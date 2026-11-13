import { AlertTriangle } from "lucide-react";

/** Red banner shown when a tab can't load its data (e.g. table not created yet). */
export function AdminError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-semibold">Database not ready</p>
        <p className="mt-0.5">{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border bg-card py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{text}</p>
      </div>
      {children}
    </div>
  );
}
