"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { loginAction, type LoginState } from "@/app/admin/actions";

export function AdminLogin() {
  const [state, formAction, pending] = React.useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center">
      <Card className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <div className="mt-5 grid h-11 w-11 place-items-center rounded-full bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="mt-3 font-serif text-xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your Gold &amp; Glow catalogue
          </p>
        </div>

        <form action={formAction} className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="username">Admin ID</Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {state.error && (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.error}
            </p>
          )}
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
        <Link
          href="/"
          className="mt-4 block text-center text-xs text-muted-foreground hover:text-primary"
        >
          ← Back to site
        </Link>
      </Card>
    </div>
  );
}
