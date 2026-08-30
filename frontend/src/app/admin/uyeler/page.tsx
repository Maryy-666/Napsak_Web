"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { z } from "zod";
import {
  UserCheck,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Crown,
  ShieldCheck,
  X,
  Layers,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { MediaPickerModal } from "../../../components/admin/media/MediaPickerModal";
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
  AdminEmptyState,
  FilterOption,
} from "../../../components/admin/ui";
import { MembersRepository } from "../../../lib/membersStore";
import { TeamsRepository } from "../../../lib/teamsStore";
import { PublicMember } from "../../../data/members";
import { TeamData } from "../../../data/teams";

// ==========================================
// 1. FORM DOĞRULAMA (ZOD SCHEMA)
// ==========================================
const memberFormSchema = z.object({
  name: z.string().min(2, "Üye adı en az 2 karakter olmalıdır."),
  initials: z.string().min(1, "Baş harfler zorunludur.").max(4),
  primaryTeam: z.string().min(2, "Ana ekip seçimi zorunludur."),
  primaryRole: z.string().min(2, "Ekip içi görev/unvan zorunludur."),
  isPresident: z.boolean(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  linkedin: z.string().optional(),
  city: z.string().optional(),
  school: z.string().optional(),
  department: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

interface MembershipFormItem {
  teamSlug: string;
  team: string;
  role: string;
  subRole?: string;
  isLeader?: boolean;
}

export default function AdminUyelerPage() {
  const { isDark } = useAdminTheme();

  // State Yönetimi
  const [members, setMembers] = useState<PublicMember[]>([]);
  const [teamsList, setTeamsList] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Arama, Filtreleme ve Sayfalama
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("Tümü");
  const [roleFilter, setRoleFilter] = useState("Tümü");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal ve Dialog State'leri
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<PublicMember | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<PublicMember | null>(null);

  // Form State
  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    initials: "",
    primaryTeam: "Teknoloji Ekibi",
    primaryRole: "Uzman",
    isPresident: false,
    bio: "",
    avatar: "",
    linkedin: "",
    city: "İstanbul",
    school: "",
    department: "",
  });

  const [membershipsInput, setMembershipsInput] = useState<MembershipFormItem[]>([]);
  const [newTeamSlug, setNewTeamSlug] = useState("");
  const [newTeamRole, setNewTeamRole] = useState("Uzman");

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Veri Yükleme
  const loadData = async () => {
    try {
      setLoading(true);
      setApiError("");
      const dbMembers = await MembersRepository.fetchMembersFromDB();
      const dbTeams = await TeamsRepository.fetchTeamsFromDB();

      setMembers(dbMembers);
      setTeamsList(dbTeams);
    } catch (err: any) {
      console.error("Üyeler yüklenirken hata:", err);
      setApiError("Veriler veritabanından alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtreleme Mantığı
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Ekip filtresi
      if (teamFilter !== "Tümü") {
        const matchesTeam =
          m.primaryTeam.toLowerCase().includes(teamFilter.toLowerCase()) ||
          m.memberships?.some((mem) =>
            mem.team.toLowerCase().includes(teamFilter.toLowerCase())
          );
        if (!matchesTeam) return false;
      }

      // Rol filtresi
      if (roleFilter === "Başkanlar") {
        if (!m.isPresident && !m.memberships?.some((mem) => mem.role === "Başkan")) {
          return false;
        }
      }

      // Arama filtresi
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        m.name.toLowerCase().includes(q) ||
        m.primaryTeam.toLowerCase().includes(q) ||
        m.primaryRole.toLowerCase().includes(q) ||
        (m.city && m.city.toLowerCase().includes(q)) ||
        (m.school && m.school.toLowerCase().includes(q))
      );
    });
  }, [members, teamFilter, roleFilter, searchQuery]);

  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  // Yeni Üye Ekleme Modalı Açma
  const handleOpenNewModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      initials: "",
      primaryTeam: teamsList[0]?.title || "Teknoloji Ekibi",
      primaryRole: "Uzman",
      isPresident: false,
      bio: "",
      avatar: "",
      linkedin: "",
      city: "",
      school: "",
      department: "",
    });
    setMembershipsInput([
      {
        teamSlug: teamsList[0]?.slug || "teknoloji",
        team: teamsList[0]?.title || "Teknoloji Ekibi",
        role: "Uzman",
      },
    ]);
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Düzenleme Modalı Açma
  const handleOpenEditModal = (member: PublicMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      initials: member.initials || member.name.substring(0, 2).toUpperCase(),
      primaryTeam: member.primaryTeam,
      primaryRole: member.primaryRole,
      isPresident: Boolean(member.isPresident),
      bio: member.bio || "",
      avatar: member.avatar || "",
      linkedin: member.linkedin || "",
      city: member.city || "",
      school: member.school || "",
      department: member.department || "",
    });

    setMembershipsInput(
      member.memberships && member.memberships.length > 0
        ? member.memberships.map((m) => ({
            teamSlug: (m as any).teamSlug || m.team.toLowerCase().replace(/\s+/g, "-"),
            team: m.team,
            role: m.role,
            subRole: m.subRole,
            isLeader: (m as any).isLeader || m.role === "Başkan",
          }))
        : [
            {
              teamSlug: member.primaryTeam.toLowerCase().replace(/\s+/g, "-"),
              team: member.primaryTeam,
              role: member.primaryRole,
            },
          ]
    );

    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Otomatik Baş Harfler
  const handleNameChange = (val: string) => {
    const parts = val.trim().split(" ");
    let inits = "";
    if (parts.length >= 2) {
      inits = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      inits = parts[0].substring(0, 2).toUpperCase();
    }
    setFormData((prev) => ({
      ...prev,
      name: val,
      initials: prev.initials || inits,
    }));
  };

  // Çoklu Ekip Üyeliği Ekleme (Modal İçinde)
  const handleAddMembershipItem = () => {
    if (!newTeamSlug) return;
    const targetTeam = teamsList.find((t) => t.slug === newTeamSlug || t.id === newTeamSlug);
    if (!targetTeam) return;

    if (membershipsInput.some((m) => m.teamSlug === targetTeam.slug)) {
      setFormErrors((prev) => ({
        ...prev,
        memberships: "Üye bu ekibe zaten eklenmiş.",
      }));
      return;
    }

    setMembershipsInput((prev) => [
      ...prev,
      {
        teamSlug: targetTeam.slug,
        team: targetTeam.title,
        role: newTeamRole || "Uzman",
        isLeader: newTeamRole === "Başkan",
      },
    ]);
    setNewTeamSlug("");
    setNewTeamRole("Uzman");
    setFormErrors((prev) => ({ ...prev, memberships: "" }));
  };

  const handleRemoveMembershipItem = (teamSlug: string) => {
    setMembershipsInput((prev) => prev.filter((m) => m.teamSlug !== teamSlug));
  };

  // Form Gönderme
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setApiError("");

    const result = memberFormSchema.safeParse(formData);
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

    try {
      const payload = {
        name: formData.name.trim(),
        initials: formData.initials.trim(),
        primaryTeam: formData.primaryTeam,
        primaryRole: formData.primaryRole,
        isPresident: formData.isPresident,
        bio: formData.bio || null,
        avatar: formData.avatar || null,
        linkedin: formData.linkedin || null,
        city: formData.city || null,
        school: formData.school || null,
        department: formData.department || null,
        memberships: membershipsInput,
      };

      if (editingMember) {
        // Güncelleme
        await MembersRepository.updateMember(editingMember.id, payload as any);
        setSuccessMessage("Üye profili veritabanında başarıyla güncellendi.");
      } else {
        // Yeni Ekleme
        await MembersRepository.addMember(payload as any);
        setSuccessMessage("Yeni üye profili veritabanına eklendi.");
      }

      setIsFormModalOpen(false);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Üye kaydedilirken hata:", err);
      setApiError(err?.message || "Üye kaydedilemedi.");
    }
  };

  // Üye Silme
  const handleOpenDeleteDialog = (member: PublicMember) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      setApiError("");
      await MembersRepository.deleteMember(memberToDelete.id);
      setSuccessMessage("Üye profili veritabanından güvenle silindi.");
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Üye silinirken hata:", err);
      setApiError("Üye silinirken hata oluştu.");
    }
  };

  // Tablo Sütunları
  const columns: Column<PublicMember>[] = [
    {
      key: "name",
      header: "ÜYE BİLGİSİ",
      accessor: (m: PublicMember) => {
        const isTeamLeader = m.memberships?.some(
          (mem: any) => mem.role === "Başkan" || (Boolean(mem.isLeader) && mem.role?.includes("Başkan"))
        );

        return (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center font-bold text-sm shrink-0 border border-[#0A5C3A]/20">
              {m.avatar ? (
                <Image src={m.avatar} alt={m.name} fill className="object-cover" />
              ) : (
                <span>{m.initials}</span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>{m.name}</span>
                {m.isPresident ? (
                  <span title="Topluluk Eş Başkanı">
                    <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </span>
                ) : isTeamLeader ? (
                  <span title="Ekip Sorumlusu">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0A5C3A]" />
                  </span>
                ) : null}
              </div>
              <span className="text-xs text-[#5F6773]">
                {m.school ? `${m.school} ${m.department ? `(${m.department})` : ""}` : m.city || "Gençlik Gönüllüsü"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "primaryTeam",
      header: "ANA EKİP & GÖREV",
      accessor: (m: PublicMember) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-sm text-[#0F1115] dark:text-slate-100">{m.primaryTeam}</span>
          <span className="text-xs text-[#0A5C3A] font-medium">{m.primaryRole}</span>
        </div>
      ),
    },
    {
      key: "memberships",
      header: "EKİP ÜYELİKLERİ",
      accessor: (m: PublicMember) => (
        <div className="flex flex-wrap gap-1">
          {m.memberships && m.memberships.length > 0 ? (
            m.memberships.map((mem: any, idx: number) => {
              const isLd = mem.role === "Başkan" || (Boolean(mem.isLeader) && mem.role?.includes("Başkan"));
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1 border ${
                    isLd
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold"
                      : "bg-[#F8F9FA] dark:bg-slate-800/70 border-[#EEF0F2] dark:border-slate-700 text-[#0F1115] dark:text-slate-200"
                  }`}
                >
                  <span>{mem.team}</span>
                  <span className={isLd ? "text-emerald-700 font-bold" : "text-[#0A5C3A]"}>
                    ({isLd ? `★ ${mem.role}` : mem.role})
                  </span>
                </span>
              );
            })
          ) : (
            <span className="text-xs text-gray-400">1 Ekip Üyesi</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "İŞLEMLER",
      accessor: (m: PublicMember) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenEditModal(m)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Üye Profili Düzenle"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDeleteDialog(m)}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/30 transition-colors"
            title="Üye Profilini Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const teamFilterOptions: FilterOption[] = [
    { label: "Tümü", value: "Tümü" },
    ...teamsList.map((t) => ({ label: t.title, value: t.title })),
  ];

  const roleFilterOptions: FilterOption[] = [
    { label: "Tümü", value: "Tümü" },
    { label: "Başkanlar", value: "Başkanlar" },
  ];

  return (
    <div className="space-y-6">
      {/* Sayfa Başlığı */}
      <AdminPageHeader
        title="Üye Yönetimi (CMS)"
        subtitle="N'apsak? Gençlik Topluluğu üye profillerini, çoklu ekip üyeliklerini ve unvanlarını yönetin."
        icon={UserCheck}
        action={
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white font-bold text-sm hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Üye Ekle</span>
          </button>
        }
      />

      {/* Bildirim Mesajları */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {apiError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Arama ve Filtreleme Barı */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <AdminSearch
          placeholder="İsim, unvan veya okul ara..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="flex items-center gap-3">
          <AdminFilter
            label="Ekip Filtresi"
            options={teamFilterOptions}
            selectedValue={teamFilter}
            onChange={setTeamFilter}
          />
          <AdminFilter
            label="Rol Filtresi"
            options={roleFilterOptions}
            selectedValue={roleFilter}
            onChange={setRoleFilter}
          />
        </div>
      </div>

      {/* Tablo Ekranı */}
      <div className="bg-white dark:bg-[#0F1623] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#0A5C3A] border-t-transparent animate-spin" />
            <span>Veriler veritabanından yükleniyor...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <AdminEmptyState
            title="Üye Bulunamadı"
            description="Arama kriterlerinize uygun üye kaydı bulunamadı."
            action={
              <button
                onClick={handleOpenNewModal}
                className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold"
              >
                Yeni Üye Ekle
              </button>
            }
          />
        ) : (
          <>
            <AdminTable
              data={paginatedMembers}
              columns={columns}
              keyExtractor={(m) => m.id}
            />
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
          </>
        )}
      </div>

      {/* ÜYE EKLEME / DÜZENLEME MODALI */}
      <AdminModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingMember ? "Üye Profilini Düzenle" : "Yeni Üye Profili Ekle"}
        subtitle="Üyenin temel profil bilgilerini, unvanını ve bağlı olduğu çalışma ekiplerini belirleyin."
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ad Soyad */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ad Soyad <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Ege Berk Oter"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
              {formErrors.name && (
                <span className="text-xs text-rose-500 mt-1 block">{formErrors.name}</span>
              )}
            </div>

            {/* Baş Harfler */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Baş Harfler (Initials) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.initials}
                onChange={(e) => setFormData((p) => ({ ...p, initials: e.target.value.toUpperCase() }))}
                placeholder="Örn: EBO"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ana Ekip */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ana Ekip <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.primaryTeam}
                onChange={(e) => setFormData((p) => ({ ...p, primaryTeam: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              >
                {teamsList.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Ana Görev / Unvan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ekip İçi Görev / Unvan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.primaryRole}
                onChange={(e) => setFormData((p) => ({ ...p, primaryRole: e.target.value }))}
                placeholder="Örn: Başkan, Uzman, Web Geliştirici"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Profil Fotoğrafı (Avatar URL) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Profil Fotoğrafı URL (Avatar)
              </label>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="text-xs text-[#0A5C3A] font-bold hover:underline flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Medya Kütüphanesinden Seç</span>
              </button>
            </div>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData((p) => ({ ...p, avatar: e.target.value }))}
              placeholder="https://images.unsplash.com/... veya /uploads/avatars/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Görsel bağlantısı boş bırakılırsa baş harfler (Initials) avatar olarak kullanılır.
            </span>
          </div>

          <MediaPickerModal
            isOpen={isMediaPickerOpen}
            onClose={() => setIsMediaPickerOpen(false)}
            targetFolder="avatars"
            onSelect={(url) => setFormData((p) => ({ ...p, avatar: url }))}
          />

          {/* Okul, Bölüm, Şehir & LinkedIn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Şehir
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                placeholder="Örn: İstanbul"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Üniversite / Okul
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData((p) => ({ ...p, school: e.target.value }))}
                placeholder="Örn: İTÜ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bölüm
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                placeholder="Örn: Bilgisayar Müh."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* ÇOKLU EKİP ÜYELİKLERİ YÖNETİMİ (TeamMembership) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0A5C3A]" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Çoklu Ekip Üyelikleri (TeamMembership)
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">
                Bir üye birden fazla ekibe farklı görevlerle bağlanabilir.
              </span>
            </div>

            {/* Bağlı Ekipler Listesi */}
            <div className="space-y-2">
              {membershipsInput.map((mem, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F1115] dark:text-white">{mem.team}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] font-semibold">
                      {mem.role}
                    </span>
                    {mem.isLeader && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        Ekip Başkanı
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMembershipItem(mem.teamSlug)}
                    className="p-1 rounded-md text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Bu Ekip Üyeliğini Kaldır"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Yeni Ekip Bağlama Girişi */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <select
                value={newTeamSlug}
                onChange={(e) => setNewTeamSlug(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-xs"
              >
                <option value="">-- Ekip Seç --</option>
                {teamsList.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.title}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={newTeamRole}
                onChange={(e) => setNewTeamRole(e.target.value)}
                placeholder="Görev (Örn: Araştırmacı)"
                className="w-full sm:w-1/3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-xs"
              />

              <button
                type="button"
                onClick={handleAddMembershipItem}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0A5C3A] text-white font-bold text-xs hover:bg-[#084A2F] transition-colors"
              >
                Ekibe Bağla
              </button>
            </div>
            {formErrors.memberships && (
              <span className="text-xs text-rose-500 block">{formErrors.memberships}</span>
            )}
          </div>

          {/* Form Aksiyon Butonları */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0A5C3A] text-white text-sm font-bold hover:bg-[#084A2F] transition-colors shadow-md"
            >
              {editingMember ? "Değişiklikleri Kaydet" : "Üye Profilini Ekle"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* SİLME ONAY DIALOGU */}
      <AdminConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Üye Profilini Sil"
        description={`"${memberToDelete?.name}" isimli üyenin profili ve tüm ekip üyelikleri veritabanından silinecektir. Varsa ilişkili Kullanıcı (User) hesabı korunacaktır. Onaylıyor musunuz?`}
        confirmText="Evet, Üyeyi Sil"
        variant="danger"
      />
    </div>
  );
}
