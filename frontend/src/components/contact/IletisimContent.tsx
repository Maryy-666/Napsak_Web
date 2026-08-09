"use client";

import React, { useState, useEffect } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { FaInstagram, FaLinkedin } from "react-icons/fa6";
import { Mail, Phone, MessageCircleHeart, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "../../config/site";
import { Card } from "../ui/Card";
import { Logo } from "../common/Logo";
import { ContactForm } from "./ContactForm";

export default function IletisimContent() {
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isMobile = windowSize.width < 640;

  const springConfig = {
    type: "spring" as const,
    stiffness: 110,
    damping: 18,
    mass: 0.8,
  };

  const contactItems = [
    {
      icon: Mail,
      title: "E-posta",
      value: SITE_CONFIG.contact.email,
      href: `mailto:${SITE_CONFIG.contact.email}`,
    },
    {
      icon: Phone,
      title: "Topluluk Hattı",
      value: SITE_CONFIG.contact.phone,
      href: `tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, "")}`,
    },
  ];

  return (
    <LayoutGroup id="iletisim-layout-group">
      <div
        className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center bg-white px-4 py-8 sm:py-12 overflow-hidden"
        id="iletisim-page-root"
      >
        {/* Subtle Radial Gradient at Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(10,92,58,0.04)_0%,transparent_75%)] pointer-events-none z-0" />

        {/* Premium Line Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />

        {/* Grid Dot Intersections */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(10,92,58,0.14)_2px,transparent_2px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />

        {/* Subtle Noise Grain Layer */}
        <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none mix-blend-overlay z-0" />

        {/* Corner Green Spotlights */}
        <div
          className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0"
          style={{ backgroundColor: "rgba(10, 92, 58, 0.28)" }}
        />
        <div
          className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none z-0"
          style={{ backgroundColor: "rgba(10, 92, 58, 0.32)" }}
        />

        {/* Background Decorative Watermark Logo */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {
                  width: isMobile ? 420 : 840,
                  height: isMobile ? 420 : 840,
                  x: isMobile ? "25vw" : "28vw",
                  y: "-10vh",
                  rotate: -12,
                  opacity: 0.06,
                }
              : {
                  width: isMobile ? 420 : 840,
                  height: isMobile ? 420 : 840,
                  x: isMobile ? "25vw" : "28vw",
                  y: "-10vh",
                  rotate: -12,
                  opacity: 0.06,
                }
          }
          transition={springConfig}
          style={{ translateX: "-50%", translateY: "-50%" }}
          className="fixed left-1/2 top-1/2 pointer-events-none z-0 flex items-center justify-center select-none"
        >
          <Logo
            variant="decorative"
            size={isMobile ? 420 : 840}
            opacity={1.0}
            priority
            className="w-full h-full select-none [&_img]:w-full [&_img]:h-full"
          />
        </motion.div>

        {/* 2-COLUMN MAIN CONTENT CONTAINER */}
        <div className="w-full max-w-6xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start py-4">
          
          {/* LEFT COLUMN: Title, Description, Real Contact Details & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-start gap-6 select-none text-left pt-2 sm:pt-4"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F1115] font-headings leading-tight mb-3">
                İletişim
              </h1>
              <p className="text-base sm:text-lg text-[#5F6773] font-medium leading-relaxed font-sans max-w-md mb-6">
                Soruların, önerilerin veya iş birliklerin için bizimle doğrudan iletişime geçebilirsin.
              </p>

              {/* Real Direct Contact Info Block */}
              <div className="space-y-4 my-6 py-4 border-y border-[#EEF0F2]/80">
                <p className="text-xs font-semibold text-[#9FA6B2] uppercase tracking-wider mb-3">
                  İletişim Kanalları
                </p>
                {contactItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={idx}
                      href={item.href}
                      className="flex items-center gap-3.5 group p-2 rounded-xl hover:bg-[#F8F9FA] transition-all duration-150 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-[12px] bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-[#9FA6B2] font-semibold uppercase tracking-wide">
                          {item.title}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-[#0F1115] group-hover:text-[#0A5C3A] font-sans transition-colors">
                          {item.value}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Social Media Section Header + Social Accounts */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#9FA6B2] uppercase tracking-wider mb-3">
                  Sosyal Medyada N'apsak?
                </p>
                <div className="flex flex-col gap-2.5">
                  {SITE_CONFIG.social?.instagram && (
                    <a
                      href={SITE_CONFIG.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] bg-[#F8F9FA] border border-[#EEF0F2] text-[#0F1115] hover:bg-[#0A5C3A]/5 hover:border-[#0A5C3A]/30 hover:text-[#0A5C3A] transition-all duration-200 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0A5C3A]/10 text-[#0A5C3A] group-hover:bg-[#0A5C3A] group-hover:text-white flex items-center justify-center transition-colors">
                        <FaInstagram className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold font-sans">
                        @napsakgencliktoplulugu
                      </span>
                    </a>
                  )}

                  {SITE_CONFIG.social?.linkedin && (
                    <a
                      href={SITE_CONFIG.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] bg-[#F8F9FA] border border-[#EEF0F2] text-[#0F1115] hover:bg-[#0A5C3A]/5 hover:border-[#0A5C3A]/30 hover:text-[#0A5C3A] transition-all duration-200 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0A5C3A]/10 text-[#0A5C3A] group-hover:bg-[#0A5C3A] group-hover:text-white flex items-center justify-center transition-colors">
                        <FaLinkedin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold font-sans">
                        Napsak Gençlik Topluluğu
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Contact Form ("Bize Ulaşın") */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 w-full"
          >
            <Card
              variant="auth"
              animate={false}
              className="w-full rounded-[24px] bg-white/85 backdrop-blur-[20px] border border-white/70 p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,17,21,0.06)] flex flex-col text-left"
            >
              <div className="mb-6 select-none">
                <h2 className="text-2xl font-bold text-[#0F1115] font-headings tracking-tight">
                  Bize Ulaşın
                </h2>
                <p className="text-sm text-[#5F6773] mt-1 font-medium font-sans">
                  Aşağıdaki formu doldurarak mesajınızı doğrudan ekibimize iletebilirsiniz.
                </p>
              </div>
              <ContactForm />
            </Card>
          </motion.div>

        </div>
      </div>
    </LayoutGroup>
  );
}
