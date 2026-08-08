import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const user = await getMe();
    const title = `${user.username}'s Profile | NoteHub`;
    return {
      title,
      description: `Personal profile page of ${user.username} on NoteHub app.`,
    };
  } catch {
    return { title: "Profile | NoteHub" };
  }
}

export default async function ProfilePage() {
  let user = null;

  try {
    user = await getMe();
  } catch {
    user = null;
  }

  const avatarSrc =
    user?.avatar || "https://ac.goit.global/fullstack/react/default-avatar.jpg";

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <p>Please sign in again to view your profile.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
