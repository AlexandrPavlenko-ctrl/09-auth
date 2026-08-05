"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  // isOpen?: boolean; // <- Додайте знак "?" або повністю видаліть цей рядок, якщо він не потрібен
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    // Блокуємо скролл на body при відкритті модалки
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [onClose]);

  if (typeof window === "undefined") return null;

  const modalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
};
