import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PromptRefiner — Better prompts, better AI results",
  description:
    "Automatically refine your AI prompts before sending them to ChatGPT, Claude, Gemini, and more.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
          background: "#fff",
          color: "#111827",
        }}
      >
        {children}
      </body>
    </html>
  )
}
