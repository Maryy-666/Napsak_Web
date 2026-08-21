"use client";

import React, { useEffect, useState } from "react";
import {
  Ticket,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  X,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";
import { EventsRepository, EventApplication, EventItem } from "@/lib/eventsStore";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminEtkinlikBasvurulariPage() {
  const { isDark } = useAdminTheme();
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FİLTRE & ARAMA STATE'LERİ
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // DETAY MODAL & SİLME MODAL STATE'LERİ
  const [selectedApp, setSelectedApp] = useState<EventApplication | null>(null);
  const [appToDelete, setAppToDelete] = useState<EventApplication | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dbEvents, dbApps] = await Promise.all([
        EventsRepository.fetchEventsFromDB(),
        EventsRepository.fetchApplicationsFromDB(),
      ]);

      setEvents(dbEvents);
      setApplications([...dbApps]);
    } catch (err) {
      console.error("DATA LOAD ERROR:", err);
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshList = () => {
    setApplications([...EventsRepository.getApplications()]);
  };

  // DURUM GÜNCELLEME
  const handleStatusChange = async (
    appId: string,
    newStatus: "Beklemede" | "Onaylandı" | "Reddedildi"
  ) => {
    EventsRepository.updateApplicationStatus(appId, newStatus);
    refreshList();
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  // BAŞVURU SİLME
  const handleDeleteConfirm = () => {
    if (!appToDelete) return;
    EventsRepository.deleteApplication(appToDelete.id);
    refreshList();
    setAppToDelete(null);
    if (selectedApp && selectedApp.id === appToDelete.id) {
      setSelectedApp(null);
    }
  };

  // FİLTRELEME MANTIĞI
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.phone && app.phone.includes(searchQuery));

    const matchesEvent =
      selectedEventFilter === "all" ||
      app.eventId === selectedEventFilter ||
      app.eventTitle === selectedEventFilter;

    const matchesStatus =
      selectedStatusFilter === "all" || app.status === selectedStatusFilter;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  // İSTATİSTİKLER
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "Beklemede").length;
  const approvedCount = applications.filter((a) => a.status === "Onaylandı").length;
  const rejectedCount = applications.filter((a) => a.status === "Reddedildi").length;

  return (
    <div className="space-y-6 select-none font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. ÜST BAŞLIK & REFRESH                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center font-bold">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-headings">Etkinlik Başvuruları</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#0A5C3A]/10 text-[#0A5C3A]">
                {totalCount} Toplam
              </span>
            </div>
            <p className="text-xs opacity-70 mt-0.5">
              Gelen etkinlik katılım başvurularını görüntüleme ve yönetme.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-sm font-medium">
          {error}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. FİLTRE VE ARAMA BARI                                       */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`p-4 rounded-2xl border ${
          isDark ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
        } shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4`}
      >
        {/* Arama Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim, e-posta veya telefon ile ara..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border transition-colors outline-none ${
              isDark
                ? "bg-[#1F2937] border-slate-700 text-white placeholder-slate-500 focus:border-[#0A5C3A]"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0A5C3A]"
            }`}
          />
        </div>

        {/* Etkinlik Filtresi */}
        <div className="sm:w-64">
          <select
            value={selectedEventFilter}
            onChange={(e) => setSelectedEventFilter(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs border transition-colors outline-none cursor-pointer ${
              isDark
                ? "bg-[#1F2937] border-slate-700 text-white"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <option value="all">Tüm Etkinlikler</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title}
              </option>
            ))}
          </select>
        </div>

        {/* Durum Filtresi */}
        <div className="sm:w-48">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs border transition-colors outline-none cursor-pointer ${
              isDark
                ? "bg-[#1F2937] border-slate-700 text-white"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <option value="all">Tüm Durumlar ({totalCount})</option>
            <option value="Beklemede">Beklemede ({pendingCount})</option>
            <option value="Onaylandı">Onaylandı ({approvedCount})</option>
            <option value="Reddedildi">Reddedildi ({rejectedCount})</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. ANA BAŞVURU TABLOSU                                        */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs ${
          isDark ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        {loading ? (
          <div className="p-12 text-center text-sm opacity-60">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0A5C3A]" />
            Başvurular yükleniyor...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Ticket className="w-10 h-10 mx-auto opacity-30 mb-3" />
            <h3 className="font-bold text-base">Başvuru Bulunamadı</h3>
            <p className="text-xs opacity-60 mt-1">
              {searchQuery || selectedEventFilter !== "all" || selectedStatusFilter !== "all"
                ? "Seçilen filtrelere uygun başvuru kaydı bulunamadı."
                : "Henüz etkinlik katılım başvurusu yapılmamış."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                    isDark
                      ? "bg-[#1F2937]/50 border-slate-800 text-slate-400"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                >
                  <th className="py-3.5 px-4">Başvuran Kişi</th>
                  <th className="py-3.5 px-4">İletişim</th>
                  <th className="py-3.5 px-4">Başvurulan Etkinlik</th>
                  <th className="py-3.5 px-4">Tarih</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Başvuran Adı */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm font-headings">{app.fullName}</div>
                      {(app.school || app.city) && (
                        <div className="text-[11px] opacity-60 mt-0.5 flex items-center gap-1">
                          {app.city && <span>{app.city}</span>}
                          {app.city && app.school && <span>•</span>}
                          {app.school && <span className="truncate max-w-[180px]">{app.school}</span>}
                        </div>
                      )}
                    </td>

                    {/* İletişim */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{app.email}</div>
                      {app.phone && <div className="text-[11px] opacity-60 mt-0.5">{app.phone}</div>}
                    </td>

                    {/* Etkinlik Adı */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {app.eventTitle}
                      </div>
                    </td>

                    {/* Başvuru Tarihi */}
                    <td className="py-3.5 px-4 opacity-70 whitespace-nowrap">{app.appliedAt}</td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          app.status === "Onaylandı"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                            : app.status === "Reddedildi"
                            ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
                            : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                        }`}
                      >
                        {app.status === "Onaylandı" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {app.status === "Reddedildi" && <XCircle className="w-3.5 h-3.5" />}
                        {app.status === "Beklemede" && <Clock className="w-3.5 h-3.5" />}
                        {app.status}
                      </span>
                    </td>

                    {/* İşlemler */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Detay Görüntüle */}
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Durum Değiştir Hızlı Seçim */}
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(
                              app.id,
                              e.target.value as "Beklemede" | "Onaylandı" | "Reddedildi"
                            )
                          }
                          className="text-[11px] py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent cursor-pointer font-medium outline-none"
                        >
                          <option value="Beklemede">Beklemede</option>
                          <option value="Onaylandı">Onayla</option>
                          <option value="Reddedildi">Reddet</option>
                        </select>

                        {/* Sil */}
                        <button
                          type="button"
                          onClick={() => setAppToDelete(app)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Başvuruyu Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. BAŞVURU DETAY MODAL                                        */}
      {/* ------------------------------------------------------------- */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-xl p-6 relative max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-[#111827] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Modal Kapat Butonu */}
            <button
              type="button"
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-headings">Başvuru Detayı</h3>
                <p className="text-xs opacity-60">ID: {selectedApp.id}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Etkinlik Bilgisi */}
              <div className="p-3.5 rounded-xl bg-[#0A5C3A]/5 border border-[#0A5C3A]/20">
                <div className="text-[11px] font-semibold text-[#0A5C3A] uppercase tracking-wider mb-1">
                  Başvurulan Etkinlik
                </div>
                <div className="font-bold text-sm text-[#0A5C3A]">{selectedApp.eventTitle}</div>
              </div>

              {/* Kişisel Bilgiler Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] opacity-60 font-medium">Ad Soyad</div>
                  <div className="font-bold text-sm mt-0.5">{selectedApp.fullName}</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] opacity-60 font-medium">E-posta</div>
                  <div className="font-semibold text-xs mt-0.5 truncate">{selectedApp.email}</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] opacity-60 font-medium">Telefon</div>
                  <div className="font-semibold text-xs mt-0.5">{selectedApp.phone || "Belirtilmedi"}</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] opacity-60 font-medium">Şehir</div>
                  <div className="font-semibold text-xs mt-0.5">{selectedApp.city || "Belirtilmedi"}</div>
                </div>
              </div>

              {/* Eğitim Bilgileri */}
              {(selectedApp.school || selectedApp.department || selectedApp.grade) && (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] opacity-60 font-medium mb-1">Eğitim Bilgisi</div>
                  {selectedApp.school && <div><strong>Okul:</strong> {selectedApp.school}</div>}
                  {selectedApp.department && <div><strong>Bölüm:</strong> {selectedApp.department}</div>}
                  {selectedApp.grade && <div><strong>Sınıf:</strong> {selectedApp.grade}</div>}
                </div>
              )}

              {/* Kullanıcı Notu / Beklentisi */}
              {selectedApp.note && (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="text-[11px] opacity-60 font-medium mb-1">Katılım Amacı & Not</div>
                  <p className="italic leading-relaxed text-slate-700 dark:text-slate-300">
                    "{selectedApp.note}"
                  </p>
                </div>
              )}

              {/* Başvuru Tarihi & Durumu */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="opacity-60">Başvuru Tarihi: </span>
                  <span className="font-semibold">{selectedApp.appliedAt}</span>
                </div>
                <div>
                  <span className="opacity-60 mr-2">Durum:</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      selectedApp.status === "Onaylandı"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedApp.status === "Reddedildi"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              {/* Durum Değiştirme Butonları */}
              <div className="pt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApp.id, "Onaylandı")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    selectedApp.status === "Onaylandı"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Onayla
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApp.id, "Beklemede")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    selectedApp.status === "Beklemede"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Beklemeye Al
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApp.id, "Reddedildi")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    selectedApp.status === "Reddedildi"
                      ? "bg-rose-600 text-white"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Reddet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. SİLME ONAY MODALI                                          */}
      {/* ------------------------------------------------------------- */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-2xl border shadow-xl p-5 relative ${
              isDark ? "bg-[#111827] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <h3 className="font-bold text-base font-headings">Başvuruyu Sil</h3>
            <p className="text-xs opacity-70 mt-2">
              <strong>{appToDelete.fullName}</strong> isimli kullanıcının <strong>{appToDelete.eventTitle}</strong> etkinliğine yaptığı başvuruyu silmek istediğinize emin misiniz?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
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
