"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoteApi } from "@/lib/api/api";
import { useNoteStore } from "@/lib/store/noteStore"; // Імпортуємо новий стор
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Отримуємо стан draft та методи з Zustand-стору
  const { draft, setDraft, clearDraft } = useNoteStore();

  // Локальний стейт для виведення помилок валідації
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    tag?: string;
  }>({});

  const mutation = useMutation({
    mutationFn: createNoteApi,
    onSuccess: () => {
      // 1. Інвалідуємо кеш нотаток за допомогою useQueryClient
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // 2. Очищаємо draft через метод clearDraft
      clearDraft();
      // 3. Перенаправляємо користувача на маршрут /notes/filter/all
      router.push("/notes/filter/all");
    },
    onError: (err) => {
      console.error("Error creating note:", err);
    },
  });

  // Забезпечує миттєве збереження змін у draft в Zustand одразу при зміні полів
  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Викликаємо setDraft у сторі з актуальними даними, зберігаючи інші поля
    setDraft({ [name]: value });

    // Скидаємо помилку валідації при введенні тексту
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Обробник форми через механізм formAction
  const handleFormAction = (formData: FormData) => {
    const title = ((formData.get("title") as string) || "").trim();
    const content = ((formData.get("content") as string) || "").trim();
    const tag = (formData.get("tag") as string) || "Todo";

    // Валідація значень полів форми
    const newErrors: typeof errors = {};
    if (!title || title.length < 3 || title.length > 50) {
      newErrors.title =
        "Title must be between 3 and 50 characters and is required";
    }
    if (content.length > 500) {
      newErrors.content = "Content maximum length is 500 characters";
    }
    if (!["Todo", "Work", "Personal", "Meeting", "Shopping"].includes(tag)) {
      newErrors.tag = "Invalid tag value";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Якщо все добре — створюємо нотатку на сервері
    mutation.mutate({ title, content, tag });
  };

  return (
    <form action={handleFormAction} className={css.form}>
      {/* Поле Title */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title} // Підставляємо значення зі стану Zustand
          onChange={handleFieldChange} // Оновлюємо Zustand при зміні
        />
        <span className={css.error}>{errors.title || ""}</span>
      </div>

      {/* Поле Content */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content} // Підставляємо значення зі стану Zustand
          onChange={handleFieldChange} // Оновлюємо Zustand при зміні
        />
        <span className={css.error}>{errors.content || ""}</span>
      </div>

      {/* Поле Tag */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag} // Підставляємо значення зі стану Zustand
          onChange={handleFieldChange} // Оновлюємо Zustand при зміні
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error}>{errors.tag || ""}</span>
      </div>

      {/* Панель дій */}
      <div className={css.actions}>
        {/* При натисканні Cancel draft НЕ очищається, користувач просто повертається назад */}
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
