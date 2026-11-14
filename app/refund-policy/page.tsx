import { PolicyView, policyMetadata } from "@/components/policy-view";

export const dynamic = "force-dynamic";
export const generateMetadata = () => policyMetadata("refund-policy");

export default function RefundPolicyPage() {
  return <PolicyView slug="refund-policy" />;
}
