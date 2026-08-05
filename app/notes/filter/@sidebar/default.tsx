import React from "react";
import Link from "next/link";
import css from "./SidebarNotes.module.css";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes(): React.JSX.Element {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link
          href="/notes/filter/all"
          className={css.menuLink}
          prefetch={false}
        >
          All notes
        </Link>
      </li>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${tag}`}
            className={css.menuLink}
            prefetch={false}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
