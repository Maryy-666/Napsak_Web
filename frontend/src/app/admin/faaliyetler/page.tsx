"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  Pin,
  RefreshCw,
  Eye,
  Users,
  Save,
} from "lucide-react";
import {
  FaaliyetItem,
  FaaliyetStatus,
  FaaliyetlerRepository,
  subscribeFaaliyetlerChanges,
} from "../../../lib/faaliyetlerStore";
import { useAdminTheme } from "../../../context/AdminThemeContext";
import Link from "next/link";

export default function AdminFaaliyetlerPage() {
  const { isDark } = useAdminTheme();
  const [faaliyetler, setFaaliyetler] = useState<FaaliyetItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // Modal State'leri
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FaaliyetItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // Form State'leri
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Toplumsal Etki");
  const [team, setTeam] = useState("N'apsak Ekibi");
  const [status, setStatus] = useState<FaaliyetStatus>("Devam Eden");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [image, setImage] = useState("");

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeFaaliyetlerChanges(() => {
      refreshData();
    });
    return unsubscribe;
  }, []);

  const refreshData = () => {
    setFaaliyetler(FaaliyetlerRepository.getAllFaaliyetler());
  };

  // İstatistik Sayıları
  const totalCount = faaliyetler.length;
  const activeCount = faaliyetler.filter((f) => f.status === "Devam Eden").length;
  const upcomingCount = faaliyetler.filter((f) => f.status === "Yakında").length;
  const completedCount = faaliyetler.filter((f) => f.status === "Tamamlanan").length;

  const filteredFaaliyetler = faaliyetler.filter((item) => {
    const matchesStatus =
      selectedStatusFilter === "all" || item.status === selectedStatusFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.team.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const resetForm = () => {
    setTitle("");
    setCategory("Toplumsal Etki");
    setTeam("N'apsak Ekibi");
    setStatus("Devam Eden");
    setDate("");
    setLocation("");
    setSummary("");
    setParticipantCount(0);
    setImage("");
    setEditingItem(null);
    setShowAddModal(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      alert("Lütfen başlık ve özet alanlarını doldurunuz.");
      return;
    }

    const defaultStyle = {
      noteBg: "bg-[#EAF5EF]",
      borderColor: "border-[#CDEAD9]",
      badgeBg: "bg-[#0A5C3A]",
      badgeText: "text-white",
      tapeColor: "bg-[#86EFAC]/50 border-[#4ADE80]/40",
      pinColor: "text-[#0A5C3A]",
    };

    const rotationOptions = ["rotate-2", "-rotate-2", "rotate-3", "-rotate-3"];
    const randomRotation = rotationOptions[Math.floor(Math.random() * rotationOptions.length)];

    if (editingItem) {
      FaaliyetlerRepository.updateFaaliyet(editingItem.id, {
        title: title.trim(),
        type: "sticky",
        category: category.trim(),
        team: team.trim() || "N'apsak Ekibi",
        status,
        date: date.trim() || "2025",
        location: location.trim() || "Genel",
        summary: summary.trim(),
        participantCount: participantCount > 0 ? participantCount : undefined,
        image: image.trim() || undefined,
        ...defaultStyle,
      });
    } else {
      FaaliyetlerRepository.addFaaliyet({
        title: title.trim(),
        type: "sticky",
        category: category.trim() || "Toplumsal Etki",
        team: team.trim() || "N'apsak Ekibi",
        status,
        date: date.trim() || "2025",
        location: location.trim() || "Genel",
        summary: summary.trim(),
        participantCount: participantCount > 0 ? participantCount : undefined,
        image: image.trim() || undefined,
        rotation: randomRotation,
        ...defaultStyle,
      });
    }

    refreshData();
    resetForm();
  };

  const openEdit = (item: FaaliyetItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setTeam(item.team);
    setStatus(item.status);
    setDate(item.date);
    setLocation(item.location);
    setSummary(item.summary);
    setParticipantCount(item.participantCount || 0);
    setImage(item.image || "");
    setShowAddModal(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      FaaliyetlerRepository.deleteFaaliyet(itemToDelete.id);
      refreshData();
      setItemToDelete(null);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Panodaki kartları varsayılan duruma sıfırlamak istediğinize emin misiniz?")) {
      FaaliyetlerRepository.resetToDefaults();
      refreshData();
    }
  };

  // Tema Yardımcı Stilleri
  const cardBg = isDark ? "bg-[#0F1623] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-[#0F1115] shadow-xs";
  const tableHeaderBg = isDark ? "bg-[#141C2E] text-slate-400 border-slate-800/60" : "bg-slate-50/60 text-[#5F6773] border-slate-100";
  const tableRowBorder = isDark ? "border-slate-800/60 hover:bg-[#141C2E]/40" : "border-slate-100 hover:bg-slate-50/80";
  const inputBg = isDark ? "bg-[#141C2E] border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-[#0F1115]";
  const modalBg = isDark ? "bg-[#0F1623] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-[#0F1115] shadow-2xl";
  const titleColor = isDark ? "text-white" : "text-[#0F1115]";
  const subColor = isDark ? "text-slate-400" : "text-[#5F6773]";

  return (
    <div className="space-y-6 select-none font-sans">
      {/* ÜST BAŞLIK VE EYLEMLER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A5C3A] text-white">
              <Pin className="h-4 w-4" />
            </span>
            <h1 className={`text-xl sm:text-2xl font-bold font-headings tracking-tight ${titleColor}`}>
              Faaliyet Yönetimi
            </h1>
          </div>
          <p className={`text-xs ${subColor} mt-1 font-normal`}>
            `/faaliyetler` mantar panosunda görünen faaliyetleri ve topluluk çalışmalarını yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/faaliyetler"
            target="_blank"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141C2E] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Eye className="h-3.5 w-3.5 text-[#0A5C3A]" />
            <span>Panoyu Canlı Gör</span>
          </Link>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141C2E] px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Varsayılana Sıfırla"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-[#0A5C3A] hover:bg-[#128C59] text-white px-4.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Yeni Faaliyet Ekle</span>
          </button>
        </div>
      </div>

      {/* ARAMA VE FİLTRELER */}
      <div className={`${cardBg} rounded-3xl border overflow-hidden transition-colors shadow-xs`}>
        <div className={`p-5 sm:p-6 border-b ${isDark ? "border-slate-800/80" : "border-slate-200"} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#0A5C3A] absolute left-4 top-3.5 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Faaliyet veya açıklama ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border-2 rounded-full pl-11 pr-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:border-[#0A5C3A] ${
                isDark
                  ? "bg-[#141C2E] border-slate-700 text-slate-100 placeholder:text-slate-500"
                  : "bg-white border-slate-300 text-[#0F1115] placeholder:text-slate-400 shadow-xs"
              }`}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {[
              { id: "all", label: `Tümü (${totalCount})` },
              { id: "Devam Eden", label: `Devam Eden (${activeCount})` },
              { id: "Yakında", label: `Yakında (${upcomingCount})` },
              { id: "Tamamlanan", label: `Tamamlanan (${completedCount})` },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatusFilter(st.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedStatusFilter === st.id
                    ? isDark
                      ? "bg-white text-slate-900 shadow-sm"
                      : "bg-[#0A5C3A] text-white shadow-sm"
                    : isDark
                    ? "bg-[#141C2E] text-slate-400 hover:text-white"
                    : "bg-slate-100 text-[#5F6773] hover:bg-slate-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* ETKİNLİKLER SAYFASIYLA BİREBİR ETKİLEŞİMLİ VE YUMUŞAK TABLO */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className={`${tableHeaderBg} uppercase font-extrabold text-[11px] tracking-wider border-b border-slate-100 dark:border-slate-800/60`}>
              <tr>
                <th className="py-4.5 px-6 min-w-[300px]">Faaliyet Adı</th>
                <th className="py-4.5 px-3.5 whitespace-nowrap">Kategori</th>
                <th className="py-4.5 px-3.5 whitespace-nowrap">Durum</th>
                <th className="py-4.5 px-5 whitespace-nowrap">Katılımcı</th>
                <th className="py-4.5 px-6 text-right whitespace-nowrap">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaaliyetler.map((item) => (
                <tr key={item.id} className={`border-b border-slate-100 dark:border-slate-800/50 last:border-b-0 transition-colors ${isDark ? "hover:bg-[#141C2E]/40" : "hover:bg-slate-50/80"}`}>
                  {/* Faaliyet Adı ve Özeti */}
                  <td className="py-6 px-6 min-w-[300px]">
                    <div className={`text-sm font-semibold leading-relaxed ${titleColor}`}>{item.title}</div>
                    <div className={`text-xs ${subColor} mt-1 font-normal line-clamp-1 max-w-md`}>{item.summary}</div>
                  </td>

                  {/* Kategori */}
                  <td className="py-6 px-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold inline-block whitespace-nowrap ${
                      isDark ? "bg-slate-800 text-slate-200 border border-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}>
                      {item.category}
                    </span>
                  </td>

                  {/* Durum */}
                  <td className="py-6 px-3.5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition-all whitespace-nowrap ${
                        item.status === "Devam Eden"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : item.status === "Yakında"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : isDark
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Katılımcı Kayıt Sayısı */}
                  <td className="py-6 px-5 whitespace-nowrap">
                    {item.participantCount ? (
                      <span className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap">
                        <Users className="w-3.5 h-3.5 stroke-[2]" />
                        <span>{item.participantCount} Kayıt</span>
                      </span>
                    ) : (
                      <span className={`text-xs ${subColor}`}>-</span>
                    )}
                  </td>

                  {/* İŞLEMLER BUTONLARI (ETKİNLİKLER SAYFASI İLE BİREBİR AYNI) */}
                  <td className="py-6 px-6 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 transition-all shadow-xs inline-flex items-center justify-center cursor-pointer"
                      title="Faaliyeti Düzenle"
                    >
                      <Edit3 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => setItemToDelete({ id: item.id, title: item.title })}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 hover:scale-105 active:scale-95 transition-all shadow-xs inline-flex items-center justify-center cursor-pointer"
                      title="Faaliyeti Sil"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EKLE / DÜZENLE MODALI */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className={`${modalBg} rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <h3 className={`text-base font-bold font-headings ${titleColor}`}>
                {editingItem ? "Faaliyeti Düzenle" : "Yeni Faaliyet Ekle"}
              </h3>
              <button type="button" onClick={resetForm} className={`${subColor} hover:${titleColor} font-bold`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className={`font-bold ${titleColor} mb-1 block`}>Faaliyet Başlığı *</label>
                <input
                  required
                  type="text"
                  placeholder="Örn: Kitap Bağış Kampanyası"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Kategori *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Toplumsal Etki"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  />
                </div>

                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Sorumlu Ekip</label>
                  <input
                    type="text"
                    placeholder="Örn: Sosyal Sorumluluk Ekibi"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Durum *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FaaliyetStatus)}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  >
                    <option value="Devam Eden">Devam Eden</option>
                    <option value="Yakında">Yakında</option>
                    <option value="Tamamlanan">Tamamlanan</option>
                  </select>
                </div>

                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Tarih</label>
                  <input
                    type="text"
                    placeholder="Örn: 15 Haziran 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  />
                </div>

                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Katılımcı Sayısı</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={participantCount}
                    onChange={(e) => setParticipantCount(Number(e.target.value))}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  />
                </div>
              </div>

              <div>
                <label className={`font-bold ${titleColor} mb-1 block`}>Özet / Açıklama *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Faaliyet özeti..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>

              <div>
                <label className={`font-bold ${titleColor} mb-1 block`}>Görsel URL (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: /images/workshop.png"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>
            </div>

            <div className={`pt-3 flex justify-end gap-3 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <button
                type="button"
                onClick={resetForm}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${subColor} hover:${titleColor}`}
              >
                İptal
              </button>
              <button
                type="submit"
                className="bg-[#0A5C3A] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#128C59] transition-all inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingItem ? "Güncelle" : "Panoya Kaydet"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-6 space-y-4 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150`}>
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className={`text-lg font-bold font-headings ${titleColor}`}>Faaliyeti Sil</h3>
              <p className={`text-xs ${subColor} mt-1.5 leading-relaxed`}>
                "<span className="font-bold text-rose-500">{itemToDelete.title}</span>" faaliyetini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold ${subColor} hover:${titleColor} transition-colors`}
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/25"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
