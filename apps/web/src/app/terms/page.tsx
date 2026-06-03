import Link from "next/link"

export const metadata = { title: "Terms of Service — Contxt" }

const s = {
  h2: { fontSize: 18, fontWeight: 700, margin: "36px 0 8px" } as React.CSSProperties,
  p: { margin: "0 0 12px" } as React.CSSProperties,
  ul: { paddingLeft: 20, margin: "0 0 12px" } as React.CSSProperties,
}

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px", fontFamily: "system-ui,sans-serif", color: "#111827", lineHeight: 1.75 }}>
      <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Back</Link>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "24px 0 4px", letterSpacing: "-0.02em" }}>Terms of Service</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>Last updated: June 2025</p>

      <h2 style={s.h2}>1. Acceptance</h2>
      <p style={s.p}>By using Contxt ("the Service") you agree to these Terms. If you do not agree, do not use the Service.</p>

      <h2 style={s.h2}>2. Description of Service</h2>
      <p style={s.p}>Contxt is a browser extension and web application that injects user-defined persona context into AI chat interfaces (ChatGPT, Claude, Gemini, and others) and stores conversation memory locally. A Pro subscription (€49/year) adds cloud sync and cross-device conversation history.</p>

      <h2 style={s.h2}>3. Subscriptions and Billing</h2>
      <p style={s.p}>The Contxt Pro plan is billed annually at €49/year via Lemon Squeezy. Your subscription renews automatically unless cancelled before the renewal date. You may cancel at any time from your account settings; access continues until the end of the paid period.</p>

      <h2 style={s.h2}>4. Right of Withdrawal (EU Consumers)</h2>
      <p style={s.p}>If you are a consumer in the EU/EEA, you have the right to withdraw from this contract within <strong>14 days</strong> of purchase without giving any reason (EU Consumer Rights Directive 2011/83/EU).</p>
      <p style={s.p}>However, by completing your purchase and accessing the Pro features immediately, you <strong>expressly request</strong> that the Service begins before the 14-day withdrawal period expires. You acknowledge that you will lose your right of withdrawal once the Service has been fully performed or once you have begun accessing the digital content.</p>
      <p style={s.p}>To exercise the right of withdrawal (if still applicable), contact us at <a href="mailto:seunfemiadebola@gmail.com" style={{ color: "#7c3aed" }}>seunfemiadebola@gmail.com</a> within 14 days of purchase with your order number and a clear statement of your decision to withdraw. We will refund your payment within 14 days.</p>

      <h2 style={s.h2}>5. Acceptable Use</h2>
      <p style={s.p}>You may not use Contxt to violate any law, infringe third-party rights, or interfere with AI platforms in ways that breach their own terms. You are responsible for any persona content you configure.</p>

      <h2 style={s.h2}>6. Intellectual Property</h2>
      <p style={s.p}>Contxt and its original content are owned by the operator and protected by applicable IP laws. You retain ownership of any persona or content you create.</p>

      <h2 style={s.h2}>7. Disclaimer of Warranties</h2>
      <p style={s.p}>The Service is provided "as is." We do not guarantee uninterrupted availability or compatibility with all AI platforms at all times. Nothing in these terms excludes or limits rights you have as a consumer under applicable EU law.</p>

      <h2 style={s.h2}>8. Limitation of Liability</h2>
      <p style={s.p}>To the maximum extent permitted by applicable law, our total liability for any claim arising from these terms or your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim. We are not liable for indirect or consequential damages. Statutory rights of EU consumers are not affected.</p>

      <h2 style={s.h2}>9. Governing Law and Disputes</h2>
      <p style={s.p}>These Terms are governed by the laws of Ireland. For EU consumers, the mandatory consumer protection laws of your country of residence also apply and take precedence where more favourable.</p>
      <p style={s.p}>We prefer to resolve disputes amicably — please contact us first at <a href="mailto:seunfemiadebola@gmail.com" style={{ color: "#7c3aed" }}>seunfemiadebola@gmail.com</a>. If we cannot reach agreement, EU consumers may use the <a href="https://ec.europa.eu/consumers/odr" style={{ color: "#7c3aed" }}>EU Online Dispute Resolution platform</a> (ec.europa.eu/consumers/odr).</p>

      <h2 style={s.h2}>10. Changes to Terms</h2>
      <p style={s.p}>We will notify you of material changes via email at least 14 days before they take effect. Continued use after that date constitutes acceptance.</p>

      <h2 style={s.h2}>11. Contact</h2>
      <p style={s.p}><a href="mailto:seunfemiadebola@gmail.com" style={{ color: "#7c3aed" }}>seunfemiadebola@gmail.com</a></p>
    </div>
  )
}
