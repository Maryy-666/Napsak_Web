"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  BookOpen,
  Newspaper,
  Plus,
  Trash2,
  Download,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  FileCheck,
  X,
  Upload,
  Edit3,
} from "lucide-react";
import { useAdminTheme } from "@/context/AdminThemeContext";

interface ReportItem {
  id: string;
  title: string;
  category: string;
  publishDate: string;
  readCount: number;
  downloadCount: number;
  fileName?: string;
  fileSize?: string;
  summary?: string;
}

interface MagazineItem {
  id: string;
  issueNumber?: string;
  title: string;
  publishDate: string;
  pages: number;
  readCount: number;
}

export default function AdminIcerikPage() {
  const { isDark } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<"reports" | "magazines" | "news">("reports");

  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "genclik-katilimi-2026",
      title: "2026 Gençlik Katılımı ve Üretim Kültürü Raporu",
      category: "Gençlik & Katılım",
      publishDate: "12 Şubat 2026",
      readCount: 1840,
      downloadCount: 620,
      fileSize: "4.8 MB",
      summary: "Topluluk üyelerinin etkinlik, gönüllülük ve sivil katılım pratiklerini inceleyen kapsamlı alan araştırması.",
    },
    {
      id: "calisma-ekipleri-2026-q1",
      title: "Çalışma Ekipleri Faaliyet ve Etki Notu",
      category: "Çalışma Ekipleri",
      publishDate: "28 Ocak 2026",
      readCount: 950,
      downloadCount: 310,
      fileSize: "3.1 MB",
      summary: "Teknoloji, sanat, çevre-sağlık, eğitim ve iletişim çalışma ekiplerinin ilk çeyrek üretim çıktıları.",
    },
    {
      id: "etkinlik-geribildirim-2026",
      title: "Etkinlik & Atölye Geri Bildirimleri Analizi",
      category: "Etkinlik & Buluşmalar",
      publishDate: "Mart 2026",
      readCount: 420,
      downloadCount: 180,
      fileSize: "2.2 MB",
      summary: "Gerçekleştirilen atölyeler ve buluşmalardan toplanan nitel/nicel geri bildirimlerin memnuniyet analizi.",
    },
    {
      id: "yerel-genclik-ihtiyaclari-2026",
      title: "Yerel Gençlik İhtiyaçları & Saha Gözlemi",
      category: "Saha Araştırmaları",
      publishDate: "Nisan 2026",
      readCount: 290,
      downloadCount: 95,
      fileSize: "4.0 MB",
      summary: "Gençlerin öğrenme, sosyalleşme ve imkanlara erişim alanlarında karşılaştığı temel kısıtlar ve yerel ihtiyaç tespiti.",
    },
  ]);

  const [magazines, setMagazines] = useState<MagazineItem[]>([
    {
      id: "sayi-4-genclik-ve-gelecek",
      issueNumber: "Sayı #4",
      title: "Gençlik, Dijital Üretim ve Geleceğin Meslekleri",
      publishDate: "05 Ocak 2026",
      pages: 56,
      readCount: 2410,
    },
    {
      id: "sayi-3-sanat-ve-toplum",
      issueNumber: "Sayı #3",
      title: "Yerel Sanat, Kamusal Alan ve Genç Ekspresyonu",
      publishDate: "15 Ekim 2025",
      pages: 48,
      readCount: 1750,
    },
    {
      id: "sayi-2-cevre-ve-iklim",
      issueNumber: "Sayı #2",
      title: "Ekolojik Dönüşüm ve Genç İklim Aktivizmi",
      publishDate: "20 Temmuz 2025",
      pages: 40,
      readCount: 1420,
    },
    {
      id: "sayi-1-ilk-adim",
      issueNumber: "Sayı #1",
      title: "Tanışma ve Kuruluş Özel Sayısı",
      publishDate: "10 Mayıs 2025",
      pages: 32,
      readCount: 1100,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // MODAL STATE
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportItem | null>(null);
  const [editingMagazine, setEditingMagazine] = useState<MagazineItem | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Gençlik & Katılım");
  const [magIssueNumber, setMagIssueNumber] = useState<string>("Sayı #5");
  const [magPages, setMagPages] = useState<number>(36);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfFileSize, setPdfFileSize] = useState("");
  const [pdfFileData, setPdfFileData] = useState("");
  const [newSummary, setNewSummary] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reports");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setReports(
            json.data.map((r: any) => ({
              id: String(r.id),
              title: r.title,
              category: r.category || "Genel",
              publishDate: r.publishDate || "Şubat 2026",
              readCount: r.readCount || 0,
              downloadCount: r.downloadCount || 0,
            }))
          );
        }
      }
    } catch (err) {
      console.error("Reports fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMagazines = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/magazines");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMagazines(
            json.data.map((m: any) => ({
              id: String(m.id),
              issueNumber: m.issueNumber || "Sayı #1",
              title: m.title,
              publishDate: m.publishDate || "2026",
              pages: m.pages || 30,
              readCount: m.readCount || 0,
            }))
          );
        }
      }
    } catch (err) {
      console.error("Magazines fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    loadMagazines();
  }, []);

  const handleOpenEditReport = (report: ReportItem) => {
    setEditingReport(report);
    setNewTitle(report.title);
    setNewCategory(report.category);
    setPdfFileName(report.fileName || "");
    setPdfFileSize(report.fileSize || "");
    setPdfFileData("");
    setNewSummary(report.summary || "");
    setShowAddModal(true);
  };

  const handleOpenEditMagazine = (mag: MagazineItem) => {
    setEditingMagazine(mag);
    setMagIssueNumber(mag.issueNumber || "Sayı #1");
    setNewTitle(mag.title);
    setMagPages(mag.pages || 36);
    setShowAddModal(true);
  };

  const resetFormModal = () => {
    setEditingReport(null);
    setEditingMagazine(null);
    setNewTitle("");
    setNewCategory("Gençlik & Katılım");
    setMagIssueNumber("Sayı #5");
    setPdfFileName("");
    setPdfFileSize("");
    setPdfFileData("");
    setNewSummary("");
    setMagPages(36);
    setShowAddModal(false);
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeTab === "reports") {
      if (editingReport) {
        // Rapor Düzenleme işlemi
        setReports(
          reports.map((r) =>
            r.id === editingReport.id
              ? {
                  ...r,
                  title: newTitle.trim(),
                  category: newCategory,
                  fileName: pdfFileName || r.fileName,
                  fileSize: pdfFileSize || r.fileSize,
                  summary: newSummary || r.summary,
                }
              : r
          )
        );
      } else {
        // Yeni rapor ekleme
        const newItem: ReportItem = {
          id: Date.now().toString(),
          title: newTitle.trim(),
          category: newCategory,
          publishDate: "Ağustos 2026",
          readCount: 0,
          downloadCount: 0,
          fileName: pdfFileName || undefined,
          fileSize: pdfFileSize || "3.5 MB",
          summary: newSummary || undefined,
        };
        setReports([newItem, ...reports]);
        fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle.trim(), category: newCategory }),
        }).catch(() => null);
      }
    } else if (activeTab === "magazines") {
      if (editingMagazine) {
        // Dergi Düzenleme işlemi
        setMagazines(
          magazines.map((m) =>
            m.id === editingMagazine.id
              ? {
                  ...m,
                  issueNumber: magIssueNumber.trim() || m.issueNumber,
                  title: newTitle.trim(),
                  pages: Number(magPages) || m.pages,
                }
              : m
          )
        );
      } else {
        // Yeni Dergi ekleme
        const newItem: MagazineItem = {
          id: Date.now().toString(),
          issueNumber: magIssueNumber.trim() || "Sayı #5",
          title: newTitle.trim(),
          publishDate: "Ağustos 2026",
          pages: Number(magPages) || 36,
          readCount: 0,
        };
        setMagazines([newItem, ...magazines]);
        fetch("/api/magazines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle.trim(), issueNumber: magIssueNumber.trim() }),
        }).catch(() => null);
      }
    }

    resetFormModal();
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const handleDeleteMagazine = (id: string) => {
    setMagazines(magazines.filter((m) => m.id !== id));
  };

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
            <FileText className="w-7 h-7 text-[#0A5C3A]" />
            İçerik Yönetimi
          </h1>
          <p
            className={`text-xs font-medium mt-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Sitede yayınlanan dergiler, raporlar ve öne çıkan içeriklerin yönetimi.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] text-white text-xs font-bold transition-all shadow-md shadow-[#0A5C3A]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni {activeTab === "reports" ? "Rapor" : "Dergi"} Ekle</span>
        </button>
      </div>

      {/* SEKMELER (TABS) */}
      <div className="flex items-center gap-2 border-b border-slate-700/40 pb-3">
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "reports"
              ? "bg-[#0A5C3A] text-white shadow-sm"
              : isDark
              ? "bg-slate-800/60 hover:bg-slate-800 text-slate-300"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Raporlar & Yayınlar ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("magazines")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "magazines"
              ? "bg-[#0A5C3A] text-white shadow-sm"
              : isDark
              ? "bg-slate-800/60 hover:bg-slate-800 text-slate-300"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Topluluk Dergileri ({magazines.length})</span>
        </button>
      </div>

      {/* İÇERİK LİSTESİ */}
      {activeTab === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                isDark
                  ? "bg-[#0F1623] border-slate-800/80 hover:border-slate-700"
                  : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#0A5C3A]/10 text-[#0A5C3A]">
                    {report.category}
                  </span>
                  <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {report.publishDate}
                  </span>
                </div>
                <h3 className={`text-base font-bold font-headings ${isDark ? "text-white" : "text-slate-900"}`}>
                  {report.title}
                </h3>
                {report.summary && (
                  <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {report.summary}
                  </p>
                )}
                {report.fileName && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#0A5C3A] font-semibold">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">{report.fileName}</span>
                    <span className="text-[10px] opacity-75">({report.fileSize || "PDF"})</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/40 text-xs">
                <div className={`flex items-center gap-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {report.readCount} Okunma
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {report.downloadCount} İndirme
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditReport(report)}
                    className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                    title="Raporu Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Raporu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "magazines" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {magazines.map((mag) => (
            <div
              key={mag.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                isDark
                  ? "bg-[#0F1623] border-slate-800/80 hover:border-slate-700"
                  : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600">
                    {mag.issueNumber || "Sayı Dergisi"}
                  </span>
                  <span className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {mag.publishDate} • {mag.pages} Sayfa
                  </span>
                </div>
                <h3 className={`text-base font-bold font-headings ${isDark ? "text-white" : "text-slate-900"}`}>
                  {mag.title}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/40 text-xs">
                <div className={`flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  <Eye className="w-3.5 h-3.5 text-[#0A5C3A]" />
                  <span>{mag.readCount} Okunma</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditMagazine(mag)}
                    className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                    title="Dergiyi Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMagazine(mag.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Dergi Sayısını Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* YENİ İÇERİK MODALI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddContent}
            className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isDark ? "bg-[#0F1623] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-headings">
                {editingReport
                  ? "Raporu Düzenle"
                  : editingMagazine
                  ? "Dergi Sayısını Düzenle"
                  : `Yeni ${activeTab === "reports" ? "Rapor" : "Dergi"} Ekle`}
              </h3>
              <button
                type="button"
                onClick={resetFormModal}
                className={`p-1.5 rounded-lg ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Başlık</label>
                <input
                  type="text"
                  required
                  placeholder={
                    activeTab === "reports"
                      ? "Örn: 2026 Gençlik Katılım Raporu"
                      : "Örn: N'apsak? Dergi Sayı 03"
                  }
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border outline-none ${
                    isDark
                      ? "bg-slate-900 border-slate-800 text-white focus:border-[#0A5C3A]"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#0A5C3A]"
                  }`}
                />
              </div>

              {activeTab === "reports" && (
                <>
                  <div>
                    <label className="block font-semibold mb-1">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border outline-none ${
                        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    >
                      <option value="Gençlik & Katılım">Gençlik & Katılım</option>
                      <option value="Sivil Toplum">Sivil Toplum</option>
                      <option value="Teknoloji & Tasarım">Teknoloji & Tasarım</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Rapor PDF Belgesi (Dosya Seç)</label>
                    <div className="space-y-2">
                      <label
                        className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          isDark
                            ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                        }`}
                      >
                        <Upload className="w-4 h-4 text-[#0A5C3A]" />
                        <span>PDF / Doküman Dosyası Seç</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPdfFileName(file.name);
                              setPdfFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                  setPdfFileData(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {pdfFileName && (
                        <div
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                            <span className="truncate font-semibold">{pdfFileName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0A5C3A]/10 text-[#0A5C3A] font-bold">
                              {pdfFileSize}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPdfFileName("");
                              setPdfFileSize("");
                              setPdfFileData("");
                            }}
                            className="text-rose-500 hover:bg-rose-500/10 p-1 rounded-lg transition-colors ml-2"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Rapor Özeti (Opsiyonel)</label>
                    <textarea
                      rows={2}
                      placeholder="Raporun öne çıkan içeriğini ve amacını özetleyen kısa açıklama..."
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border outline-none resize-none ${
                        isDark
                          ? "bg-slate-900 border-slate-800 text-white focus:border-[#0A5C3A]"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#0A5C3A]"
                      }`}
                    />
                  </div>
                </>
              )}

              {activeTab === "magazines" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Dergi Sayısı / No *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Sayı #5"
                      value={magIssueNumber}
                      onChange={(e) => setMagIssueNumber(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border outline-none ${
                        isDark ? "bg-slate-900 border-slate-800 text-white focus:border-[#0A5C3A]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#0A5C3A]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Sayfa Sayısı</label>
                    <input
                      type="number"
                      min={1}
                      value={magPages}
                      onChange={(e) => setMagPages(Number(e.target.value))}
                      className={`w-full px-3.5 py-2 rounded-xl border outline-none ${
                        isDark ? "bg-slate-900 border-slate-800 text-white focus:border-[#0A5C3A]" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#0A5C3A]"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetFormModal}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] text-white text-xs font-bold transition-colors"
              >
                {editingReport || editingMagazine ? "Güncelle" : "Yayınla"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
