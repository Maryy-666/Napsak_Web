"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileCheck2, Save, Shield, X } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";
import { PagesRepository, PageItem } from "../../../lib/pagesStore";
import {
  COOKIE_SECTIONS_FALLBACK,
  KVKK_SECTIONS_FALLBACK,
  serializeLegalSections,
} from "../../../lib/legalPages";

type PolicyConfig = {
  key: "kvkk" | "cerez";
  title: string;
  slug: string;
  publicPath: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  fallbackContent: string;
  icon: typeof Shield;
};

type PolicyRow = PolicyConfig & {
  page?: PageItem;
};

const POLICY_CONFIGS: PolicyConfig[] = [
  {
    key: "kvkk",
    title: "KVKK Aydınlatma Metni",
    slug: "kvkk",
    publicPath: "/kvkk",
    description:
      "Kişisel Verilerin Korunması Kanunu kapsamında kullanıcı bilgilendirme metni.",
    metaTitle: "KVKK Aydınlatma Metni | N'apsak? Gençlik Topluluğu",
    metaDescription: "N'apsak? Gençlik Topluluğu KVKK Aydınlatma Metni.",
    fallbackContent: serializeLegalSections(KVKK_SECTIONS_FALLBACK),
    icon: Shield,
  },
  {
    key: "cerez",
    title: "Çerez Politikası",
    slug: "cerez-politikasi",
    publicPath: "/cerez-politikasi",
    description: "Çerez kullanımı, tercih ayarları ve gizlilik bilgilendirmesi.",
    metaTitle: "Çerez Politikası | N'apsak? Gençlik Topluluğu",
    metaDescription:
      "N'apsak? Gençlik Topluluğu web sitesinde kullanılan çerezler hakkında bilgilendirme.",
    fallbackContent: serializeLegalSections(COOKIE_SECTIONS_FALLBACK),
    icon: FileCheck2,
  },
];

const todayLabel = () => new Date().toLocaleDateString("tr-TR");

