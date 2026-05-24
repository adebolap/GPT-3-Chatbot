import { NextResponse } from "next/server"
import Stripe from "stripe"
import { clerkClient } from "@clerk/nextjs/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const clerk = await clerkClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const clerkUserId = session.client_reference_id
        if (clerkUserId) {
          await clerk.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              plan: "pro",
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
            },
          })
        }
        break
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id
        // Find user by stripeCustomerId stored in metadata
        const users = await clerk.users.getUserList({ limit: 10 })
        const match = users.data.find(
          (u) => (u.publicMetadata as any)?.stripeCustomerId === customerId
        )
        if (match) {
          await clerk.users.updateUserMetadata(match.id, {
            publicMetadata: { plan: "free", stripeCustomerId: customerId },
          })
        }
        break
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice
        const customerId = typeof inv.customer === "string" ? inv.customer : (inv.customer as any)?.id
        const users = await clerk.users.getUserList({ limit: 10 })
        const match = users.data.find(
          (u) => (u.publicMetadata as any)?.stripeCustomerId === customerId
        )
        if (match) {
          await clerk.users.updateUserMetadata(match.id, {
            publicMetadata: { ...(match.publicMetadata as object), plan: "past_due" },
          })
        }
        break
      }
    }
  } catch (err) {
    console.error("webhook handler error:", err)
  }

  return NextResponse.json({ received: true })
}
