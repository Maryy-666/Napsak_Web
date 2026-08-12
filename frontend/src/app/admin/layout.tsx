"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  MailCheck,
  Menu,
  MessageSquare,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Ticket,
  UserCog,
  UserPlus,
  X,
} from "lucide-react";
import { AdminThemeProvider, useAdminTheme } from "../../context/AdminThemeContext";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
  published: boolean;
};

const NAV_SECTIONS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "YÖNETİM & TOPLULUK",
    items: [
      { title: "Genel Bakış", href: "/admin", icon: LayoutDashboard, badge: null, published: true },
      { title: "Etkinlik Yönetimi", href: "/admin/etkinlikler", icon: Calendar, badge: "3 Aktif", published: true },
      { title: "Etkinlik Başvuruları", href: "/admin/basvurular", icon: Ticket, badge: "Yakında", published: false },
      { title: "Üyelik Başvuruları", href: "/admin/uyelikler", icon: UserPlus, badge: "Yakında", published: false },
      { title: "İçerik Yönetimi", href: "/admin/icerik", icon: FileText, badge: "Yakında", published: false },
      { title: "Etkileşim & Katılım", href: "/admin/katilim", icon: MessageSquare, badge: "Yakında", published: false },
    ],
  },
  {
    title: "SİSTEM & YETKİLENDİRME",
    items: [
      { title: "Kullanıcı Yönetimi", href: "/admin/kullanicilar", icon: UserCog, badge: "Yakında", published: false },
      { title: "Yetkilendirme", href: "/admin/yetkilendirme", icon: Lock, badge: "Yakında", published: false },
      { title: "Mesaj Yönetimi", href: "/admin/mesajlar", icon: MailCheck, badge: "Yakında", published: false },
      { title: "Politika & KVKK", href: "/admin/politikalar", icon: FileCheck2, badge: null, published: true },
    ],
  },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toggleTheme, isDark } = useAdminTheme();

  return (
    <div
      className={`min-h-screen flex font-sans select-none transition-colors duration-300 ${
        isDark ? "bg-[#0B0F17] text-slate-100" : "bg-[#F4F6F8] text-[#0F1115]"
      }`}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 flex flex-col p-5 transition-all duration-300 ${
          isDark
            ? "bg-[#0F1623] border-r border-slate-800/80 text-slate-100"
            : "bg-white border-r border-slate-200 text-[#0F1115] shadow-xs"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isDark ? "border-slate-800/70" : "border-slate-200"}`}>
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A5C3A] to-[#128C59] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#0A5C3A]/25">
              N
            </div>
            <div>
              <h2 className={`font-extrabold font-headings text-base tracking-tight flex items-center gap-1.5 ${isDark ? "text-white" : "text-[#0F1115]"}`}>
                <span>N&apos;apsak? Admin</span>
              </h2>
              <p className="text-[10.5px] text-[#0A5C3A] font-bold font-sans">
                Yönetim & İdari Merkez
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-1 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-[#0F1115]"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`mb-5 p-3 rounded-xl border flex items-center gap-3 ${
          isDark ? "bg-[#141C2E] border-slate-800/80 text-white" : "bg-[#F8F9FA] border-slate-200 text-[#0F1115]"
        }`}>
          <div className="w-8 h-8 rounded-lg bg-[#0A5C3A]/20 border border-[#0A5C3A]/40 text-[#0A5C3A] flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold font-headings truncate">Yönetici</h4>
            <p className={`text-[10px] font-sans truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>admin@napsak.com</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className={`text-[9.5px] font-extrabold uppercase tracking-widest px-3 mb-1.5 block ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {section.title}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const className = `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive && item.published
                    ? "bg-[#0A5C3A] text-white shadow-sm font-bold"
                    : item.published
                    ? isDark
                      ? "text-slate-400 hover:text-white hover:bg-[#141C2E]"
                      : "text-[#5F6773] hover:text-[#0F1115] hover:bg-slate-100"
                    : isDark
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-slate-400 cursor-not-allowed"
                }`;
                const iconClassName = `w-4 h-4 shrink-0 ${
                  isActive && item.published
                    ? "text-white"
                    : item.published
                    ? isDark
                      ? "text-slate-400 group-hover:text-emerald-400"
                      : "text-slate-500 group-hover:text-[#0A5C3A]"
                    : "text-slate-500"
                }`;
                const badgeClassName = `text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                  isActive && item.published
                    ? "bg-white/20 text-white"
                    : item.published
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : isDark
                    ? "bg-slate-800 text-slate-500 border border-slate-700"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`;
                const content = (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={iconClassName} />
                      <span className="truncate">{item.title}</span>
                    </div>
                    {item.badge && <span className={badgeClassName}>{item.badge}</span>}
                  </>
                );

                if (!item.published) {
                  return (
                    <span key={item.href} className={className} title="Yakında">
                      {content}
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={className}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={`pt-3 border-t mt-auto ${isDark ? "border-slate-800/80" : "border-slate-200"}`}>
          <Link
            href="/"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              isDark ? "text-slate-400 hover:text-white hover:bg-[#141C2E]" : "text-[#5F6773] hover:text-[#0F1115] hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ana Sayfaya Dön</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300 ${
          isDark ? "bg-[#0F1623] border-slate-800/80 text-slate-100" : "bg-white border-slate-200 text-[#0F1115] shadow-xs"
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-1.5 rounded-lg ${isDark ? "text-slate-400 hover:text-white hover:bg-[#141C2E]" : "text-slate-600 hover:text-[#0F1115] hover:bg-slate-100"}`}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className={`text-xs font-semibold hidden sm:flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              <Sparkles className="w-4 h-4 text-emerald-500 stroke-[2]" />
              <span>N&apos;apsak? Gençlik Topluluğu Panel Alanı</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isDark
                  ? "bg-[#141C2E] text-amber-300 border-slate-700 hover:bg-slate-800"
                  : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
              }`}
              title={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                  <span className="hidden sm:inline">Beyaz Tema</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-800 stroke-[2.5]" />
                  <span className="hidden sm:inline">Siyah Tema</span>
                </>
              )}
            </button>

            <div className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-xl border ${
              isDark ? "bg-[#141C2E] border-slate-800 text-slate-200" : "bg-slate-100 border-slate-200 text-slate-800"
            }`}>
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 stroke-[2]" />
              <span>Yönetici Paneli</span>
            </div>
            <Link
              href="/login"
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              title="Çıkış Yap"
            >
              <LogOut className="w-4.5 h-4.5 stroke-[2]" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}
