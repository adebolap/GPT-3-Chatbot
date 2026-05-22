import { defineConfig } from "plasmo"

export default defineConfig({
  manifest: {
    name: "PromptRefiner",
    version: "0.1.0",
    manifest_version: 3,
    permissions: ["storage"],
    host_permissions: [
      "https://chatgpt.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*",
      "http://localhost:8787/*"
    ]
  }
})
