"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { z } from "zod";
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Globe,
  Sparkles,
  ArrowUpRight,
  Menu,
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
  AdminEmptyState,
} from "../../../components/admin/ui";
import { PagesRepository, PageItem } from "../../../lib/pagesStore";

const pageFormSchema = z.object({
  title: z
    .string()
    .min(2, "Sayfa başlığı en az 2 karakter olmalıdır.")
    .max(100, "Sayfa başlığı en fazla 100 karakter olabilir."),
  slug: z
    .string()
    .min(2, "Slug en az 2 karakter olmalıdır.")
    .max(60, "Slug en fazla 60 karakter olabilir.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Geçersiz slug biçimi (küçük harf, rakam ve tire kullanın)"),
  shortDescription: z.string().max(300, "Kısa açıklama en fazla 300 karakter olabilir.").optional(),
  content: z.string().optional(),
  publicationStatus: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]),
  isFeatured: z.boolean().default(false),
  showInMenu: z.boolean().default(false),
  displayOrder: z.number().int().min(0, "Sıra 0 veya daha büyük olmalıdır."),
  featuredImage: z.string().optional(),
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(200).optional(),
});

export default function AdminSayfalarPage() {
  const { isDark } = useAdminTheme();

  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageItem | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    publicationStatus: "PUBLISHED" as "PUBLISHED" | "DRAFT" | "ARCHIVED",
    isFeatured: false,
    showInMenu: false,
    displayOrder: 0,
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadPages = async () => {
    setLoading(true);
    const data = await PagesRepository.fetchPagesFromDB("all");
    setPages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingPage(null);
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      content: "Sayfa içeriği yakında eklenecektir.",
      publicationStatus: "PUBLISHED",
      isFeatured: false,
      showInMenu: false,
      displayOrder: pages.length + 1,
      featuredImage: "",
      metaTitle: "",
      metaDescription: "",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (page: PageItem) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      shortDescription: page.shortDescription || "",
      content: page.content || "Sayfa içeriği yakında eklenecektir.",
      publicationStatus: (page.publicationStatus as any) || "PUBLISHED",
      isFeatured: Boolean(page.isFeatured),
      showInMenu: Boolean(page.showInMenu),
      displayOrder: page.displayOrder || 0,
      featuredImage: (page as any).featuredImage || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const generated = val
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

      return {
        ...prev,
        title: val,
        slug: editingPage ? prev.slug : generated,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const payload = {
      ...formData,
      content: formData.content || "Sayfa içeriği",
    };

    const validation = pageFormSchema.safeParse(payload);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    try {
      if (editingPage) {
        await PagesRepository.updatePage(editingPage.id, payload);
        setSuccessMessage("Sayfa veritabanında başarıyla güncellendi.");
      } else {
        await PagesRepository.addPage(payload);
        setSuccessMessage("Yeni sayfa başarıyla oluşturuldu.");
      }

      setIsFormModalOpen(false);
      await loadPages();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Sayfa kaydedilirken hata:", err);
      setApiError(err?.message || "Sayfa kaydedilemedi.");
    }
  };

  const handleTogglePublication = async (page: PageItem) => {
    const nextStatus = page.publicationStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await PagesRepository.updatePage(page.id, { publicationStatus: nextStatus });
      await loadPages();
    } catch (err: any) {
      console.error("Yayın durumu değiştirilemedi:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pageToDelete) return;
    try {
      await PagesRepository.deletePage(pageToDelete.id);
      setSuccessMessage("Sayfa veritabanından güvenle silindi.");
      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
      await loadPages();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setApiError("Sayfa silinirken hata oluştu.");
    }
  };

  // Filter & Pagination logic
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || p.publicationStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [pages, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage) || 1;
  const paginatedPages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPages.slice(start, start + itemsPerPage);
  }, [filteredPages, currentPage]);

  const columns: Column<PageItem>[] = [
    {
      key: "displayOrder",
      header: "Sıra",
      align: "center",
      accessor: (p: PageItem) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
          #{p.displayOrder}
        </span>
      ),
    },
    {
      key: "title",
      header: "SAYFA BİLGİSİ & SLUG",
      accessor: (p: PageItem) => (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#0F1115] dark:text-white">{p.title}</span>
            {p.isFeatured && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                ★ Öne Çıkarılan
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-[#0A5C3A] font-semibold">/sayfa/{p.slug}</span>
        </div>
      ),
    },
    {
      key: "publicationStatus",
      header: "YAYIN DURUMU",
      align: "center",
      accessor: (p: PageItem) => {
        const isPublished = p.publicationStatus === "PUBLISHED";
        const isDraft = p.publicationStatus === "DRAFT";
        return (
          <span
            onClick={() => handleTogglePublication(p)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
              isPublished
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : isDraft
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
            }`}
            title="Yayın Durumunu Değiştirmek İçin Tıklayın"
          >
            {isPublished ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : isDraft ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            <span>{isPublished ? "YAYINDA" : isDraft ? "TASLAK" : "ARŞİVDE"}</span>
          </span>
        );
      },
    },
    {
      key: "showInMenu",
      header: "MENÜDE GÖSTER",
      align: "center",
      accessor: (p: PageItem) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${
            p.showInMenu
              ? "bg-[#0A5C3A]/10 text-[#0A5C3A] border border-[#0A5C3A]/20"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <Menu className="w-3 h-3" />
          <span>{p.showInMenu ? "Menüde" : "Menü Dışı"}</span>
        </span>
      ),
    },
    {
      key: "actions",
      header: "İŞLEMLER",
      accessor: (p: PageItem) => (
        <div className="flex items-center justify-end gap-2">
          {p.publicationStatus === "PUBLISHED" && (
            <Link
              href={`/sayfa/${p.slug}`}
              target="_blank"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Public Sayfayı İncele"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
          <button
            onClick={() => handleOpenEditModal(p)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Düzenle"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setPageToDelete(p);
              setIsDeleteDialogOpen(true);
            }}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
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
        title="Sayfa Yönetimi (Page CMS)"
        subtitle="N'apsak? web sitesinin dinamik sayfalarını oluşturun, içeriklerini düzenleyin ve yayın durumunu yönetin."
        icon={FileText}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white font-bold text-xs hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Sayfa Oluştur</span>
          </button>
        }
      />

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
          {successMessage}
        </div>
      )}

      {apiError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-semibold text-sm">
          {apiError}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <AdminSearch
          placeholder="Sayfa başlığı veya slug ara..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <AdminFilter
          options={[
            { label: "Tüm Durumlar", value: "all" },
            { label: "Yayında Olanlar", value: "published" },
            { label: "Taslaklar", value: "draft" },
            { label: "Arşivde Olanlar", value: "archived" },
          ]}
          selectedValue={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={paginatedPages}
        keyExtractor={(p) => p.id}
        isLoading={loading}
        emptyState={<AdminEmptyState title="Sayfa Bulunamadı" description="Henüz kayıtlı bir sayfa bulunmamaktadır." />}
      />

      {/* Pagination */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredPages.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Create / Edit Form Modal */}
      <AdminModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingPage ? "Sayfa Profili Düzenle" : "Yeni Sayfa Oluştur"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">
                Sayfa Başlığı <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Hakkımızda"
                className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs dark:bg-[#141C2E] dark:border-slate-800"
              />
              {formErrors.title && <p className="text-rose-500 text-[11px] mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                Sayfa URL Adresi (Slug) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-slate-400">/sayfa/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="hakkimizda"
                  className="flex-1 h-10 px-3 rounded-xl border outline-none font-mono text-xs dark:bg-[#141C2E] dark:border-slate-800"
                />
              </div>
              {formErrors.slug && <p className="text-rose-500 text-[11px] mt-1">{formErrors.slug}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Kısa Açıklama (Özet)</label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="Sayfanın amacını özetleyen 1-2 cümle..."
              className="w-full p-3 rounded-xl border outline-none font-medium text-xs resize-none dark:bg-[#141C2E] dark:border-slate-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Öne Çıkan Kapak Görseli URL (featuredImage)
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
              value={formData.featuredImage || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
              placeholder="/uploads/general/... veya https://..."
              className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs dark:bg-[#141C2E] dark:border-slate-800"
            />
          </div>

          <MediaPickerModal
            isOpen={isMediaPickerOpen}
            onClose={() => setIsMediaPickerOpen(false)}
            targetFolder="general"
            onSelect={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Yayın Durumu</label>
              <select
                value={formData.publicationStatus}
                onChange={(e) => setFormData((prev) => ({ ...prev, publicationStatus: e.target.value as any }))}
                className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs cursor-pointer dark:bg-[#141C2E] dark:border-slate-800"
              >
                <option value="PUBLISHED">PUBLISHED (Yayında)</option>
                <option value="DRAFT">DRAFT (Taslak)</option>
                <option value="ARCHIVED">ARCHIVED (Arşivde)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Görüntülenme Sırası</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value, 10) || 0 }))}
                className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs dark:bg-[#141C2E] dark:border-slate-800"
              />
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-slate-300 text-[#0A5C3A] focus:ring-[#0A5C3A]"
                />
                <span>Öne Çıkarılan Sayfa</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInMenu}
                  onChange={(e) => setFormData((prev) => ({ ...prev, showInMenu: e.target.checked }))}
                  className="rounded border-slate-300 text-[#0A5C3A] focus:ring-[#0A5C3A]"
                />
                <span>Menüde Göster</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A5C3A]">SEO Ayarları</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold mb-1">SEO Meta Başlığı</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Başlık | N'apsak?"
                  className="w-full h-9 px-3 rounded-xl border outline-none font-medium text-xs dark:bg-[#141C2E] dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1">SEO Meta Açıklaması</label>
                <input
                  type="text"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Arama motorları için özet metin..."
                  className="w-full h-9 px-3 rounded-xl border outline-none font-medium text-xs dark:bg-[#141C2E] dark:border-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0A5C3A] text-white font-bold text-xs hover:bg-[#084A2F] transition-colors shadow-md"
            >
              {editingPage ? "Güncellemeleri Kaydet" : "Sayfayı Yayınla"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Sayfayı Sil"
        description={`"${pageToDelete?.title}" sayfasını veritabanından silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Sayfayı Sil"
        variant="danger"
      />
    </div>
  );
}