export default function AdminPolitikalarPage() {
  const { isDark } = useAdminTheme();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRow | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    content: "",
    publicationStatus: "PUBLISHED" as "PUBLISHED" | "DRAFT" | "ARCHIVED",
    metaTitle: "",
    metaDescription: "",
  });

  const cardBg = isDark
    ? "bg-[#0F1623] border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-[#0F1115] shadow-xs";
  const tableHeaderBg = isDark
    ? "bg-[#141C2E] text-slate-400 border-slate-800"
    : "bg-slate-100 text-[#5F6773] border-slate-200";
  const inputBg = isDark
    ? "bg-[#141C2E] border-slate-800 text-slate-200"
    : "bg-slate-50 border-slate-200 text-[#0F1115]";
  const modalBg = isDark
    ? "bg-[#0F1623] border-slate-800 text-slate-200"
    : "bg-white border-slate-200 text-[#0F1115] shadow-2xl";
  const titleColor = isDark ? "text-white" : "text-[#0F1115]";
  const subColor = isDark ? "text-slate-400" : "text-[#5F6773]";

  const policyRows = useMemo<PolicyRow[]>(() => {
    return POLICY_CONFIGS.map((config) => ({
      ...config,
      page: pages.find((page) => page.slug === config.slug),
    }));
  }, [pages]);

  const loadPages = async () => {
    setLoading(true);
    const data = await PagesRepository.fetchPagesFromDB("all");
    setPages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPages();
  }, []);

  const openPolicy = (policy: PolicyRow) => {
    setSelectedPolicy(policy);
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({
      title: policy.page?.title || policy.title,
      shortDescription: policy.page?.shortDescription || policy.description,
      content: policy.page?.content || policy.fallbackContent,
      publicationStatus: (policy.page?.publicationStatus as any) || "PUBLISHED",
      metaTitle: policy.page?.metaTitle || policy.metaTitle,
      metaDescription: policy.page?.metaDescription || policy.metaDescription,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;

    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMessage("Başlık ve metin alanı boş bırakılamaz.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const payload = {
      title: formData.title.trim(),
      slug: selectedPolicy.slug,
      shortDescription: formData.shortDescription.trim(),
      content: formData.content,
      publicationStatus: formData.publicationStatus,
      isFeatured: false,
      showInMenu: false,
      displayOrder: selectedPolicy.key === "kvkk" ? 90 : 91,
      metaTitle: formData.metaTitle.trim(),
      metaDescription: formData.metaDescription.trim(),
    };

    try {
      if (selectedPolicy.page) {
        await PagesRepository.updatePage(selectedPolicy.page.id, payload);
      } else {
        await PagesRepository.addPage(payload);
      }

      await loadPages();
      setSuccessMessage("Politika metni veritabanına kaydedildi.");
      setSelectedPolicy(null);
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Politika metni kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 select-none font-sans">
      <div>
        <h1 className={`text-2xl font-bold font-headings ${titleColor}`}>
          Politika & KVKK Sayfa Yönetimi
        </h1>
        <p className={`text-xs ${subColor} mt-1`}>
          KVKK ve Çerez Politikası metinlerini Page tablosu üzerinden kalıcı olarak yönetin.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {policyRows.map((policy) => {
          const Icon = policy.icon;
          const isPublished = policy.page?.publicationStatus === "PUBLISHED";

          return (
            <button
              key={policy.slug}
              type="button"
              onClick={() => openPolicy(policy)}
              className={`${cardBg} p-5 rounded-2xl border flex items-center justify-between text-left transition-colors hover:border-emerald-500/50`}
            >
              <div>
                <span className={`text-xs ${subColor} font-medium`}>
                  {policy.page ? "DB kaydı var" : "Fallback ile açılıyor"}
                </span>
                <h3 className={`text-lg font-bold font-headings ${titleColor} mt-1`}>
                  {policy.page?.title || policy.title}
                </h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block mt-2 ${
                    isPublished
                      ? "text-emerald-600 bg-emerald-500/10"
                      : "text-amber-600 bg-amber-500/10"
                  }`}
                >
                  {policy.page ? policy.page.publicationStatus : "HENÜZ DB'DE YOK"}
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
            </button>
          );
        })}
      </div>

      <div className={`${cardBg} rounded-2xl border overflow-hidden transition-colors`}>
        <div
          className={`p-5 border-b ${
            isDark ? "border-slate-800/80" : "border-slate-200"
          } flex items-center justify-between gap-4`}
        >
          <h2 className={`text-base font-bold font-headings ${titleColor}`}>
            Yasal ve Kurumsal Politika Metinleri
          </h2>
          <button
            type="button"
            onClick={loadPages}
            className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20"
          >
            {loading ? "Yükleniyor" : "Yenile"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`${tableHeaderBg} uppercase font-bold text-[10px] tracking-wider border-b`}
            >
              <tr>
                <th className="p-4">Politika</th>
                <th className="p-4">Public Sayfa</th>
                <th className="p-4">Son Güncelleme</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {policyRows.map((policy) => (
                <tr
                  key={policy.slug}
                  className={`border-b last:border-b-0 transition-colors ${
                    isDark
                      ? "border-slate-800/50 hover:bg-[#141C2E]/40"
                      : "border-slate-100 hover:bg-slate-50/80"
                  }`}
                >
                  <td className={`p-4 font-bold ${titleColor}`}>{policy.page?.title || policy.title}</td>
                  <td className="p-4">
                    <Link
                      href={policy.publicPath}
                      target="_blank"
                      className="font-mono text-emerald-600 hover:underline"
                    >
                      {policy.publicPath}
                    </Link>
                  </td>
                  <td className={`p-4 ${subColor}`}>
                    {policy.page?.updatedAt
                      ? new Date(policy.page.updatedAt).toLocaleDateString("tr-TR")
                      : "-"}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10.5px]">
                      {policy.page?.publicationStatus || "FALLBACK"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => openPolicy(policy)}
                      className="px-3 py-1.5 rounded-lg bg-[#0A5C3A] text-white hover:bg-[#128C59] transition-all font-bold text-xs"
                    >
                      {policy.page ? "Düzenle" : "DB Kaydı Oluştur"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className={`${modalBg} rounded-2xl max-w-3xl w-full p-6 space-y-4 max-h-[88vh] overflow-y-auto border`}
          >
            <div
              className={`flex items-center justify-between border-b pb-3 ${
                isDark ? "border-slate-800" : "border-slate-200"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                  {selectedPolicy.publicPath}
                </span>
                <h3 className={`text-base font-bold font-headings mt-1 ${titleColor}`}>
                  {selectedPolicy.page ? "Politika Metnini Düzenle" : "DB Kaydı Oluştur"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className={`${subColor} hover:text-emerald-600`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className={`font-bold mb-1 block ${titleColor}`}>Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className={`w-full p-2.5 rounded-xl border ${inputBg} focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>

              <div>
                <label className={`font-bold mb-1 block ${titleColor}`}>Yayın Durumu</label>
                <select
                  value={formData.publicationStatus}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      publicationStatus: e.target.value as any,
                    }))
                  }
                  className={`w-full p-2.5 rounded-xl border ${inputBg} focus:outline-none focus:border-[#0A5C3A]`}
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className={`font-bold mb-1 block ${titleColor}`}>Kısa Açıklama</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
                }
                className={`w-full p-2.5 rounded-xl border ${inputBg} focus:outline-none focus:border-[#0A5C3A]`}
              />
            </div>

            <div className="text-xs">
              <label className={`font-bold mb-1 block ${titleColor}`}>
                Politika Metni
              </label>
              <textarea
                rows={14}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                className={`w-full p-3 rounded-xl border ${inputBg} font-mono focus:outline-none focus:border-[#0A5C3A]`}
              />
              <p className={`mt-1 ${subColor}`}>
                JSON bölüm formatını veya Markdown başlıklarını kullanabilirsiniz. Public sayfa bu
                metni otomatik bölümlere ayırır.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className={`font-bold mb-1 block ${titleColor}`}>Meta Başlık</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                  className={`w-full p-2.5 rounded-xl border ${inputBg} focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>

              <div>
                <label className={`font-bold mb-1 block ${titleColor}`}>Meta Açıklama</label>
                <input
                  type="text"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                  }
                  className={`w-full p-2.5 rounded-xl border ${inputBg} focus:outline-none focus:border-[#0A5C3A]`}
                />
              </div>
            </div>

            <div
              className={`pt-3 flex justify-end gap-3 border-t ${
                isDark ? "border-slate-800" : "border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${subColor} hover:text-emerald-600`}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#0A5C3A] disabled:opacity-60 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#128C59] transition-all inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Kaydediliyor..." : `Kaydet (${todayLabel()})`}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
