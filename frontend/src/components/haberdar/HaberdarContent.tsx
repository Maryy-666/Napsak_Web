"use client";

import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { Mail, Sparkles, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { PageBackground } from "../common/PageBackground";
import { ROUTES } from "../../constants/routes";
import { useLanguage } from "../../context/LanguageContext";

export default function HaberdarContent() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  return (
    <LayoutGroup id="haberdar-layout-group">
      <PageBackground id="haberdar-page-root" className="justify-center py-12 sm:py-16">
        <div className="w-full max-w-3xl px-4 sm:px-6 z-20 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center space-y-10"
          >
            {/* 1. Başarı ve Başlık Alanı */}
            <div className="flex flex-col items-center max-w-2xl space-y-4 select-none">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 140, damping: 14 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-[#0A5C3A] text-xs font-bold shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isEn ? "Application received successfully! 🎉" : "Başvurunuz başarıyla alındı! 🎉"}</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1115] font-headings leading-tight">
                {t("haberdar.title", "Bizden Haberdar Ol")}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed font-sans max-w-xl">
                {t(
                  "haberdar.subtitle",
                  "Artık Ne Yapsak? Gençlik Derneği'nun bir parçası olmak için ilk adımı attın. Gelişmeleri kaçırmamak için bizi takip etmeyi unutma."
                )}
              </p>
            </div>

            {/* 2. Öne Çıkarılan Ana Kanal: WHATSAPP (Hero Card) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-full"
            >
              <div className="relative group p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white/90 backdrop-blur-[20px] border border-emerald-500/30 shadow-[0_15px_40px_rgba(10,92,58,0.06)] hover:shadow-[0_20px_50px_rgba(10,92,58,0.12)] hover:border-emerald-500/50 transition-all duration-300 text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#0A5C3A] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0A5C3A]/20 group-hover:scale-105 transition-transform duration-200">
                      <FaWhatsapp className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0A5C3A] uppercase tracking-wider">
                          {t("haberdar.mainChannel", "Ana İletişim Kanalı")}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold font-headings text-slate-900">
                        WhatsApp
                      </h2>
                      <p className="text-sm text-slate-600 font-medium font-sans">
                        {isEn
                          ? "Follow association announcements and developments directly."
                          : "Dernek duyurularını ve gelişmeleri doğrudan takip et."}
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://chat.whatsapp.com/JYsudsmm6jMAKQioHwIRvi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#0A5C3A]/20 hover:shadow-lg hover:shadow-[#0A5C3A]/30 transition-all cursor-pointer shrink-0"
                  >
                    <span>{t("haberdar.whatsappBtn", "WhatsApp Derneğine Katıl")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* 3. Diğer Kanallar: Instagram, LinkedIn & E-posta (Sade Mini Kartlar) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-full space-y-3"
            >
              <div className="text-left select-none">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t("haberdar.otherChannels", "Diğer Takip Kanallarımız")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/napsak_genclik_toplulugu?igsi=NXd2YmY2Z283c3cx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-500/40 hover:bg-rose-50/20 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <FaInstagram className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 font-headings group-hover:text-rose-600 transition-colors">
                      Instagram
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-rose-600 pt-1">
                    <span>{t("haberdar.follow", "Takip Et")}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/napsakgen%C3%A7lik/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-500/40 hover:bg-blue-50/20 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FaLinkedin className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 font-headings group-hover:text-blue-600 transition-colors">
                      LinkedIn
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-blue-600 pt-1">
                    <span>{t("haberdar.follow", "Takip Et")}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                {/* E-posta */}
                <a
                  href="mailto:kurumsal@napsak.org"
                  className="group p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0A5C3A]/40 hover:bg-emerald-50/20 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0 group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors">
                      <Mail className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 font-headings group-hover:text-[#0A5C3A] transition-colors">
                      {isEn ? "Email" : "E-posta"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#0A5C3A] pt-1">
                    <span className="truncate">kurumsal@napsak.org</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </div>
            </motion.div>

            {/* 5. Alt Aksiyon: Ana Sayfaya Geri Dön */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="pt-6"
            >
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>{t("haberdar.backHome", "Ana Sayfaya Geri Dön")}</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </PageBackground>
    </LayoutGroup>
  );
}
