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
  capacity?: number;
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

// DEFAULT INITIAL EVENTS (AKTİF VE GEÇMİŞ ETKİNLİKLER)
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
    description:
      "N'apsak? Gençlik Topluluğu'nun ilk büyük yüz yüze buluşması! 1923 Gençlik Topluluğu iş birliği ile gençlerin projelerini sergileyebileceği, sunum ve networking zirvesi.",
    coverImage: "/images/news-ani-cover.jpg",
    badge: "Öne Çıkan Aktif Zirve",
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
    description:
      "Yapay zeka araçlarının günlük projelerde etkin kullanımı, açık kaynak kodlama ve yeşil teknoloji yaklaşımlarının ele alınacağı interaktif online atölye serisi.",
    badge: "Kontenjan Sınırlı",
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
    title: "Topluluk İçi Ideathon & Fikir Kampı",
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

// DEFAULT INITIAL APPLICATIONS (Gerçek DB Verileri ile Çalışır)
const INITIAL_APPLICATIONS: EventApplication[] = [];

// SINGLETON STORE MANAGEMENT
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
      const url = statusFilter ? `/api/events?status=${statusFilter}` : "/api/events";
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const dbEvents: EventItem[] = json.data.map((item: any) => ({
            id: String(item.id),
            slug: item.slug || String(item.id),
            title: item.title,
            category: item.category || "programlar",
            categoryLabel: item.category === "teknoloji" ? "Teknoloji & İnovasyon" : "Programlar & Sosyal",
            date: item.startDate ? new Date(item.startDate).toLocaleDateString("tr-TR") : "",
            time: "14:00",
            location: item.location || "Belirtilmedi",
            status: item.status || "Yaklaşan",
            publicationStatus: item.publicationStatus || "PUBLISHED",
            shortDescription: item.shortDescription || item.description || "",
            description: item.description || "",
            content: item.content || item.description || "",
            appliedCount: item.appliedCount || 0,
            capacity: item.capacity || 100,
            coverImage: item.image || item.coverImage || undefined,
            image: item.image || item.coverImage || undefined,
            isFeatured: Boolean(item.isFeatured),
            registrationEnabled: item.registrationEnabled !== undefined ? Boolean(item.registrationEnabled) : true,
            registrationDeadline: item.registrationDeadline || undefined,
            startDate: item.startDate || undefined,
            endDate: item.endDate || undefined,
          }));

          eventsStore.length = 0;
          eventsStore.push(...dbEvents);
          return eventsStore;
        }
      }
    } catch (err) {
      console.warn("DB'den etkinlikler alınamadı, yerel depolama kullanılıyor:", err);
    }
    return eventsStore;
  },

  getActiveEvents(): EventItem[] {
    return eventsStore.filter((e) => e.status === "aktif");
  },

  getPastEvents(): EventItem[] {
    return eventsStore.filter((e) => e.status === "gecmis");
  },

  addEvent(event: Omit<EventItem, "id" | "appliedCount">): EventItem {
    const newEvent: EventItem = {
      ...event,
      id: `evt-${Date.now().toString().slice(-4)}`,
      appliedCount: 0,
    };
    eventsStore.unshift(newEvent);

    // Background DB sync
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: event.title,
        description: event.description,
        location: event.location,
        category: event.category,
        status: event.status,
        image: event.coverImage,
        startDate: new Date().toISOString(),
      }),
    }).then(() => this.fetchEventsFromDB()).catch(() => {});

    return newEvent;
  },

  updateEvent(id: string, updatedFields: Partial<EventItem>): EventItem | null {
    const index = eventsStore.findIndex((e) => e.id === id);
    if (index !== -1) {
      eventsStore[index] = { ...eventsStore[index], ...updatedFields };

      const numericId = Number(id);
      if (Number.isInteger(numericId)) {
        fetch(`/api/events/${numericId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        }).then(() => this.fetchEventsFromDB()).catch(() => {});
      }

      return eventsStore[index];
    }
    return null;
  },

  deleteEvent(id: string): boolean {
    const index = eventsStore.findIndex((e) => e.id === id);
    if (index !== -1) {
      eventsStore.splice(index, 1);

      const numericId = Number(id);
      if (Number.isInteger(numericId)) {
        fetch(`/api/events/${numericId}`, {
          method: "DELETE",
        }).then(() => this.fetchEventsFromDB()).catch(() => {});
      }

      return true;
    }
    return false;
  },

  // ETKİNLİK BAŞVURULARI DB VE STORE YÖNETİMİ
  async fetchApplicationsFromDB(): Promise<EventApplication[]> {
    try {
      const res = await fetch("/api/event-applications", { cache: "no-store" });
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
      console.warn("DB'den etkinlik başvuruları alınamadı, yerel bellek kullanılıyor:", err);
    }
    return eventApplicationsStore;
  },

  applyToEvent(data: Omit<EventApplication, "id" | "appliedAt" | "status"> & { status?: EventApplication["status"] }): EventApplication {
    const newApplication: EventApplication = {
      ...data,
      id: `APP-EVT-${Date.now().toString().slice(-4)}`,
      status: data.status || "Beklemede",
      appliedAt: new Date().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
    eventApplicationsStore.unshift(newApplication);

    // Event applied count artırma
    const targetEvent = eventsStore.find((e) => e.id === data.eventId);
    if (targetEvent) {
      targetEvent.appliedCount += 1;
    }

    // Arka planda DB kaydı
    fetch("/api/event-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: data.eventId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        school: data.school,
        department: data.department,
        grade: data.grade,
        note: data.note,
        status: newApplication.status,
      }),
    }).then(() => this.fetchApplicationsFromDB()).catch(() => {});

    return newApplication;
  },

  updateApplicationStatus(id: string, status: "Beklemede" | "Onaylandı" | "Reddedildi"): EventApplication | null {
    const index = eventApplicationsStore.findIndex((a) => a.id === id);
    if (index !== -1) {
      eventApplicationsStore[index].status = status;

      const numericId = Number(id);
      if (Number.isInteger(numericId)) {
        fetch(`/api/event-applications/${numericId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }).then(() => this.fetchApplicationsFromDB()).catch(() => {});
      }

      return eventApplicationsStore[index];
    }
    return null;
  },

  deleteApplication(id: string): boolean {
    const index = eventApplicationsStore.findIndex((a) => a.id === id);
    if (index !== -1) {
      eventApplicationsStore.splice(index, 1);

      const numericId = Number(id);
      if (Number.isInteger(numericId)) {
        fetch(`/api/event-applications/${numericId}`, {
          method: "DELETE",
        }).then(() => this.fetchApplicationsFromDB()).catch(() => {});
      }

      return true;
    }
    return false;
  },

  getApplications(): EventApplication[] {
    return eventApplicationsStore;
  },
};
