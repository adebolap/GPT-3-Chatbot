import Link from "next/link"

export const metadata = { title: "Privacy Policy — Contxt" }

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px", fontFamily: "system-ui,sans-serif", color: "#111827", lineHeight: 1.7 }}>
      <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Back</Link>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "24px 0 8px", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>Last updated: June 2025</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>1. What We Collect</h2>
      <p><strong>Account data:</strong> Email address and name when you sign up, managed via Clerk.</p>
      <p><strong>Conversation metadata (Pro only):</strong> If you enable cloud sync, we store the URL, AI model used, conversation title, first message snippet, and persona name in Supabase. We do not store the full content of your AI conversations.</p>
      <p><strong>Local data:</strong> The browser extension stores your persona and conversation history locally on your device using IndexedDB. This data never leaves your device unless you explicitly enable cloud sync.</p>
      <p><strong>Payment data:</strong> Billing is handled entirely by Lemon Squeezy. We do not store card numbers or payment details.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>2. How We Use Your Data</h2>
      <p>We use your data solely to provide the Service — authenticating your account, enabling cloud sync for Pro users, and processing your subscription. We do not sell your data or use it for advertising.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>3. Data Storage and Security</h2>
      <p>Account data is stored by Clerk. Cloud sync data is stored in Supabase with row-level access tied to your user ID. We use HTTPS for all data in transit.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>4. Third-Party Services</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li><strong>Clerk</strong> — authentication and user management</li>
        <li><strong>Supabase</strong> — cloud sync storage (Pro only)</li>
        <li><strong>Lemon Squeezy</strong> — payment processing</li>
        <li><strong>Vercel</strong> — hosting</li>
      </ul>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>5. Your Rights</h2>
      <p>You can delete your account at any time from the Clerk user profile. This removes your account data. To request deletion of cloud sync data, email us at the address below.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>6. Cookies</h2>
      <p>We use only essential cookies required for authentication (set by Clerk). We do not use tracking or advertising cookies.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>7. Children's Privacy</h2>
      <p>The Service is not directed at children under 13. We do not knowingly collect data from children.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>8. Changes to This Policy</h2>
      <p>We may update this policy from time to time. We will notify users of significant changes via email or a notice on the site.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>9. Contact</h2>
      <p>For privacy questions or data deletion requests: <a href="mailto:seunfemiadebola@gmail.com" style={{ color: "#7c3aed" }}>seunfemiadebola@gmail.com</a></p>
    </div>
  )
}
