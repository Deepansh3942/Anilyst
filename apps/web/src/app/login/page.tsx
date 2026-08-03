import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in · Anilyst",
  description: "Sign in to track anime, manage your library, and get recommendations.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue tracking your watchlist and discovering new titles."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-[var(--accent)] hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
