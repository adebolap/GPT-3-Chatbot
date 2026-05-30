import "dotenv/config"
import express from "express"
import cors from "cors"
import Stripe from "stripe"
import OpenAI from "openai"
import { supabaseAdmin } from "./lib/supabase.js"
import { authMiddleware, type AuthRequest } from "./middleware/auth.js"

const app = express()
app.use(cors())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const FREE_LIMIT = 10

const REFINE_SYSTEM = `You are a prompt-refinement engine. Improve the user's prompt before it is sent to another AI model. Preserve intent. Add missing structure, assumptions, output format, constraints, and quality checks. Do not answer the prompt. Return only the improved prompt unless JSON mode is requested.`

const anonUsage = new Map<string, number>()

const redactSecrets = (text: string) =>
  text
    .replace(/(sk-[A-Za-z0-9]{20,})/g, "[REDACTED_API_KEY]")
    .replace(/(password\s*[:=]\s*\S+)/gi, "password=[REDACTED]")
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[REDACTED_CARD]")
    .replace(/(token\s*[:=]\s*\S+)/gi, "token=[REDACTED]")
    .replace(/(secret\s*[:=]\s*\S+)/gi, "secret=[REDACTED]")

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

async function getDbUsage(userId: string, month: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from("usage_events")
    .select("refinement_count")
    .eq("user_id", userId)
    .eq("month", month)
    .single()
  return data?.refinement_count ?? 0
}

async function incrementDbUsage(userId: string, month: string): Promise<void> {
  const { data: existing } = await supabaseAdmin
    .from("usage_events")
    .select("id, refinement_count")
    .eq("user_id", userId)
    .eq("month", month)
    .single()

  if (existing) {
    await supabaseAdmin
      .from("usage_events")
      .update({ refinement_count: existing.refinement_count + 1 })
      .eq("id", existing.id)
  } else {
    await supabaseAdmin
      .from("usage_events")
      .insert({ user_id: userId, month, refinement_count: 1 })
  }
}

// JSON body for most routes
app.use((req, res, next) => {
  if (req.path === "/api/stripe-webhook") return next()
  express.json()(req, res, next)
})

app.post("/api/refine", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { prompt, mode } = req.body
    if (!prompt?.trim()) {
      res.status(400).json({ error: "prompt is required" })
      return
    }

    const userId = req.userId!
    const isPro = req.userPlan === "pro"
    const month = currentMonth()

    // Check rate limit
    if (req.isAuthenticated) {
      const count = await getDbUsage(userId, month)
      if (!isPro && count >= FREE_LIMIT) {
        res.status(429).json({ error: "Free tier limit reached", limit: FREE_LIMIT, count })
        return
      }
    } else {
      const count = anonUsage.get(userId) ?? 0
      if (count >= FREE_LIMIT) {
        res.status(429).json({ error: "Free tier limit reached", limit: FREE_LIMIT, count })
        return
      }
      anonUsage.set(userId, count + 1)
    }

    const sanitized = redactSecrets(prompt)
    const completion = await openai.chat.completions.create({
      model: process.env.REFINER_MODEL || "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: REFINE_SYSTEM },
        {
          role: "user",
          content: `Mode: ${mode || "default"}\nReturn JSON: { refinedPrompt, detectedIntent, missingContext, confidence }\nPrompt:\n${sanitized}`,
        },
      ],
    })

    if (req.isAuthenticated) {
      await incrementDbUsage(userId, month)
    }

    res.json(JSON.parse(completion.choices[0].message.content || "{}"))
  } catch (err: any) {
    console.error("refine error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/checkout", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const appUrl = process.env.APP_URL || "http://localhost:3000"
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID || "", quantity: 1 }],
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing/cancel`,
      ...(req.isAuthenticated && { client_reference_id: req.userId }),
    })
    res.json({ url: session.url })
  } catch (err: any) {
    console.error("checkout error:", err)
    res.status(500).json({ error: "Failed to create checkout session" })
  }
})

app.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"]
    const secret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !secret) {
      res.status(400).json({ error: "Missing signature or secret" })
      return
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, secret)
    } catch (err: any) {
      console.error("webhook signature error:", err.message)
      res.status(400).json({ error: `Webhook error: ${err.message}` })
      return
    }

    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "invoice.payment_succeeded": {
          const sub = event.data.object as Stripe.Subscription
          const customerId =
            typeof sub.customer === "string" ? sub.customer : sub.customer.id
          const status = sub.status === "active" ? "active" : sub.status
          await supabaseAdmin
            .from("users")
            .update({ subscription_status: status, plan: status === "active" ? "pro" : "free" })
            .eq("stripe_customer_id", customerId)
          break
        }
        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription
          const customerId =
            typeof sub.customer === "string" ? sub.customer : sub.customer.id
          await supabaseAdmin
            .from("users")
            .update({ subscription_status: "canceled", plan: "free" })
            .eq("stripe_customer_id", customerId)
          break
        }
        case "invoice.payment_failed": {
          const inv = event.data.object as Stripe.Invoice
          const customerId =
            typeof inv.customer === "string" ? inv.customer : inv.customer?.id
          if (customerId) {
            await supabaseAdmin
              .from("users")
              .update({ subscription_status: "past_due" })
              .eq("stripe_customer_id", customerId)
          }
          break
        }
      }
    } catch (err) {
      console.error("webhook handler error:", err)
    }

    res.json({ received: true })
  }
)

app.get("/api/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.isAuthenticated) {
      res.json({ id: req.userId, subscription_status: "free", plan: "free" })
      return
    }
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, email, subscription_status, plan")
      .eq("id", req.userId)
      .single()
    res.json(user ?? { id: req.userId, subscription_status: "free", plan: "free" })
  } catch {
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/usage", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const month = currentMonth()
    let count = 0

    if (req.isAuthenticated) {
      count = await getDbUsage(req.userId!, month)
    } else {
      count = anonUsage.get(req.userId!) ?? 0
    }

    const isPro = req.userPlan === "pro"
    res.json({ month, refinement_count: count, free_limit: isPro ? null : FREE_LIMIT })
  } catch {
    res.status(500).json({ error: "Internal server error" })
  }
})

const PORT = process.env.PORT || 8787
app.listen(PORT, () => console.log(`API running on :${PORT}`))
