"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css"; // Убедитесь, что у вас именно такое имя файла стилей, либо замените на EditProfilePage.module.css, если стили общие

export default function AuthNavigation() {
  const router = useRouter();

  // Извлекаем состояние строго из вашего useAuthStore
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    // Очищаем локальное состояние Zustand
    clearIsAuthenticated();

    // Перенаправляем строго на /sign-in по вашему ТЗ
    router.push("/sign-in");
  };

  // 1. Если пользователь НЕ авторизован — рендерим строго ваши <Link> на /sign-in и /sign-up
  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
            Sign up
          </Link>
        </li>
      </>
    );
  }

  // 2. Если пользователь залогинен — показываем Profile и рабочую кнопку Logout
  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button className={css.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  );
}
