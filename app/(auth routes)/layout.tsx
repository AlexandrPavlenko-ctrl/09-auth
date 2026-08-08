import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

// КРИТИЧНО ДЛЯ NEXT.JS: Компонент обов'язково має бути експортований як default
export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Зчитуємо доступні куки авторизації з браузера користувача на серверній стороні
  const cookieStore = await cookies();
  const hasAuthCookie = Boolean(
    cookieStore.get("session") ||
    cookieStore.get("accessToken") ||
    cookieStore.get("refreshToken"),
  );

  // Якщо токен активний (користувач уже пройшов автентифікацію):
  if (hasAuthCookie) {
    // Примусово перенаправляємо його на профіль
    redirect("/profile");
  }

  // Якщо куки немає — дозволяємо рендерити сторінки /sign-in або /sign-up
  return <>{children}</>;
}
