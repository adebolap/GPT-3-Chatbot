import { NextResponse } from "next/server"
import OpenAI from "openai"
import { getAuthContext } from "@/lib/auth"
import { redactSecrets } from "@/lib/redact"
import {
  checkLimit,
  currentMonth,
  incrementAuthUserUsage,
  incrementDeviceUsage,
} from "@/lib/usage"

export const maxDuration = 30

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM = `You are a prompt-refinement engine. Improve the user's prompt before it is sent to another AI model. Preserve intent. Add missing structure, assumptions, output format, constraints, and quality checks. Do not answer the prompt. Return only the improved prompt unless JSON mode is requested.`

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id",
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json()
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400, headers: CORS })
    }

    const auth = await getAuthContext(req)
    const month = currentMonth()

    const { allowed, count } = await checkLimit(
      auth.userId,
      auth.isAuthenticated,
      auth.userPlan === "pro",
      month
    )
    if (!allowed) {
      return NextResponse.json(
        { error: "Free tier limit reached", limit: 10, count },
        { status: 429, headers: CORS }
      )
    }

    const sanitized = redactSecrets(prompt)
    const completion = await openai.chat.completions.create({
      model: process.env.REFINER_MODEL || "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Mode: ${mode || "default"}\nReturn JSON: { refinedPrompt, detectedIntent, missingContext, confidence }\nPrompt:\n${sanitized}`,
        },
      ],
    })

    if (auth.isAuthenticated) {
      await incrementAuthUserUsage(auth.userId, month)
    } else {
      await incrementDeviceUsage(auth.userId, month)
    }

    const result = JSON.parse(completion.choices[0].message.content || "{}")
    return NextResponse.json(result, { headers: CORS })
  } catch (err) {
    console.error("refine error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: CORS })
  }
}
