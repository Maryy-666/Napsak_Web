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

export default function AdminAcikPozisyonlarPage() {
  const [positions, setPositions] = useState<OpenPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<OpenPosition | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
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

  // Textarea raw states for multi-line array fields
  const [respText, setRespText] = useState("");
  const [respEnText, setRespEnText] = useState("");
  const [reqText, setReqText] = useState("");
  const [reqEnText, setReqEnText] = useState("");
  const [prefText, setPrefText] = useState("");
  const [prefEnText, setPrefEnText] = useState("");

  // Confirm Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPositions();
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
      isUrgent: pos.isUrgent,
      displayOrder: pos.displayOrder,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      setFormError("Pozisyon başlığı zorunludur.");
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
      setFormError(err?.message || "İşlem sırasında bir hata oluştu.");
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
      alert(err?.message || "Durum değiştirilemedi.");
    }
  };

  const handleConfirmDelete = async () => {
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

  // Filtered List
  const filteredPositions = positions.filter((pos) => {
    const matchesSearch =
      searchQuery === "" ||
      pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pos.titleEn && pos.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pos.team.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeam =
      teamFilter === "all" || pos.teamCategory === teamFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && pos.isActive) ||
      (statusFilter === "passive" && !pos.isActive);

    return matchesSearch && matchesTeam && matchesStatus;
  });

  const columns: Column<OpenPosition>[] = [
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
      header: "Ekip / Katman",
      accessor: (pos) => (
        <div>
          <AdminBadge variant="info" size="sm">
            {pos.team}
          </AdminBadge>
        </div>
      ),
    },

    {
      key: "workType",
      header: "Çalışma Şekli & Konum",
      accessor: (pos) => (
        <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-300">
          <div className="font-semibold text-slate-900 dark:text-slate-100">{pos.workType}</div>
          <div className="text-slate-500">{pos.location}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Yayın Durumu",
      accessor: (pos) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(pos)}
          className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A] rounded-md transition-transform hover:scale-105"
        >
          {pos.isActive ? (
            <AdminBadge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Aktif
            </AdminBadge>
          ) : (
            <AdminBadge variant="neutral" size="sm">
              <XCircle className="w-3 h-3 mr-1" />
              Pasif
            </AdminBadge>
          )}
        </button>
      ),
    },
    {
      key: "actions",
      header: "İşlemler",
      className: "text-right",
      accessor: (pos) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleOpenEditModal(pos)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0A5C3A] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
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
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
        title="Açık Pozisyonlar Yönetimi"
        subtitle="Topluluk için gönüllülük ve ekip üyesi pozisyonlarını yönetin. Aktif yapılan pozisyonlar kamuya açık sayfada anında listelenir."
        icon={Briefcase}
        action={

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yeni Pozisyon Ekle
          </button>
        }
      />

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
          columns={columns}
          keyExtractor={(pos) => pos.id}
        />
      )}


      {/* CREATE & EDIT MODAL */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPosition ? "Pozisyonu Düzenle" : "Yeni Pozisyon Ekle"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {formError}
            </div>
          )}

          {/* Title TR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pozisyon Adı (Türkçe) *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Örn: Yazılım Geliştirme Gönüllüsü"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pozisyon Adı (English)
              </label>
              <input
                type="text"
                value={formData.titleEn || ""}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="e.g. Software Development Volunteer"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Team TR, EN & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ekip Adı (TR)
              </label>
              <input
                type="text"
                value={formData.team || ""}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="İletişim ve Medya"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
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
                placeholder="Communication & Media"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Filtre Kategorisi
              </label>
              <select
                value={formData.teamCategory || "iletisim"}
                onChange={(e) => setFormData({ ...formData, teamCategory: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              >
                <option value="iletisim">İletişim ve Medya</option>
                <option value="teknoloji">Teknoloji</option>
                <option value="etkinlik">Etkinlik</option>
                <option value="yonetim">Yönetim</option>
                <option value="diger">Diğer</option>
              </select>
            </div>
          </div>

          {/* Work Type & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Çalışma Şekli (TR / EN)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.workType || ""}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  placeholder="TR: Gönüllü / Hibrit"
                  className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
                />
                <input
                  type="text"
                  value={formData.workTypeEn || ""}
                  onChange={(e) => setFormData({ ...formData, workTypeEn: e.target.value })}
                  placeholder="EN: Volunteer / Hybrid"
                  className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Konum / Şehir (TR / EN)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="TR: Uzaktan / Çevrim İçi"
                  className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
                />
                <input
                  type="text"
                  value={formData.locationEn || ""}
                  onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                  placeholder="EN: Remote / Online"
                  className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
                />
              </div>
            </div>
          </div>

          {/* Short Description TR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kısa Açıklama (Türkçe)
              </label>
              <textarea
                value={formData.shortDescription || ""}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Pozisyonun kısa özeti..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kısa Açıklama (English)
              </label>
              <textarea
                value={formData.shortDescriptionEn || ""}
                onChange={(e) => setFormData({ ...formData, shortDescriptionEn: e.target.value })}
                placeholder="Short position summary..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Responsibilities TR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sorumluluklar (Her satıra 1 madde - TR)
              </label>
              <textarea
                value={respText}
                onChange={(e) => setRespText(e.target.value)}
                placeholder="İçerik takvimi hazırlamak&#10;Metin yazarlığı yapmak"
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Responsibilities (Her satıra 1 madde - EN)
              </label>
              <textarea
                value={respEnText}
                onChange={(e) => setRespEnText(e.target.value)}
                placeholder="Preparing content calendar&#10;Writing copy"
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Requirements TR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Aranan Özellikler (Her satıra 1 madde - TR)
              </label>
              <textarea
                value={reqText}
                onChange={(e) => setReqText(e.target.value)}
                placeholder="Sosyal medyaya ilgi&#10;Haftada 3-5 saat zaman"
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Requirements (Her satıra 1 madde - EN)
              </label>
              <textarea
                value={reqEnText}
                onChange={(e) => setReqEnText(e.target.value)}
                placeholder="Interest in social media&#10;3-5 hours per week"
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Preferred Skills TR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tercih Edilen Yetkinlikler (TR)
              </label>
              <textarea
                value={prefText}
                onChange={(e) => setPrefText(e.target.value)}
                placeholder="Canva deneyimi&#10;Reels kurgu tecrübesi"
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Qualifications (EN)
              </label>
              <textarea
                value={prefEnText}
                onChange={(e) => setPrefEnText(e.target.value)}
                placeholder="Canva experience&#10;Reels editing"
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Checkboxes: Active & Urgent */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[#0A5C3A] focus:ring-[#0A5C3A]"
              />
              <span>Yayınlansın (Aktif Pozisyon)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isUrgent ?? false}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Acil Pozisyon Rozeti</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* CONFIRM DELETE DIALOG */}
      <AdminConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Pozisyonu Sil"
        description="Bu açık pozisyonu silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="Vazgeç"
        isLoading={deleting}
      />

    </div>
  );
}
