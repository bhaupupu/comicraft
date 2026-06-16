import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  const oauth = {
    google: !!process.env.AUTH_GOOGLE_ID,
    github: !!process.env.AUTH_GITHUB_ID,
  };
  return (
    <AuthScreen title="Welcome back" subtitle="Log in to your studio and keep creating.">
      <AuthForm mode="login" oauth={oauth} />
    </AuthScreen>
  );
}
