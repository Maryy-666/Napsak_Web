"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, FileCheck2, FileText, Network, Users } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 select-none font-sans">
      <div>
        <h1 className="text-2xl font-bold font-headings">Yönetim Paneli Genel Bakış</h1>
        <p className="text-xs opacity-70 mt-1">Topluluk verileri ve hızlı yönetim modülleri.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#0A5C3A]/20 bg-[#0A5C3A]/5 flex items-center justify-between transition-colors shadow-xs">
          <div>
            <span className="text-xs font-semibold opacity-80 block">Toplam Aktif Üye</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A5C3A] font-headings mt-1">86</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center font-bold">
            <Users className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#128C59]/20 bg-[#128C59]/5 flex items-center justify-between transition-colors shadow-xs">
          <div>
            <span className="text-xs font-semibold opacity-80 block">Bekleyen Başvuru</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#128C59] font-headings mt-1">14</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#128C59]/10 text-[#128C59] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#0A5C3A]/20 bg-[#0A5C3A]/5 flex items-center justify-between transition-colors shadow-xs">
          <div>
            <span className="text-xs font-semibold opacity-80 block">Yaklaşan Etkinlik</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A5C3A] font-headings mt-1">3</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#08472D]/20 bg-[#08472D]/5 flex items-center justify-between transition-colors shadow-xs">
          <div>
            <span className="text-xs font-semibold opacity-80 block">Yasal Metin</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#08472D] font-headings mt-1">2</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#08472D]/10 text-[#08472D] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/etkinlikler"
          className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:border-blue-500/50 transition-all group shadow-xs hover:shadow-md"
        >
          <Calendar className="w-8 h-8 text-blue-500 mb-4 stroke-[2]" />
          <h3 className="text-lg font-bold font-headings group-hover:text-blue-500 transition-colors">
            Etkinlik Yönetimi
          </h3>
          <p className="text-xs opacity-75 mt-2 mb-4 leading-relaxed">
            Yeni zirve, atölye veya etkinlik oluşturun, tarih ve katılım detaylarını yönetin.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500">
            <span>Yönetime Git</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/politikalar"
          className="p-6 rounded-2xl border border-[#0A5C3A]/20 bg-[#0A5C3A]/5 hover:border-[#0A5C3A]/50 transition-all group shadow-xs hover:shadow-md"
        >
          <FileCheck2 className="w-8 h-8 text-[#0A5C3A] mb-4 stroke-[2]" />
          <h3 className="text-lg font-bold font-headings group-hover:text-[#0A5C3A] transition-colors">
            Politika & KVKK
          </h3>
          <p className="text-xs opacity-75 mt-2 mb-4 leading-relaxed">
            KVKK ve yasal metinlerin yayın durumunu panel üzerinden takip edin.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0A5C3A]">
            <span>Yönetime Git</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/topluluklar"
          className="p-6 rounded-2xl border border-[#0A5C3A]/20 bg-[#0A5C3A]/5 hover:border-[#0A5C3A]/50 transition-all group shadow-xs hover:shadow-md"
        >
          <Network className="w-8 h-8 text-[#0A5C3A] mb-4 stroke-[2]" />
          <h3 className="text-lg font-bold font-headings group-hover:text-[#0A5C3A] transition-colors">
            Topluluk Yönetimi
          </h3>
          <p className="text-xs opacity-75 mt-2 mb-4 leading-relaxed">
            Çalışma ekiplerini ekleyin, açıklamalarını ve site üzerindeki içeriklerini güncelleyin.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0A5C3A]">
            <span>Yönetime Git</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/80 opacity-70 shadow-xs cursor-not-allowed">
          <Users className="w-8 h-8 text-slate-400 mb-4 stroke-[2]" />
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold font-headings text-slate-500">Başvuru Yönetimi</h3>
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-200 text-slate-500">
              Yakında
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 mb-4 leading-relaxed">
            Üyelik ve etkinlik başvuruları için detaylı yönetim ekranı hazırlanıyor.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>Yakında Yayında</span>
          </div>
        </div>
      </div>
    </div>
  );
}
