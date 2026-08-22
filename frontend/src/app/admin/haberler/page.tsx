"use client";

import React, { useState, useEffect } from "react";
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ImageIcon,
  Star,
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
import { NewsRepository, NewsItem } from "@/lib/newsStore";

export default function AdminHaberlerPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: "",
    slug: "",
    category: "Duyuru",
    summary: "",
    content: "",
    coverImage: "",
    publishDate: "",
    readTime: "3 dk",
    publicationStatus: "PUBLISHED",
    isFeatured: false,
    displayOrder: 0,
    quoteText: "",
    quoteAuthor: "",
    quoteTitle: "",
  });

  // Media Picker State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Confirm Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await NewsRepository.fetchNewsFromDB("all");
      setNewsList(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingNews(null);
    setFormData({
      title: "",
      slug: "",
      category: "Duyuru",
      summary: "",
      content: "",
      coverImage: "",
      publishDate: new Date().toLocaleDateString("tr-TR"),
      readTime: "3 dk",
      publicationStatus: "PUBLISHED",
      isFeatured: false,
      displayOrder: newsList.length,
      quoteText: "",
      quoteAuthor: "",
      quoteTitle: "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (news: NewsItem) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      slug: news.slug || "",
      category: news.category || "Duyuru",
      summary: news.summary || "",
      content: news.content || "",
      coverImage: news.coverImage || "",
      publishDate: news.publishDate || "",
      readTime: news.readTime || "3 dk",
      publicationStatus: news.publicationStatus || "PUBLISHED",
      isFeatured: news.isFeatured || false,
      displayOrder: news.displayOrder || 0,
      quoteText: news.quoteText || "",
      quoteAuthor: news.quoteAuthor || "",
      quoteTitle: news.quoteTitle || "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setFormError("Haber başlığı zorunludur.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      if (editingNews) {
        const updated = await NewsRepository.updateNews(editingNews.id, formData);
        setNewsList((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      } else {
        const created = await NewsRepository.createNews(formData);
        setNewsList((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Haber kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNews = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await NewsRepository.deleteNews(deletingId);
      setNewsList((prev) => prev.filter((n) => n.id !== deletingId));
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      alert(err.message || "Haber silinemedi.");
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  const filteredNews = newsList.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.category && n.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || n.publicationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<NewsItem>[] = [
    {
      key: "coverImage",
      header: "Kapak",
      accessor: (news) =>
        news.coverImage ? (
          <img
            src={news.coverImage}
            alt={news.title}
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
      header: "Haber Başlığı & Kategori",
      accessor: (news) => (
        <div className="space-y-0.5">
          <div className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
            {news.title}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            {news.category || "Duyuru"} &bull; {news.slug}
          </div>
        </div>
      ),
    },
    {
      key: "publicationStatus",
      header: "Yayın Durumu",
      accessor: (news) => (
        news.publicationStatus === "PUBLISHED" ? (
          <AdminBadge variant="published">Yayınlandı</AdminBadge>
        ) : news.publicationStatus === "DRAFT" ? (
          <AdminBadge variant="draft">Taslak</AdminBadge>
        ) : (
          <AdminBadge variant="passive">Arşivlendi</AdminBadge>
        )
      ),
    },
    {
      key: "isFeatured",
      header: "Öne Çıkan",
      accessor: (news) =>
        news.isFeatured ? (
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
      accessor: (news) => (
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
          {news.displayOrder}
        </span>
      ),
    },
    {
      key: "actions",
      header: "İşlemler",
      accessor: (news) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(news)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-all"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(news.id);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {news.slug && (
            <a
              href={`/haberler/${news.slug}`}
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
        title="Haber & Duyuru Yönetimi"
        subtitle="Topluluk haberlerini, basın duyurularını ve içeriklerini oluşturun ve yayınlayın."
        icon={Newspaper}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Haber Ekle</span>
          </button>
        }
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <AdminSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Haber başlığı veya kategori ara..."
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
      ) : filteredNews.length === 0 ? (
        <AdminEmptyState
          title="Haber Bulunamadı"
          description="Aradığınız kriterlere uygun haber bulunmuyor. Yeni bir haber ekleyebilirsiniz."
        />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredNews}
          keyExtractor={(row) => row.id}
        />
      )}

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNews ? "Haberi Düzenle" : "Yeni Haber Ekle"}
        size="lg"
      >
        <form onSubmit={handleSaveNews} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Haber Başlığı *
            </label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Örn: Kil Atölyesi: Çamurdan Hayallere"
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
                placeholder="Örn: Sanat & Atölye"
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
              placeholder="Haberin kısa özeti..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detaylı Haber İçeriği (Markdown / Metin)
            </label>
            <textarea
              rows={5}
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Haber içeriği metni..."
            />
          </div>

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
                onClick={() => setMediaPickerOpen(true)}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold hover:bg-slate-300 transition-all shrink-0"
              >
                Seç
              </button>
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
                placeholder="Örn: 15 Ekim 2025"
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
              id="isFeaturedNews"
              checked={formData.isFeatured || false}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-[#0A5C3A] focus:ring-[#0A5C3A]"
            />
            <label htmlFor="isFeaturedNews" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Öne Çıkarılan Haber (Featured)
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
              {saving ? "Kaydediliyor..." : editingNews ? "Güncelle" : "Oluştur"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
        allowedType="image"
      />

      {/* Confirm Delete */}
      <AdminConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteNews}
        title="Haberi Sil"
        description="Bu haberi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
