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

// DEFAULT INITIAL EVENTS
const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt-101",
    title: "1923 Gençlik Topluluğu İş Birliği & Tanışma Zirvesi",
    category: "programlar",
    categoryLabel: "Programlar & Sosyal",
    date: "26 Eylül 2025",
    time: "14:00 - 18:00",
    location: "Beylikdüzü Smart-B Kültür Merkezi",
    status: "aktif",
    partner: "1923 Gençlik Topluluğu & Beylikdüzü Belediyesi",
    quota: 120,
    appliedCount: 42,
    description: "N'apsak? Gençlik Topluluğu'nun ilk büyük yüz yüze buluşması!",
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
            // DÜZELTME: "Yaklaşan" veya benzeri durumları frontend'in tanıdığı "aktif" değerine dönüştürür
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
            // DÜZELTME: Açıkça false yapılmamışsa başvuru butonunu aktif tutar
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