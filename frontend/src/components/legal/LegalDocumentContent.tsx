"use client";

import React from "react";
import { ShieldCheck, FileText, Lock, CheckCircle2 } from "lucide-react";
import { PageBackground } from "../common/PageBackground";

interface LegalDocumentProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Array<{
    title: string;
    content: string | string[];
  }>;
}

export default function LegalDocumentContent({
  title,
  subtitle,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <PageBackground className="px-0 py-0 pb-24 text-[#0F1115]">
      {/* Banner */}
      <section className="w-full bg-[#063823] text-white pt-24 pb-16 md:pt-28 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.25),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-4 border border-white/15">
            <ShieldCheck className="w-4 h-4" />
            <span>Yasal Metinler & Gizlilik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headings tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 font-sans max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="mt-4 text-xs text-emerald-300/80 font-mono">
            Son Güncelleme: {lastUpdated}
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4 pb-8 border-b border-slate-100 last:border-b-0 last:pb-0">
              <h2 className="text-xl font-bold font-headings text-slate-900 flex items-center gap-2">
                <span className="text-[#0A5C3A] font-extrabold">{idx + 1}.</span>
                <span>{section.title}</span>
              </h2>

              {Array.isArray(section.content) ? (
                <div className="space-y-3">
                  {section.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </PageBackground>
  );
}
