export interface Note {
  id: string;
  title: string;
  content: string; // Строго content замість text
  createdAt: string;
  updatedAt: string;
  tag: string; // Строго рядок замість масиву tags
}
