// Plasmo v0.90.x reads this file for manifest overrides.
// NOTE: `defineConfig` is not exported by plasmo@0.90.5 — export a plain object instead.
export default {
  manifest: {
    name: "PromptRefiner",
    version: "0.1.0",
    manifest_version: 3,
    permissions: ["storage", "clipboardWrite"],
    host_permissions: [
      "https://chatgpt.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*",
      "http://localhost:8787/*"
    ]
  }
}
