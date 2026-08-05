"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import css from "./NoteDetails.module.css";

export const NoteDetailsClient: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  const dateDisplay =
    note.createdAt ? new Date(note.createdAt).toLocaleDateString("uk-UA") : "—";

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag || "Todo"}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{dateDisplay}</p>
        </div>
      </div>
    </main>
  );
};
