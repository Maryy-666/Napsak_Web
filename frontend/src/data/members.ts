export interface GroupMembership {
  team: string;
  role: string;
}

export type MemberTeamRole = GroupMembership;

export interface PublicMember {
  id: string;
  name: string;
  initials: string;
  primaryTeam: string;
  primaryRole: string;
  memberships: GroupMembership[];
  isPresident?: boolean;
}

export const MEMBER_TEAMS = [
  "Sanat",
  "Kurumsal İletişim",
  "Programlar",
  "Sağlık ve Çevre",
] as const;

export type MemberTeamFilter = (typeof MEMBER_TEAMS)[number];

export function getInitials(name: string): string {
  if (!name) return "N";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0][0] + parts[1][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const PUBLIC_MEMBERS: PublicMember[] = [
  // ==================================================
  // TOPLULUK EŞ BAŞKANLARI (2)
  // ==================================================
  {
    id: "m-kadir-colmekci",
    name: "Kadir Çölmekci",
    initials: "KÇ",
    primaryTeam: "Topluluk Eş Başkanları",
    primaryRole: "Topluluk Eş Başkanı",
    isPresident: true,
    memberships: [
      { team: "Topluluk Başkanlığı", role: "Topluluk Eş Başkanı" },
    ],
  },
  {
    id: "m-humeyra-erdonmez",
    name: "Hümeyra Erdönmez",
    initials: "HE",
    primaryTeam: "Topluluk Eş Başkanları",
    primaryRole: "Topluluk Eş Başkanı",
    isPresident: true,
    memberships: [
      { team: "Topluluk Başkanlığı", role: "Topluluk Eş Başkanı" },
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
    initials: "EY",
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
    initials: "AD",
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
    initials: "EK",
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
    primaryTeam: "Sanat Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-meryem-rana-aslan",
    name: "Meryem Rana Aslan",
    initials: "MA",
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
    initials: "EK",
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
    initials: "AK",
    primaryTeam: "Kurumsal İletişim Departmanı",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-deniz-ayse-brijavi",
    name: "Deniz Ayşe Brıjavı",
    initials: "DB",
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
    initials: "GK",
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
    initials: "MY",
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
    initials: "EA",
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
    initials: "AK",
    primaryTeam: "Programlar Çalışma Grubu",
    primaryRole: "Uzman",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
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
    initials: "AE",
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
];
