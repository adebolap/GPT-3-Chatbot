// plasmo@0.90.5 does not export `defineConfig` — use a plain object.
// Manifest overrides (permissions, host_permissions) are read from
// the "manifest" key in package.json at runtime.
export default {
  manifest: {
    name: "Contxt — AI Memory",
    version: "0.1.0",
    manifest_version: 3,
    description:
      "Your AI memory layer. Context injection and conversation history across ChatGPT, Claude, Gemini and more.",
    permissions: ["storage", "clipboardWrite"],
    host_permissions: [
      "https://chatgpt.com/*",
      "https://claude.ai/*",
      "https://gemini.google.com/*",
    ],
  },
}
