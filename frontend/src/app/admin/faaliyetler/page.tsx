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
} from "lucide-react";
import {
  FaaliyetItem,
  FaaliyetStatus,
  BoardCardType,
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
  const [type, setType] = useState<BoardCardType>("sticky");
  const [category, setCategory] = useState("Toplumsal Etki");
  const [team, setTeam] = useState("N'apsak Ekibi");
  const [status, setStatus] = useState<FaaliyetStatus>("Devam Eden");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [image, setImage] = useState("");
  const [tagText, setTagText] = useState("");
  const [noteColor, setNoteColor] = useState("sage");

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
    setType("sticky");
    setCategory("Toplumsal Etki");
    setTeam("N'apsak Ekibi");
    setStatus("Devam Eden");
    setDate("");
    setLocation("");
    setSummary("");
    setParticipantCount(0);
    setImage("");
    setTagText("");
    setNoteColor("sage");
    setEditingItem(null);
    setShowAddModal(false);
  };

  const getColorPreset = (color: string) => {
    switch (color) {
      case "mint":
        return {
          noteBg: "bg-[#F0FDF4]",
          borderColor: "border-[#BBF7D0]",
          badgeBg: "bg-[#166534]",
          badgeText: "text-white",
          tapeColor: "bg-emerald-200/60 border-emerald-300/40",
          pinColor: "text-emerald-700",
        };
      case "cream":
        return {
          noteBg: "bg-[#FAF9F4]",
          borderColor: "border-[#E5E2D5]",
          badgeBg: "bg-[#0A5C3A]/15",
          badgeText: "text-[#0A5C3A]",
          tapeColor: "bg-amber-200/50 border-amber-300/40",
          pinColor: "text-[#0A5C3A]",
        };
      case "olive":
        return {
          noteBg: "bg-[#F3F7EE]",
          borderColor: "border-[#D8E4CB]",
          badgeBg: "bg-[#3B5226]",
          badgeText: "text-white",
          tapeColor: "bg-[#D8E4CB]/60 border-[#B5C99A]/40",
          pinColor: "text-[#3B5226]",
        };
      case "white":
        return {
          noteBg: "bg-white",
          borderColor: "border-[#DDE7E1]",
          badgeBg: "bg-[#0A5C3A]",
          badgeText: "text-white",
          tapeColor: "bg-emerald-200/50 border-emerald-300/40",
          pinColor: "text-[#0A5C3A]",
        };
      default: // sage (#EAF5EF)
        return {
          noteBg: "bg-[#EAF5EF]",
          borderColor: "border-[#CDEAD9]",
          badgeBg: "bg-[#0A5C3A]",
          badgeText: "text-white",
          tapeColor: "bg-[#86EFAC]/50 border-[#4ADE80]/40",
          pinColor: "text-[#0A5C3A]",
        };
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      alert("Lütfen başlık ve özet alanlarını doldurunuz.");
      return;
    }

    const style = getColorPreset(noteColor);
    const rotationOptions = ["rotate-2", "-rotate-2", "rotate-3", "-rotate-3"];
    const randomRotation = rotationOptions[Math.floor(Math.random() * rotationOptions.length)];

    if (editingItem) {
      FaaliyetlerRepository.updateFaaliyet(editingItem.id, {
        title: title.trim(),
        type,
        category,
        team: team.trim(),
        status,
        date: date.trim() || "2025",
        location: location.trim() || "Genel",
        summary: summary.trim(),
        participantCount: participantCount > 0 ? participantCount : undefined,
        image: image.trim() || undefined,
        tagText: tagText.trim() || undefined,
        ...style,
      });
    } else {
      FaaliyetlerRepository.addFaaliyet({
        title: title.trim(),
        type,
        category,
        team: team.trim() || "N'apsak Ekibi",
        status,
        date: date.trim() || "2025",
        location: location.trim() || "Genel",
        summary: summary.trim(),
        participantCount: participantCount > 0 ? participantCount : undefined,
        image: image.trim() || undefined,
        tagText: tagText.trim() || undefined,
        rotation: randomRotation,
        ...style,
      });
    }

    refreshData();
    resetForm();
  };

  const openEdit = (item: FaaliyetItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setType(item.type);
    setCategory(item.category);
    setTeam(item.team);
    setStatus(item.status);
    setDate(item.date);
    setLocation(item.location);
    setSummary(item.summary);
    setParticipantCount(item.participantCount || 0);
    setImage(item.image || "");
    setTagText(item.tagText || "");
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

  return (
    <div className={`space-y-6 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
      {/* Üst Başlık & Eylemler */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A5C3A] text-white">
              <Pin className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold font-headings">Faaliyetler & Pano Yönetimi</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            `/faaliyetler` mantar panosunda görünen sticky notları ve faaliyet kartlarını yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/faaliyetler"
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            <Eye className="h-4 w-4 text-[#0A5C3A]" />
            Panoyu Canlı Gör
          </Link>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 shadow-xs hover:bg-slate-50"
            title="Varsayılana Sıfırla"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#0A5C3A] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#08482D] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Yeni Not / Faaliyet Ekle
          </button>
        </div>
      </div>

      {/* Arama ve Filtreleme Barı */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Faaliyet veya not ara..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs font-medium outline-none focus:border-[#0A5C3A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "Devam Eden", "Yakında", "Tamamlanan"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                selectedStatusFilter === st
                  ? "bg-[#0A5C3A] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "all" ? "Tümü" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Tablo / Kart Listesi */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Kart / Not Başlığı</th>
                <th className="p-4">Tip</th>
                <th className="p-4">Kategori & Ekip</th>
                <th className="p-4">Durum</th>
                <th className="p-4">Katılımcı</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFaaliyetler.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="font-extrabold text-slate-900 text-sm">{item.title}</div>
                    <div className="text-slate-500 line-clamp-1 max-w-md">{item.summary}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-md bg-[#EAF5EF] px-2.5 py-1 text-[11px] font-extrabold text-[#0A5C3A] uppercase">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{item.category}</div>
                    <div className="text-slate-400 text-[11px]">{item.team}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                        item.status === "Devam Eden"
                          ? "bg-[#0A5C3A] text-white"
                          : item.status === "Yakında"
                          ? "bg-[#EAF5EF] text-[#0A5C3A]"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-700">
                    {item.participantCount ? `👥 ${item.participantCount}` : "-"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-[#0A5C3A]"
                      title="Düzenle"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete({ id: item.id, title: item.title })}
                      className="rounded-lg p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-headings text-slate-900">
                {editingItem ? "Faaliyet / Sticky Not Düzenle" : "Yeni Faaliyet veya Sticky Not Ekle"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Başlık *
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Kitap Bağış Kampanyası"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kart Tipi
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as BoardCardType)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                  >
                    <option value="sticky">Sticky Note (Post-it)</option>
                    <option value="photo">Fotoğraf Kartı</option>
                    <option value="polaroid">Polaroid Tarzı Fotoğraf</option>
                    <option value="motto">Motto / El Yazısı Not</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Not Rengi (Marka Tonları)
                  </label>
                  <select
                    value={noteColor}
                    onChange={(e) => setNoteColor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                  >
                    <option value="sage">Adaçayı Yeşili (#EAF5EF)</option>
                    <option value="mint">Okaliptüs Yeşili (#F0FDF4)</option>
                    <option value="cream">Sıcak Krem Keten (#FAF9F4)</option>
                    <option value="olive">Zeytin / Fıstık Yeşili (#F3F7EE)</option>
                    <option value="white">Polaroid Beyaz (#FFFFFF)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kategori
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Örn: Toplumsal Etki"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Sorumlu Ekip
                  </label>
                  <input
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    placeholder="Örn: Sosyal Sorumluluk Ekibi"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Durum
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FaaliyetStatus)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                  >
                    <option value="Devam Eden">Devam Eden</option>
                    <option value="Yakında">Yakında</option>
                    <option value="Tamamlanan">Tamamlanan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tarih
                  </label>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Örn: 15 Haziran 2025"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Katılımcı Sayısı
                  </label>
                  <input
                    type="number"
                    value={participantCount}
                    onChange={(e) => setParticipantCount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Özet / Açıklama *
                </label>
                <textarea
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Sticky note üzerinde görünecek kısa açıklama..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Görsel URL (Opsiyonel)
                </label>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Örn: /images/workshop.png"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium outline-none focus:border-[#0A5C3A]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0A5C3A] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#08482D]"
                >
                  {editingItem ? "Güncelle" : "Panoya Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <h3 className="text-base font-bold font-headings text-slate-900">
              Notu Silmek İstediğinize Emin Misiniz?
            </h3>
            <p className="text-xs text-slate-500">
              <strong className="text-slate-800">{itemToDelete.title}</strong> notu panodan kalıcı olarak kaldırılacaktır.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
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
