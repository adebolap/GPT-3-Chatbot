import { NextResponse } from "next/server"
import Stripe from "stripe"
import { supabaseAdmin } from "@/lib/supabase-admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err: any) {
    console.error("webhook signature error:", err.message)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "customer.subscription.updated":
      case "invoice.payment_succeeded": {
        const sub = event.data.object as Stripe.Subscription
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id
        const status = sub.status === "active" ? "active" : sub.status
        await supabaseAdmin
          .from("users")
          .update({ subscription_status: status, plan: status === "active" ? "pro" : "free" })
          .eq("stripe_customer_id", customerId)
        break
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id
        await supabaseAdmin
          .from("users")
          .update({ subscription_status: "canceled", plan: "free" })
          .eq("stripe_customer_id", customerId)
        break
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice
        const customerId =
          typeof inv.customer === "string" ? inv.customer : (inv.customer as any)?.id
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

  return NextResponse.json({ received: true })
}
