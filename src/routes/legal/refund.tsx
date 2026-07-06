import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalShell } from "@/components/LegalShell";

export const Route = createFileRoute("/legal/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Prodigy" },
      { name: "description", content: "30-day money-back guarantee on all Prodigy subscriptions." },
    ],
  }),
  component: Refund,
});

function Refund() {
  return (
    <LegalShell title="Refund Policy" updated="2026-07-06">
      <h2>30-day money-back guarantee</h2>
      <p>We offer a full refund on any Prodigy subscription within <strong>30 days</strong> of the initial purchase or renewal, no questions asked. If Prodigy isn't the right fit for your child or your learners, you get your money back.</p>

      <h2>How to request a refund</h2>
      <p>All payments are processed by our Merchant of Record, <strong>Paddle</strong>. To request a refund:</p>
      <ol>
        <li>Go to <a href="https://paddle.net" target="_blank" rel="noreferrer">paddle.net</a> and enter the email you used at checkout, or open the receipt Paddle emailed you.</li>
        <li>Locate your Prodigy order and click "Get help" → "Request a refund".</li>
        <li>You may also contact us via the support address on your receipt; we will confirm eligibility and Paddle will process the refund.</li>
      </ol>
      <p>Refunds are returned to the original payment method within 5–10 business days after approval.</p>

      <h2>After the 30-day window</h2>
      <p>You can cancel your subscription at any time via the customer portal. Cancellation stops the next renewal — you keep access until the end of the current paid period. Partial refunds outside the 30-day window are considered on a case-by-case basis.</p>

      <h2>Chargebacks</h2>
      <p>Please contact us or Paddle before initiating a chargeback — we can almost always resolve billing issues directly, faster than the chargeback process.</p>

      <p className="text-sm text-muted-foreground mt-8">See also our <Link to="/legal/terms">Terms & Conditions</Link>.</p>
    </LegalShell>
  );
}