import { PolicyView, policyMetadata } from "@/components/policy-view";

export const dynamic = "force-dynamic";
export const generateMetadata = () => policyMetadata("payment-policy");

export default function PaymentPolicyPage() {
  return <PolicyView slug="payment-policy" />;
}
