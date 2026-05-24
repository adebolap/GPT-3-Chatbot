import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getAuthContext } from "@/lib/auth"

export const maxDuration = 30

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST() {
  try {
    const { userId } = await getAuthContext()

    const appUrl =
      process.env.APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${appUrl}/billing/success`,
      cancel_url: `${appUrl}/billing/cancel`,
      ...(userId && { client_reference_id: userId }),
    })

    return NextResponse.json({ url: session.url }, { headers: CORS })
  } catch (err) {
    console.error("checkout error:", err)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500, headers: CORS })
  }
}
