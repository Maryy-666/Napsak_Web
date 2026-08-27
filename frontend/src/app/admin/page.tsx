"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  FileCheck2,
  FileText,
  Users,
  UserPlus,
  Ticket,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { ApplicationsRepository } from "@/lib/applicationsStore";
import { EventsRepository } from "@/lib/eventsStore";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function AdminDashboardPage() {
  const { isDark } = useAdminTheme();
  const [userCount, setUserCount] = useState<number>(0);
  const [pendingAppCount, setPendingAppCount] = useState<number>(0);
  const [activeEventCount, setActiveEventCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        setLoading(true);
        const [apps, events] = await Promise.all([
          ApplicationsRepository.fetchApplicationsFromDB(),
          EventsRepository.fetchEventsFromDB(),
        ]);
        setPendingAppCount(apps.filter((a) => a.status === "Beklemede").length);
        setActiveEventCount(events.length);

        // Fetch user count from API
        const userRes = await fetch("/api/users").catch(() => null);
        if (userRes && userRes.ok) {
          const userData = await userRes.json();
          if (Array.isArray(userData.data)) {
            setUserCount(userData.data.length);
          } else if (Array.isArray(userData)) {
            setUserCount(userData.length);
          }
        }
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardStats();
  }, []);

  return (
    <div className="space-y-8 select-none font-sans">
      <div>
        <h1 className={`text-2xl font-bold font-headings ${isDark ? "text-white" : "text-slate-900"}`}>
          Yönetim Paneli Genel Bakış
        </h1>
        <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Topluluk canlı verileri ve yönetim modülleri.
        </p>
      </div>

      {/* METRİK KARTLARI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-colors shadow-xs ${
            isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-[#0A5C3A]/5 border-[#0A5C3A]/20"
          }`}
        >
          <div>
            <span className={`text-xs font-semibold block ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Kayıtlı Kullanıcılar
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A5C3A] font-headings mt-1">
              {loading ? "..." : userCount || 12}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center font-bold">
            <Users className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-colors shadow-xs ${
            isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-[#128C59]/5 border-[#128C59]/20"
          }`}
        >
          <div>
            <span className={`text-xs font-semibold block ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Bekleyen Üyelik Başvurusu
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#128C59] font-headings mt-1">
              {loading ? "..." : pendingAppCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#128C59]/10 text-[#128C59] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-colors shadow-xs ${
            isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-[#0A5C3A]/5 border-[#0A5C3A]/20"
          }`}
        >
          <div>
            <span className={`text-xs font-semibold block ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Aktif Etkinlikler
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A5C3A] font-headings mt-1">
              {loading ? "..." : activeEventCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-colors shadow-xs ${
            isDark ? "bg-[#0F1623] border-slate-800/80" : "bg-[#08472D]/5 border-[#08472D]/20"
          }`}
        >
          <div>
            <span className={`text-xs font-semibold block ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Yayınlanan Rapor & Dergi
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#08472D] font-headings mt-1">3</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#08472D]/10 text-[#08472D] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* MODÜL KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/uyelikler"
          className={`p-6 rounded-2xl border transition-all group shadow-xs hover:shadow-md ${
            isDark
              ? "bg-[#0F1623] border-slate-800 hover:border-emerald-500/50"
              : "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50"
          }`}
        >
          <UserPlus className="w-8 h-8 text-emerald-600 mb-4 stroke-[2]" />
          <h3 className="text-lg font-bold font-headings group-hover:text-emerald-600 transition-colors">
            Üyelik Başvuruları
          </h3>
          <p className={`text-xs mt-2 mb-4 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Topluluk üye kayıtlarını ve katılımcı başvurularını onaylayın veya yönetin.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <span>Başvurulara Git</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/etkinlikler"
          className={`p-6 rounded-2xl border transition-all group shadow-xs hover:shadow-md ${
            isDark
              ? "bg-[#0F1623] border-slate-800 hover:border-blue-500/50"
              : "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/50"
          }`}
        >
          <Calendar className="w-8 h-8 text-blue-500 mb-4 stroke-[2]" />
          <h3 className="text-lg font-bold font-headings group-hover:text-blue-500 transition-colors">
            Etkinlik Yönetimi
          </h3>
          <p className={`text-xs mt-2 mb-4 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Yeni zirve, atölye veya etkinlik oluşturun, katılım detaylarını yönetin.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500">
            <span>Yönetime Git</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/uyeler"
          className={`p-6 rounded-2xl border transition-all group shadow-xs hover:shadow-md ${
            isDark
              ? "bg-[#0F1623] border-slate-800 hover:border-teal-500/50"
              : "bg-teal-500/5 border-teal-500/20 hover:border-teal-500/50"
          }`}
        >
          <Users className="w-8 h-8 text-teal-500 mb-4 stroke-[2]" />
          <h3 className="text-lg font-bold font-headings group-hover:text-teal-500 transition-colors">
            Ekip Üyeleri Düzenleme
          </h3>
          <p className={`text-xs mt-2 mb-4 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Üye profillerini, ekip atamalarını ve görev bilgilerini düzenleyin.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-500">
            <span>Üyelere Git</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

      </div>
    </div>
  );
}
