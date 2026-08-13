import React from "react";
import Link from "next/link";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { Logo } from "../components/common/Logo";
import { PageBackground } from "../components/common/PageBackground";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <PageBackground className="min-h-[calc(100vh-10rem)] justify-center py-16 select-none">
          {/* 404 Content Box */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto px-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0A5C3A]/10 ring-1 ring-[#0A5C3A]/20 mb-8 shadow-sm">
              <Logo size={72} variant="default" priority />
            </div>

            <span className="text-7xl font-extrabold text-[#0A5C3A] font-headings tracking-tight mb-2">
              404
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F1115] font-headings mb-3">
              Aradığınız sayfayı bulamadık.
            </h1>

            <p className="text-base text-[#5F6773] font-medium font-sans mb-8 leading-relaxed">
              Ulaşmaya çalıştığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center h-[56px] px-8 rounded-[14px] text-base font-semibold text-white bg-[#0A5C3A] hover:bg-[#0D7449] shadow-[0_1px_2px_rgba(10,92,58,0.18)] hover:shadow-[0_8px_20px_rgba(10,92,58,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </PageBackground>
      </main>
      <Footer />
    </>
  );
}
