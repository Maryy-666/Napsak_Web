"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  Edit2,
  Copy,
  Check,
  Eye,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { AdminPageHeader } from "../../../components/admin/ui/AdminPageHeader";
import { AdminModal } from "../../../components/admin/ui/AdminModal";
import { AdminConfirmDialog } from "../../../components/admin/ui/AdminConfirmDialog";
import { MediaRepository, MediaItem } from "../../../lib/mediaStore";

export default function AdminMedyaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState("general");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Edit Modal State
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [editFolder, setEditFolder] = useState("general");
  const [savingEdit, setSavingEdit] = useState(false);

  // Preview Modal State
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  // Delete Confirm State
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [usageError, setUsageError] = useState<{ message: string; details: string[] } | null>(null);

  // Copy Feedback State
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    loadMedia();
  }, [searchQuery, selectedFolder, selectedType, page]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await MediaRepository.fetchMediaFromDB({
        page,
        limit: 24,
        q: searchQuery,
        folder: selectedFolder === "all" ? undefined : selectedFolder,
        type: selectedType === "all" ? undefined : selectedType,
      });
      setMediaList(res.media);
      setTotalPages(res.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      await MediaRepository.uploadMedia(file, uploadFolder);
      await loadMedia();
    } catch (err: any) {
      setUploadError(err.message || "Dosya yüklenirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleStartEdit = (media: MediaItem) => {
    setEditingMedia(media);
    setEditTitle(media.title || "");
    setEditAltText(media.altText || "");
    setEditFolder(media.folder || "general");
  };

  const handleSaveEdit = async () => {
    if (!editingMedia) return;
    setSavingEdit(true);
    try {
      const updated = await MediaRepository.updateMedia(editingMedia.id, {
        title: editTitle,
        altText: editAltText,
        folder: editFolder,
      });
      setMediaList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setEditingMedia(null);
    } catch (err: any) {
      alert(err.message || "Güncelleme sırasında hata oluştu.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCopyUrl = (media: MediaItem) => {
    navigator.clipboard.writeText(media.url);
    setCopiedId(media.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMedia = async () => {
    if (!deletingMedia) return;
    setDeleting(true);
    setUsageError(null);
    try {
      await MediaRepository.deleteMedia(deletingMedia.id);
      setMediaList((prev) => prev.filter((m) => m.id !== deletingMedia.id));
      setDeletingMedia(null);
    } catch (err: any) {
      if (err.usageDetails) {
        setUsageError({
          message: err.message,
          details: err.usageDetails,
        });
      } else {
        alert(err.message || "Silme işlemi başarısız.");
        setDeletingMedia(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Medya Kütüphanesi"
        subtitle="Web sitesindeki görselleri, afişleri ve medya dosyalarını yönetin."
        icon={ImageIcon}
        action={
          <div className="flex items-center gap-2">
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141C2E] font-medium outline-none"
            >
              <option value="general">Genel Klasörü</option>
              <option value="avatars">Avatarlar</option>
              <option value="teams">Ekipler</option>
              <option value="events">Etkinlikler</option>
              <option value="activities">Faaliyetler</option>
            </select>

            <label className="h-10 px-4 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-[#084A2F] transition-all shadow-md shadow-[#0A5C3A]/20">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Yeni Medya Yükle</span>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        }
      />

      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0F172A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Başlık veya dosya adı ile ara..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] focus:outline-none focus:border-[#0A5C3A]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtre:</span>
          </div>

          <select
            value={selectedFolder}
            onChange={(e) => {
              setSelectedFolder(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
          >
            <option value="all">Tüm Klasörler</option>
            <option value="general">Genel</option>
            <option value="avatars">Avatarlar</option>
            <option value="teams">Ekipler</option>
            <option value="events">Etkinlikler</option>
            <option value="activities">Faaliyetler</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
          >
            <option value="all">Tüm Tipler</option>
            <option value="image">Görseller</option>
            <option value="pdf">PDF Belgeleri</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs font-semibold text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#0A5C3A]" />
          <span>Medya kütüphanesi yükleniyor...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-16 text-center text-xs font-semibold text-slate-400 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800">
          Medya kütüphanesinde gösterilecek dosya bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((item) => {
            const isImage = item.mimeType.startsWith("image/");

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Thumbnail Area */}
                <div className="relative aspect-square w-full bg-slate-100 dark:bg-[#141C2E] overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.title || item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center p-4 text-center">
                      <FileText className="w-10 h-10 text-rose-500 mb-2" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        PDF Belgesi
                      </span>
                    </div>
                  )}

                  {/* Overlay Action Buttons */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewMedia(item)}
                      title="Büyüt / Önizle"
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item)}
                      title="URL Kopyala"
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      title="Düzenle"
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingMedia(item)}
                      title="Sil"
                      className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-3 text-left space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {item.title || item.originalName}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span className="uppercase tracking-wider font-semibold text-[#0A5C3A]">{item.folder}</span>
                    <span>{formatFileSize(item.size)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingMedia && (
        <AdminModal
          isOpen={!!editingMedia}
          onClose={() => setEditingMedia(null)}
          title="Medya Detaylarını Düzenle"
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A5C3A] text-white hover:bg-[#084A2F]"
              >
                {savingEdit ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Medya Başlığı</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">SEO Alt Metni (Alt Text)</label>
              <input
                type="text"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
                placeholder="Örn: Ne Yapsak Etkinlik Afişi"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Klasör</label>
              <select
                value={editFolder}
                onChange={(e) => setEditFolder(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E]"
              >
                <option value="general">Genel</option>
                <option value="avatars">Avatarlar</option>
                <option value="teams">Ekipler</option>
                <option value="events">Etkinlikler</option>
                <option value="activities">Faaliyetler</option>
              </select>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Preview Modal */}
      {previewMedia && (
        <AdminModal
          isOpen={!!previewMedia}
          onClose={() => setPreviewMedia(null)}
          title={previewMedia.title || previewMedia.originalName}
          size="lg"
        >
          <div className="flex flex-col items-center justify-center p-2 space-y-4">
            {previewMedia.mimeType.startsWith("image/") ? (
              <img
                src={previewMedia.url}
                alt={previewMedia.altText || previewMedia.originalName}
                className="max-h-[60vh] object-contain rounded-xl shadow-md"
              />
            ) : (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-rose-500 mx-auto mb-3" />
                <a
                  href={previewMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold inline-block"
                >
                  PDF Belgesini Yeni Sekmede Aç
                </a>
              </div>
            )}

            <div className="w-full text-xs space-y-1 p-4 rounded-xl bg-slate-50 dark:bg-[#141C2E]">
              <p><strong>URL:</strong> <code className="text-[11px] text-[#0A5C3A]">{previewMedia.url}</code></p>
              <p><strong>Dosya Adı:</strong> {previewMedia.originalName}</p>
              <p><strong>Boyut:</strong> {formatFileSize(previewMedia.size)}</p>
              {previewMedia.width && previewMedia.height && (
                <p><strong>Boyutlar:</strong> {previewMedia.width} x {previewMedia.height} px</p>
              )}
            </div>
          </div>
        </AdminModal>
      )}

      {/* Confirm Delete Dialog */}
      {deletingMedia && (
        <AdminConfirmDialog
          isOpen={!!deletingMedia}
          onClose={() => {
            setDeletingMedia(null);
            setUsageError(null);
          }}
          onConfirm={handleDeleteMedia}
          title="Medyayı Sil"
          description={
            usageError
              ? `${usageError.message} (${usageError.details.join("; ")})`
              : `"${deletingMedia.title || deletingMedia.originalName}" medyasını veritabanından ve depolamadan silmek istediğinize emin misiniz?`
          }
          confirmText={usageError ? "Anladım" : "Medyayı Sil"}
          variant="danger"
          isLoading={deleting}
        />
      )}
    </div>
  );
}
