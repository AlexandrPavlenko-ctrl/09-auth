import React from "react";
// Link removed: not used in this file

export default function HomePage() {
  return (
    <main style={{ padding: "4rem 1rem", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          background: "#ffffff",
          padding: "2.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#4f46e5",
            marginBottom: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Welcome to NoteHub
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#374151",
            lineHeight: "1.7",
            marginBottom: "1.5rem",
          }}
        >
          NoteHub is a simple and efficient application designed for managing
          personal notes. It helps keep your thoughts organized and accessible
          in one place, whether you are at home or on the go.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#374151",
            lineHeight: "1.7",
            marginBottom: "2rem",
          }}
        >
          The app provides a clean interface for writing, editing, and browsing
          notes. With support for keyword search and structured organization,
          NoteHub offers a streamlined experience for anyone who values clarity
          and productivity.
        </p>
      </div>
    </main>
  );
}
