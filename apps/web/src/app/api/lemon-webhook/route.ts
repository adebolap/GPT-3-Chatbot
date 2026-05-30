import { NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { clerkClient } from "@clerk/nextjs/server"

function verifySignature(body: string, signature: string, secret: string): boolean {
  const digest = createHmac("sha256", secret).update(body).digest("hex")
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("x-signature") ?? ""
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET

  if (!secret || !verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload = JSON.parse(body)
  const eventName: string = payload.meta?.event_name ?? ""
  const clerk = await clerkClient()

  try {
    switch (eventName) {
      case "order_created": {
        const clerkUserId: string | undefined = payload.meta?.custom_data?.clerk_user_id
        const customerId = String(payload.data?.attributes?.customer_id ?? "")
        const subscriptionId = String(
          payload.data?.attributes?.first_subscription_item?.subscription_id ?? ""
        )
        if (clerkUserId) {
          await clerk.users.updateUserMetadata(clerkUserId, {
            publicMetadata: { plan: "pro", lsCustomerId: customerId, lsSubscriptionId: subscriptionId },
          })
        }
        break
      }
      case "subscription_cancelled": {
        const customerId = String(payload.data?.attributes?.customer_id ?? "")
        const users = await clerk.users.getUserList({ limit: 100 })
        const match = users.data.find((u) => (u.publicMetadata as any)?.lsCustomerId === customerId)
        if (match) {
          await clerk.users.updateUserMetadata(match.id, {
            publicMetadata: { plan: "free", lsCustomerId: customerId },
          })
        }
        break
      }
      case "subscription_payment_failed": {
        const customerId = String(payload.data?.attributes?.customer_id ?? "")
        const users = await clerk.users.getUserList({ limit: 100 })
        const match = users.data.find((u) => (u.publicMetadata as any)?.lsCustomerId === customerId)
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
