"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthNavigation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Подписываемся на глобальный Zustand-стор авторизации
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  // Настройка мутации для безопасного выхода из системы
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 1. Мгновенно очищаем Zustand-стор (шапка сразу перерисуется в Login / Sign up)
      clearIsAuthenticated();

      // 2. Принудительно очищаем и обнуляем кэш сессии в TanStack Query
      queryClient.setQueryData(["session"], null);
      queryClient.invalidateQueries({ queryKey: ["session"] });

      // 3. Выполняем нативный редирект на страницу авторизации
      router.push("/sign-in");
    },
    onError: (err) => {
      console.error("Logout request failed:", err);
    },
  });

  return (
    <>
      {/* Условный рендеринг строго на основании Zustand-стейта isAuthenticated */}
      {isAuthenticated && user ?
        <>
          <li className="navigationItem">
            <Link href="/profile" prefetch={false} className="navigationLink">
              Profile
            </Link>
          </li>
          <li className="navigationItem">
            <p className="userEmail">{user.email}</p>
            <button
              type="button"
              className="logoutButton"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </li>
        </>
      : <>
          <li className="navigationItem">
            <Link href="/sign-in" prefetch={false} className="navigationLink">
              Login
            </Link>
          </li>
          <li className="navigationItem">
            <Link href="/sign-up" prefetch={false} className="navigationLink">
              Sign up
            </Link>
          </li>
        </>
      }
    </>
  );
}
