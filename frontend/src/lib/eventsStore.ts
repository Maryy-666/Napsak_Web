"use client";

export interface EventItem {
  id: string;
  title: string;
  category: "teknoloji" | "sanat" | "cevre-saglik" | "programlar";
  categoryLabel: string;
  date: string;
  time: string;
  location: string;
  status: "aktif" | "gecmis" | "taslak";
  partner?: string;
  quota?: number;
  appliedCount: number;
  description: string;
  coverImage?: string;
  badge?: string;
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
    categoryLabel: "Çevre ve Sağlık",
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

// DEFAULT INITIAL APPLICATIONS
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
    return newEvent;
  },

  updateEvent(id: string, updatedFields: Partial<EventItem>): EventItem | null {
    const index = eventsStore.findIndex((e) => e.id === id);
    if (index !== -1) {
      eventsStore[index] = { ...eventsStore[index], ...updatedFields };
      return eventsStore[index];
    }
    return null;
  },

  deleteEvent(id: string): boolean {
    const index = eventsStore.findIndex((e) => e.id === id);
    if (index !== -1) {
      eventsStore.splice(index, 1);
      return true;
    }
    return false;
  },

  applyToEvent(data: Omit<EventApplication, "id" | "appliedAt">): EventApplication {
    const newApplication: EventApplication = {
      ...data,
      id: `APP-EVT-${Date.now().toString().slice(-4)}`,
      appliedAt: new Date().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
    eventApplicationsStore.unshift(newApplication);

    const targetEvent = eventsStore.find((e) => e.id === data.eventId);
    if (targetEvent) {
      targetEvent.appliedCount += 1;
    }

    return newApplication;
  },

  getApplications(): EventApplication[] {
    return eventApplicationsStore;
  },
};
