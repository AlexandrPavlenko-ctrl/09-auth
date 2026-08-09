import Link from "next/link";
import css from "./Header.module.css";
import AuthNavigation from "../AuthNavigation/AuthNavigation";

// ИСПРАВЛЕНО: Удалены неиспользуемые импорты getMe и типа User

export default async function Header() {
  // ИСПРАВЛЕНО: Полностью удален блок инициализации let user = null и try-catch,
  // так как AuthNavigation теперь работает автономно на клиенте через TanStack Query

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

          {/* Автономный клиентский компонент без лишних пропсов */}
          <AuthNavigation />

          <li>
            <Link href="/notes/filter/all">Notes</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
