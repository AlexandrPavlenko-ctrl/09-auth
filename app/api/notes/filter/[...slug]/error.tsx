"use client"; // Файли помилок обов'язково мають бути клієнтськими компонентами

import React, { useEffect } from "react";

// 1. Обов'язковий іменований інтерфейс для пропсів Next.js Error Boundary
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): React.JSX.Element {
  useEffect(() => {
    // Логуємо помилку в консоль або сервіс аналітики
    console.error("Caught routing error:", error);
  }, [error]);

  return (
    <div
      style={{
        padding: "24px",
        textAlign: "center",
        background: "#fff3f3",
        borderRadius: "8px",
        border: "1px solid #f5c2c2",
      }}
    >
      <h2 style={{ color: "#dc3545", marginTop: 0 }}>Something went wrong!</h2>
      <p style={{ color: "#6c757d" }}>
        {error.message || "Failed to load filtered notes."}
      </p>

      <button
        type="button"
        onClick={() => reset()} // Спроба перезавантажити частину сторінки (викликати prefetch/useQuery знову)
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
