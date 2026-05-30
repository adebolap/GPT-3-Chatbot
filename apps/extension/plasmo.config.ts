import { defineConfig } from "plasmo"

export default defineConfig({
  manifest: {
    name: "Contxt",
    version: "0.1.0",
    manifest_version: 3,
    permissions: ["storage", "tabs"],
    host_permissions: [
      "https://chatgpt.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*"
    ],
    action: {
      default_title: "Contxt"
    }
  }
})
