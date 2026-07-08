import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/legal/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Prodigy" },
      { name: "description", content: "30-day money-back guarantee on all Prodigy subscriptions." },
    ],
  }),
  component: Refund,
});

const S = {
  title: "Refund Policy",
  updatedLabel: "Last updated",
  homeLabel: "Home",
  termsLabel: "Terms",
  refundLabel: "Refund Policy",
  privacyLabel: "Privacy Notice",
  pricingLabel: "Pricing",
  h1: "30-day money-back guarantee",
  p1: "We offer a full refund on any Prodigy subscription within <strong>30 days</strong> of the initial purchase or renewal, no questions asked. If Prodigy isn't the right fit for your child or your learners, you get your money back.",
  h2: "How to request a refund",
  p2: "All payments are processed by our Merchant of Record, <strong>Paddle</strong>. To request a refund:",
  li1: "Go to <a href=\"https://paddle.net\" target=\"_blank\" rel=\"noreferrer\">paddle.net</a> and enter the email you used at checkout, or open the receipt Paddle emailed you.",
  li2: "Locate your Prodigy order and click \"Get help\" → \"Request a refund\".",
  li3: "You may also contact us via the support address on your receipt; we will confirm eligibility and Paddle will process the refund.",
  p3: "Refunds are returned to the original payment method within 5–10 business days after approval.",
  h3: "After the 30-day window",
  p4: "You can cancel your subscription at any time via the customer portal. Cancellation stops the next renewal — you keep access until the end of the current paid period. Partial refunds outside the 30-day window are considered on a case-by-case basis.",
  h4: "Chargebacks",
  p5: "Please contact us or Paddle before initiating a chargeback — we can almost always resolve billing issues directly, faster than the chargeback process.",
  p6: "See also our <a href=\"/legal/terms\">Terms & Conditions</a>.",
};

function Refund() {
  return (
    <LegalPage pageKey="refund" updated="2026-07-06" strings={S}>
      {({ s, html }) => (
        <>
          <h2>{s.h1}</h2><p dangerouslySetInnerHTML={html("p1")} />
          <h2>{s.h2}</h2>
          <p dangerouslySetInnerHTML={html("p2")} />
          <ol>
            <li dangerouslySetInnerHTML={html("li1")} />
            <li dangerouslySetInnerHTML={html("li2")} />
            <li dangerouslySetInnerHTML={html("li3")} />
          </ol>
          <p dangerouslySetInnerHTML={html("p3")} />
          <h2>{s.h3}</h2><p dangerouslySetInnerHTML={html("p4")} />
          <h2>{s.h4}</h2><p dangerouslySetInnerHTML={html("p5")} />
          <p className="text-sm text-muted-foreground mt-8" dangerouslySetInnerHTML={html("p6")} />
        </>
      )}
    </LegalPage>
  );
}