"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { register, checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

interface AxiosSessionResponse {
  data: User;
}

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

export default function SignUpPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  // 1. ИСПРАВЛЕНО: Защита публичного роута. Проверяем сессию при загрузке страницы
  const { data: session, isSuccess } = useQuery({
    queryKey: ["session"],
    queryFn: checkSession,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && session && typeof session !== "boolean") {
      const response = session as unknown as AxiosSessionResponse;
      const userData =
        response.data ? response.data : (session as unknown as User);

      // Если пользователь УЖЕ вошел, принудительно выталкиваем его на главную (/) по ТЗ ментора
      if (
        userData &&
        typeof userData === "object" &&
        "email" in userData &&
        userData.email
      ) {
        router.replace("/");
      }
    }
  }, [session, isSuccess, router]);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (userData) => {
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ["session"] });

      // 2. ИСПРАВЛЕНО: После успешной регистрации редиректим строго на главную (/) по ТЗ ментора
      router.push("/");
    },
    onError: (err: unknown) => {
      setError(getErrorMessage(err));
    },
  });

  // 3. ИСПРАВЛЕНО: Перешли на классический onSubmit с e.preventDefault() ради стабильности React Query
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
    <main className="mainContent">
      <h1 className="formTitle">Sign up</h1>

      <form onSubmit={handleSubmit} className="form">
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
            {mutation.isPending ? "Registering..." : "Register"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </form>
    </main>
  );
}
