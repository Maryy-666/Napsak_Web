"use client";

import React, { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import {
  Menu,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Layers,
  Link as LinkIcon,
  ExternalLink,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";
import {
  AdminPageHeader,
  AdminTable,
  Column,
  AdminSearch,
  AdminFilter,
  AdminModal,
  AdminConfirmDialog,
  AdminEmptyState,
} from "../../../components/admin/ui";
import { NavigationRepository, NavItemData, NavTargetType, NavLocation } from "../../../lib/navigationStore";
import { PagesRepository, PageItem } from "../../../lib/pagesStore";

const navFormSchema = z.object({
  label: z
    .string()
    .min(2, "Menü başlığı en az 2 karakter olmalıdır.")
    .max(50, "Menü başlığı en fazla 50 karakter olabilir."),
  targetType: z.enum(["PAGE", "CUSTOM_URL", "DROPDOWN_PARENT"]),
  href: z.string().optional(),
  pageId: z.number().nullable().optional(),
  parentId: z.number().nullable().optional(),
  location: z.enum(["NAVBAR", "FOOTER", "BOTH"]),
  displayOrder: z.number().int().min(0, "Sıra 0 veya daha büyük olmalıdır."),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

export default function AdminMenulerPage() {
  const { isDark } = useAdminTheme();

  const [navItems, setNavItems] = useState<NavItemData[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"NAVBAR" | "FOOTER">("NAVBAR");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItemData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NavItemData | null>(null);

  const [formData, setFormData] = useState({
    label: "",
    targetType: "PAGE" as NavTargetType,
    href: "",
    pageId: null as number | null,
    parentId: null as number | null,
    location: "NAVBAR" as NavLocation,
    displayOrder: 0,
    isVisible: true,
    openInNewTab: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [navRes, pagesRes] = await Promise.all([
      NavigationRepository.fetchNavFromDB(undefined, "all"),
      PagesRepository.fetchPagesFromDB("published"),
    ]);
    setNavItems(navRes.all);
    setPages(pagesRes);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      label: "",
      targetType: "PAGE",
      href: "",
      pageId: pages.length > 0 ? pages[0].id : null,
      parentId: null,
      location: activeTab,
      displayOrder: navItems.length + 1,
      isVisible: true,
      openInNewTab: false,
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: NavItemData) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      targetType: (item.targetType as NavTargetType) || "PAGE",
      href: item.href || "",
      pageId: item.pageId || (item.page?.id ?? null),
      parentId: item.parentId || null,
      location: (item.location as NavLocation) || "NAVBAR",
      displayOrder: item.displayOrder || 0,
      isVisible: Boolean(item.isVisible),
      openInNewTab: Boolean(item.openInNewTab),
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const validation = navFormSchema.safeParse(formData);
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
      if (editingItem) {
        await NavigationRepository.updateNavItem(editingItem.id, formData);
        setSuccessMessage("Menü öğesi veritabanında güncellendi.");
      } else {
        await NavigationRepository.addNavItem(formData);
        setSuccessMessage("Yeni menü öğesi oluşturuldu.");
      }

      setIsFormModalOpen(false);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      console.error("Menü kaydedilirken hata:", err);
      setApiError(err?.message || "Menü kaydı yapılamadı.");
    }
  };

  const handleToggleVisibility = async (item: NavItemData) => {
    try {
      await NavigationRepository.updateNavItem(item.id, { isVisible: !item.isVisible });
      await loadData();
    } catch (err: any) {
      console.error("Görünürlük değiştirilemedi:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await NavigationRepository.deleteNavItem(itemToDelete.id);
      setSuccessMessage("Menü öğesi başarıyla silindi.");
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setApiError("Menü öğesi silinirken hata oluştu.");
    }
  };

  // Filter items based on activeTab (NAVBAR vs FOOTER)
  const currentTabItems = useMemo(() => {
    return navItems.filter((i) => i.location === activeTab || i.location === "BOTH");
  }, [navItems, activeTab]);

  // Parent options for dropdown assignment (exclude self)
  const parentOptions = useMemo(() => {
    return navItems.filter((i) => {
      if (editingItem && i.id === editingItem.id) return false;
      return i.targetType === "DROPDOWN_PARENT" || i.location === activeTab || i.location === "BOTH";
    });
  }, [navItems, editingItem, activeTab]);

  const columns: Column<NavItemData>[] = [
    {
      key: "displayOrder",
      header: "Sıra",
      align: "center",
      accessor: (i: NavItemData) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
          #{i.displayOrder}
        </span>
      ),
    },
    {
      key: "label",
      header: "MENÜ ETİKETİ & HEDEF",
      accessor: (i: NavItemData) => {
        const isParent = i.parentId !== null;
        const parentItem = navItems.find((p) => p.id === i.parentId);

        return (
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              {isParent && <span className="text-slate-400 text-xs font-mono">└─</span>}
              <span className="font-bold text-sm text-[#0F1115] dark:text-white">{i.label}</span>
              {i.targetType === "DROPDOWN_PARENT" && (
                <span className="px-1.5 py-0.2 rounded bg-[#0A5C3A]/10 text-[#0A5C3A] text-[10px] font-extrabold uppercase">
                  Dropdown Başlığı
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#5F6773] mt-0.5">
              {i.targetType === "PAGE" && i.page && (
                <span className="text-[#0A5C3A] font-semibold flex items-center gap-1">
                  <FileText className="w-3 h-3" /> /sayfa/{i.page.slug}
                </span>
              )}
              {i.targetType === "CUSTOM_URL" && (
                <span className="font-mono text-slate-500 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> {i.href || "/"}
                </span>
              )}
              {parentItem && (
                <span className="text-amber-600 dark:text-amber-400 text-[10.5px]">
                  (Üst Menü: {parentItem.label})
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "location",
      header: "KONUM",
      align: "center",
      accessor: (i: NavItemData) => (
        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {i.location}
        </span>
      ),
    },
    {
      key: "isVisible",
      header: "GÖRÜNÜRLÜK",
      align: "center",
      accessor: (i: NavItemData) => (
        <button
          onClick={() => handleToggleVisibility(i)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
            i.isVisible
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
          }`}
          title="Görünürlüğü Değiştir"
        >
          {i.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{i.isVisible ? "GÖRÜNÜR" : "GİZLİ"}</span>
        </button>
      ),
    },
    {
      key: "actions",
      header: "İŞLEMLER",
      accessor: (i: NavItemData) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenEditModal(i)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Düzenle"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setItemToDelete(i);
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
        title="Menü Yönetimi (Navigation CMS)"
        subtitle="Public Navbar ve Footer menü ögelerini dinamik oluşturun, hiyerarşiyi ve sıralamayı kod müdahalesi olmadan değiştirin."
        icon={Menu}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white font-bold text-xs hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Menü Öğesi Ekle</span>
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

      {/* Tabs Navigation (NAVBAR vs FOOTER) */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("NAVBAR")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "NAVBAR"
              ? "bg-[#0A5C3A] text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          Navbar Menüleri
        </button>
        <button
          onClick={() => setActiveTab("FOOTER")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "FOOTER"
              ? "bg-[#0A5C3A] text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          Footer Linkleri
        </button>
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={currentTabItems}
        keyExtractor={(i) => i.id}
        isLoading={loading}
        emptyState={<AdminEmptyState title="Menü Öğesi Bulunamadı" description="Bu sekmede henüz kayıtlı bir menü öğesi bulunmamaktadır." />}
      />

      {/* Create / Edit Form Modal */}
      <AdminModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingItem ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold mb-1">
              Menü Etiketi (Gösterilecek İsim) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Örn: Hakkımızda veya Çalışmalar"
              className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs dark:bg-[#141C2E] dark:border-slate-800"
            />
            {formErrors.label && <p className="text-rose-500 text-[11px] mt-1">{formErrors.label}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Hedef Tipi</label>
              <select
                value={formData.targetType}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetType: e.target.value as NavTargetType }))}
                className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs cursor-pointer dark:bg-[#141C2E] dark:border-slate-800"
              >
                <option value="PAGE">Dinamik Sayfa (PAGE)</option>
                <option value="CUSTOM_URL">Özel Rota / Dış URL (CUSTOM_URL)</option>
                <option value="DROPDOWN_PARENT">Dropdown Başlığı (DROPDOWN_PARENT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Menü Konumu</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value as NavLocation }))}
                className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs cursor-pointer dark:bg-[#141C2E] dark:border-slate-800"
              >
                <option value="NAVBAR">Sadece Navbar</option>
                <option value="FOOTER">Sadece Footer</option>
                <option value="BOTH">Hem Navbar Hem Footer</option>
              </select>
            </div>
          </div>

          {formData.targetType === "PAGE" && (
            <div>
              <label className="block text-xs font-bold mb-1">
                İlişkili Sayfa Seçimi <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.pageId || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, pageId: parseInt(e.target.value, 10) || null }))}
                className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs cursor-pointer dark:bg-[#141C2E] dark:border-slate-800"
              >
                <option value="">-- Bir Sayfa Seçin --</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (/sayfa/{p.slug})
                  </option>
                ))}
              </select>
              {formErrors.pageId && <p className="text-rose-500 text-[11px] mt-1">{formErrors.pageId}</p>}
            </div>
          )}

          {formData.targetType === "CUSTOM_URL" && (
            <div>
              <label className="block text-xs font-bold mb-1">
                URL Adresi (Örn: /etkinlikler veya https://...) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.href}
                onChange={(e) => setFormData((prev) => ({ ...prev, href: e.target.value }))}
                placeholder="/etkinlikler"
                className="w-full h-10 px-3 rounded-xl border outline-none font-mono text-xs dark:bg-[#141C2E] dark:border-slate-800"
              />
              {formErrors.href && <p className="text-rose-500 text-[11px] mt-1">{formErrors.href}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Üst Menü (Parent - Opsiyonel)</label>
              <select
                value={formData.parentId || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentId: parseInt(e.target.value, 10) || null }))}
                className="w-full h-10 px-3 rounded-xl border outline-none font-medium text-xs cursor-pointer dark:bg-[#141C2E] dark:border-slate-800"
              >
                <option value="">-- Üst Menü Yok (Ana Seviye) --</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({p.targetType})
                  </option>
                ))}
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
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))}
                className="rounded border-slate-300 text-[#0A5C3A] focus:ring-[#0A5C3A]"
              />
              <span>Menüde Görünsün</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.openInNewTab}
                onChange={(e) => setFormData((prev) => ({ ...prev, openInNewTab: e.target.checked }))}
                className="rounded border-slate-300 text-[#0A5C3A] focus:ring-[#0A5C3A]"
              />
              <span>Yeni Sekmede Aç</span>
            </label>
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
              {editingItem ? "Güncelle" : "Menü Öğesini Ekle"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Menü Öğesini Sil"
        description={`"${itemToDelete?.label}" menü öğesini silmek istediğinize emin misiniz?`}
        confirmText="Evet, Menü Öğesini Sil"
        variant="danger"
      />
    </div>
  );
}
