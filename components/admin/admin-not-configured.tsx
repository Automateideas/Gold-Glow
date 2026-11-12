import Link from "next/link";
import { Logo } from "@/components/logo";

export function AdminNotConfigured() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Logo withTagline />
      <h1 className="mt-6 font-serif text-2xl font-bold">Admin login not set up</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Add an admin ID and password to <code>.env.local</code>, then restart the
        server:
      </p>
      <pre className="mt-4 rounded-xl border bg-card px-5 py-3 text-left text-xs leading-relaxed">
        {`ADMIN_USERNAME=your-id\nADMIN_PASSWORD=your-strong-password`}
      </pre>
      <Link href="/" className="mt-6 text-sm font-medium text-primary hover:underline">
        ← Back to site
      </Link>
    </div>
  );
}
