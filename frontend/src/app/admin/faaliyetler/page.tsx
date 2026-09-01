"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Globe,
  Archive,
  FileText,
  Pin,
  Star,
  Users,
  Upload,
  Image as ImageIcon,
  Loader2,
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
  FilterOption,
} from "../../../components/admin/ui";
import {
  FaaliyetItem,
  FaaliyetlerRepository,
  subscribeFaaliyetlerChanges,
} from "../../../lib/faaliyetlerStore";
import { MediaPickerModal } from "../../../components/admin/media/MediaPickerModal";
import { MediaRepository } from "../../../lib/mediaStore";

export default function AdminFaaliyetlerPage() {
  const { isDark } = useAdminTheme();

  // State Yönetimi
  const [faaliyetler, setFaaliyetler] = useState<FaaliyetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Arama & Filtreleme
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal ve Dialog State'leri
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaaliyetItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FaaliyetItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sanat & Atölye");
  const [team, setTeam] = useState("N'apsak Ekibi");
  const [status, setStatus] = useState("Devam Eden");
  const [publicationStatus, setPublicationStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(false);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [participantCount, setParticipantCount] = useState<number>(30);
  const [image, setImage] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError("");
    try {
      const uploaded = await MediaRepository.uploadMedia(file, "activities");
      setImage(uploaded.url);
      setSuccessMessage("Görsel ana makineden yüklendi.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Görsel yükleme hatası:", err);
      setUploadError(err.message || "Görsel yüklenirken hata oluştu.");
    } finally {
      setUploadingImage(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setApiError("");
      const dbFaaliyetler = await FaaliyetlerRepository.fetchFaaliyetlerFromDB();
      setFaaliyetler(dbFaaliyetler);
    } catch (err: any) {
      console.error("Faaliyetler yüklenirken hata:", err);
      setApiError("Faaliyetler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeFaaliyetlerChanges(() => {
      setFaaliyetler(FaaliyetlerRepository.getAllFaaliyetler());
    });
    return unsubscribe;
  }, []);

  const filteredFaaliyetler = useMemo(() => {
    return faaliyetler.filter((item) => {
      const pub = (item as any).publicationStatus || "PUBLISHED";
      if (statusFilter !== "Tümü") {
        if (statusFilter === "Yayında" && pub !== "PUBLISHED") return false;
        if (statusFilter === "Taslak" && pub !== "DRAFT") return false;
        if (statusFilter === "Arşiv" && pub !== "ARCHIVED") return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.team.toLowerCase().includes(q)
      );
    });
  }, [faaliyetler, statusFilter, searchQuery]);

  const totalItems = filteredFaaliyetler.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedFaaliyetler = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFaaliyetler.slice(start, start + itemsPerPage);
  }, [filteredFaaliyetler, currentPage, itemsPerPage]);

  const resetForm = () => {
    setTitle("");
    setCategory("Sanat & Atölye");
    setTeam("N'apsak Ekibi");
    setStatus("Devam Eden");
    setPublicationStatus("PUBLISHED");
    setIsFeatured(false);
    setDate("");
    setLocation("");
    setSummary("");
    setParticipantCount(30);
    setImage("");
    setEditingItem(null);
    setIsFormModalOpen(false);
  };

  const handleOpenNewModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: FaaliyetItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setTeam(item.team);
    setStatus(item.status);
    setPublicationStatus((item as any).publicationStatus || "PUBLISHED");
    setIsFeatured(Boolean((item as any).isFeatured));
    setDate(item.date || "");
    setLocation(item.location || "");
    setSummary(item.summary || "");
    setParticipantCount(item.participantCount || 0);
    setImage(item.image || "");
    setIsFormModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      setApiError("Lütfen başlık ve özet alanlarını doldurunuz.");
      return;
    }

    try {
      setApiError("");
      const payload: any = {
        title: title.trim(),
        category: category.trim(),
        team: team.trim(),
        status: status as any,
        publicationStatus,
        isFeatured,
        date: date.trim(),
        location: location.trim(),
        summary: summary.trim(),
        participantCount,
        image: image.trim() || undefined,
        type: "polaroid",
        rotation: "-rotate-1",
        pinColor: "text-[#0A5C3A]",
        noteBg: "bg-white",
        borderColor: "border-[#DDE7E1]",
        badgeBg: "bg-[#0A5C3A]",
        badgeText: "text-white",
      };

      if (editingItem) {
        await FaaliyetlerRepository.updateFaaliyet(editingItem.id, payload);
        setSuccessMessage("Faaliyet başarıyla güncellendi.");
      } else {
        await FaaliyetlerRepository.addFaaliyet(payload);
        setSuccessMessage("Yeni faaliyet veritabanına eklendi.");
      }

      resetForm();
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Faaliyet kaydedilirken hata:", err);
      setApiError("Faaliyet kaydedilemedi.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setApiError("");
      await FaaliyetlerRepository.deleteFaaliyet(itemToDelete.id);
      setSuccessMessage("Faaliyet başarıyla silindi.");
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Faaliyet silinirken hata:", err);
      setApiError("Faaliyet silinemedi.");
    }
  };

  const columns: Column<FaaliyetItem>[] = [
    {
      key: "title",
      header: "FAALİYET BİLGİSİ",
      accessor: (item: FaaliyetItem) => {
        const pub = (item as any).publicationStatus || "PUBLISHED";
        return (
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm text-[#0F1115] dark:text-slate-100">{item.title}</span>
            <div className="flex items-center gap-2 text-xs text-[#5F6773] dark:text-slate-400 mt-0.5">
              <span>{item.category}</span>
              <span>•</span>
              <span>{item.team}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "YAYIN DURUMU",
      accessor: (item: FaaliyetItem) => {
        const pub = (item as any).publicationStatus || "PUBLISHED";
        return (
          <div className="flex flex-col text-left gap-1">
            {pub === "PUBLISHED" ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5 w-fit">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>PUBLISHED (Yayında)</span>
              </span>
            ) : pub === "DRAFT" ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5 w-fit">
                <FileText className="w-3 h-3 text-amber-600" />
                <span>DRAFT (Taslak)</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center gap-1.5 w-fit">
                <Archive className="w-3 h-3 text-slate-500" />
                <span>ARCHIVED (Arşiv)</span>
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "date",
      header: "TARİH & KATILIM",
      accessor: (item: FaaliyetItem) => (
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.date || "Tarih Yok"}</span>
          <span className="text-[11px] text-[#0A5C3A] font-medium">
            {item.participantCount || 0} Katılımcı
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "İŞLEMLER",
      accessor: (item: FaaliyetItem) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEditModal(item)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Faaliyeti Düzenle"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setItemToDelete(item);
              setIsDeleteDialogOpen(true);
            }}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
            title="Faaliyeti Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const statusFilterOptions: FilterOption[] = [
    { label: "Tümü", value: "Tümü" },
    { label: "Yayında", value: "Yayında" },
    { label: "Taslak", value: "Taslak" },
    { label: "Arşiv", value: "Arşiv" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Faaliyet Yönetimi (CMS)"
        subtitle="N'apsak? Gençlik Topluluğu gerçekleştirdiği çalışma ve faaliyetleri yönetin."
        icon={Activity}
        action={
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white font-bold text-sm hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Faaliyet Ekle</span>
          </button>
        }
      />

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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <AdminSearch
          placeholder="Faaliyet adı, kategori veya ekip ara..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <AdminFilter
          label="Yayın Durumu"
          options={statusFilterOptions}
          selectedValue={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <div className="bg-white dark:bg-[#0F1623] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Faaliyetler yükleniyor...</div>
        ) : filteredFaaliyetler.length === 0 ? (
          <AdminEmptyState
            title="Faaliyet Bulunamadı"
            description="Kriterlere uygun faaliyet kaydı bulunmamaktadır."
          />
        ) : (
          <>
            <AdminTable
              data={paginatedFaaliyetler}
              columns={columns}
              keyExtractor={(item) => item.id}
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

      {/* FORM MODALI */}
      <AdminModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingItem ? "Faaliyeti Düzenle" : "Yeni Faaliyet Ekle"}
        subtitle="Faaliyet detaylarını doldurun ve yayın durumunu seçin."
      >
        <form onSubmit={handleSave} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Faaliyet Başlığı <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Kil Atölyesi: Çamurdan Hayallere"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Örn: Sanat & Atölye"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                İlişkili Ekip
              </label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Örn: Sanat Ekibi"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tarih
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="15 Ekim 2025"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Konum
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Kültür Atölyesi"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Katılımcı Sayısı
              </label>
              <input
                type="number"
                value={participantCount}
                onChange={(e) => setParticipantCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Özet Açıklama <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Faaliyet hakkında özet bilgi..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Yayın Durumu (CMS Status)
              </label>
              <select
                value={publicationStatus}
                onChange={(e) => setPublicationStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-xs font-bold"
              >
                <option value="PUBLISHED">PUBLISHED (Yayında)</option>
                <option value="DRAFT">DRAFT (Taslak)</option>
                <option value="ARCHIVED">ARCHIVED (Arşiv)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Görsel Yükle / URL
                </label>
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="text-xs text-[#0A5C3A] font-bold hover:underline flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Kütüphaneden Seç</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/... veya Görsel URL"
                  className="flex-1 min-w-0 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
                />
                <label className="px-3 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#084A2F] transition-all shrink-0">
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Dosya Seç</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleDirectFileUpload}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              {uploadError && (
                <p className="text-xs text-rose-500 font-semibold mt-1">{uploadError}</p>
              )}
              {image && (
                <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <img src={image} alt="Görsel önizleme" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F]"
            >
              Kaydet
            </button>
          </div>
        </form>
      </AdminModal>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        targetFolder="activities"
        allowedType="image"
        onSelect={(url) => setImage(url)}
      />

      <AdminConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Faaliyeti Sil"
        description={`"${itemToDelete?.title}" faaliyeti veritabanından silinecektir. Onaylıyor musunuz?`}
        confirmText="Evet, Sil"
        variant="danger"
      />
    </div>
  );
}
