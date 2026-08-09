"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { login, checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";
import css from "./SignInPage.module.css";

// Строгий интерфейс для ответа Axios, чтобы избежать any
interface AxiosSessionResponse {
  data: User;
}

export default function SignIn() {
  const router = useRouter();

  // ИСПРАВЛЕНО: Добавлена инициализация queryClient для сброса кэша TanStack Query
  const queryClient = useQueryClient();

  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");

  const { data: session, isSuccess } = useQuery({
    queryKey: ["session"],
    queryFn: checkSession,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Реагируем только если запрос завершился успешным статусом 200 OK
    if (isSuccess && session && typeof session !== "boolean") {
      const response = session as unknown as AxiosSessionResponse;
      const userData =
        response.data ? response.data : (session as unknown as User);

      // Перенаправляем на главную ТОЛЬКО если в ответе есть реальный email залогиненного юзера.
      // Если бэкенд вернул 401 ошибку — этот блок игнорируется, и форма откроется.
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const credentials = {
        email: (formData.get("email") as string) || "",
        password: (formData.get("password") as string) || "",
      };

      const user = await login(credentials);
      setUser(user);

      // Принудительно очищаем кэш сессии в React Query перед переходом
      queryClient.invalidateQueries({ queryKey: ["session"] });

      // ИСПРАВЛЕНО: Использование window.location.href гарантирует запись кук бэкенда.
      // Направляем пользователя строго на главную страницу (/) в соответствии с ТЗ ментора.
      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.error || err.response?.data?.message;
        setError(
          typeof serverMessage === "string" ? serverMessage : "Login failed",
        );
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            autoComplete="email"
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
            autoComplete="current-password"
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
