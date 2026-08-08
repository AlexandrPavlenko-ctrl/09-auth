"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { NoteList } from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag: string; // Принимаем строку тега от серверного компонента
}

export default function NotesClient({ tag: currentTag }: NotesClientProps) {
  // Локальное управление состояниями пагинации и поиска согласно требованиям ТЗ
  const [page, setPage] = useState<number>(1);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // 1. Эффект дебаунса для ввода текста (синхронизация с таймаутом)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchInputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInputValue]);

  useEffect(() => {
    if (page !== 1) {
      const token = setTimeout(() => {
        setPage(1);
      }, 0);
      return () => clearTimeout(token);
    }
  }, [debouncedSearchQuery, currentTag, page]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, debouncedSearchQuery, currentTag],
    queryFn: () =>
      fetchNotes({
        page,
        limit: 10,
        search: debouncedSearchQuery,
        tag: currentTag,
      }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className={css.app || "app-container"}>
      <div className={css.toolbar || "toolbar"}>
        <SearchBox value={searchInputValue} onChange={setSearchInputValue} />

        <Link
          href="/notes/action/create"
          className={css.button}
          prefetch={false}
          style={{ textDecoration: "none", display: "inline-block" }}
        >
          Create note +
        </Link>
      </div>

      {isError && (
        <div className="error" style={{ color: "#dc3545", margin: "10px 0" }}>
          Error loading notes: {(error as Error).message}
        </div>
      )}

      {isLoading ?
        <div className="loading">Loading notes...</div>
      : <>
          {data && data.notes.length > 0 ?
            <NoteList notes={data.notes} />
          : <div
              className="no-notes"
              style={{ textAlign: "center", color: "#6c757d", padding: "20px" }}
            >
              No notes found.
            </div>
          }
        </>
      }

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
