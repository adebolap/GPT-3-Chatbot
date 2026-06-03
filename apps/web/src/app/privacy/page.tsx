import Link from "next/link"

export const metadata = { title: "Privacy Policy — Contxt" }

const s = {
  h2: { fontSize: 18, fontWeight: 700, margin: "36px 0 8px" } as React.CSSProperties,
  p: { margin: "0 0 12px" } as React.CSSProperties,
  ul: { paddingLeft: 20, margin: "0 0 12px" } as React.CSSProperties,
}

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px", fontFamily: "system-ui,sans-serif", color: "#111827", lineHeight: 1.75 }}>
      <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Back</Link>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "24px 0 4px", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>Last updated: June 2025 · Applies to EU/EEA users under GDPR</p>

      <h2 style={s.h2}>1. Data Controller</h2>
      <p style={s.p}>The data controller is the operator of Contxt, reachable at <a href="mailto:seunfemiadebola@gmail.com" style={{ color: "#7c3aed" }}>seunfemiadebola@gmail.com</a>. We do not have a Data Protection Officer as we are a small operator not required to appoint one under Art. 37 GDPR.</p>

      <h2 style={s.h2}>2. Data We Collect and Legal Basis</h2>
      <ul style={s.ul}>
        <li style={{ marginBottom: 8 }}><strong>Account data</strong> (email, name) — collected when you sign up via Clerk. Legal basis: <em>performance of a contract</em> (Art. 6(1)(b) GDPR).</li>
        <li style={{ marginBottom: 8 }}><strong>Conversation metadata (Pro only)</strong> — if you enable cloud sync, we store the URL, AI model, conversation title, first message snippet, and persona name. We do not store full conversation content. Legal basis: <em>performance of a contract</em> (Art. 6(1)(b) GDPR).</li>
        <li style={{ marginBottom: 8 }}><strong>Local extension data</strong> — your persona and conversation history are stored locally on your device using IndexedDB. This data never leaves your device unless you enable cloud sync. No legal basis needed as this is not processed by us.</li>
        <li style={{ marginBottom: 8 }}><strong>Payment data</strong> — handled entirely by Lemon Squeezy. We receive only subscription status. Legal basis: <em>performance of a contract</em> (Art. 6(1)(b) GDPR).</li>
        <li style={{ marginBottom: 8 }}><strong>Waitlist email</strong> — if you submit your email for notifications. Legal basis: <em>consent</em> (Art. 6(1)(a) GDPR). You may withdraw consent at any time by emailing us.</li>
      </ul>

      <h2 style={s.h2}>3. Retention Periods</h2>
      <ul style={s.ul}>
        <li>Account data: retained for the duration of your account plus 30 days after deletion.</li>
        <li>Cloud sync conversation metadata: retained for 12 months or until you request deletion.</li>
        <li>Waitlist emails: retained until you unsubscribe or withdraw consent.</li>
        <li>Payment records: retained for 7 years as required by applicable accounting law.</li>
      </ul>

      <h2 style={s.h2}>4. International Data Transfers</h2>
      <p style={s.p}>Our sub-processors are based in the United States. Transfers are made under appropriate safeguards:</p>
      <ul style={s.ul}>
        <li><strong>Clerk</strong> (auth) — participates in the EU–US Data Privacy Framework.</li>
        <li><strong>Supabase</strong> (cloud sync) — transfers under Standard Contractual Clauses (SCCs).</li>
        <li><strong>Vercel</strong> (hosting) — transfers under Standard Contractual Clauses (SCCs).</li>
        <li><strong>Lemon Squeezy</strong> (payments) — transfers under Standard Contractual Clauses (SCCs).</li>
      </ul>

      <h2 style={s.h2}>5. Your Rights Under GDPR</h2>
      <p style={s.p}>If you are in the EU/EEA, you have the following rights:</p>
      <ul style={s.ul}>
        <li><strong>Access (Art. 15)</strong> — request a copy of the personal data we hold about you.</li>
        <li><strong>Rectification (Art. 16)</strong> — ask us to correct inaccurate data.</li>
        <li><strong>Erasure (Art. 17)</strong> — request deletion of your data ("right to be forgotten").</li>
        <li><strong>Restriction (Art. 18)</strong> — ask us to limit how we use your data.</li>
        <li><strong>Portability (Art. 20)</strong> — receive your data in a machine-readable format.</li>
        <li><strong>Objection (Art. 21)</strong> — object to processing based on legitimate interests.</li>
        <li><strong>Withdraw consent</strong> — where processing is based on consent, withdraw it at any time.</li>
      </ul>
      <p style={s.p}>To exercise any right, email <a href="mailto:seunfemiadebola@gmail.com" style={{ color: "#7c3aed" }}>seunfemiadebola@gmail.com</a>. We will respond within 30 days.</p>
      <p style={s.p}><strong>Right to complain:</strong> You have the right to lodge a complaint with your national data protection authority. In Ireland: <a href="https://www.dataprotection.ie" style={{ color: "#7c3aed" }}>dataprotection.ie</a>. A full list of EU DPAs is at <a href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en" style={{ color: "#7c3aed" }}>edpb.europa.eu</a>.</p>

      <h2 style={s.h2}>6. Cookies</h2>
      <p style={s.p}>We use only strictly necessary cookies required for authentication, set by Clerk. No tracking, analytics, or advertising cookies are used. Strictly necessary cookies do not require consent under the ePrivacy Directive.</p>

      <h2 style={s.h2}>7. Data Security</h2>
      <p style={s.p}>All data is transmitted over HTTPS. Cloud sync data is stored in Supabase with row-level security tied to your user ID. We apply appropriate technical and organisational measures to protect your data.</p>

      <h2 style={s.h2}>8. Children</h2>
      <p style={s.p}>The Service is not directed at children under 16. We do not knowingly collect data from children. If you believe a child has provided us data, contact us for immediate deletion.</p>

      <h2 style={s.h2}>9. Changes</h2>
      <p style={s.p}>We will notify you of material changes via email or a banner on the site at least 14 days before changes take effect.</p>

      <h2 style={s.h2}>10. Contact</h2>
      <p style={s.p}><a href="mailto:seunfemiadebola@gmail.com" style={{ color: "#7c3aed" }}>seunfemiadebola@gmail.com</a></p>
    </div>
  )
}
