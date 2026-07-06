import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalShell } from "@/components/LegalShell";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Prodigy" },
      { name: "description", content: "Prodigy Terms of Service." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalShell title="Terms & Conditions" updated="2026-07-06">
      <p><strong>Please review this page carefully and replace “[LEGAL BUSINESS NAME]” with your registered business or personal name before publishing.</strong></p>

      <h2>1. Who we are</h2>
      <p>These Terms & Conditions ("Terms") are a contract between you and <strong>[LEGAL BUSINESS NAME]</strong> ("Prodigy", "we", "us"), the provider of the Prodigy AI tutoring service (the "Service"). By using the Service you confirm you have authority to accept these Terms (or are of legal age in your jurisdiction).</p>

      <h2>2. Acceptance</h2>
      <p>By creating an account or using the Service you agree to these Terms and our Privacy Notice. If you do not agree, do not use the Service.</p>

      <h2>3. The Service</h2>
      <p>Prodigy provides AI-powered tutoring across math, physics, writing, and code for learners aged 6–18 and adult learners. The AI adapts to the stated grade level and uses a Socratic method. Outputs may contain errors and are not a substitute for regulated professional advice; verify important information independently.</p>

      <h2>4. Acceptable use</h2>
      <p>You must not misuse the Service, including: unlawful use, fraud, spam, infringement of intellectual property, uploading malicious content, probing or interfering with security, scraping, reverse-engineering, or bypassing usage limits. You are responsible for content you submit and outputs you use, and for having the rights to any inputs you provide. You must not use outputs to generate illegal content, deepfakes of real people without consent, hate speech, or content that impersonates real individuals in harmful ways.</p>

      <h2>5. Accounts</h2>
      <p>You must provide accurate information and keep credentials confidential. You are responsible for activity under your account. Children under 13 (or the age of consent in their country) must have parent/guardian authorization to use the Service.</p>

      <h2>6. Intellectual property</h2>
      <p>Prodigy and its underlying software, models, branding, and documentation are owned by us or our licensors. We grant you a limited, non-exclusive, non-transferable right to use the Service within your selected plan. Outputs generated for you may be used for your personal or internal educational purposes.</p>

      <h2>7. Content moderation</h2>
      <p>We may filter, refuse, or remove content and outputs, and may suspend accounts for repeated or serious violations. We provide a takedown pathway for rights-holder complaints; contact us using the support address shown at checkout.</p>

      <h2>8. Payment and subscriptions</h2>
      <p>Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. Payment, billing, tax, cancellation, and refund mechanics are governed by the <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noreferrer">Paddle Buyer Terms</a>. Subscriptions renew automatically at the end of each billing period until you cancel.</p>

      <h2>9. Suspension and termination</h2>
      <p>We may suspend or terminate access for material breach of these Terms, non-payment, security or fraud risk, or repeated policy violations. On termination you may lose access to session history; export within 30 days of notice where feasible.</p>

      <h2>10. Service level and warranties</h2>
      <p>The Service is provided "as is". We do not guarantee uninterrupted or error-free performance. To the fullest extent permitted by law we disclaim all implied warranties, including merchantability and fitness for a particular purpose.</p>

      <h2>11. Liability</h2>
      <p>To the fullest extent permitted by law, our aggregate liability arising out of the Service is capped at the fees you paid us in the prior 12 months. We are not liable for indirect, consequential, or special damages including loss of profits, data, or goodwill. Nothing in these Terms excludes liability for fraud, death, or personal injury caused by negligence where such exclusion is prohibited by law.</p>

      <h2>12. Indemnity</h2>
      <p>You will indemnify us for claims arising from your unlawful use of the Service, content you submit, or violations of these Terms.</p>

      <h2>13. Governing law</h2>
      <p>These Terms are governed by the laws of the jurisdiction of <strong>[LEGAL BUSINESS NAME]</strong>'s registered address, unless a mandatory consumer law of your country provides otherwise. Disputes are subject to the exclusive jurisdiction of the courts of that same jurisdiction.</p>

      <h2>14. Changes</h2>
      <p>We may update these Terms. Continued use after changes are posted constitutes acceptance.</p>

      <h2>15. Contact</h2>
      <p>Questions about these Terms? Contact us via the support channel shown in your Paddle receipt. See also our <Link to="/legal/refund">Refund Policy</Link> and <Link to="/legal/privacy">Privacy Notice</Link>.</p>
    </LegalShell>
  );
}