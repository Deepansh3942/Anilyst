"use client";

import { loginSchema } from "@anilyst/validation";
import type { AuthResponse } from "@anilyst/types";
import { useState } from "react";
import { Field } from "./field";
import { SubmitButton } from "./submit-button";
import { saveAuthSession } from "@/lib/auth-storage";

type FieldErrors = Partial<Record<"email" | "password", string>>;

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "email" || key === "password") {
          next[key] ??= issue.message;
        }
      }
      setFieldErrors(next);
      return;
    }

    setFieldErrors({});
    setPending(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload = (await response.json().catch(() => null)) as
        (AuthResponse & { message?: string }) | { message?: string } | null;

      if (!response.ok || !payload || !("tokens" in payload) || !payload.tokens) {
        setFormError(
          payload && "message" in payload && payload.message
            ? payload.message
            : "Unable to sign in. Check your credentials and try again.",
        );
        return;
      }

      saveAuthSession(payload);
      window.location.href = "/dashboard";
    } catch {
      setFormError("Could not reach the auth API. Is the backend running?");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        error={fieldErrors.email}
        placeholder="you@example.com"
      />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        error={fieldErrors.password}
        placeholder="At least 8 characters"
      />

      {formError ? (
        <p className="rounded-lg border border-[rgba(251,113,133,0.35)] bg-[rgba(251,113,133,0.08)] px-3 py-2 text-sm text-[var(--danger)]">
          {formError}
        </p>
      ) : null}

      <SubmitButton pending={pending}>Sign in</SubmitButton>
    </form>
  );
}
