"use client";

import React, { useEffect, useState } from "react";
import {
  UserPlus,
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
  Building,
  Calendar,
  FileText,
  UserCheck,
  UserX,
  Sparkles,
} from "lucide-react";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { ApplicationsRepository, ApplicationItem } from "@/lib/applicationsStore";

export default function AdminUyeliklerPage() {
  const { isDark } = useAdminTheme();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FİLTRE & ARAMA STATE'LERİ
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");

  // MODAL STATE'LERİ
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [appToDelete, setAppToDelete] = useState<ApplicationItem | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const dbApps = await ApplicationsRepository.fetchApplicationsFromDB();
      setApplications([...dbApps]);
    } catch (err) {
      console.error("APPLICATIONS LOAD ERROR:", err);
      setError("Üyelik başvuruları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshList = () => {
    setApplications([...ApplicationsRepository.getApplications()]);
  };

  // DURUM GÜNCELLEME
  const handleStatusChange = (
    id: string,
    newStatus: "Beklemede" | "Onaylandı" | "Reddedildi"
  ) => {
    ApplicationsRepository.updateStatus(id, newStatus);
    refreshList();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  // BAŞVURU SİLME
  const handleDeleteConfirm = () => {
    if (!appToDelete) return;
    ApplicationsRepository.deleteApplication(appToDelete.id);
    refreshList();
    setAppToDelete(null);
    if (selectedApp && selectedApp.id === appToDelete.id) {
      setSelectedApp(null);
    }
  };

  // FİLTRELEME
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.phone && app.phone.includes(searchQuery));

    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;

    const matchesProgram =
      programFilter === "all" || app.program === programFilter;

    return matchesSearch && matchesStatus && matchesProgram;
  });

  // İSTATİSTİKLER
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "Beklemede").length;
  const approvedCount = applications.filter((a) => a.status === "Onaylandı").length;
  const rejectedCount = applications.filter((a) => a.status === "Reddedildi").length;

  const programsList = Array.from(new Set(applications.map((a) => a.program)));

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-black font-headings tracking-tight flex items-center gap-2.5 ${
              isDark ? "text-white" : "text-[#0F1115]"
            }`}
          >
            <UserPlus className="w-7 h-7 text-[#0A5C3A]" />
            Üyelik Başvuruları
          </h1>
          <p
            className={`text-xs font-medium mt-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Derneğe katılmak için başvuran gençlerin kayıt talepleri ve başvuru süreçleri.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
              : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#0A5C3A]" : ""}`} />
          <span>Yenile</span>
        </button>
      </div>

      {/* METRİK KARTLARI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#0F1623] border-slate-800/80"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Toplam Başvuru
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            {totalCount}
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#0F1623] border-slate-800/80"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Bekleyenler
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? "text-amber-400" : "text-amber-600"}`}>
            {pendingCount}
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#0F1623] border-slate-800/80"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Onaylanan Üyeler
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
            {approvedCount}
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#0F1623] border-slate-800/80"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Reddedilenler
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? "text-rose-400" : "text-rose-600"}`}>
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* FİLTRELEME & ARAMA ÇUBUĞU */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
          isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
        }`}
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="İsim, e-posta veya telefon ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium border outline-none transition-all ${
              isDark
                ? "bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus:border-[#0A5C3A]"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0A5C3A]"
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Program Filtresi */}
          <div className="flex items-center gap-1.5 min-w-[140px]">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-medium border outline-none cursor-pointer ${
                isDark
                  ? "bg-slate-900/60 border-slate-800 text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <option value="all">Tüm Programlar</option>
              {programsList.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          {/* Durum Filtresi */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`py-2 px-3 rounded-xl text-xs font-medium border outline-none cursor-pointer ${
              isDark
                ? "bg-slate-900/60 border-slate-800 text-slate-200"
                : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="Beklemede">Beklemede</option>
            <option value="Onaylandı">Onaylandı</option>
            <option value="Reddedildi">Reddedildi</option>
          </select>
        </div>
      </div>

      {/* TABLO BÖLÜMÜ */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
        }`}
      >
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0A5C3A]" />
            <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Üyelik başvuruları yükleniyor...
            </p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center px-4">
            <UserPlus className="w-10 h-10 text-slate-400/50 stroke-1" />
            <p className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Başvuru Bulunamadı
            </p>
            <p className={`text-xs max-w-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Kriterlere uyan üyelik başvurusu bulunmuyor. Arama filtrenizi temizleyip tekrar deneyin.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                    isDark
                      ? "border-slate-800/80 bg-slate-900/40 text-slate-400"
                      : "border-slate-200 bg-slate-50/80 text-slate-500"
                  }`}
                >
                  <th className="py-3.5 px-4">Başvuran Kişi</th>
                  <th className="py-3.5 px-4">İletişim</th>
                  <th className="py-3.5 px-4">Tercih Edilen Ekip/Program</th>
                  <th className="py-3.5 px-4">Tarih</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs font-medium ${isDark ? "divide-slate-800/60" : "divide-slate-200"}`}>
                {filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-slate-900/50 text-slate-200" : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold">{app.fullName}</div>
                      {app.school && (
                        <div className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {app.school} {app.department ? `• ${app.department}` : ""}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          {app.email}
                        </span>
                        {app.phone && app.phone !== "-" && (
                          <span className={`flex items-center gap-1 text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            {app.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          isDark
                            ? "bg-slate-800 text-slate-300 border border-slate-700"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {app.program}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {new Date(app.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          app.status === "Onaylandı"
                            ? isDark
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : app.status === "Reddedildi"
                            ? isDark
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                            : isDark
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {app.status === "Onaylandı" && <CheckCircle2 className="w-3 h-3" />}
                        {app.status === "Reddedildi" && <XCircle className="w-3 h-3" />}
                        {app.status === "Beklemede" && <Clock className="w-3 h-3" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          title="Detayları Gör"
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAppToDelete(app)}
                          title="Sil"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
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

      {/* DETAY MODALI */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 space-y-5 shadow-2xl transition-all ${
              isDark ? "bg-[#0F1623] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#0A5C3A] uppercase tracking-wider">
                  Üyelik Başvuru Detayı
                </span>
                <h3 className="text-xl font-bold font-headings mt-0.5">{selectedApp.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <Mail className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                <div>
                  <div className={`text-[10px] font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>E-posta Adresi</div>
                  <div className="font-semibold text-sm">{selectedApp.email}</div>
                </div>
              </div>

              {selectedApp.phone && (
                <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <Phone className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                  <div>
                    <div className={`text-[10px] font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Telefon</div>
                    <div className="font-semibold">{selectedApp.phone}</div>
                  </div>
                </div>
              )}

              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <Building className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                <div>
                  <div className={`text-[10px] font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Tercih Edilen Ekip / Program</div>
                  <div className="font-semibold">{selectedApp.program}</div>
                </div>
              </div>

              {selectedApp.note && (
                <div className={`p-3.5 rounded-xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <div className={`text-[10px] font-semibold mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Başvuru Notu / Ön Yazı</div>
                  <p className="leading-relaxed text-xs italic">{selectedApp.note}</p>
                </div>
              )}

              {selectedApp.cvUrl && (
                <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                    <span className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                      {selectedApp.cvFileName || "Başvuran CV / Özgeçmiş"}
                    </span>
                  </div>
                  <a
                    href={selectedApp.cvUrl}
                    download={selectedApp.cvFileName || "özgeçmiş.pdf"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-colors shrink-0"
                  >
                    CV İndir / Görüntüle
                  </a>
                </div>
              )}
            </div>

            {/* DURUM GÜNCELLEME BUTONLARI */}
            <div className="pt-3 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Durumu Güncelle:
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleStatusChange(selectedApp.id, "Onaylandı")}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Onayla
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp.id, "Beklemede")}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Beklemeye Al
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp.id, "Reddedildi")}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reddet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SİLME MODALI */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isDark ? "bg-[#0F1623] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3 text-rose-500">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center font-bold">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-headings">Başvuruyu Sil</h3>
            </div>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              <strong>{appToDelete.fullName}</strong> isimli adayın üyelik başvurusunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAppToDelete(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                İptal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
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
