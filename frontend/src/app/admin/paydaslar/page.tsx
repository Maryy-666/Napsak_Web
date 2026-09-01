"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ImageIcon,
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
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { PartnersRepository, PartnerItem } from "@/lib/partnersStore";

export default function AdminPaydaslarPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PartnerItem>>({
    name: "",
    nameEn: "",
    category: "Paydaş",
    categoryEn: "Partner",
    description: "",
    descriptionEn: "",
    logo: "",
    websiteUrl: "",
    isActive: true,
    displayOrder: 0,
  });

  // Media Picker State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Confirm Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const data = await PartnersRepository.fetchPartnersFromDB("all");
      setPartners(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      nameEn: "",
      category: "Paydaş",
      categoryEn: "Partner",
      description: "",
      descriptionEn: "",
      logo: "",
      websiteUrl: "",
      isActive: true,
      displayOrder: partners.length + 1,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (partner: PartnerItem) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      nameEn: partner.nameEn || "",
      category: partner.category,
      categoryEn: partner.categoryEn || "",
      description: partner.description || "",
      descriptionEn: partner.descriptionEn || "",
      logo: partner.logo || "",
      websiteUrl: partner.websiteUrl || "",
      isActive: partner.isActive,
      displayOrder: partner.displayOrder,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      setFormError("Kurum adı zorunludur.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingPartner) {
        await PartnersRepository.updatePartner(editingPartner.id, formData);
      } else {
        await PartnersRepository.createPartner(formData);
      }

      setModalOpen(false);
      await loadPartners();
    } catch (err: any) {
      setFormError(err?.message || "İşlem sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (partner: PartnerItem) => {
    try {
      await PartnersRepository.updatePartner(partner.id, {
        isActive: !partner.isActive,
      });
      await loadPartners();
    } catch (err: any) {
      alert(err?.message || "Durum değiştirilemedi.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await PartnersRepository.deletePartner(deletingId);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      await loadPartners();
    } catch (err: any) {
      alert(err?.message || "Silme işlemi başarısız.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered List
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && p.isActive) ||
      (statusFilter === "passive" && !p.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns: Column<PartnerItem>[] = [
    {
      key: "name",
      header: "Kurum / Organizasyon",
      accessor: (partner) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Building2 className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              {partner.name}
            </div>
            {partner.nameEn && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                EN: {partner.nameEn}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      accessor: (partner) => (
        <AdminBadge variant="info" size="sm">
          {partner.category}
        </AdminBadge>
      ),
    },
    {
      key: "websiteUrl",
      header: "Web Sitesi",
      accessor: (partner) => (
        <div>
          {partner.websiteUrl ? (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#0A5C3A] font-medium hover:underline"
            >
              <span>Ziyaret Et</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-xs text-slate-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Yayın Durumu",
      accessor: (partner) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(partner)}
          className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A] rounded-md transition-transform hover:scale-105"
        >
          {partner.isActive ? (
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
      accessor: (partner) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleOpenEditModal(partner)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0A5C3A] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingId(partner.id);
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
        title="Paydaş ve Destekçi Yönetimi"
        subtitle="N'apsak? ile iş birliği yapan, projeleri destekleyen tüm kurum ve kuruluşları yönetin."
        icon={Building2}
        action={
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yeni Paydaş Ekle
          </button>
        }
      />

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex-1">
          <AdminSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Kurum adı veya kategori ara..."
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto">
          <AdminFilter
            selectedValue={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { label: "Tüm Kategoriler", value: "all" },
              { label: "Paydaş", value: "Paydaş" },
              { label: "Destekçi", value: "Destekçi" },
              { label: "İş Birliği", value: "İş Birliği" },
              { label: "Kurumsal Destek", value: "Kurumsal Destek" },
              { label: "Eğitim", value: "Eğitim" },
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
      ) : filteredPartners.length === 0 ? (
        <AdminEmptyState
          icon={Building2}
          title="Paydaş bulunamadı"
          description="Arama kriterlerinize uyan paydaş kaydı bulunmamaktadır."
          action={
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-[#0A5C3A] text-white rounded-xl text-xs font-bold"
            >
              Paydaş Ekle
            </button>
          }
        />
      ) : (
        <AdminTable
          data={filteredPartners}
          columns={columns}
          keyExtractor={(p) => p.id}
        />
      )}

      {/* CREATE & EDIT MODAL */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPartner ? "Paydaşı Düzenle" : "Yeni Paydaş Ekle"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {formError}
            </div>
          )}

          {/* Name TR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kurum / Organizasyon Adı (TR) *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Gençlik ve Gelecek Vakfı"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kurum Adı (EN)
              </label>
              <input
                type="text"
                value={formData.nameEn || ""}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="e.g. Youth & Future Foundation"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Category TR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori (TR)
              </label>
              <select
                value={formData.category || "Paydaş"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              >
                <option value="Paydaş">Paydaş</option>
                <option value="Destekçi">Destekçi</option>
                <option value="İş Birliği">İş Birliği</option>
                <option value="Kurumsal Destek">Kurumsal Destek</option>
                <option value="Eğitim">Eğitim</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori (EN)
              </label>
              <input
                type="text"
                value={formData.categoryEn || ""}
                onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                placeholder="e.g. Partner / Supporter"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Logo Selection (with Media CMS Modal Picker) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kurum Logosu (Media CMS)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.logo || ""}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="/uploads/logo.png veya https://..."
                className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <ImageIcon className="w-4 h-4 text-[#0A5C3A]" />
                <span>Medya Seç</span>
              </button>
            </div>
            {formData.logo && (
              <div className="mt-2 w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-white flex items-center justify-center overflow-hidden">
                <img src={formData.logo} alt="Logo Önizleme" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Web Sitesi Bağlantısı (URL)
            </label>
            <input
              type="url"
              value={formData.websiteUrl || ""}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              placeholder="https://kurumadresi.org"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
            />
          </div>

          {/* Description TR & EN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kısa Açıklama (TR)
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kurum ve iş birliği kapsamı..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description (EN)
              </label>
              <textarea
                value={formData.descriptionEn || ""}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                placeholder="Institution & partnership overview..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActivePartner"
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-[#0A5C3A] focus:ring-[#0A5C3A]"
            />
            <label htmlFor="isActivePartner" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Yayınlansın (Aktif Paydaş)
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

      {/* MEDIA PICKER MODAL */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(mediaUrl) => {
          setFormData({ ...formData, logo: mediaUrl });
          setMediaPickerOpen(false);
        }}
        allowedType="image"
      />


      {/* CONFIRM DELETE DIALOG */}
      <AdminConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Paydaşı Sil"
        description="Bu paydaş kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="Vazgeç"
        isLoading={deleting}
      />
    </div>
  );
}
