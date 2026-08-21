"use client";

export type BoardCardType = "photo" | "sticky" | "motto" | "polaroid";
export type FaaliyetStatus = "Devam Eden" | "Yakında" | "Tamamlanan";

export interface FaaliyetItem {
  id: string;
  type: BoardCardType;
  title: string;
  category: string;
  team: string;
  status: FaaliyetStatus;
  date: string;
  location: string;
  summary: string;
  outcomes?: string[];
  participantCount?: number;
  progressPercent?: number;
  image?: string;
  rotation: string;
  pinColor: string;
  noteBg: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  mottoText?: string;
  tagText?: string;
  tapeColor?: string;
  tapeRotation?: string;
  youthStickerIconName?: string;
  stickerBadgeBg?: string;
  objectives?: string[];
  impactMetrics?: string;
  createdAt: number;
}

// N'apsak? Resmi Haberler ve Çalışmalar Arşivinden Gerçek Faaliyet Verileri
const INITIAL_FAALIYETLER: FaaliyetItem[] = [
  {
    id: "kil-atolyesi",
    type: "polaroid",
    title: "Kil Atölyesi: Çamurdan Hayallere",
    category: "Sanat & Atölye",
    team: "Sanat Ekibi",
    status: "Tamamlanan",
    date: "15 Ekim 2025",
    location: "Kültür Atölyesi",
    summary: "Gençlerimizin elleriyle şekil verdiği, el becerilerini ve sanatsal ifade güçlerini ortaya çıkardığı doğal kil atölyemiz.",
    image: "/images/news-kil-cover.jpg",
    rotation: "-rotate-2",
    pinColor: "text-[#0A5C3A]",
    noteBg: "bg-white",
    borderColor: "border-[#DDE7E1]",
    badgeBg: "bg-[#0A5C3A]",
    badgeText: "text-white",
    participantCount: 35,
    createdAt: Date.now() - 5000,
  },
  {
    id: "ani-defteri-atolyesi",
    type: "polaroid",
    title: "Anı Defteri Atölyesi",
    category: "Tasarım & Üretim",
    team: "Tasarım Ekibi",
    status: "Tamamlanan",
    date: "12 Kasım 2025",
    location: "Gençlik Merkezi",
    summary: "Fotoğraflar, illüstrasyonlar ve el yazılarıyla kişiselleştirilen özel anı defteri tasarımı atölyemizde yaratıcı fikirler buluştu.",
    image: "/images/news-ani-cover.jpg",
    rotation: "rotate-2",
    pinColor: "text-[#0A5C3A]",
    noteBg: "bg-white",
    borderColor: "border-[#DDE7E1]",
    badgeBg: "bg-[#0A5C3A]",
    badgeText: "text-white",
    participantCount: 28,
    createdAt: Date.now() - 4000,
  },
  {
    id: "kariyer-z-1923",
    type: "polaroid",
    title: "Kariyer Z × 1923 İş Birliği Buluşması",
    category: "Kariyer & İş Birliği",
    team: "Kariyer Ekibi",
    status: "Devam Eden",
    date: "28 Kasım 2025",
    location: "Smart-B Salonu",
    summary: "Z kuşağının iş hayatındaki rolü, girişimcilik ve geleceğin mesleklerini ele aldığımız stratejik gençlik buluşması.",
    image: "/images/news-kariyer-cover.jpg",
    rotation: "-rotate-1",
    pinColor: "text-[#0A5C3A]",
    noteBg: "bg-white",
    borderColor: "border-[#DDE7E1]",
    badgeBg: "bg-[#0A5C3A]",
    badgeText: "text-white",
    participantCount: 120,
    createdAt: Date.now() - 3000,
  },
  {
    id: "23-nisan-senligi",
    type: "polaroid",
    title: "23 Nisan Coşkusu & Çocuk Şenliği",
    category: "Toplumsal Fayda",
    team: "Sosyal Sorumluluk Ekibi",
    status: "Tamamlanan",
    date: "23 Nisan 2025",
    location: "Şehir Parkı",
    summary: "Resim atölyeleri, yüz boyama ve çocuk oyun parkurlarıyla gerçekleştirdiğimiz toplumsal fayda ve çocuk bayramı çalışmamız.",
    image: "/images/news-23nisan-cover.jpg",
    rotation: "rotate-2",
    pinColor: "text-[#0A5C3A]",
    noteBg: "bg-white",
    borderColor: "border-[#DDE7E1]",
    badgeBg: "bg-[#0A5C3A]",
    badgeText: "text-white",
    participantCount: 150,
    createdAt: Date.now() - 2000,
  },
  {
    id: "cadilar-bayrami-bulusmasi",
    type: "polaroid",
    title: "Cadılar Bayramı Konseptli Gençlik Buluşması",
    category: "Etkinlik & Sosyal",
    team: "Etkinlik Ekibi",
    status: "Tamamlanan",
    date: "31 Ekim 2025",
    location: "Topluluk Salonu",
    summary: "Yaratıcı kostümler, tematik oyunlar ve müzik dinletisi eşliğinde üyelerimiz arasındaki bağları güçlendiren eğlenceli akşam.",
    image: "/images/news-cd-cover.jpg",
    rotation: "-rotate-2",
    pinColor: "text-[#0A5C3A]",
    noteBg: "bg-white",
    borderColor: "border-[#DDE7E1]",
    badgeBg: "bg-[#0A5C3A]",
    badgeText: "text-white",
    participantCount: 45,
    createdAt: Date.now() - 1000,
  },
];

