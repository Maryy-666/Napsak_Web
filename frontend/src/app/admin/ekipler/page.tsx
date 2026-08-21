"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import {
  Users,
  Plus,
  Edit3,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Cpu,
  Palette,
  HeartPulse,
  BookOpen,
  Share2,
  UserPlus,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowUpDown,
  Mail,
  Award,
  Upload,
  X,
} from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";
import {
  AdminPageHeader,
  AdminTable,
  Column,
  AdminSearch,
  AdminFilter,
  AdminPagination,
  AdminModal,
  AdminConfirmDialog,
  AdminBadge,
  AdminEmptyState,
} from "../../../components/admin/ui";

// ==========================================
// 1. VERİ MODELİ VE MOCK YÖNETİM VERİLERİ
// ==========================================

export interface AdminTeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joinedDate: string;
}

export interface AdminTeamItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  about: string;
  iconName: "cpu" | "palette" | "heart-pulse" | "book-open" | "share-2";
  bgImage: string;
  leaderName: string;
  leaderTitle: string;
  leaderAvatar: string;
  memberCount: number;
  focusAreas: string[];
  whatWeDo: string[];
  status: "Aktif" | "Pasif";
  displayOrder: number;
  membersList?: AdminTeamMember[];
}

const ICON_MAP = {
  cpu: Cpu,
  palette: Palette,
  "heart-pulse": HeartPulse,
  "book-open": BookOpen,
  "share-2": Share2,
};

