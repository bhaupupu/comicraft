import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  const oauth = {
    google: !!process.env.AUTH_GOOGLE_ID,
    github: !!process.env.AUTH_GITHUB_ID,
  };
  return (
    <AuthScreen title="Start creating" subtitle="Two free generations. No credit card.">
      <AuthForm mode="signup" oauth={oauth} />
    </AuthScreen>
  );
}
