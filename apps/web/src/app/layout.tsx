import { ClerkProvider } from "@clerk/nextjs"
import type { ReactNode } from "react"

export const metadata = {
  title: "Contxt — Your AI Memory Layer",
  description: "Inject your context into every new LLM conversation and search your AI history."
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
