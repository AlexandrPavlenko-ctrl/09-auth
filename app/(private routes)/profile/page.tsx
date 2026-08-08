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
  const user = await getMe();

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
            src={user.avatar}
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
