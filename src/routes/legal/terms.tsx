import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Prodigy" },
      { name: "description", content: "Prodigy Terms of Service." },
    ],
  }),
  component: Terms,
});

const S = {
  title: "Terms & Conditions",
  updatedLabel: "Last updated",
  homeLabel: "Home",
  termsLabel: "Terms",
  refundLabel: "Refund Policy",
  privacyLabel: "Privacy Notice",
  pricingLabel: "Pricing",
  h1: "1. Who we are",
  p1: "These Terms & Conditions (\"Terms\") are a contract between you and <strong>Yossi Arazi</strong> (\"Prodigy\", \"we\", \"us\"), the provider of the Prodigy AI tutoring service (the \"Service\"). By using the Service you confirm you have authority to accept these Terms (or are of legal age in your jurisdiction).",
  h2: "2. Acceptance",
  p2: "By creating an account or using the Service you agree to these Terms and our Privacy Notice. If you do not agree, do not use the Service.",
  h3: "3. The Service",
  p3: "Prodigy provides AI-powered tutoring across math, physics, chemistry, biology, science, English, Hebrew language, writing, and code for learners aged 6–18 and adult learners. The AI adapts to the stated grade level and uses a Socratic method. Outputs may contain errors and are not a substitute for regulated professional advice; verify important information independently.",
  h4: "4. Acceptable use",
  p4: "You must not misuse the Service, including: unlawful use, fraud, spam, infringement of intellectual property, uploading malicious content, probing or interfering with security, scraping, reverse-engineering, or bypassing usage limits. You are responsible for content you submit and outputs you use, and for having the rights to any inputs you provide. You must not use outputs to generate illegal content, deepfakes of real people without consent, hate speech, or content that impersonates real individuals in harmful ways.",
  h5: "5. Accounts",
  p5: "You must provide accurate information and keep credentials confidential. You are responsible for activity under your account. Children under 13 (or the age of consent in their country) must have parent/guardian authorization to use the Service.",
  h6: "6. Intellectual property",
  p6: "Prodigy and its underlying software, models, branding, and documentation are owned by us or our licensors. We grant you a limited, non-exclusive, non-transferable right to use the Service within your selected plan. Outputs generated for you may be used for your personal or internal educational purposes.",
  h7: "7. Content moderation",
  p7: "We may filter, refuse, or remove content and outputs, and may suspend accounts for repeated or serious violations. We provide a takedown pathway for rights-holder complaints; contact us using the support address shown at checkout.",
  h8: "8. Payment and subscriptions",
  p8: "Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. Payment, billing, tax, cancellation, and refund mechanics are governed by the <a href=\"https://www.paddle.com/legal/checkout-buyer-terms\" target=\"_blank\" rel=\"noreferrer\">Paddle Buyer Terms</a>. Subscriptions renew automatically at the end of each billing period until you cancel.",
  h9: "9. Suspension and termination",
  p9: "We may suspend or terminate access for material breach of these Terms, non-payment, security or fraud risk, or repeated policy violations. On termination you may lose access to session history; export within 30 days of notice where feasible.",
  h10: "10. Service level and warranties",
  p10: "The Service is provided \"as is\". We do not guarantee uninterrupted or error-free performance. To the fullest extent permitted by law we disclaim all implied warranties, including merchantability and fitness for a particular purpose.",
  h11: "11. Liability",
  p11: "To the fullest extent permitted by law, our aggregate liability arising out of the Service is capped at the fees you paid us in the prior 12 months. We are not liable for indirect, consequential, or special damages including loss of profits, data, or goodwill. Nothing in these Terms excludes liability for fraud, death, or personal injury caused by negligence where such exclusion is prohibited by law.",
  h12: "12. Indemnity",
  p12: "You will indemnify us for claims arising from your unlawful use of the Service, content you submit, or violations of these Terms.",
  h13: "13. Governing law",
  p13: "These Terms are governed by the laws of the jurisdiction of <strong>Yossi Arazi</strong>'s registered address, unless a mandatory consumer law of your country provides otherwise. Disputes are subject to the exclusive jurisdiction of the courts of that same jurisdiction.",
  h14: "14. Changes",
  p14: "We may update these Terms. Continued use after changes are posted constitutes acceptance.",
  h15: "15. Contact",
  p15: "Questions about these Terms? Contact us via the support channel shown in your Paddle receipt. See also our <a href=\"/legal/refund\">Refund Policy</a> and <a href=\"/legal/privacy\">Privacy Notice</a>.",
};

function Terms() {
  return (
    <LegalPage pageKey="terms" updated="2026-07-06" strings={S}>
      {({ s, html }) => (
        <>
          <h2>{s.h1}</h2><p dangerouslySetInnerHTML={html("p1")} />
          <h2>{s.h2}</h2><p dangerouslySetInnerHTML={html("p2")} />
          <h2>{s.h3}</h2><p dangerouslySetInnerHTML={html("p3")} />
          <h2>{s.h4}</h2><p dangerouslySetInnerHTML={html("p4")} />
          <h2>{s.h5}</h2><p dangerouslySetInnerHTML={html("p5")} />
          <h2>{s.h6}</h2><p dangerouslySetInnerHTML={html("p6")} />
          <h2>{s.h7}</h2><p dangerouslySetInnerHTML={html("p7")} />
          <h2>{s.h8}</h2><p dangerouslySetInnerHTML={html("p8")} />
          <h2>{s.h9}</h2><p dangerouslySetInnerHTML={html("p9")} />
          <h2>{s.h10}</h2><p dangerouslySetInnerHTML={html("p10")} />
          <h2>{s.h11}</h2><p dangerouslySetInnerHTML={html("p11")} />
          <h2>{s.h12}</h2><p dangerouslySetInnerHTML={html("p12")} />
          <h2>{s.h13}</h2><p dangerouslySetInnerHTML={html("p13")} />
          <h2>{s.h14}</h2><p dangerouslySetInnerHTML={html("p14")} />
          <h2>{s.h15}</h2><p dangerouslySetInnerHTML={html("p15")} />
        </>
      )}
    </LegalPage>
  );
}