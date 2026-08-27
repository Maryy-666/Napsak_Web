"use client";

import React, { useState, useEffect } from "react";
import { Search, Upload, Check, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { AdminModal } from "../ui/AdminModal";
import { MediaRepository, MediaItem } from "../../../lib/mediaStore";

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaUrl: string, mediaItem: MediaItem) => void;
  targetFolder?: string;
  allowedType?: "all" | "image" | "pdf";
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  targetFolder = "all",
  allowedType = "all",
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(targetFolder);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, searchQuery, selectedFolder]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await MediaRepository.fetchMediaFromDB({
        page: 1,
        limit: 50,
        q: searchQuery,
        folder: selectedFolder === "all" ? undefined : selectedFolder,
      });
      setMediaList(res.media);
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
      const uploaded = await MediaRepository.uploadMedia(
        file,
        selectedFolder === "all" ? "general" : selectedFolder
      );
      setMediaList((prev) => [uploaded, ...prev]);
      setSelectedMedia(uploaded);
    } catch (err: any) {
      setUploadError(err.message || "Yükleme sırasında hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedMedia) {
      onSelect(selectedMedia.url, selectedMedia);
      onClose();
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Medya Kütüphanesinden Seç"
      size="xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleConfirmSelect}
            disabled={!selectedMedia}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A5C3A] text-white hover:bg-[#084A2F] disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>
              {allowedType === "pdf"
                ? "Seçilen PDF'i Kullan"
                : allowedType === "image"
                ? "Seçilen Görseli Kullan"
                : "Seçilen Medyayı Kullan"}
            </span>
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Görsel veya dosya adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] text-xs font-medium focus:outline-none focus:border-[#0A5C3A]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
            >
              <option value="all">Tüm Klasörler</option>
              <option value="general">Genel</option>
              <option value="avatars">Avatarlar</option>
              <option value="teams">Ekipler</option>
              <option value="events">Etkinlikler</option>
              <option value="activities">Faaliyetler</option>
            </select>

            <label className="h-9 px-3 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#084A2F] transition-all">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>Yükle</span>
              <input
                type="file"
                className="hidden"
                accept={allowedType === "pdf" ? "application/pdf" : allowedType === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "image/jpeg,image/png,image/webp,image/gif,application/pdf"}
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {uploadError}
          </div>
        )}

        {/* Media Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#0A5C3A]" />
            <span>Medya kütüphanesi yükleniyor...</span>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-400">
            Gösterilecek medya bulunamadı. Yeni bir dosya yükleyebilirsiniz.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto p-1">
            {mediaList
              .filter((item) => {
                if (allowedType === "image") return item.mimeType.startsWith("image/");
                if (allowedType === "pdf") return item.mimeType === "application/pdf";
                return true;
              })
              .map((item) => {
              const isSelected = selectedMedia?.id === item.id;
              const isImage = item.mimeType.startsWith("image/");

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all aspect-square flex flex-col items-center justify-center ${
                    isSelected
                      ? "border-[#0A5C3A] ring-4 ring-[#0A5C3A]/20 bg-[#0A5C3A]/5"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  {isImage ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.title || item.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center p-3 text-center">
                      <FileText className="w-8 h-8 text-rose-500 mb-1" />
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 line-clamp-1">
                        {item.originalName}
                      </span>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0A5C3A] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminModal>
  );
}
