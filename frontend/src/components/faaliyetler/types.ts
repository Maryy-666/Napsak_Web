import { NoteVariant, NoteColor } from "./PaperNote";

export type FaaliyetKategori = "atolye" | "sosyal" | "teknoloji";

export interface FaaliyetItem {
  id: string;
  title: string;
  description: string;
  memoryCaption?: string; // Short handwritten memory note (e.g., "Çamurdan hayallere, ilk eserlerimizi ellerimizle şekillendirdiğimiz o güzel gün...")
  category: FaaliyetKategori;
  categoryLabel: string;
  date: string;
  iconName: "briefcase" | "users" | "heart" | "laptop" | "book" | "sparkles" | "camera" | "palette";
  imageUrl?: string; // Real Ne Yapsak activity thumbnail photo!
  noteVariant: NoteVariant;
  noteColor: NoteColor;
  rotation: number;
  pinColor?: "red" | "sage" | "peach" | "lavender" | "yellow" | "mint" | "coral";
  tapeColor?: "mint" | "peach" | "lavender" | "sage" | "yellow" | "grid";
  tapePattern?: "dots" | "stripes" | "solid";
  clipColor?: "gold" | "rose" | "silver";
}

export interface BoardSlot {
  slotId: string;
  top: string;
  left: string;
  width: string;
  height: string;
  rotation: number;
  zIndex?: number;
  activityData?: FaaliyetItem; // If present, renders active data card; if undefined, renders placeholder note!
  placeholderVariant: NoteVariant;
  placeholderColor: NoteColor;
  pinColor?: "red" | "sage" | "peach" | "lavender" | "yellow" | "mint" | "coral";
  tapeColor?: "mint" | "peach" | "lavender" | "sage" | "yellow" | "grid";
  tapePattern?: "dots" | "stripes" | "solid";
  clipColor?: "gold" | "rose" | "silver";
}