const STORAGE_KEY = "napsak_faaliyetler_v4";
const EVENT_LISTENERS: Array<() => void> = [];

export function subscribeFaaliyetlerChanges(callback: () => void) {
  EVENT_LISTENERS.push(callback);
  return () => {
    const idx = EVENT_LISTENERS.indexOf(callback);
    if (idx !== -1) EVENT_LISTENERS.splice(idx, 1);
  };
}

function notifyListeners() {
  EVENT_LISTENERS.forEach((cb) => cb());
}

export const FaaliyetlerRepository = {
  getAllFaaliyetler(): FaaliyetItem[] {
    if (typeof window === "undefined") return INITIAL_FAALIYETLER;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Faaliyetler localStorage okunurken hata:", err);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAALIYETLER));
    } catch { }
    return INITIAL_FAALIYETLER;
  },

  async fetchFaaliyetlerFromDB(): Promise<FaaliyetItem[]> {
    try {
      const res = await fetch("/api/activities", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const formatted: FaaliyetItem[] = json.data.map((item: any) => ({
            id: String(item.id),
            type: item.type || "polaroid",
            title: item.title,
            category: item.category || "Genel",
            team: item.team || "N'apsak Ekibi",
            status: item.status || "Devam Eden",
            date: item.date || "",
            location: item.location || "",
            summary: item.summary || "",
            participantCount: item.participantCount || 0,
            image: item.image || "",
            rotation: item.rotation || "-rotate-1",
            pinColor: item.pinColor || "text-[#0A5C3A]",
            noteBg: item.noteBg || "bg-white",
            borderColor: item.borderColor || "border-[#DDE7E1]",
            badgeBg: item.badgeBg || "bg-[#0A5C3A]",
            badgeText: item.badgeText || "text-white",
            mottoText: item.mottoText || undefined,
            tagText: item.tagText || undefined,
            tapeColor: item.tapeColor || undefined,
            tapeRotation: item.tapeRotation || undefined,
            youthStickerIconName: item.youthStickerIconName || undefined,
            stickerBadgeBg: item.stickerBadgeBg || undefined,
            objectives: item.objectives || [],
            impactMetrics: item.impactMetrics || undefined,
            outcomes: item.outcomes || [],
            createdAt: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
          }));

          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(formatted));
            } catch { }
          }
          notifyListeners();
          return formatted;
        }
      }
    } catch (err) {
      console.warn("DB'den faaliyetler alınamadı, yerel hafıza kullanılıyor:", err);
    }
    return this.getAllFaaliyetler();
  },

  addFaaliyet(item: Omit<FaaliyetItem, "id" | "createdAt">): FaaliyetItem {
    const currentList = this.getAllFaaliyetler();
    const newItem: FaaliyetItem = {
      ...item,
      id: `faaliyet-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };

    const updated = [newItem, ...currentList];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Faaliyet ekleme kaydedilemedi:", err);
      }
    }

    // Backend DB sync in background
    fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }).then(() => this.fetchFaaliyetlerFromDB()).catch(() => {});

    notifyListeners();
    return newItem;
  },

  updateFaaliyet(id: string, updatedFields: Partial<FaaliyetItem>): FaaliyetItem | null {
    const currentList = this.getAllFaaliyetler();
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    currentList[index] = { ...currentList[index], ...updatedFields };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
      } catch (err) {
        console.error("Faaliyet güncelleme kaydedilemedi:", err);
      }
    }

    // Backend DB sync in background
    const numericId = Number(id);
    if (Number.isInteger(numericId)) {
      fetch(`/api/activities/${numericId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      }).then(() => this.fetchFaaliyetlerFromDB()).catch(() => {});
    }

    notifyListeners();
    return currentList[index];
  },

  deleteFaaliyet(id: string): boolean {
    const currentList = this.getAllFaaliyetler();
    const filtered = currentList.filter((item) => item.id !== id);
    if (filtered.length === currentList.length) return false;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (err) {
        console.error("Faaliyet silme kaydedilemedi:", err);
      }
    }

    // Backend DB sync in background
    const numericId = Number(id);
    if (Number.isInteger(numericId)) {
      fetch(`/api/activities/${numericId}`, {
        method: "DELETE",
      }).then(() => this.fetchFaaliyetlerFromDB()).catch(() => {});
    }

    notifyListeners();
    return true;
  },

  resetToDefaults(): FaaliyetItem[] {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAALIYETLER));
      } catch { }
    }
    notifyListeners();
    return INITIAL_FAALIYETLER;
  },
};
