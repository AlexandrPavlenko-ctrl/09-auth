"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

function getErrorMessage(error: unknown): string {
  const maybeApiError = error as { response?: { data?: unknown } };
  if (
    typeof error === "object" &&
    error !== null &&
    typeof maybeApiError.response === "object" &&
    maybeApiError.response !== null
  ) {
    const maybeResponseData = maybeApiError.response.data as
      | { message?: unknown }
      | undefined;
    if (
      typeof maybeResponseData === "object" &&
      maybeResponseData !== null &&
      typeof maybeResponseData.message === "string"
    ) {
      return maybeResponseData.message;
    }
  }

  return "Invalid email or password.";
}

export default function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/profile");
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err));
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const email = ((formData.get("email") as string) || "").trim();
    const password = ((formData.get("password") as string) || "").trim();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    mutation.mutate({ email, password });
  };

  return (
    <main className={css.mainContent}>
      <form onSubmit={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>
        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            Log in
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
