import React from "react";
import Link from "next/link";
import css from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" prefetch={false}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/" prefetch={false}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/notes/filter/all" prefetch={false}>
              Notes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
