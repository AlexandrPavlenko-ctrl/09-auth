"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUserData) => {
      setUser(updatedUserData);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/profile");
    },
    onError: (error: unknown) => {
      let message = "Failed to update profile.";
      if (typeof error === "string") {
        message = error;
      } else if (typeof error === "object" && error !== null) {
        const err = error as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message ?? message;
      }
      setError(message);
    },
  });

  const handleFormAction = (formData: FormData) => {
    setError(null);
    const username = ((formData.get("username") as string) || "").trim();

    if (!username) {
      setError("Username is required.");
      return;
    }
    mutation.mutate({ username });
  };

  if (!user)
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
    );

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
          priority
        />
        <form action={handleFormAction} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              name="username"
              className={css.input}
              defaultValue={user.username}
            />
          </div>
          <p>Email: {user.email}</p>
          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={mutation.isPending}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
