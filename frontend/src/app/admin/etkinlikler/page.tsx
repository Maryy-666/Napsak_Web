"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { z } from "zod";
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  Eye,
  Star,
  Globe,
  Archive,
  FileText,
  Clock,
  MapPin,
  Sparkles,
  Lock,
  Layers,
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
  AdminBadge,
  AdminEmptyState,
  FilterOption,
} from "../../../components/admin/ui";
import { EventsRepository, EventItem, EventApplication } from "../../../lib/eventsStore";

// ==========================================
// 1. FORM DOĞRULAMA (ZOD SCHEMA)
// ==========================================
const eventFormSchema = z.object({
  title: z.string().min(3, "Etkinlik başlığı en az 3 karakter olmalıdır."),
  slug: z.string().min(2, "Slug en az 2 karakter olmalıdır."),
  shortDescription: z.string().min(5, "Kısa açıklama en az 5 karakter olmalıdır."),
  description: z.string().optional(),
  category: z.string().min(2, "Kategori seçimi zorunludur."),
  location: z.string().min(2, "Konum bilgisi zorunludur."),
  startDate: z.string().min(5, "Başlangıç tarihi zorunludur."),
  endDate: z.string().optional(),
  capacity: z.number().min(1, "Kontenjan en az 1 olmalıdır."),
  publicationStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean(),
  registrationEnabled: z.boolean(),
  image: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

export default function AdminEtkinliklerPage() {
  const { isDark } = useAdminTheme();

  // State Yönetimi
  const [events, setEvents] = useState<EventItem[]>([]);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Arama, Filtreleme ve Sayfalama
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [categoryFilter, setCategoryFilter] = useState("Tümü");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal ve Dialog State'leri
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [selectedEventForApps, setSelectedEventForApps] = useState<EventItem | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "programlar",
    location: "Online / Google Meet",
    startDate: new Date().toISOString().substring(0, 10),
    endDate: "",
    capacity: 100,
    publicationStatus: "PUBLISHED",
    isFeatured: false,
    registrationEnabled: true,
    image: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Veri Yükleme
  const loadData = async () => {
    try {
      setLoading(true);
      setApiError("");
      const dbEvents = await EventsRepository.fetchEventsFromDB();
      const dbApps = await EventsRepository.fetchApplicationsFromDB();

      setEvents(dbEvents);
      setApplications(dbApps);
    } catch (err: any) {
      console.error("Etkinlikler yüklenirken hata:", err);
      setApiError("Veriler veritabanından alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtreleme Mantığı
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Yayın Durumu Filtresi
      if (statusFilter !== "Tümü") {
        if (statusFilter === "Yayında" && evt.publicationStatus !== "PUBLISHED") return false;
        if (statusFilter === "Taslak" && evt.publicationStatus !== "DRAFT") return false;
        if (statusFilter === "Arşiv" && evt.publicationStatus !== "ARCHIVED") return false;
      }

      // Kategori Filtresi
      if (categoryFilter !== "Tümü") {
        if (evt.category !== categoryFilter && evt.categoryLabel !== categoryFilter) {
          return false;
        }
      }

      // Arama Filtresi
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q) ||
        (evt.slug && evt.slug.toLowerCase().includes(q))
      );
    });
  }, [events, statusFilter, categoryFilter, searchQuery]);

  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  // Automatic Slug Generator
  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || generatedSlug,
    }));
  };

  // Yeni Etkinlik Ekleme Modalı Açma
  const handleOpenNewModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      description: "",
      category: "programlar",
      location: "Online / Google Meet",
      startDate: new Date().toISOString().substring(0, 10),
      endDate: "",
      capacity: 100,
      publicationStatus: "PUBLISHED",
      isFeatured: false,
      registrationEnabled: true,
      image: "/images/news-ani-cover.jpg",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Düzenleme Modalı Açma
  const handleOpenEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      slug: (evt as any).slug || evt.id,
      shortDescription: (evt as any).shortDescription || evt.description || "",
      description: evt.description || "",
      category: evt.category || "programlar",
      location: evt.location || "",
      startDate: (evt as any).startDate
        ? new Date((evt as any).startDate).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      endDate: (evt as any).endDate
        ? new Date((evt as any).endDate).toISOString().substring(0, 10)
        : "",
      capacity: (evt as any).capacity || 100,
      publicationStatus: (evt as any).publicationStatus || (evt.status === "taslak" ? "DRAFT" : "PUBLISHED"),
      isFeatured: Boolean((evt as any).isFeatured),
      registrationEnabled: (evt as any).registrationEnabled !== undefined ? Boolean((evt as any).registrationEnabled) : true,
      image: evt.coverImage || "",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Yayın Durumu Değiştirme (DRAFT <-> PUBLISHED <-> ARCHIVED)
  const handleTogglePublicationStatus = async (evt: EventItem) => {
    try {
      const current = (evt as any).publicationStatus || "PUBLISHED";
      const nextStatus = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

      await EventsRepository.updateEvent(evt.id, {
        publicationStatus: nextStatus,
      } as any);

      setSuccessMessage(`Etkinlik durumu "${nextStatus}" olarak güncellendi.`);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Yayın durumu değiştirilirken hata:", err);
      setApiError("Etkinlik yayın durumu güncellenemedi.");
    }
  };

  // Öne Çıkar Değiştirme
  const handleToggleFeatured = async (evt: EventItem) => {
    try {
      const nextVal = !(evt as any).isFeatured;
      await EventsRepository.updateEvent(evt.id, {
        isFeatured: nextVal,
      } as any);

      setSuccessMessage(`Etkinlik öne çıkarma durumu güncellendi.`);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Öne çıkarma değiştirilirken hata:", err);
      setApiError("Öne çıkarma güncellenemedi.");
    }
  };

  // Form Gönderme
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setApiError("");

    const result = eventFormSchema.safeParse(formData);
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
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description?.trim() || formData.shortDescription.trim(),
        content: formData.description?.trim() || formData.shortDescription.trim(),
        category: formData.category,
        location: formData.location.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        capacity: formData.capacity,
        publicationStatus: formData.publicationStatus,
        isFeatured: formData.isFeatured,
        registrationEnabled: formData.registrationEnabled,
        image: formData.image || null,
        coverImage: formData.image || null,
      };

      if (editingEvent) {
        // Güncelleme
        await EventsRepository.updateEvent(editingEvent.id, payload as any);
        setSuccessMessage("Etkinlik veritabanında başarıyla güncellendi.");
      } else {
        // Yeni Ekleme
        await EventsRepository.addEvent(payload as any);
        setSuccessMessage("Yeni etkinlik veritabanına başarıyla eklendi.");
      }

      setIsFormModalOpen(false);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Etkinlik kaydedilirken hata:", err);
      setApiError(err?.message || "Etkinlik kaydedilemedi.");
    }
  };

  // Güvenli Silme İşlemi
  const handleOpenDeleteDialog = (evt: EventItem) => {
    setEventToDelete(evt);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      setApiError("");
      const targetApps = applications.filter((app) => app.eventId === eventToDelete.id);

      await EventsRepository.deleteEvent(eventToDelete.id);

      if (targetApps.length > 0) {
        setSuccessMessage(`Etkinliğe ait ${targetApps.length} adet geçmiş başvuru bulunduğu için etkinlik ARCHIVED (Arşiv) durumuna alındı, başvurular korundu.`);
      } else {
        setSuccessMessage("Etkinlik veritabanından başarıyla silindi.");
      }

      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Etkinlik silinirken hata:", err);
      setApiError("Etkinlik silinemedi.");
    }
  };

  // Tablo Sütunları
  const columns: Column<EventItem>[] = [
    {
      key: "title",
      header: "ETKİNLİK BİLGİSİ",
      accessor: (evt: EventItem) => {
        const pubStatus = (evt as any).publicationStatus || (evt.status === "taslak" ? "DRAFT" : "PUBLISHED");
        const isF = Boolean((evt as any).isFeatured);

        return (
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800">
              {evt.coverImage ? (
                <Image src={evt.coverImage} alt={evt.title} fill className="object-cover" />
              ) : (
                <Calendar className="w-6 h-6 m-3 text-[#0A5C3A]" />
              )}
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#0F1115] dark:text-slate-100">
                <span>{evt.title}</span>
                {isF && (
                  <span title="Öne Çıkan Etkinlik">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#5F6773] dark:text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#0A5C3A]" />
                  <span>{evt.location}</span>
                </span>
                <span>•</span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  /etkinlikler/{(evt as any).slug || evt.id}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "YAYIN DURUMU",
      accessor: (evt: EventItem) => {
        const pubStatus = (evt as any).publicationStatus || (evt.status === "taslak" ? "DRAFT" : "PUBLISHED");

        return (
          <div className="flex flex-col text-left gap-1">
            {pubStatus === "PUBLISHED" ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5 w-fit">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>PUBLISHED (Yayında)</span>
              </span>
            ) : pubStatus === "DRAFT" ? (
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
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Süreç: {evt.status || "Yaklaşan"}
            </span>
          </div>
        );
      },
    },
    {
      key: "date",
      header: "TARİH & KONTENJAN",
      accessor: (evt: EventItem) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-xs text-[#0F1115] dark:text-slate-200">{evt.date || "Tarih Belirtilmedi"}</span>
          <span className="text-[11px] text-[#0A5C3A] font-medium">
            Kontenjan: {evt.appliedCount || (evt as any).capacity || 100} Kişi
          </span>
        </div>
      ),
    },
    {
      key: "applications",
      header: "BAŞVURU SAYISI",
      accessor: (evt: EventItem) => {
        const evtApps = applications.filter((app) => app.eventId === evt.id);

        return (
          <button
            onClick={() => {
              setSelectedEventForApps(evt);
              setIsApplicationsModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-[#0A5C3A]/10 border border-slate-200 dark:border-slate-800 text-xs font-bold text-[#0A5C3A] flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{evtApps.length} Başvuru</span>
          </button>
        );
      },
    },
    {
      key: "actions",
      header: "İŞLEMLER",
      accessor: (evt: EventItem) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleToggleFeatured(evt)}
            className={`p-1.5 rounded-lg transition-colors ${
              (evt as any).isFeatured
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "hover:bg-slate-100 text-slate-400"
            }`}
            title={(evt as any).isFeatured ? "Öne Çıkarmayı Kaldır" : "Anasayfada Öne Çıkar"}
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleTogglePublicationStatus(evt)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Yayın Durumunu Değiştir (DRAFT / PUBLISHED)"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEditModal(evt)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Etkinliği Düzenle"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDeleteDialog(evt)}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/30 transition-colors"
            title="Etkinliği Sil / Arşivle"
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

  const categoryFilterOptions: FilterOption[] = [
    { label: "Tümü", value: "Tümü" },
    { label: "Programlar", value: "programlar" },
    { label: "Teknoloji", value: "teknoloji" },
    { label: "Sanat", value: "sanat" },
    { label: "Yaşam ve Sürdürülebilirlik", value: "cevre-saglik" },
  ];

  return (
    <div className="space-y-6">
      {/* Sayfa Başlığı */}
      <AdminPageHeader
        title="Etkinlik Yönetimi (CMS)"
        subtitle="Ne Yapsak? Gençlik Derneği etkinliklerini oluşturun, taslak/yayın durumunu yönetin ve başvuruları inceleyin."
        icon={Calendar}
        action={
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white font-bold text-sm hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Etkinlik Oluştur</span>
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
          placeholder="Etkinlik adı, konum veya slug ara..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <div className="flex items-center gap-3">
          <AdminFilter
            label="Yayın Durumu"
            options={statusFilterOptions}
            selectedValue={statusFilter}
            onChange={setStatusFilter}
          />
          <AdminFilter
            label="Kategori"
            options={categoryFilterOptions}
            selectedValue={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>
      </div>

      {/* Tablo Ekranı */}
      <div className="bg-white dark:bg-[#0F1623] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#0A5C3A] border-t-transparent animate-spin" />
            <span>Etkinlikler veritabanından yükleniyor...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <AdminEmptyState
            title="Etkinlik Bulunamadı"
            description="Arama kriterlerinize uygun etkinlik kaydı bulunamadı."
            action={
              <button
                onClick={handleOpenNewModal}
                className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold"
              >
                Yeni Etkinlik Oluştur
              </button>
            }
          />
        ) : (
          <>
            <AdminTable
              data={paginatedEvents}
              columns={columns}
              keyExtractor={(evt) => evt.id}
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

      {/* ETKİNLİK EKLEME / DÜZENLEME MODALI */}
      <AdminModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingEvent ? "Etkinliği Düzenle" : "Yeni Etkinlik Oluştur"}
        subtitle="Etkinlik başlığı, slug adresi, tarih, konum ve yayın parametrelerini belirleyin."
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
          {/* Başlık & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Etkinlik Başlığı <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Yapay Zeka Zirvesi 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
              {formErrors.title && (
                <span className="text-xs text-rose-500 mt-1 block">{formErrors.title}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                URL Adresi (Slug) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value.toLowerCase() }))}
                placeholder="yapay-zeka-zirvesi-2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-mono text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
              {formErrors.slug && (
                <span className="text-xs text-rose-500 mt-1 block">{formErrors.slug}</span>
              )}
            </div>
          </div>

          {/* Kısa Açıklama */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kısa Özet Açıklama <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
              placeholder="Kartlarda ve özet alanlarında görünecek kısa açıklama..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
            />
          </div>

          {/* Detay Açıklama / İçerik */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detaylı Etkinlik İçeriği
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Etkinlik programı, konuşmacılar ve detaylı açıklama metni..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
            />
          </div>

          {/* Tarihler, Konum & Kontenjan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Başlangıç Tarihi <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bitiş Tarihi (Opsiyonel)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kontenjan Kapasitesi <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) => setFormData((p) => ({ ...p, capacity: Number(e.target.value) }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Konum */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Konum / Mekan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                placeholder="Örn: Smart-B Kültür Merkezi veya Online"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
              >
                <option value="programlar">Programlar & Sosyal</option>
                <option value="teknoloji">Teknoloji & İnovasyon</option>
                <option value="sanat">Sanat & Tasarım</option>
                <option value="cevre-saglik">Yaşam ve Sürdürülebilirlik</option>
              </select>
            </div>
          </div>

          {/* Kapak Görsel URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Kapak Görseli URL
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
              value={formData.image}
              onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
              placeholder="/images/... veya /uploads/events/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:outline-none focus:border-[#0A5C3A]"
            />
          </div>

          <MediaPickerModal
            isOpen={isMediaPickerOpen}
            onClose={() => setIsMediaPickerOpen(false)}
            targetFolder="events"
            onSelect={(url) => setFormData((p) => ({ ...p, image: url }))}
          />

          {/* CMS Yayın ve Bayrak Ayarları */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Yayın Durumu (CMS Status)
                </label>
                <select
                  value={formData.publicationStatus}
                  onChange={(e) => setFormData((p) => ({ ...p, publicationStatus: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-xs font-bold"
                >
                  <option value="PUBLISHED">PUBLISHED (Public Sitede Yayında)</option>
                  <option value="DRAFT">DRAFT (Taslak - Public'te Gizli)</option>
                  <option value="ARCHIVED">ARCHIVED (Arşivlenmiş)</option>
                </select>
              </div>

              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#0A5C3A] focus:ring-[#0A5C3A]"
                  />
                  <span>Anasayfada Öne Çıkar</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.registrationEnabled}
                    onChange={(e) => setFormData((p) => ({ ...p, registrationEnabled: e.target.checked }))}
                    className="w-4 h-4 rounded text-[#0A5C3A] focus:ring-[#0A5C3A]"
                  />
                  <span>Başvurulara Açık</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Butonları */}
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
              {editingEvent ? "Değişiklikleri Kaydet" : "Etkinliği Oluştur"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ETKİNLİK BAŞVURULARI MODALI */}
      <AdminModal
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
        title={`"${selectedEventForApps?.title}" Başvuruları`}
        subtitle={`Toplam ${applications.filter((a) => a.eventId === selectedEventForApps?.id).length} kişi bu etkinliğe başvurdu.`}
        size="lg"
      >
        <div className="space-y-3 text-left">
          {applications.filter((a) => a.eventId === selectedEventForApps?.id).length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              Bu etkinliğe henüz kayıtlı başvuru bulunmamaktadır.
            </div>
          ) : (
            applications
              .filter((a) => a.eventId === selectedEventForApps?.id)
              .map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{app.fullName}</span>
                    <span className="text-slate-500">{app.email} • {app.phone || "Telefon yok"}</span>
                    <span className="text-slate-500">{app.school} {app.department ? `(${app.department})` : ""}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {app.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{app.appliedAt}</span>
                  </div>
                </div>
              ))
          )}
        </div>
      </AdminModal>

      {/* SİLME / ARŞİV ONAY DIALOGU */}
      <AdminConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Etkinliği Sil / Arşivle"
        description={`"${eventToDelete?.title}" isimli etkinlik silinecektir. Eğer etkinliğe ait geçmiş başvurular varsa etkinlik silinmeyip arşivlenecektir (ARCHIVED). Onaylıyor musunuz?`}
        confirmText="Evet, İşlemi Yap"
        variant="danger"
      />
    </div>
  );
}
