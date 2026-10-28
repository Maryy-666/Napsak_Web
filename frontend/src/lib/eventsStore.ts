"use client";

export interface EventItem {
  id: string;
  slug?: string;
  title: string;
  category: "teknoloji" | "sanat" | "cevre-saglik" | "programlar" | string;
  categoryLabel?: string;
  date: string;
  time?: string;
  location: string;
  status: "aktif" | "gecmis" | "taslak" | "Yaklaşan" | "Geçmiş" | "Devam Ediyor" | string;
  publicationStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  partner?: string;
  quota?: number;
  appliedCount: number;
  description: string;
  shortDescription?: string;
  content?: string;
  coverImage?: string;
  image?: string;
  badge?: string;
  isFeatured?: boolean;
  registrationEnabled?: boolean;
  registrationDeadline?: string;
  startDate?: string;
  endDate?: string;
}

export interface EventApplication {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  school: string;
  department: string;
  grade: string;
  note: string;
  appliedAt: string;
  status: "Beklemede" | "Onaylandı" | "Reddedildi";
}

// REST/API YARDIMCI HEADER VE FETCH YAPILANDIRMASI
const getFetchOptions = (method: string = "GET", body?: any): RequestInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include", // Cookie/NextAuth oturum bilgilerini sunucuya otomatik taşır
    cache: "no-store",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// DEFAULT INITIAL EVENTS (Hem sizin hem arkadaşınızın eklediği tüm veriler birleştirildi)
const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt-101",
    title: "1923 Gençlik Derneği İş Birliği & Tanışma Zirvesi",
    category: "programlar",
    categoryLabel: "Programlar & Sosyal",
    date: "26 Eylül 2025",
    time: "14:00 - 18:00",
    location: "Beylikdüzü Smart-B Kültür Merkezi",
    status: "aktif",
    partner: "1923 Gençlik Derneği & Beylikdüzü Belediyesi",
    quota: 120,
    appliedCount: 42,
    description: "Ne Yapsak? Gençlik Derneği'nun ilk büyük yüz yüze buluşması!",
    coverImage: "/images/news-ani-cover.jpg",
    badge: "Öne Çıkan Aktif Zirve",
    registrationEnabled: true,
  },
  {
    id: "evt-102",
    title: "Sürdürülebilir Teknoloji ve Yapay Zeka Atölyesi",
    category: "teknoloji",
    categoryLabel: "Teknoloji & İnovasyon",
    date: "12 Ekim 2025",
    time: "19:00 - 21:00",
    location: "Online / Google Meet",
    status: "aktif",
    quota: 80,
    appliedCount: 29,
    description: "Yapay zeka araçlarının günlük projelerde etkin kullanımı.",
    badge: "Kontenjan Sınırlı",
    registrationEnabled: true,
  },
  {
    id: "evt-103",
    title: "Doğayla Denge: Doğa Yürüyüşü ve Çevre Temizliği",
    category: "cevre-saglik",
    categoryLabel: "Yaşam ve Sürdürülebilirlik",
    date: "20 Temmuz 2025",
    time: "10:00 - 15:00",
    location: "Belgrat Ormanı Aktivite Alanı",
    status: "gecmis",
    appliedCount: 65,
    description:
      "Ruhsal ve fiziksel sağlığı destekleyen doğa yürüyüşü, çevre temizliği farkındalığı ve açık hava sohbeti tamamlandı.",
  },
  {
    id: "evt-104",
    title: "Yaratıcı Yazarlık & Dijital Sanat Sergisi",
    category: "sanat",
    categoryLabel: "Sanat & Estetik",
    date: "05 Haziran 2025",
    time: "15:00 - 19:00",
    location: "Kültür & Sanat Atölyesi",
    status: "gecmis",
    appliedCount: 54,
    description:
      "Genç yazarlarımızın hikayeleri ve dijital sanat ekibimizin illüstrasyon çalışmalarının sergilendiği estetik sergi gerçekleşti.",
  },
  {
    id: "evt-105",
    title: "Dernek İçi Ideathon & Fikir Kampı",
    category: "programlar",
    categoryLabel: "Programlar & Sosyal",
    date: "15 Mayıs 2025",
    time: "13:00 - 17:00",
    location: "Online Discord Sunucusu",
    status: "gecmis",
    appliedCount: 86,
    description:
      "86 aktif üyemizin katılımıyla 2025 dönemi projelerinin belirlendiği online fikir üretme kampı tamamlandı.",
  },
];

