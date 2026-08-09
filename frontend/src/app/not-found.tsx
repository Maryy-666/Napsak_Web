import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { Logo } from "../components/common/Logo";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı | N'apsak? Gençlik Topluluğu",
  description: "Aradığınız sayfa bulunamadı.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <div className="relative min-h-[calc(100vh-10rem)] w-full flex flex-col justify-center items-center bg-white px-4 py-16 overflow-hidden select-none">
          {/* Subtle Radial Gradient at Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(10,92,58,0.04)_0%,transparent_75%)] pointer-events-none z-0" />

          {/* Premium Line Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />

          {/* Grid Dot Intersections */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(10,92,58,0.14)_2px,transparent_2px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />

          {/* Corner Green Spotlights */}
          <div
            className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0"
            style={{ backgroundColor: "rgba(10, 92, 58, 0.28)" }}
          />
          <div
            className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none z-0"
            style={{ backgroundColor: "rgba(10, 92, 58, 0.32)" }}
          />

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
        </div>
      </main>
      <Footer />
    </>
  );
}
