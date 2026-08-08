import Link from "next/link";
import css from "./Header.module.css";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import { getMe } from "@/lib/api/serverApi";
import type { User } from "@/types/user";

export default async function Header() {
  let user: User | null = null;
  try {
    user = await getMe();
  } catch {
    user = null;
  }

  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <AuthNavigation initialUser={user} />

          <li>
            <Link href="/notes/filter/all">Notes</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
