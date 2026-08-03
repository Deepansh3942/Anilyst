"use client";

import { registerSchema } from "@anilyst/validation";
import type { AuthResponse } from "@anilyst/types";
import { useState } from "react";
import { Field } from "./field";
import { SubmitButton } from "./submit-button";
import { saveAuthSession } from "@/lib/auth-storage";

type FieldErrors = Partial<Record<"email" | "username" | "password" | "confirmPassword", string>>;

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = registerSchema.safeParse({ email, username, password });
    const next: FieldErrors = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "email" || key === "username" || key === "password") {
          next[key] ??= issue.message;
        }
      }
    }

    if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    if (!parsed.success || Object.keys(next).length > 0) {
      setFieldErrors(next);
      return;
    }

    setFieldErrors({});
    setPending(true);

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
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
            : "Unable to create account. Try a different email or username.",
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
        id="username"
        label="Username"
        type="text"
        autoComplete="username"
        value={username}
        onChange={setUsername}
        error={fieldErrors.username}
        placeholder="3–32 characters"
      />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        error={fieldErrors.password}
        placeholder="At least 8 characters"
      />
      <Field
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={fieldErrors.confirmPassword}
        placeholder="Repeat your password"
      />

      {formError ? (
        <p className="rounded-lg border border-[rgba(251,113,133,0.35)] bg-[rgba(251,113,133,0.08)] px-3 py-2 text-sm text-[var(--danger)]">
          {formError}
        </p>
      ) : null}

      <SubmitButton pending={pending}>Create account</SubmitButton>
    </form>
  );
}
