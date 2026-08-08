"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

// Безопасная валидация ошибок от API без использования any
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

  return "Registration failed. Please check your data.";
}

// КРИТИЧЕСКИ ВАЖНО ДЛЯ ИСПРАВЛЕНИЯ ОШИБКИ: export default перед функцией
export default function SignUpPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/profile");
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err));
    },
  });

  const handleFormAction = (formData: FormData) => {
    setError(null);
    const email = ((formData.get("email") as string) || "").trim();
    const password = ((formData.get("password") as string) || "").trim();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    mutation.mutate({ email, password });
  };

  return (
    <main className="mainContent">
      <h1 className="formTitle">Sign up</h1>
      <form action={handleFormAction} className="form">
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className="input"
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="input"
            required
          />
        </div>

        <div className="actions">
          <button
            type="submit"
            className="submitButton"
            disabled={mutation.isPending}
          >
            Register
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </form>
    </main>
  );
}
