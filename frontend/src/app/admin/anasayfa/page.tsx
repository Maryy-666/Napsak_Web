"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Sparkles,
  Save,
} from "lucide-react";
import {
  AdminPageHeader,
  AdminTable,
  Column,
  AdminModal,
  AdminConfirmDialog,
  AdminBadge,
  AdminLoadingState,
  AdminEmptyState,
} from "@/components/admin/ui";
import { MediaPickerModal } from "@/components/admin/media/MediaPickerModal";
import { HomepageRepository, HomepageHeroItem } from "@/lib/homepageStore";

export default function AdminAnasayfaPage() {
  const [heroSlides, setHeroSlides] = useState<HomepageHeroItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats & Core Values Form State
  const [statsData, setStatsData] = useState<any>({ items: [] });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HomepageHeroItem | null>(null);
  const [savingHero, setSavingHero] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<HomepageHeroItem>>({
    badge: "Keşke Demek Yerine: N'apsak?",
    title: "",
    highlightText: "",
    description: "",
    primaryCtaText: "Çalışma Ekiplerimiz",
    primaryCtaLink: "/ekipler",
    secondaryCtaText: "Topluluğa Katıl",
    secondaryCtaLink: "/katilim",
    imageUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  // Media Picker State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Confirm Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const slides = await HomepageRepository.fetchHeroSlidesFromDB("all");
      setHeroSlides(slides);

      const stats = await HomepageRepository.fetchSectionConfig("stats");
      if (stats) setStatsData(stats);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingHero(null);
    setFormData({
      badge: "Keşke Demek Yerine: N'apsak?",
      title: "",
      highlightText: "",
      description: "",
      primaryCtaText: "Çalışma Ekiplerimiz",
      primaryCtaLink: "/ekipler",
      secondaryCtaText: "Topluluğa Katıl",
      secondaryCtaLink: "/katilim",
      imageUrl: "",
      displayOrder: heroSlides.length,
      isActive: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (hero: HomepageHeroItem) => {
    setEditingHero(hero);
    setFormData({
      badge: hero.badge || "",
      title: hero.title,
      highlightText: hero.highlightText || "",
      description: hero.description || "",
      primaryCtaText: hero.primaryCtaText || "",
      primaryCtaLink: hero.primaryCtaLink || "",
      secondaryCtaText: hero.secondaryCtaText || "",
      secondaryCtaLink: hero.secondaryCtaLink || "",
      imageUrl: hero.imageUrl || "",
      displayOrder: hero.displayOrder || 0,
      isActive: hero.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setFormError("Hero başlığı zorunludur.");
      return;
    }

    setSavingHero(true);
    setFormError(null);
    try {
      if (editingHero) {
        const updated = await HomepageRepository.updateHeroSlide(editingHero.id, formData);
        setHeroSlides((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
      } else {
        const created = await HomepageRepository.createHeroSlide(formData);
        setHeroSlides((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Hero slaytı kaydedilemedi.");
    } finally {
      setSavingHero(false);
    }
  };

  const handleDeleteHero = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await HomepageRepository.deleteHeroSlide(deletingId);
      setHeroSlides((prev) => prev.filter((h) => h.id !== deletingId));
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      alert(err.message || "Hero slaytı silinemedi.");
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  const handleSaveStatsConfig = async () => {
    setSavingConfig(true);
    setConfigSuccess(null);
    try {
      await HomepageRepository.saveSectionConfig("stats", statsData);
      setConfigSuccess("Ana sayfa istatistikleri kaydedildi!");
      setTimeout(() => setConfigSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || "İstatistikler kaydedilemedi.");
    } finally {
      setSavingConfig(false);
    }
  };

  const columns: Column<HomepageHeroItem>[] = [
    {
      key: "imageUrl",
      header: "Görsel",
      accessor: (hero) =>
        hero.imageUrl ? (
          <img
            src={hero.imageUrl}
            alt={hero.title}
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
      header: "Başlık & Rozet",
      accessor: (hero) => (
        <div className="space-y-0.5">
          <div className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
            {hero.title}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            {hero.badge || "Rozet Yok"}
          </div>
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Durum",
      accessor: (hero) =>
        hero.isActive ? (
          <AdminBadge variant="published">Aktif</AdminBadge>
        ) : (
          <AdminBadge variant="passive">Pasif</AdminBadge>
        ),
    },
    {
      key: "displayOrder",
      header: "Sıra",
      accessor: (hero) => (
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
          {hero.displayOrder}
        </span>
      ),
    },
    {
      key: "actions",
      header: "İşlemler",
      accessor: (hero) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(hero)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-all"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(hero.id);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Ana Sayfa CMS Yönetimi"
        subtitle="Hero slider slaytlarını, başlıkları, görselleri ve ana sayfa istatistiklerini yönetin."
        icon={Home}
        action={
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Hero Slaytı Ekle</span>
          </button>
        }
      />

      {/* Hero Slides Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          1. Hero Slider Slaytları
        </h3>
        {loading ? (
          <AdminLoadingState />
        ) : heroSlides.length === 0 ? (
          <AdminEmptyState
            title="Hero Slaytı Bulunamadı"
            description="Henüz oluşturulmuş bir hero slaytı yok. Yeni bir slayt ekleyebilirsiniz."
          />
        ) : (
          <AdminTable
            columns={columns}
            data={heroSlides}
            keyExtractor={(row) => row.id}
          />
        )}
      </div>

      {/* Stats Section Config */}
      <div className="bg-white dark:bg-[#0F1623] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              2. Ana Sayfa İstatistikleri (Stats Banner)
            </h3>
            <p className="text-xs text-slate-500">
              Kamuya açık ana sayfadaki göstergeleri güncelleyin.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveStatsConfig}
            disabled={savingConfig}
            className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{savingConfig ? "Kaydediliyor..." : "İstatistikleri Kaydet"}</span>
          </button>
        </div>

        {configSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold">
            {configSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(statsData.items || []).map((item: any, idx: number) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Etiket</label>
                  <input
                    type="text"
                    value={item.label || ""}
                    onChange={(e) => {
                      const updated = [...statsData.items];
                      updated[idx].label = e.target.value;
                      setStatsData({ ...statsData, items: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Değer</label>
                  <input
                    type="text"
                    value={item.value || ""}
                    onChange={(e) => {
                      const updated = [...statsData.items];
                      updated[idx].value = e.target.value;
                      setStatsData({ ...statsData, items: updated });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Açıklama</label>
                <input
                  type="text"
                  value={item.description || ""}
                  onChange={(e) => {
                    const updated = [...statsData.items];
                    updated[idx].description = e.target.value;
                    setStatsData({ ...statsData, items: updated });
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingHero ? "Hero Slaytını Düzenle" : "Yeni Hero Slaytı Ekle"}
        size="lg"
      >
        <form onSubmit={handleSaveHero} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Rozet Metni (Badge)
            </label>
            <input
              type="text"
              value={formData.badge || ""}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Örn: Keşke Demek Yerine: N'apsak?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ana Başlık *
            </label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Örn: Gençlik Üretiyor, Topluluk Dönüştürüyor"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Vurgulanan Metin (Highlight Text)
            </label>
            <input
              type="text"
              value={formData.highlightText || ""}
              onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Örn: Birlikte Düşleyelim"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Açıklama
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none focus:border-[#0A5C3A]"
              placeholder="Slayt açıklaması..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Birincil Buton Metni & Linki
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.primaryCtaText || ""}
                  onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
                  placeholder="Metin"
                />
                <input
                  type="text"
                  value={formData.primaryCtaLink || ""}
                  onChange={(e) => setFormData({ ...formData, primaryCtaLink: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
                  placeholder="Link (/ekipler)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                İkincil Buton Metni & Linki
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.secondaryCtaText || ""}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
                  placeholder="Metin"
                />
                <input
                  type="text"
                  value={formData.secondaryCtaLink || ""}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#141C2E] font-medium outline-none"
                  placeholder="Link (/katilim)"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Görsel URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.imageUrl || ""}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[#0A5C3A] focus:ring-[#0A5C3A]"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Slayt Aktif (Public Görünür)
              </label>
            </div>
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
              disabled={savingHero}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A5C3A] text-white hover:bg-[#084A2F] disabled:opacity-50 transition-all"
            >
              {savingHero ? "Kaydediliyor..." : editingHero ? "Güncelle" : "Oluştur"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
        allowedType="image"
      />

      {/* Confirm Delete */}
      <AdminConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteHero}
        title="Hero Slaytını Sil"
        description="Bu slaytı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
