import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Contxt — Your AI memory layer",
  description:
    "Never re-explain yourself to an AI again. Contxt injects your context into every chat on ChatGPT, Claude, Gemini and more.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  )
}
