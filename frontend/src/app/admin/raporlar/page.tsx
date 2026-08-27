"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ImageIcon,
  Star,
  FileCheck,
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
import { ReportsRepository, ReportItem } from "@/lib/reportsStore";

export default function AdminRaporlarPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<ReportItem>>({
    title: "",
    slug: "",
    category: "Gençlik & Katılım",
    summary: "",
    description: "",
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
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await ReportsRepository.fetchReportsFromDB("all");
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingReport(null);
    setFormData({
      title: "",
      slug: "",
      category: "Gençlik & Katılım",
      summary: "",
      description: "",
      coverImage: "",
      pdfUrl: "",
      publishDate: new Date().toLocaleDateString("tr-TR"),
      publicationStatus: "PUBLISHED",
      isFeatured: false,
      displayOrder: reports.length,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (report: ReportItem) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      slug: report.slug || "",
      category: report.category || "Gençlik & Katılım",
      summary: report.summary || "",
      description: report.description || "",
      coverImage: report.coverImage || "",
      pdfUrl: report.pdfUrl || "",
      publishDate: report.publishDate || "",
      publicationStatus: report.publicationStatus || "PUBLISHED",
      isFeatured: report.isFeatured || false,
      displayOrder: report.displayOrder || 0,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setFormError("Rapor başlığı zorunludur.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      if (editingReport) {
        const updated = await ReportsRepository.updateReport(editingReport.id, formData);
        setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await ReportsRepository.createReport(formData);
        setReports((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Rapor kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await ReportsRepository.deleteReport(deletingId);
      setReports((prev) => prev.filter((r) => r.id !== deletingId));
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      alert(err.message || "Rapor silinemedi.");
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

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || r.publicationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<ReportItem>[] = [
    {
      key: "coverImage",
      header: "Görsel",
      accessor: (report) =>
        report.coverImage ? (
          <img
            src={report.coverImage}
            alt={report.title}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
            <ImageIcon className="w-4 h-4" />
          </div>
        ),
    },
    {
      key: "title",
      header: "Başlık & Kategori",
      accessor: (report) => (
        <div className="space-y-0.5">
          <div className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
            {report.title}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            {report.category || "Genel"} &bull; {report.slug}
          </div>
        </div>
      ),
    },
    {
      key: "publicationStatus",
      header: "Yayın Durumu",
      accessor: (report) => (
        report.publicationStatus === "PUBLISHED" ? (
          <AdminBadge variant="published">Yayınlandı</AdminBadge>
        ) : report.publicationStatus === "DRAFT" ? (
          <AdminBadge variant="draft">Taslak</AdminBadge>
        ) : (
          <AdminBadge variant="passive">Arşivlendi</AdminBadge>
        )
      ),
    },
    {
      key: "pdfUrl",
      header: "PDF Bağlantısı",
      accessor: (report) =>
        report.pdfUrl ? (
          <a
            href={report.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>PDF Görüntüle</span>
          </a>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Eklenmedi</span>
        ),
    },
    {
      key: "isFeatured",
      header: "Öne Çıkan",
      accessor: (report) =>
        report.isFeatured ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Star className="w-3 h-3 fill-amber-500" /> Öne Çıkan
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-medium">-</span>
        ),
    },
    {
      key: "displayOrder",
      header: "Sıra",
      accessor: (report) => (
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
          {report.displayOrder}
        </span>
      ),
    },
    {
      key: "actions",
      header: "İşlemler",
      accessor: (report) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(report)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-all"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(report.id);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {report.slug && (
            <a
              href={"/raporlar"}
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
        title="Rapor Yönetimi"
        subtitle="Topluluk raporlarını oluşturun, düzenleyin ve PDF dosyalarını yönetin."
        icon={FileText}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Rapor Ekle</span>
          </button>
        }
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <AdminSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rapor başlığı veya kategori ara..."
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
      ) : filteredReports.length === 0 ? (
        <AdminEmptyState
          title="Rapor Bulunamadı"
          description="Aradığınız kriterlere uygun rapor bulunmuyor. Yeni bir rapor ekleyebilirsiniz."
        />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredReports}
          keyExtractor={(row) => row.id}
        />
      )}

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingReport ? "Raporu Düzenle" : "Yeni Rapor Ekle"}
        size="lg"
      >
        <form onSubmit={handleSaveReport} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Rapor Başlığı *
            </label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Örn: 2026 Gençlik Katılımı ve Üretim Kültürü Raporu"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                Kategori
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
                placeholder="Örn: Gençlik & Katılım"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Özet (Short Summary)
            </label>
            <textarea
              rows={2}
              value={formData.summary || ""}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Rapor özeti..."
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
                PDF Dosyası
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
                placeholder="Örn: 12 Şubat 2026"
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
              Öne Çıkarılan Rapor (Featured)
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
              {saving ? "Kaydediliyor..." : editingReport ? "Güncelle" : "Oluştur"}
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
        onConfirm={handleDeleteReport}
        title="Raporu Sil"
        description="Bu raporu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