const INITIAL_APPLICATIONS: EventApplication[] = [];

const globalForEvents = globalThis as unknown as {
  eventsStore?: EventItem[];
  eventApplicationsStore?: EventApplication[];
};

export const eventsStore: EventItem[] =
  globalForEvents.eventsStore ?? [...INITIAL_EVENTS];

export const eventApplicationsStore: EventApplication[] =
  globalForEvents.eventApplicationsStore ?? [...INITIAL_APPLICATIONS];

if (process.env.NODE_ENV !== "production") {
  globalForEvents.eventsStore = eventsStore;
  globalForEvents.eventApplicationsStore = eventApplicationsStore;
}

// STORE HELPER METHODS
export const EventsRepository = {
  getAllEvents(): EventItem[] {
    return eventsStore;
  },

  async fetchEventsFromDB(statusFilter?: string): Promise<EventItem[]> {
    try {
      const url = statusFilter && statusFilter !== "Tümü" && statusFilter !== "all" 
        ? `/api/events?status=${statusFilter}` 
        : "/api/events";
        
      const res = await fetch(url, getFetchOptions("GET"));

      if (res.ok) {
        const json = await res.json();
        
        const rawArray = Array.isArray(json.data?.data) 
          ? json.data.data 
          : Array.isArray(json.data) 
          ? json.data 
          : [];

        if (json.success && rawArray.length > 0) {
          const dbEvents: EventItem[] = rawArray.map((item: any) => ({
            id: String(item.id),
            slug: item.slug || String(item.id),
            title: item.title,
            category: item.category || "programlar",
            categoryLabel: item.category === "teknoloji" ? "Teknoloji & İnovasyon" : "Programlar & Sosyal",
            date: item.startDate ? new Date(item.startDate).toLocaleDateString("tr-TR") : item.date || "",
            time: item.time || "14:00",
            location: item.location || "Belirtilmedi",
            status: item.status?.toLowerCase() === "yaklaşan" ? "aktif" : (item.status || "aktif"),
            publicationStatus: item.publicationStatus || "PUBLISHED",
            shortDescription: item.shortDescription || item.description || "",
            description: item.description || "",
            content: item.content || item.description || "",
            appliedCount: item.appliedCount || 0,
            quota: item.quota || item.capacity || 100,
            coverImage: item.image || item.coverImage || undefined,
            image: item.image || item.coverImage || undefined,
            isFeatured: Boolean(item.isFeatured),
            registrationEnabled: item.registrationEnabled !== false,
            registrationDeadline: item.registrationDeadline || undefined,
            startDate: item.startDate || undefined,
            endDate: item.endDate || undefined,
          }));

          eventsStore.length = 0;
          eventsStore.push(...dbEvents, ...INITIAL_EVENTS);
          return eventsStore;
        }
      }
    } catch (err) {
      console.warn("DB'den etkinlikler alınamadı, yerel depolama kullanılıyor:", err);
    }
    
    eventsStore.length = 0;
    eventsStore.push(...INITIAL_EVENTS);
    return eventsStore;
  },

  addEvent(event: Omit<EventItem, "id" | "appliedCount">): EventItem {
    const isRegEnabled = event.registrationEnabled !== undefined ? Boolean(event.registrationEnabled) : true;
    
    const newEvent: EventItem = {
      ...event,
      id: `evt-${Date.now().toString().slice(-4)}`,
      appliedCount: 0,
      registrationEnabled: isRegEnabled,
    };
    eventsStore.unshift(newEvent);

    const payload = {
      title: event.title,
      description: event.description,
      location: event.location,
      category: event.category,
      status: "aktif",
      image: event.coverImage || event.image,
      startDate: event.startDate ? new Date(event.startDate).toISOString() : new Date().toISOString(),
      endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
      registrationEnabled: isRegEnabled,
    };

    fetch("/api/events", getFetchOptions("POST", payload))
      .then((res) => {
        if (!res.ok) console.error("Etkinlik ekleme API hatası:", res.status);
        return this.fetchEventsFromDB();
      })
      .catch((err) => console.error("Etkinlik kaydedilemedi:", err));

    return newEvent;
  },

  updateEvent(id: string, updatedFields: Partial<EventItem>): EventItem | null {
    const index = eventsStore.findIndex((e) => e.id === String(id));
    if (index !== -1) {
      eventsStore[index] = { ...eventsStore[index], ...updatedFields };

      const payload = {
        id,
        ...updatedFields,
        ...(updatedFields.date ? { startDate: new Date(updatedFields.date).toISOString() } : {}),
        ...(updatedFields.registrationEnabled !== undefined 
          ? { registrationEnabled: Boolean(updatedFields.registrationEnabled) } 
          : {}),
      };

      fetch("/api/events", getFetchOptions("PATCH", payload))
        .then((res) => {
          if (!res.ok) console.error("Güncelleme API hatası:", res.status);
          return this.fetchEventsFromDB();
        })
        .catch((err) => console.error("Güncelleme başarısız:", err));

      return eventsStore[index];
    }
    return null;
  },

  deleteEvent(id: string): boolean {
    const index = eventsStore.findIndex((e) => e.id === String(id));
    if (index !== -1) {
      eventsStore.splice(index, 1);

      fetch(`/api/events/${id}`, getFetchOptions("DELETE"))
        .then(() => this.fetchEventsFromDB())
        .catch((err) => console.error("Silme hatası:", err));

      return true;
    }
    return false;
  },

  // ETKİNLİK BAŞVURULARI DB VE STORE YÖNETİMİ
  async fetchApplicationsFromDB(): Promise<EventApplication[]> {
    try {
      const res = await fetch("/api/event-applications", getFetchOptions("GET"));
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const dbApps: EventApplication[] = json.data.map((item: any) => ({
            id: String(item.id),
            eventId: String(item.eventId || item.event?.id || ""),
            eventTitle: item.event?.title || "Etkinlik",
            fullName: item.fullName || "",
            email: item.email || "",
            phone: item.phone || "",
            city: item.city || "",
            school: item.school || "",
            department: item.department || "",
            grade: item.grade || "",
            note: item.note || "",
            status: item.status || "Beklemede",
            appliedAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString("tr-TR") : "",
          }));

          eventApplicationsStore.length = 0;
          eventApplicationsStore.push(...dbApps);
          return eventApplicationsStore;
        }
      }
    } catch (err) {
      console.warn("DB'den etkinlik başvuruları alınamadı:", err);
    }
    return eventApplicationsStore;
  },

  applyToEvent(data: Omit<EventApplication, "id" | "appliedAt" | "status"> & { status?: EventApplication["status"] }): EventApplication {
    const newApplication: EventApplication = {
      ...data,
      id: `APP-EVT-${Date.now().toString().slice(-4)}`,
      status: data.status || "Beklemede",
      appliedAt: new Date().toLocaleDateString("tr-TR"),
    };
    eventApplicationsStore.unshift(newApplication);

    fetch("/api/event-applications", getFetchOptions("POST", data))
      .then(() => this.fetchApplicationsFromDB())
      .catch((err) => console.error("Başvuru eklenemedi:", err));

    return newApplication;
  },

  updateApplicationStatus(id: string, status: "Beklemede" | "Onaylandı" | "Reddedildi"): EventApplication | null {
    const index = eventApplicationsStore.findIndex((a) => a.id === String(id));
    if (index !== -1) {
      eventApplicationsStore[index].status = status;

      fetch(`/api/event-applications/${id}`, getFetchOptions("PATCH", { status }))
        .then(() => this.fetchApplicationsFromDB())
        .catch((err) => console.error("Başvuru güncelleme hatası:", err));

      return eventApplicationsStore[index];
    }
    return null;
  },

  deleteApplication(id: string): boolean {
    const index = eventApplicationsStore.findIndex((a) => a.id === String(id));
    if (index !== -1) {
      eventApplicationsStore.splice(index, 1);

      fetch(`/api/event-applications/${id}`, getFetchOptions("DELETE"))
        .then(() => this.fetchApplicationsFromDB())
        .catch((err) => console.error("Başvuru silme hatası:", err));

      return true;
    }
    return false;
  },

  getApplications(): EventApplication[] {
    return eventApplicationsStore;
  },
};