import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description: "На жаль, запитувану сторінку не знайдено на сервері NoteHub.",
  openGraph: {
    title: "404 - Page not found | NoteHub",
    description: "На жаль, запитувану сторінку не знайдено на сервері NoteHub.",
    url: "https://notehub.com",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub 404 Page Not Found",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <h1 style={{ fontSize: "48px", color: "#e74c3c" }}>404</h1>
      <h2>Page not found</h2>
      <p style={{ color: "#6c757d", margin: "20px 0" }}>
        Запитувану сторінку не знайдено. Можливо, вона була видалена або
        переміщена.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#0d6efd",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Повернутися на головну
      </Link>
    </div>
  );
}
