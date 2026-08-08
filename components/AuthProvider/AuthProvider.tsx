"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

// Додаємо суворий колір експорту за замовчуванням (export default)
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: checkSession,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (user && typeof user !== "boolean") {
        setUser(user);
      } else {
        clearIsAuthenticated();
      }
    }
  }, [user, isLoading, setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
