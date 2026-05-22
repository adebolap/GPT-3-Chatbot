import "dotenv/config"
import express from "express"
import cors from "cors"
import Stripe from "stripe"
import OpenAI from "openai"

const app = express()
app.use(cors())
app.use(express.json())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM = `You are a prompt-refinement engine. Improve the user's prompt before it is sent to another AI model. Preserve intent. Add missing structure, assumptions, output format, constraints, and quality checks. Do not answer the prompt. Return only the improved prompt unless JSON mode is requested.`

const usage = new Map<string, number>()

const redactSecrets = (text: string) =>
  text
    .replace(/(sk-[A-Za-z0-9]{20,})/g, "[REDACTED_API_KEY]")
    .replace(/(password\s*[:=]\s*\S+)/gi, "password=[REDACTED]")
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[REDACTED_CARD]")
    .replace(/(token\s*[:=]\s*\S+)/gi, "token=[REDACTED]")

app.post("/api/refine", async (req, res) => {
  const userId = req.header("x-user-id") || "anonymous"
  const used = usage.get(userId) || 0
  if (used >= 10) return res.status(429).json({ error: "Free tier limit reached" })

  const { prompt, mode } = req.body
  const sanitized = redactSecrets(prompt || "")

  const completion = await openai.chat.completions.create({
    model: process.env.REFINER_MODEL || "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Mode: ${mode}\nReturn JSON: { refinedPrompt, detectedIntent, missingContext, confidence }\nPrompt:\n${sanitized}`
      }
    ]
  })

  usage.set(userId, used + 1)
  res.json(JSON.parse(completion.choices[0].message.content || "{}"))
})

app.post("/api/checkout", async (_req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID || "", quantity: 1 }],
    success_url: `${process.env.APP_URL}/billing/success`,
    cancel_url: `${process.env.APP_URL}/billing/cancel`
  })
  res.json({ url: session.url })
})

app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), (_req, res) => {
  // TODO: verify signature and update subscription_status in users table.
  res.json({ received: true })
})

app.get("/api/me", (_req, res) => {
  res.json({ id: "demo", subscription_status: "free", plan: "free" })
})

app.get("/api/usage", (_req, res) => {
  res.json({ month: new Date().toISOString().slice(0, 7), refinement_count: 0, free_limit: 10 })
})

app.listen(8787, () => console.log("API running on :8787"))
