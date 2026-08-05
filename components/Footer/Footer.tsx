import React from "react";
import css from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Oleksandr Pavlenko</p>
          <p>
            Contact us:{" "}
            <a href="mailto: aleksandr.pavlenko2016@gmail.com">
              aleksandr.pavlenko2016@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
