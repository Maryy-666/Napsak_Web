"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { MagazinesRepository, MagazineItem } from "@/lib/magazinesStore";
import { BookOpen, Download, ArrowLeft, Calendar } from "lucide-react";

export default function DergiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);

  const [magazine, setMagazine] = useState<MagazineItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      MagazinesRepository.fetchMagazineBySlug(slug).then((res) => {
        if (res) {
          setMagazine(res);
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
          Dergi sayısı yükleniyor...
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-1">Dergi Bulunamadı</h2>
          <p className="text-xs text-slate-500 mb-4">Aradığınız dergi sayısı yayında değil veya kaldırılmış olabilir.</p>
          <button
            onClick={() => router.push("/dergiler")}
            className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F]"
          >
            Dergilere Dön
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
          onClick={() => router.push("/dergiler")}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0A5C3A] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Dergilere Dön</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] text-xs font-bold">
                {magazine.issueNumber || "Dergi Sayısı"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {magazine.title}
              </h1>
              {magazine.publishDate && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{magazine.publishDate} &bull; {magazine.pages || 36} Sayfa</span>
                </div>
              )}
            </div>

            {magazine.pdfUrl && (
              <a
                href={magazine.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Dijital Dergiyi Aç (PDF)</span>
              </a>
            )}
          </div>

          {magazine.coverImage && (
            <div className="rounded-2xl overflow-hidden max-h-80 border border-slate-200">
              <img src={magazine.coverImage} alt={magazine.title} className="w-full h-full object-cover" />
            </div>
          )}

          {magazine.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A5C3A]">Editörden Not & İçerik</h3>
              <p className="text-sm text-slate-700 font-normal leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                {magazine.description}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
