"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Zap,
  Sparkles,
  Search,
  FileText,
  Users,
  Eye,
  ExternalLink,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  AdminPageHeader,
  AdminTable,
  Column,
  AdminSearch,
  AdminFilter,
  AdminModal,
  AdminConfirmDialog,
  AdminBadge,
  AdminLoadingState,
  AdminEmptyState,
} from "@/components/admin/ui";
import { PositionsRepository, OpenPosition } from "@/lib/positionsStore";
import {
  PositionApplicationsRepository,
  PositionApplication,
} from "@/lib/positionApplicationsStore";

export default function AdminAcikPozisyonlarPage() {
  const [activeTab, setActiveTab] = useState<"positions" | "applications">("positions");

  // Positions State
  const [positions, setPositions] = useState<OpenPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Position Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<OpenPosition | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Position Form State
  const [formData, setFormData] = useState<Partial<OpenPosition>>({
    title: "",
    titleEn: "",
    team: "İletişim ve Medya",
    teamEn: "Communication & Media",
    teamCategory: "iletisim",
    shortDescription: "",
    shortDescriptionEn: "",
    workType: "Gönüllü",
    workTypeEn: "Volunteer / Remote",
    location: "Uzaktan / Çevrim İçi",
    locationEn: "Remote / Online",
    responsibilities: [],
    responsibilitiesEn: [],
    requirements: [],
    requirementsEn: [],
    preferredQualifications: [],
    preferredQualificationsEn: [],
    isActive: true,
    isUrgent: false,
    displayOrder: 0,
  });

  const [respText, setRespText] = useState("");
  const [respEnText, setRespEnText] = useState("");
  const [reqText, setReqText] = useState("");
  const [reqEnText, setReqEnText] = useState("");
  const [prefText, setPrefText] = useState("");
  const [prefEnText, setPrefEnText] = useState("");

  // Position Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Position Applications State
  const [applications, setApplications] = useState<PositionApplication[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [appPositionFilter, setAppPositionFilter] = useState("all");
  const [appStatusFilter, setAppStatusFilter] = useState("all");

  // Application Detail Modal State
  const [selectedApp, setSelectedApp] = useState<PositionApplication | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingAppStatus, setEditingAppStatus] = useState<PositionApplication["status"]>("NEW");
  const [editingAdminNote, setEditingAdminNote] = useState("");
  const [updatingApp, setUpdatingApp] = useState(false);
  const [deleteAppConfirmOpen, setDeleteAppConfirmOpen] = useState(false);
  const [deletingAppId, setDeletingAppId] = useState<number | null>(null);

  useEffect(() => {
    loadPositions();
    loadApplications();
  }, []);

  const loadPositions = async () => {
    setLoading(true);
    try {
      const data = await PositionsRepository.fetchPositionsFromDB("all");
      setPositions(data);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    setAppsLoading(true);
    try {
      const apps = await PositionApplicationsRepository.fetchAllApplications();
      setApplications(apps);
    } finally {
      setAppsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPosition(null);
    setFormData({
      title: "",
      titleEn: "",
      team: "İletişim ve Medya",
      teamEn: "Communication & Media",
      teamCategory: "iletisim",
      shortDescription: "",
      shortDescriptionEn: "",
      workType: "Gönüllü",
      workTypeEn: "Volunteer / Remote",
      location: "Uzaktan / Çevrim İçi",
      locationEn: "Remote / Online",
      responsibilities: [],
      responsibilitiesEn: [],
      requirements: [],
      requirementsEn: [],
      preferredQualifications: [],
      preferredQualificationsEn: [],
      isActive: true,
      isUrgent: false,
      displayOrder: positions.length + 1,
    });
    setRespText("");
    setRespEnText("");
    setReqText("");
    setReqEnText("");
    setPrefText("");
    setPrefEnText("");
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (pos: OpenPosition) => {
    setEditingPosition(pos);
    setFormData({
      title: pos.title,
      titleEn: pos.titleEn || "",
      team: pos.team,
      teamEn: pos.teamEn || "",
      teamCategory: pos.teamCategory || "iletisim",
      shortDescription: pos.shortDescription,
      shortDescriptionEn: pos.shortDescriptionEn || "",
      workType: pos.workType,
      workTypeEn: pos.workTypeEn || "",
      location: pos.location,
      locationEn: pos.locationEn || "",
      isActive: pos.isActive,
      isUrgent: pos.isUrgent || false,
      displayOrder: pos.displayOrder || 0,
    });
    setRespText((pos.responsibilities || []).join("\n"));
    setRespEnText((pos.responsibilitiesEn || []).join("\n"));
    setReqText((pos.requirements || []).join("\n"));
    setReqEnText((pos.requirementsEn || []).join("\n"));
    setPrefText((pos.preferredQualifications || []).join("\n"));
    setPrefEnText((pos.preferredQualificationsEn || []).join("\n"));
    setFormError(null);
    setModalOpen(true);
  };

  const handleSavePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.shortDescription?.trim()) {
      setFormError("Lütfen pozisyon başlığı ve kısa açıklamasını doldurun.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const payload: Partial<OpenPosition> = {
        ...formData,
        responsibilities: respText.split("\n").map((s) => s.trim()).filter(Boolean),
        responsibilitiesEn: respEnText.split("\n").map((s) => s.trim()).filter(Boolean),
        requirements: reqText.split("\n").map((s) => s.trim()).filter(Boolean),
        requirementsEn: reqEnText.split("\n").map((s) => s.trim()).filter(Boolean),
        preferredQualifications: prefText.split("\n").map((s) => s.trim()).filter(Boolean),
        preferredQualificationsEn: prefEnText.split("\n").map((s) => s.trim()).filter(Boolean),
      };

      if (editingPosition) {
        await PositionsRepository.updatePosition(editingPosition.id, payload);
      } else {
        await PositionsRepository.createPosition(payload);
      }

      setModalOpen(false);
      await loadPositions();
    } catch (err: any) {
      setFormError(err?.message || "Kayıt işlemi başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (pos: OpenPosition) => {
    try {
      await PositionsRepository.updatePosition(pos.id, {
        isActive: !pos.isActive,
      });
      await loadPositions();
    } catch (err: any) {
      alert(err?.message || "Durum güncellenemedi.");
    }
  };

  const handleDeletePosition = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await PositionsRepository.deletePosition(deletingId);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      await loadPositions();
    } catch (err: any) {
      alert(err?.message || "Silme işlemi başarısız.");
    } finally {
      setDeleting(false);
    }
  };

  // Application Actions
  const handleOpenAppDetailModal = (app: PositionApplication) => {
    setSelectedApp(app);
    setEditingAppStatus(app.status);
    setEditingAdminNote(app.adminNote || "");
    setDetailModalOpen(true);
  };

  const handleUpdateAppStatus = async () => {
    if (!selectedApp) return;
    setUpdatingApp(true);
    try {
      const res = await PositionApplicationsRepository.updateStatus(
        selectedApp.id,
        editingAppStatus,
        editingAdminNote
      );

      if (res.success) {
        setDetailModalOpen(false);
        await loadApplications();
      } else {
        alert(res.error || "Güncelleme başarısız.");
      }
    } finally {
      setUpdatingApp(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!deletingAppId) return;
    try {
      await PositionApplicationsRepository.deleteApplication(deletingAppId);
      setDeleteAppConfirmOpen(false);
      setDeletingAppId(null);
      await loadApplications();
    } catch {
      alert("Silme hatası.");
    }
  };

  // Filtered List - Positions
  const filteredPositions = positions.filter((pos) => {
    const matchesSearch =
      searchQuery === "" ||
      pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pos.titleEn && pos.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pos.team.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeam = teamFilter === "all" || pos.teamCategory === teamFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && pos.isActive) ||
      (statusFilter === "passive" && !pos.isActive);

    return matchesSearch && matchesTeam && matchesStatus;
  });

  // Filtered List - Applications
  const filteredApplications = applications.filter((app) => {
    const q = appSearchQuery.toLowerCase().trim();
    const userName = app.user?.name || "";
    const userEmail = app.user?.email || "";
    const posTitle = app.position?.title || "";
    const school = app.school || "";
    const dept = app.department || "";

    const matchesQuery =
      !q ||
      userName.toLowerCase().includes(q) ||
      userEmail.toLowerCase().includes(q) ||
      posTitle.toLowerCase().includes(q) ||
      school.toLowerCase().includes(q) ||
      dept.toLowerCase().includes(q);

    const matchesPos =
      appPositionFilter === "all" || String(app.positionId) === appPositionFilter;

    const matchesStatus =
      appStatusFilter === "all" || app.status === appStatusFilter;

    return matchesQuery && matchesPos && matchesStatus;
  });

  // Columns - Positions Table
  const positionColumns: Column<OpenPosition>[] = [
    {
      key: "title",
      header: "Pozisyon Adı",
      accessor: (pos) => (
        <div className="space-y-1">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{pos.title}</span>
            {pos.isUrgent && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 inline-flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                Acil
              </span>
            )}
          </div>
          {pos.titleEn && (
            <div className="text-xs text-slate-500 dark:text-slate-400 italic">
              EN: {pos.titleEn}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "team",
      header: "Ekip",
      accessor: (pos) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {pos.team}
        </span>
      ),
    },
    {
      key: "workType",
      header: "Çalışma Şekli",
      accessor: (pos) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {pos.workType} • {pos.location}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Durum",
      accessor: (pos) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(pos)}
          className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            pos.isActive
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
          }`}
        >
          {pos.isActive ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Aktif
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              Pasif
            </>
          )}
        </button>
      ),
    },
    {
      key: "actions",
      header: "İşlemler",
      accessor: (pos) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenEditModal(pos)}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-300 dark:hover:bg-slate-800 transition-colors"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingId(pos.id);
              setDeleteConfirmOpen(true);
            }}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Columns - Applications Table
  const applicationColumns: Column<PositionApplication>[] = [
    {
      key: "user",
      header: "Aday Bilgisi",
      accessor: (app) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-900 dark:text-slate-100">
            {app.user?.name || "Bilinmeyen Kullanıcı"}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {app.user?.email}
          </div>
          {app.phone && (
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              Tel: {app.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "position",
      header: "Başvurulan Pozisyon",
      accessor: (app) => (
        <div className="space-y-1">
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            {app.position?.title || `Pozisyon #${app.positionId}`}
          </div>
          <div className="text-xs text-[#0A5C3A] font-bold">
            {app.position?.team}
          </div>
        </div>
      ),
    },
    {
      key: "education",
      header: "Okul / Bölüm",
      accessor: (app) => (
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <div>{app.school || "-"}</div>
          <div className="text-slate-400">{app.department}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Başvuru Durumu",
      accessor: (app) => {
        const statusMap = {
          NEW: { label: "Yeni", color: "bg-blue-100 text-blue-800 border-blue-200" },
          IN_REVIEW: { label: "İnceleniyor", color: "bg-amber-100 text-amber-800 border-amber-200" },
          INTERVIEW: { label: "Görüşmeye Davet", color: "bg-purple-100 text-purple-800 border-purple-200" },
          ACCEPTED: { label: "Kabul Edildi", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
          REJECTED: { label: "Reddedildi", color: "bg-rose-100 text-rose-800 border-rose-200" },
        };
        const s = statusMap[app.status] || { label: app.status, color: "bg-slate-100 text-slate-800" };
        return (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${s.color}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: "cv",
      header: "CV Dosyası",
      accessor: (app) => (
        app.cvUrl ? (
          <a
            href={app.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-[#0A5C3A] transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV Görüntüle</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Yüklenmedi</span>
        )
      ),
    },
    {
      key: "createdAt",
      header: "Tarih",
      accessor: (app) => (
        <span className="text-xs text-slate-500 font-medium">
          {new Date(app.createdAt).toLocaleDateString("tr-TR")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "İşlemler",
      accessor: (app) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAppDetailModal(app)}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-300 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Başvuruyu İncele"
          >
            <Eye className="w-4 h-4" />
            <span>İncele</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingAppId(app.id);
              setDeleteAppConfirmOpen(true);
            }}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Açık Pozisyonlar & Başvuru Yönetimi"
        subtitle="Açık pozisyonları düzenleyin ve pozisyonlara yapılan özel aday başvurularını inceleyin."
        icon={Briefcase}
        action={
          activeTab === "positions" ? (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Yeni Pozisyon Ekle
            </button>
          ) : undefined
        }
      />

      {/* TOP TABS BAR */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("positions")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "positions"
              ? "bg-[#0A5C3A] text-white shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Açık Pozisyonlar ({positions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "applications"
              ? "bg-[#0A5C3A] text-white shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pozisyon Başvuruları ({applications.length})</span>
          {applications.filter((a) => a.status === "NEW").length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black">
              {applications.filter((a) => a.status === "NEW").length} yeni
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: POSITIONS MANAGEMENT */}
      {activeTab === "positions" && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex-1">
              <AdminSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Pozisyon adı veya ekip ara..."
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto">
              <AdminFilter
                selectedValue={teamFilter}
                onChange={setTeamFilter}
                options={[
                  { label: "Tüm Ekipler", value: "all" },
                  { label: "İletişim ve Medya", value: "iletisim" },
                  { label: "Teknoloji", value: "teknoloji" },
                  { label: "Etkinlik", value: "etkinlik" },
                  { label: "Yönetim", value: "yonetim" },
                ]}
              />

              <AdminFilter
                selectedValue={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: "Tüm Durumlar", value: "all" },
                  { label: "Aktif", value: "active" },
                  { label: "Pasif", value: "passive" },
                ]}
              />
            </div>
          </div>

          {/* TABLE LISTING */}
          {loading ? (
            <AdminLoadingState />
          ) : filteredPositions.length === 0 ? (
            <AdminEmptyState
              icon={Briefcase}
              title="Açık pozisyon bulunamadı"
              description="Arama kriterlerinize uyan pozisyon kaydı bulunmamaktadır."
              action={
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 bg-[#0A5C3A] text-white rounded-xl text-xs font-bold"
                >
                  Pozisyon Ekle
                </button>
              }
            />
          ) : (
            <AdminTable
              data={filteredPositions}
              columns={positionColumns}
              keyExtractor={(pos) => pos.id}
            />
          )}
        </div>
      )}

      {/* TAB 2: POSITION APPLICATIONS MANAGEMENT */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {/* APPLICATION FILTERS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex-1">
              <AdminSearch
                value={appSearchQuery}
                onChange={setAppSearchQuery}
                placeholder="Aday adı, e-posta, okul veya pozisyon ara..."
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto">
              <AdminFilter
                selectedValue={appPositionFilter}
                onChange={setAppPositionFilter}
                options={[
                  { label: "Tüm Pozisyonlar", value: "all" },
                  ...positions.map((p) => ({ label: p.title, value: String(p.id) })),
                ]}
              />

              <AdminFilter
                selectedValue={appStatusFilter}
                onChange={setAppStatusFilter}
                options={[
                  { label: "Tüm Durumlar", value: "all" },
                  { label: "Yeni", value: "NEW" },
                  { label: "İnceleniyor", value: "IN_REVIEW" },
                  { label: "Görüşmeye Davet", value: "INTERVIEW" },
                  { label: "Kabul Edildi", value: "ACCEPTED" },
                  { label: "Reddedildi", value: "REJECTED" },
                ]}
              />
            </div>
          </div>

          {/* APPLICATIONS TABLE */}
          {appsLoading ? (
            <AdminLoadingState />
          ) : filteredApplications.length === 0 ? (
            <AdminEmptyState
              icon={Users}
              title="Pozisyon başvurusu bulunamadı"
              description="Henüz seçilen filtrelere uygun aday başvurusu bulunmamaktadır."
            />
          ) : (
            <AdminTable
              data={filteredApplications}
              columns={applicationColumns}
              keyExtractor={(app) => app.id}
            />
          )}
        </div>
      )}

      {/* POSITION CREATE / EDIT MODAL */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPosition ? "Pozisyonu Düzenle" : "Yeni Pozisyon Ekle"}
        size="xl"
      >
        <form onSubmit={handleSavePosition} className="space-y-4 text-left">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pozisyon Adı (TR) *
              </label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pozisyon Adı (EN)
              </label>
              <input
                type="text"
                value={formData.titleEn || ""}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ekip Adı (TR) *
              </label>
              <input
                type="text"
                required
                value={formData.team || ""}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ekip Adı (EN)
              </label>
              <input
                type="text"
                value={formData.teamEn || ""}
                onChange={(e) => setFormData({ ...formData, teamEn: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ekip Kategorisi *
              </label>
              <select
                value={formData.teamCategory || "iletisim"}
                onChange={(e) => setFormData({ ...formData, teamCategory: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              >
                <option value="iletisim">İletişim ve Medya</option>
                <option value="teknoloji">Teknoloji</option>
                <option value="etkinlik">Etkinlik</option>
                <option value="yonetim">Yönetim</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kısa Açıklama (TR) *
              </label>
              <textarea
                required
                rows={3}
                value={formData.shortDescription || ""}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kısa Açıklama (EN)
              </label>
              <textarea
                rows={3}
                value={formData.shortDescriptionEn || ""}
                onChange={(e) => setFormData({ ...formData, shortDescriptionEn: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sorumluluklar (Her satıra bir tane)
              </label>
              <textarea
                rows={3}
                value={respText}
                onChange={(e) => setRespText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sorumluluklar EN (Her satıra bir tane)
              </label>
              <textarea
                rows={3}
                value={respEnText}
                onChange={(e) => setRespEnText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded text-[#0A5C3A]"
              />
              <span>Aktif Pozisyon</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isUrgent || false}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="rounded text-[#0A5C3A]"
              />
              <span>Acil Pozisyon Etiketi</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* APPLICATION DETAIL & STATUS MODAL */}
      {selectedApp && (
        <AdminModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Pozisyon Başvuru Detayı"
          size="lg"
        >
          <div className="space-y-5 text-left text-xs">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedApp.user?.name}
                </span>
                <span className="text-slate-500 text-xs">
                  {new Date(selectedApp.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                E-posta: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.user?.email}</span>
                {selectedApp.phone && ` • Tel: ${selectedApp.phone}`}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Okul / Bölüm: <span className="font-semibold">{selectedApp.school || "-"}</span> / <span className="font-semibold">{selectedApp.department || "-"}</span>
              </div>
              <div className="pt-1 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  Başvurulan Pozisyon: <span className="font-bold text-[#0A5C3A]">{selectedApp.position?.title}</span> ({selectedApp.position?.team})
                </div>
                {selectedApp.cvUrl && (
                  <a
                    href={selectedApp.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-[#0A5C3A] text-white font-bold text-[11px] inline-flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> CV İndir / Aç
                  </a>
                )}
              </div>
            </div>

            {/* Why Apply */}
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-slate-100 block">
                Başvuru Nedeni / Motivasyon:
              </label>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {selectedApp.whyApply || "Belirtilmedi"}
              </div>
            </div>

            {/* Experience */}
            {selectedApp.experience && (
              <div className="space-y-1">
                <label className="font-bold text-slate-900 dark:text-slate-100 block">
                  İlgili Deneyim & Yetenekler:
                </label>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {selectedApp.experience}
                </div>
              </div>
            )}

            {/* Status & Admin Note Edit Form */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Başvuru Durumunu Güncelle:
                </label>
                <select
                  value={editingAppStatus}
                  onChange={(e) => setEditingAppStatus(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="NEW">Yeni (İncelenmedi)</option>
                  <option value="IN_REVIEW">İnceleniyor</option>
                  <option value="INTERVIEW">Görüşmeye Davet Edildi</option>
                  <option value="ACCEPTED">Kabul Edildi</option>
                  <option value="REJECTED">Reddedildi</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Yönetici Notu (Özel Admin Notu):
                </label>
                <textarea
                  rows={3}
                  value={editingAdminNote}
                  onChange={(e) => setEditingAdminNote(e.target.value)}
                  placeholder="Mülakat notu, değerlendirme açıklaması vb."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleUpdateAppStatus}
                disabled={updatingApp}
                className="px-6 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold disabled:opacity-50"
              >
                {updatingApp ? "Kaydediliyor..." : "Durumu & Notu Kaydet"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* CONFIRM DELETE DIALOGS */}
      <AdminConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeletePosition}
        title="Pozisyonu Sil"
        description="Bu açık pozisyonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        isLoading={deleting}
      />

      <AdminConfirmDialog
        isOpen={deleteAppConfirmOpen}
        onClose={() => setDeleteAppConfirmOpen(false)}
        onConfirm={handleDeleteApplication}
        title="Pozisyon Başvurusunu Sil"
        description="Bu aday başvurusunu silmek istediğinizden emin misiniz?"
        confirmText="Evet, Sil"
      />
    </div>
  );
}
