import { NextRequest, NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { email, secret } = await req.json()

    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!email) {
      return NextResponse.json({ error: "email required" }, { status: 400 })
    }

    const client = await clerkClient()
    const { data: users } = await client.users.getUserList({ emailAddress: [email] })

    if (!users.length) {
      return NextResponse.json({ error: `No user found with email: ${email}` }, { status: 404 })
    }

    const user = users[0]
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { plan: "pro" },
    })

    return NextResponse.json({
      ok: true,
      userId: user.id,
      email,
      message: `${email} is now Pro`,
    })
  } catch (err) {
    console.error("grant-pro error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
