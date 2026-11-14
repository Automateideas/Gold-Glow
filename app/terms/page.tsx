import { PolicyView, policyMetadata } from "@/components/policy-view";

export const dynamic = "force-dynamic";
export const generateMetadata = () => policyMetadata("terms");

export default function TermsPage() {
  return <PolicyView slug="terms" />;
}
