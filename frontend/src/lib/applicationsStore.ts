"use client";

export interface ApplicationItem {
  id: string;
  userId?: number;
  fullName: string;
  email: string;
  phone?: string;
  program: string;
  city?: string;
  school?: string;
  department?: string;
  grade?: string;
  status: "Beklemede" | "Onaylandı" | "Reddedildi";
  createdAt: string;
  note?: string;
}

const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-101",
    fullName: "Zeynep Yılmaz",
    email: "zeynep.yilmaz@gmail.com",
    phone: "0532 111 22 33",
    program: "Yazılım & Tasarım Ekibi",
    city: "İstanbul",
    school: "İstanbul Teknik Üniversitesi",
    department: "Bilgisayar Mühendisliği",
    grade: "3. Sınıf",
    status: "Beklemede",
    createdAt: "2026-08-20T14:30:00Z",
    note: "Topluluk projelerinde frontend geliştirmeye katkı sağlamak istiyorum.",
  },
  {
    id: "app-102",
    fullName: "Mehmet Demir",
    email: "mehmet.demir@hotmail.com",
    phone: "0555 444 55 66",
    program: "Sosyal Medya & İçerik Ekibi",
    city: "Ankara",
    school: "ODTÜ",
    department: "İletişim ve Tasarım",
    grade: "2. Sınıf",
    status: "Onaylandı",
    createdAt: "2026-08-19T11:15:00Z",
    note: "Grafik tasarım ve video kurgu alanlarında deneyimim var.",
  },
  {
    id: "app-103",
    fullName: "Elif Kaya",
    email: "elif.kaya@outlook.com",
    phone: "0544 777 88 99",
    program: "Etkinlik & Operasyon Ekibi",
    city: "İzmir",
    school: "Ege Üniversitesi",
    department: "Psikoloji",
    grade: "4. Sınıf",
    status: "Beklemede",
    createdAt: "2026-08-18T09:45:00Z",
    note: "Gençlik çalıştaylarında organizasyon tecrübesine sahibim.",
  },
  {
    id: "app-104",
    fullName: "Caner Arslan",
    email: "caner.arslan@gmail.com",
    phone: "0505 123 45 67",
    program: "Kariyer & İş Birliği Ekibi",
    city: "Bursa",
    school: "Uludağ Üniversitesi",
    department: "İşletme",
    grade: "Mezun",
    status: "Reddedildi",
    createdAt: "2026-08-15T16:20:00Z",
    note: "Sektör temsilcileri ile iletişim ve sponsorluk süreçlerini yönetebilirim.",
  },
];

let cachedApplications: ApplicationItem[] = [...INITIAL_APPLICATIONS];

export const ApplicationsRepository = {
  getApplications(): ApplicationItem[] {
    return cachedApplications;
  },

  async fetchApplicationsFromDB(): Promise<ApplicationItem[]> {
    try {
      const res = await fetch("/api/applications", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: ApplicationItem[] = json.data.map((item: any) => ({
            id: String(item.id),
            userId: item.userId,
            fullName: item.user?.name || item.fullName || "İsimsiz Başvuru",
            email: item.user?.email || item.email || "-",
            phone: item.phone || "-",
            program: item.program || "Genel Topluluk Üyeliği",
            status: item.status === "APPROVED" ? "Onaylandı" : item.status === "REJECTED" ? "Reddedildi" : "Beklemede",
            createdAt: item.createdAt || new Date().toISOString(),
            note: item.note || "",
          }));
          cachedApplications = mapped;
          return cachedApplications;
        }
      }
    } catch (err) {
      console.warn("DB'den başvurular alınamadı, yerel veriler kullanılıyor:", err);
    }
    return cachedApplications;
  },

  updateStatus(id: string, newStatus: "Beklemede" | "Onaylandı" | "Reddedildi"): void {
    cachedApplications = cachedApplications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    // Send background sync request to DB
    const dbStatus = newStatus === "Onaylandı" ? "APPROVED" : newStatus === "Reddedildi" ? "REJECTED" : "PENDING";
    fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: dbStatus }),
    }).catch((err) => console.error("DB update error:", err));
  },

  async addApplication(data: Partial<ApplicationItem>): Promise<ApplicationItem> {
    const newApp: ApplicationItem = {
      id: "app-" + Date.now(),
      fullName: data.fullName || "İsimsiz Başvuru",
      email: data.email || "-",
      phone: data.phone || "-",
      program: data.program || "Genel Topluluk Üyeliği",
      city: data.city || "",
      school: data.school || "",
      department: data.department || "",
      grade: data.grade || "",
      note: data.note || "",
      status: "Beklemede",
      createdAt: new Date().toISOString(),
    };

    cachedApplications = [newApp, ...cachedApplications];

    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApp),
      });
    } catch (err) {
      console.warn("API /applications POST hatası:", err);
    }

    return newApp;
  },

  deleteApplication(id: string): void {
    cachedApplications = cachedApplications.filter((app) => app.id !== id);
    fetch(`/api/applications/${id}`, { method: "DELETE" }).catch((err) =>
      console.error("DB delete error:", err)
    );
  },
};
