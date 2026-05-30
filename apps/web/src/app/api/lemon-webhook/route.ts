import crypto from "node:crypto"
import { createClient } from "@supabase/supabase-js"
import { webEnv } from "../../../lib/env"

export const runtime = "nodejs"

type LemonSqueezyEvent = {
  meta?: {
    event_name?: string
    custom_data?: {
      clerk_user_id?: string
      user_id?: string
    }
  }
  data?: {
    id?: string
    attributes?: {
      customer_id?: number | string
      user_email?: string
      status?: string
    }
  }
}

const verifySignature = (rawBody: string, signature: string, secret: string) => {
  const expected = Buffer.from(crypto.createHmac("sha256", secret).update(rawBody).digest("hex"), "hex")
  const received = Buffer.from(signature, "hex")
  return expected.length === received.length && crypto.timingSafeEqual(expected, received)
}

const getSupabase = () => {
  if (!webEnv.supabaseUrl || !webEnv.supabaseServiceRoleKey) return null
  return createClient(webEnv.supabaseUrl, webEnv.supabaseServiceRoleKey)
}

export async function POST(request: Request) {
  const secret = webEnv.lemonSqueezyWebhookSecret
  if (!secret) return Response.json({ error: "LEMON_SQUEEZY_WEBHOOK_SECRET is not configured" }, { status: 500 })

  const rawBody = await request.text()
  const signature = request.headers.get("x-signature") || ""
  if (!signature || !verifySignature(rawBody, signature, secret)) {
    return Response.json({ error: "Invalid Lemon Squeezy signature" }, { status: 400 })
  }

  const event = JSON.parse(rawBody) as LemonSqueezyEvent
  const eventName = event.meta?.event_name || request.headers.get("x-event-name") || "unknown"
  const clerkUserId = event.meta?.custom_data?.clerk_user_id || event.meta?.custom_data?.user_id
  const supabase = getSupabase()

  if (supabase && clerkUserId) {
    const isProEvent = ["order_created", "subscription_created", "subscription_updated"].includes(eventName)
    const isFreeEvent = ["subscription_cancelled", "subscription_payment_failed"].includes(eventName)

    if (isProEvent || isFreeEvent) {
      const { error } = await supabase.from("profiles").upsert(
        {
          clerk_user_id: clerkUserId,
          email: event.data?.attributes?.user_email,
          plan: isProEvent ? "pro" : "free",
          lemon_squeezy_customer_id: event.data?.attributes?.customer_id ? String(event.data.attributes.customer_id) : null,
          lemon_squeezy_subscription_id: event.data?.id ?? null,
          lemon_squeezy_status: event.data?.attributes?.status ?? eventName,
          updated_at: new Date().toISOString()
        },
        { onConflict: "clerk_user_id" }
      )

      if (error) return Response.json({ error: error.message }, { status: 500 })
    }
  }

  return Response.json({ received: true, event: eventName })
}
