export interface GroupMembership {
  team: string;
  teamSlug?: string;
  role: string;
  subRole?: string;
  isLeader?: boolean;
}

export type MemberTeamRole = GroupMembership;

export interface PublicMember {
  id: string;
  memberProfileId?: number | string;
  name: string;
  slug?: string;
  initials: string;
  primaryTeam: string;
  primaryRole: string;
  memberships: GroupMembership[];
  isPresident?: boolean;
  bio?: string;
  bioEn?: string;
  avatar?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  city?: string;
  school?: string;
  department?: string;
  education?: string;
  educationEn?: string;
  expertise?: string;
  expertiseEn?: string;
  responsibilities?: string;
  responsibilitiesEn?: string;
}

export const MEMBER_TEAMS = [
  "Teknoloji",
  "Sanat",
  "Sağlık ve Çevre",
  "Programlar",
  "Kurumsal İletişim",
  "Yönetim Kurulu",
  "Danışma Kurulu",
] as const;

export type MemberTeamFilter = (typeof MEMBER_TEAMS)[number];

export function slugifyMemberName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/Ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/İ/g, "i")
    .replace(/Ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sortMembersAlphabetically(members: PublicMember[]): PublicMember[] {
  return [...members].sort((a, b) =>
    a.name.localeCompare(b.name, "tr-TR", { sensitivity: "base" })
  );
}

export function getMemberBySlug(slug: string): PublicMember | undefined {
  if (!slug) return undefined;
  const target = slug.toLowerCase().trim();
  return PUBLIC_MEMBERS.find((m) => {
    const memberSlug = m.slug || slugifyMemberName(m.name);
    const memberIdSlug = m.id.replace(/^m-/, "");
    return (
      memberSlug === target ||
      m.id === target ||
      memberIdSlug === target ||
      slugifyMemberName(m.name) === target
    );
  });
}


export function getInitials(name: string): string {
  if (!name) return "N";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0][0] + parts[1][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const PUBLIC_MEMBERS: PublicMember[] = [
  // ==================================================
  // DERNEK EŞ BAŞKANLARI & YÖNETİM/DANIŞMA KURULU
  // ==================================================
  {
    id: "m-kadir-colmekci",
    slug: "kadir-colmekci",
    name: "Kadir Çölmekci",
    initials: "KÇ",
    primaryTeam: "Dernek Eş Başkanları",
    primaryRole: "Dernek Eş Başkanı",
    isPresident: true,
    bio: "Ne Yapsak? Gençlik Derneği kurucularından ve Dernek Eş Başkanı olarak gençlik projelerinde strateji, vizyon ve kurumsal yönetişim süreçlerini yürütmektedir.",
    bioEn: "Co-founder and Co-President of Ne Yapsak? Youth Association, leading youth project strategy, vision, and governance.",
    education: "İstanbul Teknik Üniversitesi - Bilgisayar Mühendisliği",
    expertise: "Yazılım Mimarisi, Dernek Yönetimi, Stratejik Planlama",
    responsibilities: "Dernek Genel Koordinasyonu, Kurumsal İlişkiler & Vizyon Yönetimi",
    linkedin: "https://www.linkedin.com/in/kadircolmekci",
    memberships: [
      { team: "Dernek Başkanlığı", role: "Dernek Eş Başkanı" },
      { team: "Yönetim Kurulu", role: "Yönetim Kurulu Üyesi" },
    ],
  },
  {
    id: "m-humeyra-erdonmez",
    slug: "humeyra-erdonmez",
    name: "Hümeyra Erdönmez",
    initials: "HE",
    primaryTeam: "Dernek Eş Başkanları",
    primaryRole: "Dernek Eş Başkanı",
    isPresident: true,
    bio: "Ne Yapsak? Gençlik Derneği Eş Başkanı olarak gençlik vizyonu, kültür yönetimi ve çalışma ekiplerinin koordinasyonunu üstlenmektedir.",
    bioEn: "Co-President of Ne Yapsak? Youth Association, managing association culture, youth vision, and working group coordination.",
    education: "Boğaziçi Üniversitesi - Sosyoloji",
    expertise: "Toplumsal Etki, Kültür & İletişim, Gençlik Çalışmaları",
    responsibilities: "Gençlik Kültürü Yönetimi, Çalışma Ekipleri Koordinasyonu",
    linkedin: "https://www.linkedin.com/in/humeyraerdonmez",
    memberships: [
      { team: "Dernek Başkanlığı", role: "Dernek Eş Başkanı" },
      { team: "Yönetim Kurulu", role: "Yönetim Kurulu Üyesi" },
    ],
  },
  {
    id: "m-yunus-efe-kolukisa",
    slug: "yunus-efe-kolukisa",
    name: "Yunus Efe Kolukısa",
    initials: "YEK",
    primaryTeam: "Yönetim Kurulu",
    primaryRole: "Yönetim Kurulu Üyesi",
    isPresident: false,
    bio: "Ne Yapsak? Yönetim Kurulu Üyesi olarak dernek bütçeleme, organizasyon ve stratejik iş birliklerinde aktif rol oynamaktadır.",
    bioEn: "Board Member at Ne Yapsak? Youth Association, active in budgeting, organization, and strategic partnerships.",
    education: "Galatasaray Üniversitesi - İktisat",
    expertise: "Finansal Yönetim, Proje Koordinasyonu, İnovasyon",
    responsibilities: "Yönetim Kurulu Strateji ve Organizasyon Süreçleri",
    linkedin: "https://www.linkedin.com/in/yunusefekolukisa",
    memberships: [
      { team: "Yönetim Kurulu", role: "Yönetim Kurulu Üyesi" },
    ],
  },
  {
    id: "m-nevgul-bilsel-safkan",
    slug: "nevgul-bilsel-safkan",
    name: "Nevgül Bilsel Safkan",
    initials: "NBS",
    primaryTeam: "Danışma Kurulu",
    primaryRole: "Sabancı Vakfı Genel Müdürü",
    isPresident: false,
    bio: "Sabancı Vakfı Genel Müdürü ve Ne Yapsak? Gençlik Derneği Danışma Kurulu Üyesi olarak derneğin sosyal sorumluluk ve gençlik etki projelerine danışmanlık yapmaktadır.",
    bioEn: "General Manager of Sabancı Foundation and Advisory Board Member of Ne Yapsak? Youth Association, mentoring youth social impact projects.",
    education: "İstanbul Üniversitesi - İşletme / Boğaziçi Üniversitesi MBA",
    expertise: "Sivil Toplum, Sosyal Katılım, Kurumsal Yönetim & Mentorluk",
    responsibilities: "Danışma Kurulu Mentorluğu & Stratejik Danışmanlık",
    linkedin: "https://www.linkedin.com/in/nevgulbilselsafkan",
    memberships: [
      { team: "Danışma Kurulu", role: "Sabancı Vakfı Genel Müdürü" },
    ],
  },


  // ==================================================
  // 1. SANAT ÇALIŞMA GRUBU
  // ==================================================
  {
    id: "m-zeynep-sude-bulbul",
    name: "Zeynep Sude Bülbül",
    initials: "ZB",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Başkan",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Başkan" },
    ],
  },
  {
    id: "m-eylul-deniz-yalcin",
    name: "Eylül Deniz Yalçın",
    initials: "EDY",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Başkan Yardımcısı",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Başkan Yardımcısı" },
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-ayse-aksoy-dikici",
    name: "Ayşe Aksoy Dikici",
    initials: "AAD",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-ebrar-akkaya",
    name: "Ebrar Akkaya",
    initials: "EA",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-beren-kar",
    name: "Beren Kar",
    initials: "BK",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-beyza-ekinci",
    name: "Beyza Ekinci",
    initials: "BE",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-ebrar-gonul-kurt",
    name: "Ebrar Gönül Kurt",
    initials: "EGK",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-merve-civan",
    name: "Merve Civan",
    initials: "MC",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-meryem-bozkurt",
    name: "Meryem Bozkurt",
    initials: "MB",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Başkan Yardımcısı",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
      { team: "Teknoloji Ekibi", role: "Başkan Yardımcısı" },
    ],
  },
  {
    id: "m-meryem-rana-aslan",
    name: "Meryem Rana Aslan",
    initials: "MRA",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-kevser-sagir",
    name: "Kevser Sağır",
    initials: "KS",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-ecenaz-yilmaz",
    name: "Ecenaz Yılmaz",
    initials: "EY",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-yagmur-cetin",
    name: "Yağmur Çetin",
    initials: "YÇ",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-pinar-cicek",
    name: "Pınar Çiçek",
    initials: "PÇ",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman-Raportör",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman-Raportör" },
      { team: "Kurumsal İletişim Departmanı", role: "SM Uzman" },
      { team: "Kurumsal İletişim Departmanı", role: "SDM Uzman" },
    ],
  },
  {
    id: "m-eylul-burcu-kara",
    name: "Eylül Burcu Kara",
    initials: "EBK",
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Tiyatro Koordinatörü",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Tiyatro Koordinatörü" },
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
    ],
  },

  // ==================================================
  // 2. KURUMSAL İLETİŞİM DEPARTMANI
  // ==================================================
  {
    id: "m-zehranur-vardar",
    name: "Zehranur Vardar",
    initials: "ZV",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Başkan",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Başkan" },
    ],
  },
  {
    id: "m-feyza-soyturk",
    name: "Feyza Soytürk",
    initials: "FS",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Başkan Yardımcısı",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Başkan Yardımcısı" },
    ],
  },
  {
    id: "m-aysegul-tugce-kartal",
    name: "Ayşegül Tuğçe Kartal",
    initials: "ATK",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-deniz-ayse-brijavi",
    name: "Deniz Ayşe Brıjavı",
    initials: "DAB",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
      { team: "Sağlık ve Çevre Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-erdeniz-erdaloglu",
    name: "Erdeniz Erdaloğlu",
    initials: "EE",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-feyza-dinc",
    name: "Feyza Dinç",
    initials: "FD",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-melike-saglik",
    name: "Melike Sağlık",
    initials: "MS",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-rumeysa-aki",
    name: "Rümeysa Akı",
    initials: "RA",
    primaryTeam: "Sağlık ve Çevre Çalışma Grubu",
    primaryRole: "Başkan Yardımcısı",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
      { team: "Sağlık ve Çevre Çalışma Grubu", role: "Başkan Yardımcısı" },
    ],
  },
  {
    id: "m-ekin-ozbay",
    name: "Ekin Özbay",
    initials: "EÖ",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-aybike-gurbuzce",
    name: "Aybike Gürbüzce",
    initials: "AG",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "SM Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "SM Uzman" },
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-gulsah-sena-kilic",
    name: "Gülşah Sena Kılıç",
    initials: "GSK",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "SM Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "SM Uzman" },
    ],
  },
  {
    id: "m-sila-gulagaoglu",
    name: "Sıla Gülağaoğlu",
    initials: "SG",
    primaryTeam: "Programlar Çalışma Grubu",
    primaryRole: "Başkan Yardımcısı",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Başkan Yardımcısı" },
      { team: "Kurumsal İletişim Departmanı", role: "SM Uzman" },
      { team: "Sağlık ve Çevre Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-melis-ada-yazar",
    name: "Melis Ada Yazar",
    initials: "MAY",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "SM Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "SM Uzman" },
    ],
  },
  {
    id: "m-batuhan-orak",
    name: "Batuhan Orak",
    initials: "BO",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Sohbet Düzeni ve Moderasyon Koordinatörü",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Sohbet Düzeni ve Moderasyon Koordinatörü" },
    ],
  },
  {
    id: "m-alime-cam",
    name: "Alime Çam",
    initials: "AÇ",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "SDM Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "SDM Uzman" },
    ],
  },
  {
    id: "m-elif-tuana-akpinar",
    name: "Elif Tuana Akpınar",
    initials: "ETA",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "SDM Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "SDM Uzman" },
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-bilal-cevik",
    name: "Bilal Çevik",
    initials: "BÇ",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "SDM Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "SDM Uzman" },
    ],
  },

  // ==================================================
  // 3. PROGRAMLAR ÇALIŞMA GRUBU (Kalan Üyeler)
  // ==================================================
  {
    id: "m-aysegul-kartal",
    name: "Ayşegül Kartal",
    initials: "AK",
    primaryTeam: "Programlar Çalışma Grubu",
    primaryRole: "Başkan",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Başkan" },
    ],
  },
  {
    id: "m-buglem-yavuz",
    name: "Buğlem Yavuz",
    initials: "BY",
    primaryTeam: "Programlar Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-emine-savci",
    name: "Emine Savcı",
    initials: "ES",
    primaryTeam: "Programlar Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-abdullah-nazim-karanfil",
    name: "Abdullah Nazım Karanfil",
    initials: "ANK",
    primaryTeam: "Programlar Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
      { team: "Teknoloji Ekibi", role: "Uzman" },
    ],
  },

  // ==================================================
  // 4. SAĞLIK VE ÇEVRE ÇALIŞMA GRUBU (Kalan Üyeler)
  // ==================================================
  {
    id: "m-sude-erol",
    name: "Sude Erol",
    initials: "SE",
    primaryTeam: "Sağlık ve Çevre Çalışma Grubu",
    primaryRole: "Başkan",
    memberships: [
      { team: "Sağlık ve Çevre Çalışma Grubu", role: "Başkan" },
    ],
  },
  {
    id: "m-ayse-ilayda-eracar",
    name: "Ayşe İlayda Eracar",
    initials: "AİE",
    primaryTeam: "Sağlık ve Çevre Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sağlık ve Çevre Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-sedanur-balta",
    name: "Sedanur Balta",
    initials: "SB",
    primaryTeam: "Sağlık ve Çevre Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sağlık ve Çevre Çalışma Grubu", role: "Uzman" },
    ],
  },

  // ==================================================
  // 5. TEKNOLOJİ EKİBİ (Yeni Ekip Üyeleri - Toplam 11 Kişi)
  // ==================================================
  {
    id: "m-ege-berk-oter",
    name: "Ege Berk Oter",
    initials: "EBO",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Başkan",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Başkan" },
    ],
  },
  {
    id: "m-azra-fatma-kalayci",
    name: "Azra Fatma Kalaycı",
    initials: "AFK",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Uzman" },
    ],
  },
  {
    id: "m-iskender-aras-ocak",
    name: "İskender Aras Ocak",
    initials: "İAO",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Uzman" },
    ],
  },
  {
    id: "m-helin-akalin",
    name: "Helin Akalın",
    initials: "HA",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Uzman" },
    ],
  },
  {
    id: "m-elif-yaldiz",
    name: "Elif Yaldız",
    initials: "EY",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Uzman", subRole: "Web Sitesi Ekibi" },
      { team: "Web Sitesi", role: "Web Sitesi Ekibi" },
    ],
  },
  {
    id: "m-dilara-ozocak",
    name: "Dilara Özocak",
    initials: "DÖ",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Uzman" },
    ],
  },
  {
    id: "m-yusuf-barut",
    name: "Yusuf Barut",
    initials: "YB",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Uzman", subRole: "Web Sitesi Sorumlusu" },
      { team: "Web Sitesi", role: "Web Sitesi Sorumlusu" },
    ],
  },
  {
    id: "m-feyzanur-olcay",
    name: "Feyzanur Olçay",
    initials: "FO",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Uzman", subRole: "Web Sitesi Ekibi" },
      { team: "Web Sitesi", role: "Web Sitesi Ekibi" },
    ],
  },
  {
    id: "m-ayoub-rebhi",
    name: "Ayoub Rebhi",
    initials: "AR",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    memberships: [
      { team: "Teknoloji Ekibi", role: "Uzman" },
    ],
  },
];