const INITIAL_MOCK_TEAMS: AdminTeamItem[] = [
  {
    id: "teknoloji",
    slug: "teknoloji",
    title: "Teknoloji Ekibi",
    iconName: "cpu",
    bgImage: "/images/istockphoto-1173149385-612x612.jpg",
    shortDescription:
      "Dijitalleşme, inovasyon, yazılım, yapay zeka ve sürdürülebilir teknoloji alanlarında eğitim içerikleri, projeler ve etkinlikler geliştirir.",
    about:
      "Teknoloji Ekibimiz, dijital dönüşümün ve modern teknolojik gelişmelerin topluluk çalışmalarına ve gençlik projelerine entegrasyonunu sağlar. Web geliştirmeden yapay zeka çözümlerine kadar geniş bir yelpazede projeler üretir.",
    leaderName: "Ahmet Yılmaz",
    leaderTitle: "Teknoloji Ekip Lideri",
    leaderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    memberCount: 24,
    focusAreas: [
      "Yazılım & Web Geliştirme",
      "Yapay Zeka & Veri Bilimi",
      "Dijital Ürün Tasarımı & UX/UI",
      "Açık Kaynak Projeler",
    ],
    whatWeDo: [
      "Topluluk web sitesini ve yazılım altyapılarını geliştiriyoruz.",
      "Gençlere yönelik kodlama ve yapay zeka atölyeleri düzenliyoruz.",
      "Açık kaynak ekosistemine katkı sağlayan yenilikçi projeler üretiyoruz.",
    ],
    status: "Aktif",
    displayOrder: 1,
    membersList: [
      { id: "m1", name: "Zeynep Kaya", role: "Yazılım Geliştirici", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", joinedDate: "12 Ocak 2025" },
      { id: "m2", name: "Caner Demir", role: "UI/UX Tasarımcı", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", joinedDate: "05 Şubat 2025" },
      { id: "m3", name: "Elif Şahin", role: "Veri Analisti", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80", joinedDate: "18 Mart 2025" },
    ],
  },
  {
    id: "sanat",
    slug: "sanat",
    title: "Sanat Ekibi",
    iconName: "palette",
    bgImage: "/images/stock-photo-close-up-of-painting-brushes-in-studio-of-artist.jpg",
    shortDescription:
      "Gençlerin sanatsal ve yaratıcı ifade becerilerini geliştirmelerini destekleyen atölyeler ve estetik projeler yürütür.",
    about:
      "Sanat Ekibimiz, görsel sanatlardan dijital tasarıma, estetik ifade biçimlerinden kültür-sanat projelerine kadar gençlerin yaratıcı potansiyellerini keşfetmelerine olanak tanır.",
    leaderName: "Elif Öztürk",
    leaderTitle: "Sanat Ekip Lideri",
    leaderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    memberCount: 18,
    focusAreas: [
      "Görsel Sanatlar & İllüstrasyon",
      "Dijital Sanat & Grafik Tasarım",
      "Fotoğrafçılık & Videografi",
    ],
    whatWeDo: [
      "Topluluk projeleri için özgün görsel tasarımlar hazırlıyoruz.",
      "Tematik sanat atölyeleri ve çizim buluşmaları düzenliyoruz.",
    ],
    status: "Aktif",
    displayOrder: 2,
    membersList: [
      { id: "m4", name: "Mert Acar", role: "Grafik Tasarımcı", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", joinedDate: "20 Ocak 2025" },
      { id: "m5", name: "Selin Yıldız", role: "İllüstratör", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", joinedDate: "10 Şubat 2025" },
    ],
  },
  {
    id: "cevre-saglik",
    slug: "cevre-saglik",
    title: "Çevre ve Sağlık Ekibi",
    iconName: "heart-pulse",
    bgImage: "/images/pngtree-vibrant-earth-planet-surrounded-by-fresh-green-leaves-eco-friendly-concept-image_21673995.webp",
    shortDescription:
      "Sürdürülebilirlik, çevre bilinci, sağlıklı yaşam ve toplumsal fayda odaklı sosyal sorumluluk projeleri gerçekleştirir.",
    about:
      "Çevre ve Sağlık Ekibimiz; ekolojik farkındalık, iklim krizi, sıfır atık bilinci, ruh ve beden sağlığı ile toplumsal esenlik alanlarında sürdürülebilir çalışmalar yürütür.",
    leaderName: "Burak Kaan",
    leaderTitle: "Çevre & Sağlık Lideri",
    leaderAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    memberCount: 20,
    focusAreas: [
      "Ekolojik Farkındalık & İklim Eylemi",
      "Sıfır Atık & Sürdürülebilirlik",
      "Ruh Sağlığı & Bütünsel Esenlik",
    ],
    whatWeDo: [
      "Doğa dostu yaşam ve sürdürülebilirlik odaklı farkındalık projeleri yürütüyoruz.",
      "Doğa yürüyüşleri ve çevre temizlik etkinlikleri düzenliyoruz.",
    ],
    status: "Aktif",
    displayOrder: 3,
    membersList: [
      { id: "m6", name: "Deniz Arslan", role: "Ekoloji Masası Sorumlusu", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80", joinedDate: "02 Şubat 2025" },
    ],
  },
  {
    id: "programlar",
    slug: "programlar",
    title: "Programlar Ekibi",
    iconName: "book-open",
    bgImage: "/images/krm.png",
    shortDescription:
      "Gençlerin kişisel, akademik ve mesleki gelişim yolculuklarına katkı sağlayan kapsayıcı eğitim ve gelişim programları kurgular.",
    about:
      "Programlar Ekibimiz, gençlerin geleceğe yetkin hazırlanması için mentörlük süreçleri, bootcamp'ler, akademi serileri ve kişisel gelişim içerikleri tasarlar.",
    leaderName: "Seda Aksoy",
    leaderTitle: "Programlar Ekip Lideri",
    leaderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    memberCount: 15,
    focusAreas: [
      "Eğitim Müfredatı & Tasarımı",
      "Mentörlük & Koçluk Programları",
      "Akademi & Atölye Serileri",
    ],
    whatWeDo: [
      "Dönemsel beceri geliştirme akademileri ve sertifika programları tasarlıyoruz.",
      "Alanında uzman isimlerle webinarlar ve söyleşiler kurguluyoruz.",
    ],
    status: "Aktif",
    displayOrder: 4,
    membersList: [],
  },
  {
    id: "kurumsal-iletisim",
    slug: "kurumsal-iletisim",
    title: "Kurumsal İletişim Ekibi",
    iconName: "share-2",
    bgImage: "/images/world-map-global-business-communication-network-technology-connection-background_15037139(1).jpg!bw800",
    shortDescription:
      "Topluluğun kurumsal kimliğini, medya stratejilerini, dijital mecralarını ve paydaş iş birliklerini yönetir.",
    about:
      "Kurumsal İletişim Ekibimiz, N'apsak? Gençlik Topluluğu'nun vizyonunu kamuoyuna ve gençliğe aktarır. Dijital medya yönetimi ve paydaş ilişkilerini yürütür.",
    leaderName: "Emre Eren",
    leaderTitle: "İletişim Ekip Lideri",
    leaderAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    memberCount: 12,
    focusAreas: [
      "Sosyal Medya Yönetimi & Stratejisi",
      "Marka Yönetimi & Kurumsal Kimlik",
      "Paydaş İlişkileri & İş Birlikleri",
    ],
    whatWeDo: [
      "Sosyal medya hesaplarını ve dijital iletişim kanallarını yönetiyoruz.",
      "Kurumsal bültenler ve basın açıklamaları hazırlıyoruz.",
    ],
    status: "Pasif",
    displayOrder: 5,
    membersList: [],
  },
];

// ==========================================
// 2. FORM DOĞRULAMA (ZOD SCHEMA)
// ==========================================

const teamFormSchema = z.object({
  title: z
    .string()
    .min(2, "Ekip adı en az 2 karakter olmalıdır.")
    .max(60, "Ekip adı en fazla 60 karakter olabilir."),
  slug: z
    .string()
    .min(2, "Slug en az 2 karakter olmalıdır.")
    .max(40, "Slug en fazla 40 karakter olabilir.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Geçersiz slug biçimi (küçük harf, rakam ve tire kullanın. Örn: teknoloji-ekibi)"),
  shortDescription: z
    .string()
    .min(10, "Kısa açıklama en az 10 karakter olmalıdır.")
    .max(200, "Kısa açıklama en fazla 200 karakter olabilir."),
  about: z
    .string()
    .min(15, "Detaylı açıklama en az 15 karakter olmalıdır.")
    .max(1000, "Detaylı açıklama en fazla 1000 karakter olabilir."),
  bgImage: z.string().min(1, "Ekip görsel URL'si zorunludur."),
  leaderName: z
    .string()
    .min(2, "Ekip lideri adı en az 2 karakter olmalıdır.")
    .max(60, "Ekip lideri adı en fazla 60 karakter olabilir."),
  leaderTitle: z
    .string()
    .min(2, "Lider unvanı zorunludur.")
    .max(60, "Lider unvanı en fazla 60 karakter olabilir."),
  displayOrder: z.number().min(1, "Görüntülenme sırası 1 veya daha büyük olmalıdır."),
  status: z.enum(["Aktif", "Pasif"]),
  iconName: z.enum(["cpu", "palette", "heart-pulse", "book-open", "share-2"]),
  focusAreasText: z.string().min(3, "En az 1 odak alanı giriniz (virgülle ayırın)."),
  whatWeDoText: z.string().min(5, "En az 1 çalışma faaliyeti giriniz (her satıra 1 madde)."),
});

type TeamFormData = z.infer<typeof teamFormSchema>;

// ==========================================
// 3. ANA ADMIN ÇALIŞMA EKİPLERİ SAYFASI
// ==========================================

import { TeamsRepository } from "../../../lib/teamsStore";

export default function AdminEkiplerPage() {
  const { isDark } = useAdminTheme();

  // State Yönetimi (Database & Store)
  const [teams, setTeams] = useState<AdminTeamItem[]>(INITIAL_MOCK_TEAMS);

  useEffect(() => {
    TeamsRepository.fetchTeamsFromDB().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const formatted: AdminTeamItem[] = data.map((t: any, idx: number) => ({
          id: t.id || t.slug,
          slug: t.slug || t.id,
          title: t.title,
          shortDescription: t.shortDescription || "",
          about: t.about || "",
          iconName: (t.iconName as any) || "cpu",
          bgImage: t.bgImage || "/images/istockphoto-1173149385-612x612.jpg",
          leaderName: t.leaderName || "Ekip Lideri",
          leaderTitle: t.leaderTitle || "Lider",
          leaderAvatar: t.leaderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          memberCount: t.memberCount || 0,
          focusAreas: t.focusAreas || [],
          whatWeDo: t.whatWeDo || [],
          status: t.status || "Aktif",
          displayOrder: t.displayOrder || idx + 1,
          membersList: t.membersList || [],
        }));
        setTeams(formatted);
      }
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [sortKey, setSortKey] = useState<"displayOrder" | "title" | "memberCount">("displayOrder");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal ve Dialog State'leri
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<AdminTeamItem | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailTeam, setSelectedDetailTeam] = useState<AdminTeamItem | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<AdminTeamItem | null>(null);

  // Üye Atama UI Önizleme State
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  // Form State & Validation Errors
  const [formData, setFormData] = useState<TeamFormData>({
    title: "",
    slug: "",
    shortDescription: "",
    about: "",
    bgImage: "/images/istockphoto-1173149385-612x612.jpg",
    leaderName: "",
    leaderTitle: "Ekip Lideri",
    displayOrder: 1,
    status: "Aktif",
    iconName: "cpu",
    focusAreasText: "",
    whatWeDoText: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ==========================================
  // 4. FİLTRELEME & SIRALAMA & SAYFALAMA
  // ==========================================

  const filteredTeams = useMemo(() => {
    return teams
      .filter((team) => {
        // Status filter
        if (statusFilter === "Aktif" && team.status !== "Aktif") return false;
        if (statusFilter === "Pasif" && team.status !== "Pasif") return false;

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          team.title.toLowerCase().includes(q) ||
          team.slug.toLowerCase().includes(q) ||
          team.leaderName.toLowerCase().includes(q) ||
          team.shortDescription.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (typeof valA === "string") {
          const res = (valA as string).localeCompare(valB as string, "tr");
          return sortDir === "asc" ? res : -res;
        }

        const res = (valA as number) - (valB as number);
        return sortDir === "asc" ? res : -res;
      });
  }, [teams, statusFilter, searchQuery, sortKey, sortDir]);

  const totalItems = filteredTeams.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTeams.slice(start, start + itemsPerPage);
  }, [filteredTeams, currentPage, itemsPerPage]);

  const handleSort = (columnKey: string) => {
    if (columnKey === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(columnKey as any);
      setSortDir("asc");
    }
  };

  // ==========================================
  // 5. FORM AÇMA & DÜZENLEME İŞLEMLERİ
  // ==========================================

  const handleOpenNewModal = () => {
    setEditingTeam(null);
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      about: "",
      bgImage: "/images/istockphoto-1173149385-612x612.jpg",
      leaderName: "",
      leaderTitle: "Ekip Lideri",
      displayOrder: teams.length + 1,
      status: "Aktif",
      iconName: "cpu",
      focusAreasText: "",
      whatWeDoText: "",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (team: AdminTeamItem) => {
    setEditingTeam(team);
    setFormData({
      title: team.title,
      slug: team.slug,
      shortDescription: team.shortDescription,
      about: team.about,
      bgImage: team.bgImage,
      leaderName: team.leaderName,
      leaderTitle: team.leaderTitle,
      displayOrder: team.displayOrder,
      status: team.status,
      iconName: team.iconName,
      focusAreasText: team.focusAreas.join(", "),
      whatWeDoText: team.whatWeDo.join("\n"),
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = teamFormSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    const focusAreasArray = formData.focusAreasText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const whatWeDoArray = formData.whatWeDoText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingTeam) {
      // Düzenleme işlemi
      const updatedFields = {
        title: formData.title,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        about: formData.about,
        bgImage: formData.bgImage,
        leaderName: formData.leaderName,
        leaderTitle: formData.leaderTitle,
        displayOrder: formData.displayOrder,
        status: formData.status,
        iconName: formData.iconName,
        focusAreas: focusAreasArray,
        whatWeDo: whatWeDoArray,
      };

      setTeams((prev) =>
        prev.map((t) => (t.id === editingTeam.id ? { ...t, ...updatedFields } : t))
      );
      TeamsRepository.updateTeam(editingTeam.id, updatedFields as any);
    } else {
      // Yeni ekip ekleme işlemi
      const newTeam: AdminTeamItem = {
        id: formData.slug,
        slug: formData.slug,
        title: formData.title,
        shortDescription: formData.shortDescription,
        about: formData.about,
        bgImage: formData.bgImage,
        leaderName: formData.leaderName,
        leaderTitle: formData.leaderTitle,
        iconName: formData.iconName,
        leaderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        memberCount: 0,
        focusAreas: focusAreasArray,
        whatWeDo: whatWeDoArray,
        status: formData.status,
        displayOrder: formData.displayOrder,
        membersList: [],
      };
      setTeams((prev) => [...prev, newTeam]);
      TeamsRepository.addTeam(newTeam as any);
    }

    setIsFormModalOpen(false);
  };

  // ==========================================
  // 6. SİLME İŞLEMİ (CONFIRM DIALOG)
  // ==========================================

  const handleOpenDeleteDialog = (team: AdminTeamItem) => {
    setTeamToDelete(team);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (teamToDelete) {
      setTeams((prev) => prev.filter((t) => t.id !== teamToDelete.id));
      TeamsRepository.deleteTeam(teamToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setTeamToDelete(null);
  };

  // ==========================================
  // 7. EKİP DETAYI VE ÜYE ATAMA ÖNİZLEMESİ
  // ==========================================

  const handleOpenDetailModal = (team: AdminTeamItem) => {
    setSelectedDetailTeam(team);
    setNewMemberName("");
    setNewMemberRole("");
    setIsDetailModalOpen(true);
  };

  const handleAddMemberPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !selectedDetailTeam) return;

    const newMember: AdminTeamMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      role: newMemberRole.trim() || "Ekip Üyesi",
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=100&auto=format&fit=crop&q=80`,
      joinedDate: "Bugün",
    };

    const updatedTeam: AdminTeamItem = {
      ...selectedDetailTeam,
      memberCount: selectedDetailTeam.memberCount + 1,
      membersList: [...(selectedDetailTeam.membersList || []), newMember],
    };

    setSelectedDetailTeam(updatedTeam);
    setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));

    setNewMemberName("");
    setNewMemberRole("");
  };

  const handleRemoveMemberPreview = (memberId: string) => {
    if (!selectedDetailTeam) return;

    const updatedList = (selectedDetailTeam.membersList || []).filter((m) => m.id !== memberId);
    const updatedTeam: AdminTeamItem = {
      ...selectedDetailTeam,
      memberCount: Math.max(0, selectedDetailTeam.memberCount - 1),
      membersList: updatedList,
    };

    setSelectedDetailTeam(updatedTeam);
    setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
  };

  // Auto slug generation from title
  const handleTitleChange = (value: string) => {
    setFormData((prev) => {
      const generatedSlug = value
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      return {
        ...prev,
        title: value,
        slug: editingTeam ? prev.slug : generatedSlug,
      };
    });
  };

  // ==========================================
  // 8. TABLO SÜTUN TANIMLARI
  // ==========================================

  const columns: Column<AdminTeamItem>[] = [
    {
      key: "displayOrder",
      header: "Sıra",
      sortable: true,
      align: "center",
      accessor: (team) => (
        <span
          className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${
            isDark ? "bg-[#141C2E] border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
          }`}
        >
          #{team.displayOrder}
        </span>
      ),
    },
    {
      key: "title",
      header: "Ekip Bilgisi & Slug",
      sortable: true,
      accessor: (team) => {
        const IconComp = ICON_MAP[team.iconName] || Cpu;

        return (
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-700/30">
              <Image src={team.bgImage} alt={team.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                <IconComp className="w-4.5 h-4.5" />
              </div>
            </div>

            <div>
              <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-[#0F1115]"}`}>
                {team.title}
              </h3>
              <span className="text-[11px] font-mono text-[#0A5C3A] font-semibold block">
                /ekipler/{team.slug}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "leaderName",
      header: "Ekip Lideri",
      accessor: (team) => (
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#0A5C3A]/30">
            <Image src={team.leaderAvatar} alt={team.leaderName} fill className="object-cover" />
          </div>
          <div>
            <span className={`block font-bold text-xs ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
              {team.leaderName}
            </span>
            <span className={`block text-[10.5px] ${isDark ? "text-slate-400" : "text-[#5F6773]"}`}>
              {team.leaderTitle}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "memberCount",
      header: "Üye Sayısı",
      sortable: true,
      align: "center",
      accessor: (team) => (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] border border-[#0A5C3A]/20">
          <Users className="w-3.5 h-3.5" /> {team.memberCount} Üye
        </span>
      ),
    },
    {
      key: "focusAreas",
      header: "Odak Alanları",
      accessor: (team) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {team.focusAreas.slice(0, 2).map((area) => (
            <span
              key={area}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
              }`}
            >
              {area}
            </span>
          ))}
          {team.focusAreas.length > 2 && (
            <span className="text-[10px] font-bold text-[#0A5C3A] px-1.5 py-0.5">
              +{team.focusAreas.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Durum",
      align: "center",
      accessor: (team) => (
        <AdminBadge variant={team.status === "Aktif" ? "success" : "passive"} dot>
          {team.status}
        </AdminBadge>
      ),
    },
    {
      key: "actions",
      header: "İşlemler",
      align: "right",
      accessor: (team) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleOpenDetailModal(team)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? "border-slate-800 bg-[#141C2E] text-slate-300 hover:text-white hover:bg-slate-800"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:text-[#0F1115] hover:bg-slate-100"
            }`}
            title="Detay Görüntüle"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEditModal(team)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? "border-slate-800 bg-[#141C2E] text-emerald-400 hover:bg-emerald-500/20"
                : "border-slate-200 bg-slate-50 text-[#0A5C3A] hover:bg-emerald-50"
            }`}
            title="Düzenle"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenDeleteDialog(team)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? "border-slate-800 bg-[#141C2E] text-rose-400 hover:bg-rose-500/20"
                : "border-slate-200 bg-slate-50 text-rose-600 hover:bg-rose-50"
            }`}
            title="Sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // ==========================================
  // 9. RENDER UI
  // ==========================================

  return (
    <div className="space-y-6 select-none font-sans">
      {/* FRONTEND MOCK DATA PREVIEW UYARI BADGE'İ */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
        isDark ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-[#0A5C3A]"
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>
            <strong>Frontend Önizleme Modu:</strong> Bu sayfadaki ekip ekleme, düzenleme ve silme işlemleri yerel durum (state) üzerinde simüle edilmektedir.
          </span>
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20">
          UI Prototiplendirme
        </span>
      </div>

      {/* SAYFA ÜST ŞERİDİ (HEADER) */}
      <AdminPageHeader
        title="Çalışma Ekipleri Yönetimi"
        subtitle="N'apsak? bünyesindeki 5 ana ekibin içeriklerini, çalışma alanlarını ve lider atamalarını yönetin."
        icon={Users}
        badge={{ text: `${teams.length} Ekip Kayıtlı`, variant: "info" }}
        action={
          <button
            type="button"
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Yeni Ekip Ekle</span>
          </button>
        }
      />

      {/* ARAMA VE FİLTRELEME ALANI */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
          isDark ? "bg-[#0F1623] border-slate-800" : "bg-white border-slate-200 shadow-xs"
        }`}
      >
        <AdminSearch
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Ekip adı, slug veya lider adı ile arayın..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <AdminFilter
            options={[
              { label: "Tümü", value: "Tümü", count: teams.length },
              { label: "Aktif", value: "Aktif", count: teams.filter((t) => t.status === "Aktif").length },
              { label: "Pasif", value: "Pasif", count: teams.filter((t) => t.status === "Pasif").length },
            ]}
            selectedValue={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            label="Durum:"
          />
        </div>
      </div>

      {/* TABLO BİLEŞENİ */}
      <AdminTable
        columns={columns}
        data={paginatedTeams}
        keyExtractor={(team) => team.id}
        sortColumn={sortKey}
        sortDirection={sortDir}
        onSort={handleSort}
        onRowClick={(team) => handleOpenDetailModal(team)}
        emptyState={
          <AdminEmptyState
            icon={Users}
            title="Ekip Bulunamadı"
            description="Arama kriterlerinize uyan çalışma ekibi bulunamadı. Aramayı temizlemeyi veya yeni ekip eklemeyi deneyebilirsiniz."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("Tümü");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A5C3A] text-white hover:bg-[#084A2F] transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            }
          />
        }
      />

      {/* SAYFALAMA CONTROLS */}
      {totalItems > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(num) => {
            setItemsPerPage(num);
            setCurrentPage(1);
          }}
        />
      )}

      {/* ==========================================
          10. YENİ EKİP / DÜZENLE MODALI
         ========================================== */}
      <AdminModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingTeam ? `${editingTeam.title} Düzenle` : "Yeni Çalışma Ekibi Ekle"}
        subtitle="Ekip bilgileri, odak alanları, slug ve lider atamalarını gerçekleştirin."
        icon={editingTeam ? Edit3 : Plus}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isDark
                  ? "border-slate-800 bg-[#141C2E] text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0A5C3A] hover:bg-[#084A2F] text-white shadow-md transition-all cursor-pointer"
            >
              {editingTeam ? "Güncelle ve Kaydet" : "Ekibi Oluştur"}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* EKİP ADI */}
            <div>
              <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
                Ekip Adı <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Yapay Zeka & Teknoloji Ekibi"
                className={`w-full h-10 px-3 rounded-xl border outline-none font-medium transition-all ${
                  isDark
                    ? "bg-[#141C2E] border-slate-800 text-slate-100 focus:border-[#0A5C3A]"
                    : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
                }`}
              />
              {formErrors.title && <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.title}</p>}
            </div>

            {/* SLUG */}
            <div>
              <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
                Slug (URL Adresi) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className={`absolute left-3 font-mono text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  /ekipler/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))}
                  placeholder="teknoloji"
                  className={`w-full h-10 pl-20 pr-3 rounded-xl border outline-none font-mono font-medium transition-all ${
                    isDark
                      ? "bg-[#141C2E] border-slate-800 text-emerald-400 focus:border-[#0A5C3A]"
                      : "bg-slate-50 border-slate-200 text-[#0A5C3A] focus:border-[#0A5C3A]"
                  }`}
                />
              </div>
              {formErrors.slug && <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.slug}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LİDER ADI */}
            <div>
              <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
                Ekip Lideri Adı <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.leaderName}
                onChange={(e) => setFormData((prev) => ({ ...prev, leaderName: e.target.value }))}
                placeholder="Örn: Ahmet Yılmaz"
                className={`w-full h-10 px-3 rounded-xl border outline-none font-medium transition-all ${
                  isDark
                    ? "bg-[#141C2E] border-slate-800 text-slate-100 focus:border-[#0A5C3A]"
                    : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
                }`}
              />
              {formErrors.leaderName && <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.leaderName}</p>}
            </div>

            {/* LİDER UNVANI */}
            <div>
              <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
                Lider Unvanı <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.leaderTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, leaderTitle: e.target.value }))}
                placeholder="Örn: Teknoloji Ekip Lideri"
                className={`w-full h-10 px-3 rounded-xl border outline-none font-medium transition-all ${
                  isDark
                    ? "bg-[#141C2E] border-slate-800 text-slate-100 focus:border-[#0A5C3A]"
                    : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
                }`}
              />
              {formErrors.leaderTitle && <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.leaderTitle}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* İKON SEÇİMİ */}
            <div>
              <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
                İkon Sembolü
              </label>
              <select
                value={formData.iconName}
                onChange={(e) => setFormData((prev) => ({ ...prev, iconName: e.target.value as any }))}
                className={`w-full h-10 px-3 rounded-xl border outline-none font-medium cursor-pointer ${
                  isDark
                    ? "bg-[#141C2E] border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-[#0F1115]"
                }`}
              >
                <option value="cpu">Teknoloji (CPU)</option>
                <option value="palette">Sanat (Palet)</option>
                <option value="heart-pulse">Çevre & Sağlık (Kalp/Nabız)</option>
                <option value="book-open">Programlar (Kitap)</option>
                <option value="share-2">İletişim (Paylaş)</option>
              </select>
            </div>

            {/* GÖRÜNTÜLENME SIRASI */}
            <div>
              <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
                Görüntülenme Sırası <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={formData.displayOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))}
                className={`w-full h-10 px-3 rounded-xl border outline-none font-medium ${
                  isDark
                    ? "bg-[#141C2E] border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-[#0F1115]"
                }`}
              />
              {formErrors.displayOrder && <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.displayOrder}</p>}
            </div>

            {/* DURUM */}
            <div>
              <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
                Yayın Durumu
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                className={`w-full h-10 px-3 rounded-xl border outline-none font-medium cursor-pointer ${
                  isDark
                    ? "bg-[#141C2E] border-slate-800 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-[#0F1115]"
                }`}
              >
                <option value="Aktif">Aktif (Yayında)</option>
                <option value="Pasif">Pasif (Gizli)</option>
              </select>
            </div>
          </div>
          {/* KAPAK GÖRSELİ (DOSYA SEÇ / URL) */}
          <div>
            <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
              Kapak Görseli <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <label
                  className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isDark
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                  }`}
                >
                  <Upload className="w-4 h-4 text-[#0A5C3A]" />
                  <span>Dosya Seç</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") {
                            setFormData((prev) => ({ ...prev, bgImage: reader.result as string }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {formData.bgImage && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, bgImage: "" }))}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Görseli Kaldır</span>
                  </button>
                )}
              </div>

              {formData.bgImage ? (
                <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-700/50 bg-black/10 flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.bgImage} alt="Kapak Önizleme" className="w-full h-full object-cover" />
                </div>
              ) : (
                <input
                  type="text"
                  value={formData.bgImage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bgImage: e.target.value }))}
                  placeholder="veya Görsel URL'si girin (/images/ornek-gorsel.jpg)"
                  className={`w-full h-10 px-3 rounded-xl border outline-none font-mono text-xs ${
                    isDark
                      ? "bg-[#141C2E] border-slate-800 text-slate-100 focus:border-[#0A5C3A]"
                      : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
                  }`}
                />
              )}
            </div>
            {formErrors.bgImage && <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.bgImage}</p>}
          </div>

          {/* KISA AÇIKLAMA */}
          <div>
            <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
              Kısa Açıklama (Kartlar için) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="Ekibin temel amacını özetleyen 1-2 cümlelik açıklama..."
              className={`w-full p-3 rounded-xl border outline-none font-medium resize-none ${
                isDark
                  ? "bg-[#141C2E] border-slate-800 text-slate-100 focus:border-[#0A5C3A]"
                  : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
              }`}
            />
            {formErrors.shortDescription && (
              <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.shortDescription}</p>
            )}
          </div>

          {/* HAKKINDA (DETAYLI) */}
          <div>
            <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
              Detaylı Ekip Tanıtımı (Hakkında) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.about}
              onChange={(e) => setFormData((prev) => ({ ...prev, about: e.target.value }))}
              placeholder="Ekibin vizyonu, misyonu ve çalışma prensipleri..."
              className={`w-full p-3 rounded-xl border outline-none font-medium resize-none ${
                isDark
                  ? "bg-[#141C2E] border-slate-800 text-slate-100 focus:border-[#0A5C3A]"
                  : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
              }`}
            />
            {formErrors.about && <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.about}</p>}
          </div>

          {/* ODAK ALANLARI */}
          <div>
            <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
              Odak Alanları (Virgülle Ayırın) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.focusAreasText}
              onChange={(e) => setFormData((prev) => ({ ...prev, focusAreasText: e.target.value }))}
              placeholder="Yazılım, Yapay Zeka, UX/UI Tasarımı, Hackathonlar"
              className={`w-full h-10 px-3 rounded-xl border outline-none font-medium ${
                isDark
                  ? "bg-[#141C2E] border-slate-800 text-slate-100 focus:border-[#0A5C3A]"
                  : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
              }`}
            />
            {formErrors.focusAreasText && (
              <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.focusAreasText}</p>
            )}
          </div>

          {/* NE YAPIYORUZ */}
          <div>
            <label className={`block font-bold mb-1 ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
              Neler Yapıyoruz? (Her satıra 1 madde giriniz) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.whatWeDoText}
              onChange={(e) => setFormData((prev) => ({ ...prev, whatWeDoText: e.target.value }))}
              placeholder="Madde 1: Topluluğumuzun dijital platformlarını geliştiriyoruz.&#10;Madde 2: Kodlama atölyeleri düzenliyoruz."
              className={`w-full p-3 rounded-xl border outline-none font-medium resize-none ${
                isDark
                  ? "bg-[#141C2E] border-slate-800 text-slate-100 focus:border-[#0A5C3A]"
                  : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
              }`}
            />
            {formErrors.whatWeDoText && (
              <p className="text-rose-500 font-medium text-[11px] mt-1">{formErrors.whatWeDoText}</p>
            )}
          </div>
        </form>
      </AdminModal>

      {/* ==========================================
          11. EKİP DETAYI VE ÜYE ATAMA MODALI
         ========================================== */}
      {selectedDetailTeam && (
        <AdminModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`${selectedDetailTeam.title} Detay Yönetimi`}
          subtitle={`/ekipler/${selectedDetailTeam.slug} — Detaylı görünüm ve üye atamaları.`}
          icon={ICON_MAP[selectedDetailTeam.iconName] || Cpu}
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Link
                href={`/ekipler/${selectedDetailTeam.slug}`}
                target="_blank"
                className="text-xs font-bold text-[#0A5C3A] hover:underline flex items-center gap-1"
              >
                <span>Canlı Ekip Sayfasını Aç (Site)</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0A5C3A] text-white hover:bg-[#084A2F]"
              >
                Kapat
              </button>
            </div>
          }
        >
          <div className="space-y-6 font-sans text-xs">
            {/* HER BANNER */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/40 p-6 text-white min-h-[140px] flex flex-col justify-end">
              <Image
                src={selectedDetailTeam.bgImage}
                alt={selectedDetailTeam.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#0A5C3A] px-2.5 py-0.5 rounded-md">
                      #{selectedDetailTeam.displayOrder} Sırada
                    </span>
                    <AdminBadge variant={selectedDetailTeam.status === "Aktif" ? "success" : "passive"}>
                      {selectedDetailTeam.status}
                    </AdminBadge>
                  </div>
                  <h2 className="text-2xl font-extrabold font-headings">{selectedDetailTeam.title}</h2>
                  <p className="text-xs text-white/80 font-medium max-w-xl mt-1">
                    {selectedDetailTeam.shortDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* BİLGİ KARTLARI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LİDER BİLGİSİ */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? "bg-[#141C2E] border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <span className="text-[11px] font-extrabold text-[#0A5C3A] uppercase tracking-wider block mb-2">
                  EKİP LİDERİ
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#0A5C3A]">
                    <Image src={selectedDetailTeam.leaderAvatar} alt={selectedDetailTeam.leaderName} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-[#0F1115]"}`}>
                      {selectedDetailTeam.leaderName}
                    </h4>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-[#5F6773]"}`}>
                      {selectedDetailTeam.leaderTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* ODAK ALANLARI */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? "bg-[#141C2E] border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <span className="text-[11px] font-extrabold text-[#0A5C3A] uppercase tracking-wider block mb-2">
                  ODAK ALANLARI
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetailTeam.focusAreas.map((area) => (
                    <span
                      key={area}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                        isDark ? "bg-slate-800 text-slate-200 border-slate-700" : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ÜYE YÖNETİMİ & ATAMA PANELDEN ÖNİZLEME */}
            <div
              className={`p-5 rounded-2xl border ${
                isDark ? "bg-[#0F1623] border-slate-800" : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-[#0A5C3A]" />
                  <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-[#0F1115]"}`}>
                    Ekip Üyeleri ({selectedDetailTeam.membersList?.length || 0})
                  </h3>
                </div>
                <span className="text-[11px] text-[#0A5C3A] font-semibold bg-[#0A5C3A]/10 px-2.5 py-0.5 rounded-full">
                  İlişkili Üye Yönetimi
                </span>
              </div>

              {/* ÜYE EKLEME FORMU */}
              <form onSubmit={handleAddMemberPreview} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Üye Adı Soyadı"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className={`flex-1 h-9 px-3 text-xs rounded-xl border outline-none font-medium ${
                    isDark ? "bg-[#141C2E] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-[#0F1115]"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Ekip Rolü (Örn: Tasarımcı)"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className={`flex-1 h-9 px-3 text-xs rounded-xl border outline-none font-medium ${
                    isDark ? "bg-[#141C2E] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-[#0F1115]"
                  }`}
                />
                <button
                  type="submit"
                  className="px-3.5 h-9 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Üye Ata</span>
                </button>
              </form>

              {/* ÜYE LİSTESİ */}
              {selectedDetailTeam.membersList && selectedDetailTeam.membersList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedDetailTeam.membersList.map((m) => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isDark ? "bg-[#141C2E] border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700">
                          <Image src={m.avatar} alt={m.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className={`font-bold text-xs block ${isDark ? "text-slate-200" : "text-[#0F1115]"}`}>
                            {m.name}
                          </span>
                          <span className={`text-[10px] block ${isDark ? "text-slate-400" : "text-[#5F6773]"}`}>
                            {m.role} • {m.joinedDate}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMemberPreview(m.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-md transition-colors"
                        title="Ekipten Çıkar"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-xl border-slate-700/50">
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-[#5F6773]"}`}>
                    Henüz bu ekibe atanmış üye bulunmuyor. Yukarıdaki form ile üye ekleyebilirsiniz.
                  </p>
                </div>
              )}
            </div>
          </div>
        </AdminModal>
      )}

      {/* ==========================================
          12. SİLME ONAY DIALOGU
         ========================================== */}
      <AdminConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setTeamToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`${teamToDelete?.title || "Ekip"} Silinecek`}
        description="Bu ekibi silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve ekibe bağlı frontend verileri temizlenir."
        confirmText="Evet, Ekibi Sil"
        cancelText="Vazgeç"
        variant="danger"
      />
    </div>
  );
}
