"use client";

import React, { useState } from "react";
import { FileCheck2, Shield, Eye, Save, RefreshCw, CheckCircle2, X } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";

interface PolicyItem {
  id: string;
  title: string;
  slug: string;
  lastUpdated: string;
  version: string;
  status: "Yayında" | "Güncellendi";
}

const INITIAL_POLICIES: PolicyItem[] = [
  {
    id: "POL-01",
    title: "KVKK Aydınlatma Metni & Kişisel Veri Politikası",
    slug: "/kvkk",
    lastUpdated: "01 Ağustos 2025",
    version: "v1.2",
    status: "Yayında",
  },
  {
    id: "POL-02",
    title: "Çerez Politikası ve Gizlilik Sözleşmesi",
    slug: "/cerez-politikasi",
    lastUpdated: "05 Ağustos 2025",
    version: "v1.1",
    status: "Yayında",
  },
];

export default function AdminPolitikalarPage() {
  const { isDark } = useAdminTheme();
  const [policies, setPolicies] = useState<PolicyItem[]>(INITIAL_POLICIES);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setSelectedPolicy(null);
    }, 1200);
  };

  const cardBg = isDark ? "bg-[#0F1623] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-[#0F1115] shadow-xs";
  const tableHeaderBg = isDark ? "bg-[#141C2E] text-slate-400 border-slate-800" : "bg-slate-100 text-[#5F6773] border-slate-200";
  const tableRowBorder = isDark ? "border-slate-800/70 hover:bg-[#141C2E]/40" : "border-slate-100 hover:bg-slate-50/80";
  const inputBg = isDark ? "bg-[#141C2E] border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-[#0F1115]";
  const modalBg = isDark ? "bg-[#0F1623] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-[#0F1115] shadow-2xl";
  const titleColor = isDark ? "text-white" : "text-[#0F1115]";
  const subColor = isDark ? "text-slate-400" : "text-[#5F6773]";

  return (
    <div className="space-y-8 select-none font-sans">
      <div>
        <h1 className={`text-2xl font-bold font-headings ${titleColor}`}>Politika & KVKK Sayfa Yönetimi</h1>
        <p className={`text-xs ${subColor} mt-1`}>
          KVKK, Çerez Politikası ve yasal aydınlatma metinlerinin sürüm ve içerik yönetimi.
        </p>
      </div>

      {/* ŞERİD KARTLAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className={`${cardBg} p-5 rounded-2xl border flex items-center justify-between transition-colors`}>
          <div>
            <span className={`text-xs ${subColor} font-medium`}>KVKK Metni</span>
            <h3 className={`text-lg font-bold font-headings ${titleColor} mt-1`}>KVKK Aydınlatma Metni</h3>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block mt-2">
              Sürüm v1.2 — Yayında
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        <div className={`${cardBg} p-5 rounded-2xl border flex items-center justify-between transition-colors`}>
          <div>
            <span className={`text-xs ${subColor} font-medium`}>Çerez Politikası</span>
            <h3 className={`text-lg font-bold font-headings ${titleColor} mt-1`}>Çerez & Gizlilik</h3>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block mt-2">
              Sürüm v1.1 — Yayında
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* POLİTİKALAR TABLOSU */}
      <div className={`${cardBg} rounded-2xl border overflow-hidden transition-colors`}>
        <div className={`p-5 border-b ${isDark ? "border-slate-800/80" : "border-slate-200"} flex items-center justify-between`}>
          <h2 className={`text-base font-bold font-headings ${titleColor}`}>Yasal ve Kurumsal Politika Metinleri</h2>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
            Mevzuat Uyumlu
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`${tableHeaderBg} uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800/60`}>
              <tr>
                <th className="p-4">Politika Başlığı</th>
                <th className="p-4">Sayfa Bağlantısı</th>
                <th className="p-4">Son Güncelleme</th>
                <th className="p-4">Sürüm</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((pol) => (
                <tr key={pol.id} className={`border-b border-slate-100 dark:border-slate-800/50 last:border-b-0 transition-colors ${isDark ? "hover:bg-[#141C2E]/40" : "hover:bg-slate-50/80"}`}>
                  <td className={`p-4 font-bold ${titleColor}`}>{pol.title}</td>
                  <td className="p-4 font-mono text-emerald-600">{pol.slug}</td>
                  <td className={`p-4 ${subColor}`}>{pol.lastUpdated}</td>
                  <td className={`p-4 font-mono ${titleColor}`}>{pol.version}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10.5px]">
                      ● {pol.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedPolicy(pol)}
                      className="px-3 py-1.5 rounded-lg bg-[#0A5C3A] text-white hover:bg-[#128C59] transition-all font-bold text-xs"
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* METİN DÜZENLEME MODALI */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className={`${modalBg} rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                  Metin Düzenleme
                </span>
                <h3 className={`text-base font-bold font-headings mt-1 ${titleColor}`}>
                  {selectedPolicy.title}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedPolicy(null)} className={`${subColor} hover:${titleColor}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className={`font-bold mb-1 block ${titleColor}`}>Sürüm Numarası</label>
                <input
                  type="text"
                  defaultValue={selectedPolicy.version}
                  className={`w-full p-2.5 rounded-xl ${inputBg} focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>

              <div>
                <label className={`font-bold mb-1 block ${titleColor}`}>Politika Metni (Markdown / HTML)</label>
                <textarea
                  rows={8}
                  defaultValue={`# ${selectedPolicy.title}\n\nBu metin N'apsak? Gençlik Topluluğu yasal aydınlatma metnidir...`}
                  className={`w-full p-3 rounded-xl ${inputBg} font-mono focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>
            </div>

            <div className={`pt-3 flex justify-end gap-3 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${subColor} hover:${titleColor}`}
              >
                İptal
              </button>
              <button
                type="submit"
                className="bg-[#0A5C3A] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#128C59] transition-all inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaved ? "Kaydedildi!" : "Değişiklikleri Yayınla"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
