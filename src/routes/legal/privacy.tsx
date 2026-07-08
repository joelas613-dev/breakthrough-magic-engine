import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice — Prodigy" },
      { name: "description", content: "How Prodigy collects, uses, and protects your data." },
    ],
  }),
  component: Privacy,
});

const S = {
  title: "Privacy Notice",
  updatedLabel: "Last updated",
  homeLabel: "Home",
  termsLabel: "Terms",
  refundLabel: "Refund Policy",
  privacyLabel: "Privacy Notice",
  pricingLabel: "Pricing",
  h1: "1. Who we are",
  p1: "<strong>Yossi Arazi</strong> (\"Prodigy\", \"we\") is the data controller for personal data collected through the Prodigy Service.",
  h2: "2. Data we collect",
  d1: "<strong>Account data:</strong> email, display name, password hash, grade/level, preferred subject and language.",
  d2: "<strong>Learning data:</strong> your questions, tutor responses, and inferred \"stuck topics\" per subject.",
  d3: "<strong>Usage data:</strong> messages sent per day, session timestamps, feature interactions.",
  d4: "<strong>Device / technical data:</strong> IP address, browser type, device identifiers, error logs.",
  d5: "<strong>Support data:</strong> messages you send to support.",
  p2: "Payment card data is collected directly by Paddle (see §5) — we never see or store card numbers.",
  h3: "3. How we use it and legal basis",
  u1: "<strong>Providing the Service</strong> (contract performance): account creation, delivering tutor responses, saving session history.",
  u2: "<strong>Product improvement</strong> (legitimate interests): analyzing anonymized usage patterns and error logs.",
  u3: "<strong>Security and fraud prevention</strong> (legitimate interests / legal obligation): abuse detection, rate limiting.",
  u4: "<strong>Support</strong> (contract performance): responding to your requests.",
  u5: "<strong>Marketing</strong> (consent): only if you opt in.",
  h4: "4. Children",
  p3: "The Service is designed for learners aged 6–18. A parent or guardian must authorize accounts for children under the age of digital consent in their country. We minimize data collected from child accounts and never sell it.",
  h5: "5. Sharing",
  s1: "<strong>Service providers / subprocessors:</strong> hosting, database, and error monitoring providers, and the AI model provider used to generate tutor responses.",
  s2: "<strong>Merchant of Record — Paddle:</strong> for sale of the Service, subscription management, payments, tax compliance, and invoicing. See Paddle's <a href=\"https://www.paddle.com/legal/privacy\" target=\"_blank\" rel=\"noreferrer\">Privacy Policy</a>.",
  s3: "<strong>Professional advisers:</strong> legal, accounting.",
  s4: "<strong>Authorities:</strong> where required by law.",
  p4: "We do not sell your personal data.",
  h6: "6. International transfers",
  p5: "If you are located in the UK/EEA, your data may be transferred to countries outside the UK/EEA (e.g. the United States) subject to appropriate safeguards such as Standard Contractual Clauses or an adequacy decision.",
  h7: "7. Retention",
  p6: "Account and learning data is kept while your account is active and for up to 24 months after deletion for legal and dispute-resolution purposes, then deleted or anonymized. Payment records are retained by Paddle per its policy.",
  h8: "8. Your rights",
  p7: "Depending on your country you may have rights to access, correct, delete, restrict processing of, port, or object to processing of your personal data, and to withdraw consent. Under GDPR you may also lodge a complaint with your national supervisory authority. We respond to verified requests within one month.",
  h9: "9. Security",
  p8: "We use industry-standard technical and organizational measures including encryption in transit (TLS), encryption at rest, access controls, and audit logging.",
  h10: "10. Cookies",
  p9: "We use essential cookies for authentication and session management. Analytics or marketing cookies, if used, are described in our cookie banner and can be managed there.",
  h11: "11. Contact",
  p10: "Privacy requests: contact us via the support address shown in your Paddle receipt, or the contact channel listed on this site. See also our <a href=\"/legal/terms\">Terms</a>.",
};

function Privacy() {
  return (
    <LegalPage pageKey="privacy" updated="2026-07-06" strings={S}>
      {({ s, html }) => (
        <>
          <h2>{s.h1}</h2><p dangerouslySetInnerHTML={html("p1")} />
          <h2>{s.h2}</h2>
          <ul>
            <li dangerouslySetInnerHTML={html("d1")} />
            <li dangerouslySetInnerHTML={html("d2")} />
            <li dangerouslySetInnerHTML={html("d3")} />
            <li dangerouslySetInnerHTML={html("d4")} />
            <li dangerouslySetInnerHTML={html("d5")} />
          </ul>
          <p dangerouslySetInnerHTML={html("p2")} />
          <h2>{s.h3}</h2>
          <ul>
            <li dangerouslySetInnerHTML={html("u1")} />
            <li dangerouslySetInnerHTML={html("u2")} />
            <li dangerouslySetInnerHTML={html("u3")} />
            <li dangerouslySetInnerHTML={html("u4")} />
            <li dangerouslySetInnerHTML={html("u5")} />
          </ul>
          <h2>{s.h4}</h2><p dangerouslySetInnerHTML={html("p3")} />
          <h2>{s.h5}</h2>
          <ul>
            <li dangerouslySetInnerHTML={html("s1")} />
            <li dangerouslySetInnerHTML={html("s2")} />
            <li dangerouslySetInnerHTML={html("s3")} />
            <li dangerouslySetInnerHTML={html("s4")} />
          </ul>
          <p dangerouslySetInnerHTML={html("p4")} />
          <h2>{s.h6}</h2><p dangerouslySetInnerHTML={html("p5")} />
          <h2>{s.h7}</h2><p dangerouslySetInnerHTML={html("p6")} />
          <h2>{s.h8}</h2><p dangerouslySetInnerHTML={html("p7")} />
          <h2>{s.h9}</h2><p dangerouslySetInnerHTML={html("p8")} />
          <h2>{s.h10}</h2><p dangerouslySetInnerHTML={html("p9")} />
          <h2>{s.h11}</h2><p dangerouslySetInnerHTML={html("p10")} />
        </>
      )}
    </LegalPage>
  );
}