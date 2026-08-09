"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Клієнтський лейаут для автентифікаційних маршрутів (login / register)
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Якщо користувач вже залогінений, виштовхуємо його на головну сторінку
    if (user) {
      // Обов'язковий виклик для оновлення серверних даних та кук за специфікацією ДЗ
      router.refresh();
      router.push("/");
    }
  }, [user, router]);

  // Якщо користувач залогінений, повертаємо null (поки спрацьовує редірект),
  // інакше рендеримо дочірні сторінки входу/реєстрації
  if (user) {
    return null;
  }

  return <>{children}</>;
}
