"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // 1. ИСПРАВЛЕНО: Добавлен хук usePathname
import dynamic from "next/dynamic";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { logout, checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

interface AxiosSessionResponse {
  data: User;
}

export function AuthNavigationComponent() {
  const router = useRouter();
  const pathname = usePathname(); // 2. ИСПРАВЛЕНО: Получаем текущий путь в браузере
  const queryClient = useQueryClient();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  // Проверяем, находится ли пользователь на публичных страницах авторизации
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  // Синхронизируем сессию с бэкендом
  const {
    data: session,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["session"],
    queryFn: checkSession,
    retry: false,
    refetchOnWindowFocus: false,
    // 3. ИСПРАВЛЕНО: Запрос выполняется ТОЛЬКО если мы НЕ на страницах /sign-in или /sign-up.
    // Это полностью предотвращает скрытые перезапуски рендеринга и зависание ссылок!
    enabled: !isAuthPage,
  });

  useEffect(() => {
    // Если мы на странице авторизации, принудительно сбрасываем стейт на гостя без запросов к серверу
    if (isAuthPage) {
      clearIsAuthenticated();
      return;
    }

    if (isSuccess && session && typeof session !== "boolean") {
      const response = session as unknown as AxiosSessionResponse;
      const userData =
        response && response.data ?
          response.data
        : (session as unknown as User);

      if (userData && typeof userData === "object" && "email" in userData) {
        setUser(userData);
        return;
      }
    }

    clearIsAuthenticated();
  }, [session, isSuccess, setUser, clearIsAuthenticated, isAuthPage]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearIsAuthenticated();
      queryClient.setQueryData(["session"], null);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      try {
        router.refresh();
      } catch {}
      router.push("/sign-in");
    },
    onError: (err) => {
      console.error("Logout request failed:", err);
    },
  });

  // Если мы на странице авторизации, мы не ждем загрузку сессии (ее там нет)
  if (isLoading && !isAuthPage) {
    return (
      <li className="navigationItem">
        <span
          className="navigationLink"
          style={{ opacity: 0.5, cursor: "default" }}
        >
          Loading...
        </span>
      </li>
    );
  }

  // Если мы на страницах входа/регистрации, пользователь гарантированно не валиден (он гость)
  const isUserValid =
    !isAuthPage && isSuccess && isAuthenticated && user && user.email;

  return (
    <>
      {isUserValid ?
        <>
          <li className="navigationItem">
            <Link href="/profile" prefetch={false} className="navigationLink">
              Profile
            </Link>
          </li>
          <li
            className="navigationItem"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <p className="userEmail" style={{ margin: 0 }}>
              {user.email}
            </p>
            <a
              role="button"
              tabIndex={0}
              className="navigationLink logoutLink"
              style={{ cursor: "pointer", textDecoration: "none" }}
              onClick={(e) => {
                e.preventDefault();
                if (!logoutMutation.isPending) logoutMutation.mutate();
              }}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </a>
          </li>
        </>
      : <>
          {/* ИСПРАВЛЕНО: Заменили <Link> на <a>, чтобы заставить браузер сделать жесткий переход 
              в обход забагованного клиентского кэша Next.js */}
          <li className="navigationItem">
            <a href="/sign-in" className="navigationLink">
              Login
            </a>
          </li>
          <li className="navigationItem">
            <a href="/sign-up" className="navigationLink">
              Sign up
            </a>
          </li>
        </>
      }
    </>
  );
}

const AuthNavigationNoSSR = dynamic(
  async () => {
    return AuthNavigationComponent;
  },
  { ssr: false },
);

export default AuthNavigationNoSSR;
