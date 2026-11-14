import { PolicyView, policyMetadata } from "@/components/policy-view";

export const dynamic = "force-dynamic";
export const generateMetadata = () => policyMetadata("privacy");

export default function PrivacyPage() {
  return <PolicyView slug="privacy" />;
}
