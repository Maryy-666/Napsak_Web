"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Award,
  Calendar,
  Ticket,
  CheckCircle2,
  BarChart3,
  PieChart,
  RefreshCw,
  Zap,
  Star,
} from "lucide-react";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { EventsRepository, EventItem, EventApplication } from "@/lib/eventsStore";

export default function AdminKatilimPage() {
  const { isDark } = useAdminTheme();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dbEvents, dbApps] = await Promise.all([
        EventsRepository.fetchEventsFromDB(),
        EventsRepository.fetchApplicationsFromDB(),
      ]);
      setEvents(dbEvents);
      setApplications(dbApps);
    } catch (err) {
      console.error("Katılım verileri yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalApplications = applications.length;
  const approvedApplications = applications.filter((a) => a.status === "Onaylandı").length;
  const totalCapacity = events.reduce((sum, e) => sum + (e.quota || 50), 0);
  const fillRate = totalCapacity > 0 ? Math.min(100, Math.round((totalApplications / totalCapacity) * 100)) : 0;

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
            <MessageSquare className="w-7 h-7 text-[#0A5C3A]" />
            Etkileşim & Katılım Analytics
          </h1>
          <p
            className={`text-xs font-medium mt-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Topluluk etkinliklerinin doluluk oranları, katılımcı dönüşleri ve etkileşim metrikleri.
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
          <span>Verileri Güncelle</span>
        </button>
      </div>

      {/* İSTATİSTİK GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Etkinlik Başvurusu
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center font-bold">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            {totalApplications}
          </p>
          <p className="text-[11px] text-[#0A5C3A] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> %18 artış gösterdi
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Kontenjan Doluluk Oranı
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
            %{fillRate}
          </p>
          <div className="w-full bg-slate-700/20 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${fillRate}%` }}
            />
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Onaylanan Katılımcı
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
            {approvedApplications}
          </p>
          <p className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Kabul Edilen Adaylar
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Memnuniyet Puanı
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${isDark ? "text-amber-400" : "text-amber-600"}`}>
            4.9 / 5.0
          </p>
          <p className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Katılımcı Anket Ortalaması
          </p>
        </div>
      </div>

      {/* ETKİNLİK BAZLI DOLULUK VE ANALİZ TABLOSU */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-white border-slate-200 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-bold font-headings ${isDark ? "text-white" : "text-slate-900"}`}>
            Etkinlik Katılım Analizi
          </h2>
          <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Toplam {events.length} Etkinlik
          </span>
        </div>

        {events.length === 0 ? (
          <p className={`text-xs text-center py-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Henüz analiz edilecek etkinlik bulunmuyor.
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((evt) => {
              const evtApps = applications.filter((a) => a.eventId === evt.id);
              const capacity = evt.quota || 50;
              const percent = Math.min(100, Math.round((evtApps.length / capacity) * 100));

              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A5C3A]/10 text-[#0A5C3A]">
                        {evt.categoryLabel || evt.category || "Genel"}
                      </span>
                      <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        {evt.date}
                      </span>
                    </div>
                    <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {evt.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right min-w-[100px]">
                      <div className={`text-xs font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                        {evtApps.length} / {capacity} Başvuru
                      </div>
                      <div className="text-[11px] text-[#0A5C3A] font-semibold mt-0.5">
                        %{percent} Doluluk
                      </div>
                    </div>

                    <div className="w-32 bg-slate-700/20 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent >= 90
                            ? "bg-emerald-500"
                            : percent >= 50
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
