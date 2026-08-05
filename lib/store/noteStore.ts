import { create } from "zustand";
import { persist } from "zustand/middleware"; // Імпортуємо middleware persist з пакета

const initialDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

export interface NoteDraft {
  title: string;
  content: string;
  tag: string;
}

interface NoteStore {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

// ВИПРАВЛЕНО: Обгортаємо створення стору у persist з подвійними дужками
export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      // 1. Вказуємо унікальний ключ для збереження даних в localStorage
      name: "notehub-draft-storage",

      // 2. Налаштовуємо partialize, щоб зберігати ТІЛЬКИ draft, без методів
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
