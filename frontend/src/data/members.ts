export interface MemberTeamRole {
  team: string;
  role: string;
}

export interface PublicMember {
  id: string;
  name: string;
  initials: string;
  primaryTeam: string;
  primaryRole: string;
  memberships: MemberTeamRole[];
  isPresident?: boolean;
}

export const MEMBER_TEAMS = [
  "Topluluk Başkanları",
  "Sanat",
  "Kurumsal İletişim",
  "Programlar",
] as const;

export type MemberTeamFilter = (typeof MEMBER_TEAMS)[number];

export function getInitials(name: string): string {
  if (!name) return "N";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const PUBLIC_MEMBERS: PublicMember[] = [
  // TOPLULUK BAŞKANLARI (LİDERLİK)
  {
    id: "m-kadir-colmekci",
    name: "Kadir Çölmekci",
    initials: "KÇ",
    primaryTeam: "Topluluk Başkanları",
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
    primaryTeam: "Topluluk Başkanları",
    primaryRole: "Topluluk Eş Başkanı",
    isPresident: true,
    memberships: [
      { team: "Topluluk Başkanlığı", role: "Topluluk Eş Başkanı" },
    ],
  },

  // SANAT EKİBİ
  {
    id: "m-zeynep-sude-bulbul",
    name: "Zeynep Sude Bülbül",
    initials: "ZB",
    primaryTeam: "Sanat",
    primaryRole: "Başkan",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Başkan" },
    ],
  },
  {
    id: "m-eylul-deniz-yalcin",
    name: "Eylül Deniz Yalçın",
    initials: "EY",
    primaryTeam: "Sanat",
    primaryRole: "Başkan Yardımcısı",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Başkan Yardımcısı" },
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-pinar-cicek",
    name: "Pınar Çiçek",
    initials: "PÇ",
    primaryTeam: "Sanat",
    primaryRole: "Uzman-Raportör",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman-Raportör" },
      { team: "Kurumsal İletişim", role: "SM Uzman" },
      { team: "Kurumsal İletişim", role: "SDM Uzman" },
    ],
  },
  {
    id: "m-eylul-burcu-kara",
    name: "Eylül Burcu Kara",
    initials: "EK",
    primaryTeam: "Sanat",
    primaryRole: "Tiyatro Koordinatörü",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Tiyatro Koordinatörü" },
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-ayse-aksoy-dikici",
    name: "Ayşe Aksoy Dikici",
    initials: "AD",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-ebrar-akkaya",
    name: "Ebrar Akkaya",
    initials: "EA",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-beren-kar",
    name: "Beren Kar",
    initials: "BK",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-beyza-ekinci",
    name: "Beyza Ekinci",
    initials: "BE",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-ebrar-gonul-kurt",
    name: "Ebrar Gönül Kurt",
    initials: "EK",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-merve-civan",
    name: "Merve Civan",
    initials: "MC",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-meryem-bozkurt",
    name: "Meryem Bozkurt",
    initials: "MB",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-meryem-rana-aslan",
    name: "Meryem Rana Aslan",
    initials: "MA",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-kevser-sagir",
    name: "Kevser Sağır",
    initials: "KS",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-ecenaz-yilmaz",
    name: "Ecenaz Yılmaz",
    initials: "EY",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-yagmur-cetin",
    name: "Yağmur Çetin",
    initials: "YÇ",
    primaryTeam: "Sanat",
    primaryRole: "Uzman",
    memberships: [
      { team: "Sanat Çalışma Grubu", role: "Uzman" },
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },

  // KURUMSAL İLETİŞİM EKİBİ
  {
    id: "m-zehranur-vardar",
    name: "Zehranur Vardar",
    initials: "ZV",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Başkan",
    memberships: [
      { team: "Kurumsal İletişim", role: "Başkan" },
    ],
  },
  {
    id: "m-feyza-soyturk",
    name: "Feyza Soytürk",
    initials: "FS",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Başkan Yardımcısı",
    memberships: [
      { team: "Kurumsal İletişim", role: "Başkan Yardımcısı" },
    ],
  },
  {
    id: "m-aysegul-tugce-kartal",
    name: "Ayşegül Tuğçe Kartal",
    initials: "AK",
    primaryTeam: "Programlar",
    primaryRole: "Başkan",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Başkan" },
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-deniz-ayse-brijavi",
    name: "Deniz Ayşe Brijavi",
    initials: "DB",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-erdeniz-erdaloglu",
    name: "Erdeniz Erdaloğlu",
    initials: "EE",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-feyza-dinc",
    name: "Feyza Dinç",
    initials: "FD",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-melike-saglik",
    name: "Melike Sağlık",
    initials: "MS",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-rumeysa-aki",
    name: "Rümeysa Akı",
    initials: "RA",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-ekin-ozbay",
    name: "Ekin Özbay",
    initials: "EÖ",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Kİ Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "Kİ Uzman" },
    ],
  },
  {
    id: "m-aybike-gurbuzce",
    name: "Aybike Gürbüzce",
    initials: "AG",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "SM Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "SM Uzman" },
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-gulsah-sena-kilic",
    name: "Gülşah Sena Kılıç",
    initials: "GK",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "SM Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "SM Uzman" },
    ],
  },
  {
    id: "m-sila-gulagaoglu",
    name: "Sıla Gülağaoğlu",
    initials: "SG",
    primaryTeam: "Programlar",
    primaryRole: "Başkan Yardımcısı",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Başkan Yardımcısı" },
      { team: "Kurumsal İletişim", role: "SM Uzman" },
    ],
  },
  {
    id: "m-melis-ada-yazar",
    name: "Melis Ada Yazar",
    initials: "MY",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "SM Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "SM Uzman" },
    ],
  },
  {
    id: "m-batuhan-orak",
    name: "Batuhan Orak",
    initials: "BO",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "Sohbet Düzeni & Moderasyon Koordinatörü",
    memberships: [
      { team: "Kurumsal İletişim", role: "Sohbet Düzeni ve Moderasyon Koordinatörü" },
    ],
  },
  {
    id: "m-alime-cam",
    name: "Alime Çam",
    initials: "AÇ",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "SDM Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "SDM Uzman" },
    ],
  },
  {
    id: "m-elif-tuana-akpinar",
    name: "Elif Tuana Akpınar",
    initials: "EA",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "SDM Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "SDM Uzman" },
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-bilal-cevik",
    name: "Bilal Çevik",
    initials: "BÇ",
    primaryTeam: "Kurumsal İletişim",
    primaryRole: "SDM Uzman",
    memberships: [
      { team: "Kurumsal İletişim", role: "SDM Uzman" },
    ],
  },

  // PROGRAMLAR EKİBİ Kalanlar
  {
    id: "m-buglem-yavuz",
    name: "Buğlem Yavuz",
    initials: "BY",
    primaryTeam: "Programlar",
    primaryRole: "Uzman",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-emine-savci",
    name: "Emine Savcı",
    initials: "ES",
    primaryTeam: "Programlar",
    primaryRole: "Uzman",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
  {
    id: "m-abdullah-nazim-karanfil",
    name: "Abdullah Nazım Karanfil",
    initials: "AK",
    primaryTeam: "Programlar",
    primaryRole: "Uzman",
    memberships: [
      { team: "Programlar Çalışma Grubu", role: "Uzman" },
    ],
  },
];
