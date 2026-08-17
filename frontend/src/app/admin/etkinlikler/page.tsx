"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  Search,
  Zap,
  Building2,
  X,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Save,
} from "lucide-react";
import { EventsRepository, EventItem, EventApplication } from "../../../lib/eventsStore";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export default function AdminEtkinliklerPage() {
  const { isDark } = useAdminTheme();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // MODAL STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [viewingApplicationsEvent, setViewingApplicationsEvent] = useState<EventItem | null>(null);
  const [eventToDelete, setEventToDelete] = useState<{ id: string; title: string } | null>(null);

  // FORM STATES (EKLEME & DÜZENLEME)
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventItem["category"]>("programlar");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<EventItem["status"]>("aktif");
  const [partner, setPartner] = useState("");
  const [quota, setQuota] = useState(100);
  const [description, setDescription] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setEvents(EventsRepository.getAllEvents());
    setApplications(EventsRepository.getApplications());
  };

  // İSTATİSTİKLER
  const activeCount = events.filter((e) => e.status === "aktif").length;
  const pastCount = events.filter((e) => e.status === "gecmis").length;
  const totalAppsCount = applications.length;

  // FİLTRELEME
  const filteredEvents = events.filter((evt) => {
    const matchesStatus =
      selectedStatusFilter === "all" || evt.status === selectedStatusFilter;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // KONTROLLER
  const handleToggleStatus = (evt: EventItem) => {
    const nextStatus = evt.status === "aktif" ? "gecmis" : "aktif";
    EventsRepository.updateEvent(evt.id, { status: nextStatus });
    refreshData();
  };

  const handleDeleteEvent = (id: string, eventTitle: string) => {
    setEventToDelete({ id, title: eventTitle });
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      EventsRepository.deleteEvent(eventToDelete.id);
      refreshData();
      setEventToDelete(null);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !location.trim()) {
      alert("Lütfen zorunlu alanları (Başlık, Tarih, Konum) doldurunuz.");
      return;
    }

    const categoryLabels: Record<string, string> = {
      programlar: "Programlar & Sosyal",
      teknoloji: "Teknoloji & İnovasyon",
      sanat: "Sanat & Estetik",
      "cevre-saglik": "Çevre ve Sağlık",
    };

    EventsRepository.addEvent({
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category] || "Genel Etkinlik",
      date: date.trim(),
      time: time.trim() || "14:00 - 18:00",
      location: location.trim(),
      status,
      partner: partner.trim() || undefined,
      quota,
      description: description.trim() || "Etkinlik detayları güncellenecektir.",
    });

    refreshData();
    closeModal();
  };

  const openEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setCategory(evt.category);
    setDate(evt.date);
    setTime(evt.time);
    setLocation(evt.location);
    setStatus(evt.status);
    setPartner(evt.partner || "");
    setQuota(evt.quota || 100);
    setDescription(evt.description);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const categoryLabels: Record<string, string> = {
      programlar: "Programlar & Sosyal",
      teknoloji: "Teknoloji & İnovasyon",
      sanat: "Sanat & Estetik",
      "cevre-saglik": "Çevre ve Sağlık",
    };

    EventsRepository.updateEvent(editingEvent.id, {
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category] || "Genel Etkinlik",
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      status,
      partner: partner.trim() || undefined,
      quota,
      description: description.trim(),
    });

    refreshData();
    closeModal();
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
    setViewingApplicationsEvent(null);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setPartner("");
    setDescription("");
  };

  // TEMA STİLLERİ
  const cardBg = isDark ? "bg-[#0F1623] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-[#0F1115] shadow-xs";
  const innerCardBg = isDark ? "bg-[#141C2E] border-slate-800 text-slate-200" : "bg-[#F8F9FA] border-slate-200 text-[#0F1115]";
  const tableHeaderBg = isDark ? "bg-[#141C2E] text-slate-400 border-slate-800/60" : "bg-slate-50/60 text-[#5F6773] border-slate-100";
  const tableRowBorder = isDark ? "border-slate-800/60 hover:bg-[#141C2E]/40" : "border-slate-100 hover:bg-slate-50/80";
  const inputBg = isDark ? "bg-[#141C2E] border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-[#0F1115]";
  const modalBg = isDark ? "bg-[#0F1623] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-[#0F1115] shadow-2xl";
  const titleColor = isDark ? "text-white" : "text-[#0F1115]";
  const subColor = isDark ? "text-slate-400" : "text-[#5F6773]";

  return (
    <div className="space-y-6 select-none font-sans">
      {/* ÜST BAŞLIK VE HIZLI EYLEM (HAFİF YUMUŞATILMIŞ) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold font-headings tracking-tight ${titleColor}`}>Etkinlik Yönetimi</h1>
          <p className={`text-xs ${subColor} mt-1 font-normal`}>
            Topluluk zirvelerini, atölyelerini ve geçmiş faaliyetlerini yönetin, yeni etkinlikler yayınlayın.
          </p>
        </div>
        <button
          onClick={() => {
            closeModal();
            setShowAddModal(true);
          }}
          className="bg-[#0A5C3A] hover:bg-[#128C59] text-white px-4.5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Yeni Etkinlik Oluştur</span>
        </button>
      </div>

      {/* İSTATİSTİK KARTLARI (YUMUŞATILMIŞ VE ORANTILI DÜZEN) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${cardBg} p-4 sm:p-4.5 rounded-2xl border flex items-center justify-between transition-all shadow-xs`}>
          <div>
            <span className={`text-[11.5px] ${subColor} font-medium block`}>Aktif Etkinlikler</span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0A5C3A] font-headings mt-1 tracking-tight">{activeCount} Yayında</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
            <Zap className="w-4.5 h-4.5 stroke-[2]" />
          </div>
        </div>

        <div className={`${cardBg} p-4 sm:p-4.5 rounded-2xl border flex items-center justify-between transition-all shadow-xs`}>
          <div>
            <span className={`text-[11.5px] ${subColor} font-medium block`}>Geçmiş Faaliyetler</span>
            <h3 className="text-lg sm:text-xl font-bold text-[#128C59] font-headings mt-1 tracking-tight">{pastCount} Tamamlandı</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#128C59]/10 text-[#128C59] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5 stroke-[2]" />
          </div>
        </div>

        <div className={`${cardBg} p-4 sm:p-4.5 rounded-2xl border flex items-center justify-between transition-all shadow-xs`}>
          <div>
            <span className={`text-[11.5px] ${subColor} font-medium block`}>Toplam Başvuru</span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0A5C3A] font-headings mt-1 tracking-tight">{totalAppsCount} Kayıt</h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
            <Users className="w-4.5 h-4.5 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* ETKİNLİKLER TABLOSU VE FİLTRELER (OVALİMSİ VE FERAH DÜZEN) */}
      <div className={`${cardBg} rounded-3xl border overflow-hidden transition-colors shadow-xs`}>
        <div className={`p-5 sm:p-6 border-b ${isDark ? "border-slate-800/80" : "border-slate-200"} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          {/* BELİRGİN OVAL ARAMA ÇUBUĞU */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#0A5C3A] absolute left-4 top-3.5 stroke-[2.5]" />
            <input
              type="text"
              placeholder="Etkinlik, partner veya konum ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border-2 rounded-full pl-11 pr-4 py-2.5 text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:border-[#0A5C3A] ${isDark
                ? "bg-[#141C2E] border-slate-700 text-slate-100 placeholder:text-slate-500"
                : "bg-white border-slate-300 text-[#0F1115] placeholder:text-slate-400 shadow-xs"
                }`}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedStatusFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedStatusFilter === "all"
                ? isDark
                  ? "bg-white text-slate-900 shadow-sm"
                  : "bg-[#0A5C3A] text-white shadow-sm"
                : isDark
                  ? "bg-[#141C2E] text-slate-400 hover:text-white"
                  : "bg-slate-100 text-[#5F6773] hover:bg-slate-200"
                }`}
            >
              Tümü ({events.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter("aktif")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedStatusFilter === "aktif"
                ? "bg-emerald-600 text-white shadow-sm"
                : isDark
                  ? "bg-[#141C2E] text-slate-400 hover:text-white"
                  : "bg-slate-100 text-[#5F6773] hover:bg-slate-200"
                }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              onClick={() => setSelectedStatusFilter("gecmis")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedStatusFilter === "gecmis"
                ? "bg-slate-700 text-white shadow-sm"
                : isDark
                  ? "bg-[#141C2E] text-slate-400 hover:text-white"
                  : "bg-slate-100 text-[#5F6773] hover:bg-slate-200"
                }`}
            >
              Geçmiş ({pastCount})
            </button>
          </div>
        </div>

        {/* GERÇEKTEN FERAH VE NEFES ALAN DİKEY AKAN TABLO LİSTESİ */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className={`${tableHeaderBg} uppercase font-extrabold text-[11px] tracking-wider border-b border-slate-100 dark:border-slate-800/60`}>
              <tr>
                <th className="py-4.5 px-6 min-w-[300px]">Etkinlik Adı</th>
                <th className="py-4.5 px-3.5 whitespace-nowrap">Kategori</th>
                <th className="py-4.5 px-5 whitespace-nowrap">Tarih & Saat</th>
                <th className="py-4.5 px-5 min-w-[170px]">Konum</th>
                <th className="py-4.5 px-3.5 whitespace-nowrap">Durum</th>
                <th className="py-4.5 px-5 whitespace-nowrap">Başvuranlar</th>
                <th className="py-4.5 px-6 text-right whitespace-nowrap">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className={`border-b border-slate-100 dark:border-slate-800/50 last:border-b-0 transition-colors ${isDark ? "hover:bg-[#141C2E]/40" : "hover:bg-slate-50/80"}`}>
                  <td className="py-6 px-6 min-w-[300px]">
                    <div className={`text-sm font-semibold leading-relaxed ${titleColor}`}>{evt.title}</div>
                    {evt.partner && (
                      <div className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                        <span className="opacity-70">Partner:</span>
                        <span className="font-semibold">{evt.partner}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-6 px-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold inline-block whitespace-nowrap ${isDark ? "bg-slate-800 text-slate-200 border border-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                      {evt.categoryLabel}
                    </span>
                  </td>
                  <td className={`py-6 px-5 font-medium whitespace-nowrap ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                    <div className="text-xs font-bold">{evt.date}</div>
                    <div className={`text-xs ${subColor} mt-1 font-normal`}>{evt.time}</div>
                  </td>
                  <td className={`py-6 px-5 font-medium ${subColor}`}>
                    <div className="text-xs leading-relaxed max-w-[190px]">{evt.location}</div>
                  </td>
                  <td className="py-6 px-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(evt)}
                      title="Durumu Aktif/Geçmiş Yap"
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition-all whitespace-nowrap ${evt.status === "aktif"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                        : isDark
                          ? "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                    >
                      {evt.status === "aktif" ? "● Aktif" : "✓ Geçmiş"}
                    </button>
                  </td>
                  <td className="py-6 px-5 whitespace-nowrap">
                    <button
                      onClick={() => setViewingApplicationsEvent(evt)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <Users className="w-3.5 h-3.5 stroke-[2]" />
                      <span>{evt.appliedCount} Kayıt</span>
                    </button>
                  </td>
                  <td className="py-6 px-6 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(evt)}
                      className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 transition-all shadow-xs inline-flex items-center justify-center"
                      title="Etkinliği Düzenle"
                    >
                      <Edit3 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 hover:scale-105 active:scale-95 transition-all shadow-xs inline-flex items-center justify-center"
                      title="Etkinliği Sil"
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

      {/* -------------------------------------------------------------
          YENİ ETKİNLİK EKLE / DÜZENLE MODALI
      ------------------------------------------------------------- */}
      {(showAddModal || editingEvent) && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            className={`${modalBg} rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <h3 className={`text-base font-bold font-headings ${titleColor}`}>
                {editingEvent ? "Etkinliği Düzenle" : "Yeni Etkinlik Oluştur"}
              </h3>
              <button type="button" onClick={closeModal} className={`${subColor} hover:${titleColor} font-bold`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className={`font-bold ${titleColor} mb-1 block`}>Etkinlik Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Yapay Zeka Atölyesi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Kategori *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  >
                    <option value="programlar">Programlar & Sosyal</option>
                    <option value="teknoloji">Teknoloji & İnovasyon</option>
                    <option value="sanat">Sanat & Estetik</option>
                    <option value="cevre-saglik">Çevre ve Sağlık</option>
                  </select>
                </div>

                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Yayın Durumu *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  >
                    <option value="aktif">Aktif / Yayında (Başvuru Açık)</option>
                    <option value="gecmis">Geçmiş (Etkinlik Tamamlandı)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Tarih *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 26 Eylül 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  />
                </div>
                <div>
                  <label className={`font-bold ${titleColor} mb-1 block`}>Saat</label>
                  <input
                    type="text"
                    placeholder="Örn: 14:00 - 18:00"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                  />
                </div>
              </div>

              <div>
                <label className={`font-bold ${titleColor} mb-1 block`}>Konum *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Beylikdüzü Smart-B Kültür Merkezi veya Online"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>

              <div>
                <label className={`font-bold ${titleColor} mb-1 block`}>İş Birliği / Partner (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: 1923 Gençlik Topluluğu"
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>

              <div>
                <label className={`font-bold ${titleColor} mb-1 block`}>Açıklama</label>
                <textarea
                  rows={4}
                  placeholder="Etkinlik amaçları ve detayları..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full ${inputBg} rounded-xl p-2.5 focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>
            </div>

            <div className={`pt-3 flex justify-end gap-3 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <button
                type="button"
                onClick={closeModal}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${subColor} hover:${titleColor}`}
              >
                İptal
              </button>
              <button
                type="submit"
                className="bg-[#0A5C3A] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#128C59] transition-all inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingEvent ? "Güncelle" : "Kaydet ve Yayınla"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* -------------------------------------------------------------
          GELEN BAŞVURULARI İNCELEME MODALI
      ------------------------------------------------------------- */}
      {viewingApplicationsEvent && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
                  Etkinlik Başvuruları Listesi
                </span>
                <h3 className={`text-base font-bold font-headings mt-1 ${titleColor}`}>
                  {viewingApplicationsEvent.title}
                </h3>
              </div>
              <button type="button" onClick={closeModal} className={`${subColor} hover:${titleColor} font-bold`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {applications.filter((a) => a.eventId === viewingApplicationsEvent.id).length === 0 ? (
              <div className={`text-center py-8 ${subColor} text-xs`}>
                Bu etkinliğe henüz kullanıcı başvurusu yapılmamıştır.
              </div>
            ) : (
              <div className="space-y-3">
                {applications
                  .filter((a) => a.eventId === viewingApplicationsEvent.id)
                  .map((app) => (
                    <div
                      key={app.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${innerCardBg}`}
                    >
                      <div className={`flex items-center justify-between font-bold ${titleColor}`}>
                        <span>{app.fullName}</span>
                        <span className={`text-[10px] font-normal ${subColor}`}>{app.appliedAt}</span>
                      </div>
                      <div className={`flex flex-wrap items-center gap-3 text-[11px] ${subColor}`}>
                        <span>✉ {app.email}</span>
                        <span>☎ {app.phone}</span>
                        <span className="text-amber-600 font-medium">📍 {app.city}</span>
                      </div>
                      <div className="text-emerald-600 font-semibold text-[11px] flex flex-wrap gap-2">
                        <span>🎓 {app.school}</span>
                        <span>• {app.department}</span>
                        <span>• {app.grade}</span>
                      </div>
                      {app.note && (
                        <p className={`p-2.5 rounded-lg border mt-2 text-[11px] leading-relaxed ${isDark ? "bg-[#0F1623] border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}>
                          <strong className="text-emerald-600 font-bold">Beklentisi:</strong> "{app.note}"
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-[#0A5C3A] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#128C59]"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl max-w-md w-full p-6 space-y-4 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150`}>
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className={`text-lg font-bold font-headings ${titleColor}`}>Etkinliği Sil</h3>
              <p className={`text-xs ${subColor} mt-1.5 leading-relaxed`}>
                "<span className="font-bold text-rose-500">{eventToDelete.title}</span>" etkinliğini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold ${subColor} hover:${titleColor} transition-colors`}
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmDeleteEvent}
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
