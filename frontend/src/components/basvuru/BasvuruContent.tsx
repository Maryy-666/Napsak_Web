"use client";

import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card } from "../ui/Card";
import { Logo } from "../common/Logo";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";

const DEFAULT_GOOGLE_FORM_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSfdVNOuIb8ynpYORbOP6ujQstbsqDd7432nc-z31E3rTc3dxA/viewform?usp=dialog";

export default function BasvuruContent() {
  return (
    <LayoutGroup id="basvuru-layout-group">
      <PageBackground id="basvuru-page-root" className="justify-center select-none">
        {/* Application Card */}
        <div className="w-full max-w-[560px] px-4 sm:px-6 flex justify-center items-center z-20 -mt-8 sm:-mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <Card
              variant="auth"
              animate={false}
              className="w-full max-w-[520px] px-8 pt-8 pb-8 sm:px-12 sm:pt-10 sm:pb-8 rounded-[20px] sm:rounded-[24px] bg-white/84 backdrop-blur-[20px] border border-white/65 !shadow-[0_30px_80px_rgba(15,17,21,0.08)] flex flex-col text-left"
            >
              {/* Header layout matching Login page */}
              <div className="flex items-center gap-6 mb-8 select-none w-full">
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.05 }}
                  className="shrink-0 flex items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,17,21,0.04)] ring-1 ring-white/70"
                >
                  <Logo size={72} variant="default" priority />
                </motion.div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-[36px] font-bold tracking-tight text-[#0F1115] font-headings leading-none select-none">
                    Topluluğa Katıl
                  </h1>
                </div>
              </div>

              {/* Information Paragraphs */}
              <div className="flex flex-col gap-3 mb-8 select-none">
                <p className="text-base text-[#5F6773] leading-relaxed font-sans font-medium">
                  N'apsak? topluluğuna katılmak için başvuru formunu doldurmanız gerekmektedir.
                </p>
                <p className="text-base text-[#5F6773] leading-relaxed font-sans font-medium">
                  Başvurular ekibimiz tarafından incelenir ve uygun görülen adaylara e-posta yoluyla dönüş yapılır.
                </p>
              </div>

              {/* Primary Redirect Action Button */}
              <div className="w-full flex flex-col items-center">
                <a
                  href={DEFAULT_GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 h-[56px] rounded-[14px] text-base font-semibold text-white bg-[#0A5C3A] hover:bg-[#0D7449] shadow-[0_1px_2px_rgba(10,92,58,0.18)] hover:shadow-[0_8px_20px_rgba(10,92,58,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150 cursor-pointer text-center"
                >
                  <span>Google Formu Aç</span>
                  <ExternalLink className="w-4.5 h-4.5 stroke-[2]" />
                </a>

                {/* Subtitle note below button */}
                <p className="text-xs text-[#9FA6B2] font-normal font-sans mt-3 text-center select-none">
                  Google Form yeni sekmede açılacaktır.
                </p>
              </div>

              {/* Secondary Link: Return to Login */}
              <div className="w-full text-center mt-8 flex justify-center select-none">
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5F6773] hover:text-[#0A5C3A] transition-all duration-150"
                >
                  <motion.span
                    whileHover={{ x: -2 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5"
                  >
                    <span>←</span> Girişe Dön
                  </motion.span>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </PageBackground>
    </LayoutGroup>
  );
}
