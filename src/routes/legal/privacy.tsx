import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalShell } from "@/components/LegalShell";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice — Prodigy" },
      { name: "description", content: "How Prodigy collects, uses, and protects your data." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalShell title="Privacy Notice" updated="2026-07-06">
      <p><strong>Please review this page carefully and replace “[LEGAL BUSINESS NAME]” with your registered business or personal name before publishing.</strong></p>

      <h2>1. Who we are</h2>
      <p><strong>[LEGAL BUSINESS NAME]</strong> ("Prodigy", "we") is the data controller for personal data collected through the Prodigy Service.</p>

      <h2>2. Data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> email, display name, password hash, grade/level, preferred subject and language.</li>
        <li><strong>Learning data:</strong> your questions, tutor responses, and inferred "stuck topics" per subject.</li>
        <li><strong>Usage data:</strong> messages sent per day, session timestamps, feature interactions.</li>
        <li><strong>Device / technical data:</strong> IP address, browser type, device identifiers, error logs.</li>
        <li><strong>Support data:</strong> messages you send to support.</li>
      </ul>
      <p>Payment card data is collected directly by Paddle (see §5) — we never see or store card numbers.</p>

      <h2>3. How we use it and legal basis</h2>
      <ul>
        <li><strong>Providing the Service</strong> (contract performance): account creation, delivering tutor responses, saving session history.</li>
        <li><strong>Product improvement</strong> (legitimate interests): analyzing anonymized usage patterns and error logs.</li>
        <li><strong>Security and fraud prevention</strong> (legitimate interests / legal obligation): abuse detection, rate limiting.</li>
        <li><strong>Support</strong> (contract performance): responding to your requests.</li>
        <li><strong>Marketing</strong> (consent): only if you opt in.</li>
      </ul>

      <h2>4. Children</h2>
      <p>The Service is designed for learners aged 6–18. A parent or guardian must authorize accounts for children under the age of digital consent in their country. We minimize data collected from child accounts and never sell it.</p>

      <h2>5. Sharing</h2>
      <ul>
        <li><strong>Service providers / subprocessors:</strong> hosting, database, and error monitoring providers, and the AI model provider used to generate tutor responses.</li>
        <li><strong>Merchant of Record — Paddle:</strong> for sale of the Service, subscription management, payments, tax compliance, and invoicing. See Paddle's <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</li>
        <li><strong>Professional advisers:</strong> legal, accounting.</li>
        <li><strong>Authorities:</strong> where required by law.</li>
      </ul>
      <p>We do not sell your personal data.</p>

      <h2>6. International transfers</h2>
      <p>If you are located in the UK/EEA, your data may be transferred to countries outside the UK/EEA (e.g. the United States) subject to appropriate safeguards such as Standard Contractual Clauses or an adequacy decision.</p>

      <h2>7. Retention</h2>
      <p>Account and learning data is kept while your account is active and for up to 24 months after deletion for legal and dispute-resolution purposes, then deleted or anonymized. Payment records are retained by Paddle per its policy.</p>

      <h2>8. Your rights</h2>
      <p>Depending on your country you may have rights to access, correct, delete, restrict processing of, port, or object to processing of your personal data, and to withdraw consent. Under GDPR you may also lodge a complaint with your national supervisory authority. We respond to verified requests within one month.</p>

      <h2>9. Security</h2>
      <p>We use industry-standard technical and organizational measures including encryption in transit (TLS), encryption at rest, access controls, and audit logging.</p>

      <h2>10. Cookies</h2>
      <p>We use essential cookies for authentication and session management. Analytics or marketing cookies, if used, are described in our cookie banner and can be managed there.</p>

      <h2>11. Contact</h2>
      <p>Privacy requests: contact us via the support address shown in your Paddle receipt, or the contact channel listed on this site. See also our <Link to="/legal/terms">Terms</Link>.</p>
    </LegalShell>
  );
}