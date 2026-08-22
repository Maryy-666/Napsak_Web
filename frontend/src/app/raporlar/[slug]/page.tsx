"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ReportsRepository, ReportItem } from "@/lib/reportsStore";
import { FileText, Download, ArrowLeft, Calendar, FileCheck, CheckCircle2 } from "lucide-react";

export default function RaporDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);

  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      ReportsRepository.fetchReportBySlug(slug).then((res) => {
        if (res) {
          setReport(res);
        } else {
          setError(true);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-12 text-sm font-semibold text-slate-500">
          Rapor yükleniyor...
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-1">Rapor Bulunamadı</h2>
          <p className="text-xs text-slate-500 mb-4">Aradığınız rapor yayında değil veya kaldırılmış olabilir.</p>
          <button
            onClick={() => router.push("/raporlar")}
            className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F]"
          >
            Raporlara Dön
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] select-none">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <button
          onClick={() => router.push("/raporlar")}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0A5C3A] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Raporlara Dön</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] text-xs font-bold">
                {report.category || "Gençlik & Katılım"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {report.title}
              </h1>
              {report.publishDate && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{report.publishDate}</span>
                </div>
              )}
            </div>

            {report.pdfUrl && (
              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>PDF Raporunu İndir</span>
              </a>
            )}
          </div>

          {report.coverImage && (
            <div className="rounded-2xl overflow-hidden max-h-80 border border-slate-200">
              <img src={report.coverImage} alt={report.title} className="w-full h-full object-cover" />
            </div>
          )}

          {report.summary && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A5C3A]">Özet</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {report.summary}
              </p>
            </div>
          )}

          {report.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A5C3A]">Açıklama & Detaylar</h3>
              <div className="text-sm text-slate-700 font-normal leading-relaxed whitespace-pre-line">
                {report.description}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
