"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { loginAction, signupAction, type AuthState } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
      {pending ? "One sec…" : label}
    </Button>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-ink bg-paper px-3.5 py-2.5 text-[15px] outline-none transition-shadow placeholder:text-ink-faint focus:bg-white focus:shadow-panel-sm";

export function AuthForm({
  mode,
  oauth,
}: {
  mode: "login" | "signup";
  oauth: { google: boolean; github: boolean };
}) {
  const action = mode === "login" ? loginAction : signupAction;
  const [state, formAction] = useFormState<AuthState, FormData>(action, {});
  const hasOAuth = oauth.google || oauth.github;

  return (
    <div className="flex flex-col gap-5">
      {hasOAuth && (
        <>
          <div className="grid gap-2">
            {oauth.google && (
              <OAuthButton provider="google" label="Continue with Google" />
            )}
            {oauth.github && (
              <OAuthButton provider="github" label="Continue with GitHub" />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-ink-faint">
            <span className="h-px flex-1 bg-hairline" />
            or with email
            <span className="h-px flex-1 bg-hairline" />
          </div>
        </>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        {mode === "signup" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Name</span>
            <input name="name" type="text" required placeholder="Ada Lovelace" className={inputClass} />
          </label>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Email</span>
          <input name="email" type="email" required placeholder="you@studio.com" className={inputClass} autoComplete="email" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className={inputClass}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>

        {state?.error && (
          <p className="rounded-lg border-2 border-pop bg-pop/10 px-3 py-2 text-sm font-medium text-ink">
            {state.error}
          </p>
        )}

        <div className="mt-1">
          <SubmitButton label={mode === "login" ? "Log in" : "Create account"} />
        </div>
      </form>

      <p className="text-center text-sm text-ink-soft">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-2">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-2">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function OAuthButton({ provider, label }: { provider: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl: "/studio" })}
      className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-ink bg-white font-semibold transition-colors hover:bg-paper-deep"
    >
      {label}
    </button>
  );
}
