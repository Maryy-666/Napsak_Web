"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  FileCheck,
  BookOpen,
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
import { MagazinesRepository, MagazineItem } from "@/lib/magazinesStore";

export default function AdminDergilerPage() {
  const [magazines, setMagazines] = useState<MagazineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState<MagazineItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<MagazineItem>>({
    title: "",
    slug: "",
    issueNumber: "Sayı #1",
    description: "",
    pages: 36,
    coverImage: "",
    pdfUrl: "",
    publishDate: "",
    publicationStatus: "PUBLISHED",
    isFeatured: false,
    displayOrder: 0,
  });

  // Media Picker State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<"image" | "pdf">("image");

  // Confirm Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMagazines();
  }, []);

  const loadMagazines = async () => {
    setLoading(true);
    try {
      const data = await MagazinesRepository.fetchMagazinesFromDB("all");
      setMagazines(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingMagazine(null);
    setFormData({
      title: "",
      slug: "",
      issueNumber: "Sayı #" + (magazines.length + 1),
      description: "",
      pages: 36,
      coverImage: "",
      pdfUrl: "",
      publishDate: new Date().toLocaleDateString("tr-TR"),
      publicationStatus: "PUBLISHED",
      isFeatured: false,
      displayOrder: magazines.length,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (magazine: MagazineItem) => {
    setEditingMagazine(magazine);
    setFormData({
      title: magazine.title,
      slug: magazine.slug || "",
      issueNumber: magazine.issueNumber || "",
      description: magazine.description || "",
      pages: magazine.pages || 36,
      coverImage: magazine.coverImage || "",
      pdfUrl: magazine.pdfUrl || "",
      publishDate: magazine.publishDate || "",
      publicationStatus: magazine.publicationStatus || "PUBLISHED",
      isFeatured: magazine.isFeatured || false,
      displayOrder: magazine.displayOrder || 0,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveMagazine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setFormError("Dergi başlığı zorunludur.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      if (editingMagazine) {
        const updated = await MagazinesRepository.updateMagazine(editingMagazine.id, formData);
        setMagazines((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      } else {
        const created = await MagazinesRepository.createMagazine(formData);
        setMagazines((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Dergi kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMagazine = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await MagazinesRepository.deleteMagazine(deletingId);
      setMagazines((prev) => prev.filter((m) => m.id !== deletingId));
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      alert(err.message || "Dergi silinemedi.");
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  const handleOpenMediaPicker = (mode: "image" | "pdf") => {
    setMediaPickerMode(mode);
    setMediaPickerOpen(true);
  };

  const handleMediaSelected = (url: string) => {
    if (mediaPickerMode === "image") {
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } else {
      setFormData((prev) => ({ ...prev, pdfUrl: url }));
    }
  };

  const filteredMagazines = magazines.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.issueNumber && m.issueNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || m.publicationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<MagazineItem>[] = [
    {
      key: "coverImage",
      header: "Kapak",
      accessor: (magazine) =>
        magazine.coverImage ? (
          <img
            src={magazine.coverImage}
            alt={magazine.title}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
            <BookOpen className="w-4 h-4" />
          </div>
        ),
    },
    {
      key: "title",
      header: "Dergi Adı & Sayı",
      accessor: (magazine) => (
        <div className="space-y-0.5">
          <div className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
            {magazine.title}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            {magazine.issueNumber || "Sayı Belirtilmedi"} &bull; {magazine.slug}
          </div>
        </div>
      ),
    },
    {
      key: "publicationStatus",
      header: "Yayın Durumu",
      accessor: (magazine) => (
        magazine.publicationStatus === "PUBLISHED" ? (
          <AdminBadge variant="published">Yayınlandı</AdminBadge>
        ) : magazine.publicationStatus === "DRAFT" ? (
          <AdminBadge variant="draft">Taslak</AdminBadge>
        ) : (
          <AdminBadge variant="passive">Arşivlendi</AdminBadge>
        )
      ),
    },
    {
      key: "pages",
      header: "Sayfa Sayısı",
      accessor: (magazine) => (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {magazine.pages || 36} Sayfa
        </span>
      ),
    },
    {
      key: "pdfUrl",
      header: "PDF",
      accessor: (magazine) =>
        magazine.pdfUrl ? (
          <a
            href={magazine.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>PDF Oku</span>
          </a>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Eklenmedi</span>
        ),
    },
    {
      key: "displayOrder",
      header: "Sıra",
      accessor: (magazine) => (
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
          {magazine.displayOrder}
        </span>
      ),
    },
    {
      key: "actions",
      header: "İşlemler",
      accessor: (magazine) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(magazine)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-all"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(magazine.id);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {magazine.slug && (
            <a
              href={"/dergiler"}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-500/10 transition-all"
              title="Sitede Gör"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dergi Yönetimi"
        subtitle="Dernek dergi sayılarını oluşturun, düzenleyin, PDF ve kapak görsellerini yönetin."
        icon={BookOpen}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Dergi Sayısı Ekle</span>
          </button>
        }
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <AdminSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Dergi adı veya sayı no ara..."
          />
        </div>

        <AdminFilter
          options={[
            { label: "Tüm Durumlar", value: "all" },
            { label: "Yayınlananlar", value: "PUBLISHED" },
            { label: "Taslaklar", value: "DRAFT" },
            { label: "Arşivlenenler", value: "ARCHIVED" },
          ]}
          selectedValue={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {/* Content Table */}
      {loading ? (
        <AdminLoadingState />
      ) : filteredMagazines.length === 0 ? (
        <AdminEmptyState
          title="Dergi Bulunamadı"
          description="Aradığınız kriterlere uygun dergi sayısı bulunmuyor. Yeni bir dergi ekleyebilirsiniz."
        />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredMagazines}
          keyExtractor={(row) => row.id}
        />
      )}

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMagazine ? "Dergi Sayısını Düzenle" : "Yeni Dergi Sayısı Ekle"}
        size="lg"
      >
        <form onSubmit={handleSaveMagazine} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Dergi Adı / Başlığı *
            </label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Örn: Ne Yapsak? Dergi - Bahar 2026 Sayısı"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Slug (URL Adresi)
              </label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
                placeholder="Boş bırakılırsa otomatik üretilir"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sayı Numarası / Etiketi
              </label>
              <input
                type="text"
                value={formData.issueNumber || ""}
                onChange={(e) => setFormData({ ...formData, issueNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
                placeholder="Örn: Sayı #04"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sayfa Sayısı
              </label>
              <input
                type="number"
                value={formData.pages || 36}
                onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Açıklama / Editörden Not
            </label>
            <textarea
              rows={2}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Dergi sayısı hakkında kısa bilgi..."
            />
          </div>

          {/* Media Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kapak Görseli
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.coverImage || ""}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
                  placeholder="Görsel URL veya Media'dan seç"
                />
                <button
                  type="button"
                  onClick={() => handleOpenMediaPicker("image")}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all shrink-0"
                >
                  Seç
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PDF Dijital Dergi Dosyası
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.pdfUrl || ""}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
                  placeholder="PDF URL veya Media'dan seç"
                />
                <button
                  type="button"
                  onClick={() => handleOpenMediaPicker("pdf")}
                  className="px-3 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-all shrink-0"
                >
                  PDF Seç
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Yayın Durumu
              </label>
              <select
                value={formData.publicationStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publicationStatus: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
              >
                <option value="PUBLISHED">Yayınlandı (Public)</option>
                <option value="DRAFT">Taslak (Draft)</option>
                <option value="ARCHIVED">Arşivlendi (Archived)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Yayın Tarihi
              </label>
              <input
                type="text"
                value={formData.publishDate || ""}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
                placeholder="Örn: Bahar 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sıralama (Order)
              </label>
              <input
                type="number"
                value={formData.displayOrder || 0}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured || false}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-[#0A5C3A] focus:ring-[#0A5C3A]"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Öne Çıkarılan Sayı (Featured)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5F6773] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A5C3A] text-white hover:bg-[#084A2F] disabled:opacity-50 transition-all"
            >
              {saving ? "Kaydediliyor..." : editingMagazine ? "Güncelle" : "Oluştur"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelected}
        allowedType={mediaPickerMode}
      />

      {/* Confirm Delete Dialog */}
      <AdminConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteMagazine}
        title="Dergi Sayısını Sil"
        description="Bu dergi sayısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
