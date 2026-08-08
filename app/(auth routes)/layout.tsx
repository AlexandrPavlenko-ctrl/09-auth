import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

// КРИТИЧНО ДЛЯ NEXT.JS: Компонент обов'язково має бути експортований як default
export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Зчитуємо сесійну куку з браузера користувача на серверній стороні
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session");

  // Якщо токен активний (користувач уже пройшов автентифікацію):
  if (sessionToken) {
    // Примусово перенаправляємо його на профіль
    redirect("/profile");
  }

  // Якщо куки немає — дозволяємо рендерити сторінки /sign-in або /sign-up
  return <>{children}</>;
}
