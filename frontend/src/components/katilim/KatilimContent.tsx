"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Users,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  UserCheck,
  FileText,
  Rocket,
  HelpCircle,
  Compass,
  MessageCircle,
  Quote,
} from "lucide-react";
import { Badge, Button, Card, PageContainer, Section } from "../ui";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";
import { useLanguage } from "../../context/LanguageContext";

// Framer Motion animasyon varyantları
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};


// 1. Katılım Türleri (3 Açık Tonlu, Güçlü Kart)
const PARTICIPATION_TYPES = [
  {
    id: "gonullu",
    title: "Gönüllü",
    subtitle: "Esnek & Özgür Katılım",
    icon: Heart,
    badgeBg: "bg-[#EAF5EF] text-[#0A5C3A] border-[#0A5C3A]/20",
    iconBg: "bg-[#EAF5EF] text-[#0A5C3A]",
    desc: "Toplumsal etki projelerine, sosyal sorumluluk hareketlerine ve dönemsel saha çalışmalarına esnek zamanlı katkı sun.",
    perks: [
      "Dönemsel ve esnek katkı saatleri",
      "Sosyal etki projelerinde saha deneyimi",
      "Gönüllülük katılım belgesi ve topluluk ağı",
    ],
    actionText: "Gönüllü Ol",
    actionHref: `${ROUTES.BASVURU}?tur=gonullu`,
    featured: false,
  },
  {
    id: "ekip-uyesi",
    title: "Ekip Üyesi",
    subtitle: "Düzenli Üretim & Sorumluluk",
    icon: Users,
    badgeBg: "bg-[#0A5C3A] text-white border-transparent shadow-2xs",
    iconBg: "bg-[#0A5C3A] text-white shadow-sm shadow-[#0A5C3A]/20",
    desc: "Teknoloji, Sanat, Çevre, İletişim veya Etkinlik ekiplerimizden birinde düzenli rol alarak projeleri birlikte yürüt.",
    perks: [
      "Haftalık ekip toplantıları ve sürdürülebilir üretim",
      "Proje liderliği ve takım içi mentörlük",
      "Özel atölye ve ekosistem ayrıcalıkları",
    ],
    actionText: "Ekipleri İncele ve Başvur",
    actionHref: ROUTES.EKIPLER,
    featured: true,
  },
  {
    id: "etkinlik-katilimcisi",
    title: "Etkinlik Katılımcısı",
    subtitle: "İlham & Networking",
    icon: CalendarDays,
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200/60",
    iconBg: "bg-blue-50 text-blue-600",
    desc: "Düzenlediğimiz yüz yüze zirvelere, çevrim içi atölyelere ve fikir kamplarına katılarak topluluğumuzla tanış.",
    perks: [
      "Ücretsiz atölye ve zirve buluşmaları",
      "İlgi alanlarına göre topluluk networking'i",
      "Gelecek etkinlikler için öncelikli kayıt",
    ],
    actionText: "Etkinlikleri Keşfet",
    actionHref: ROUTES.ETKINLIKLER,
    featured: false,
  },
];

// 2. Katılım Süreci (4 Adımlı Görsel Akış)
const PROCESS_STEPS = [
  {
    stepNumber: "01",
    title: "Yolunu Seç",
    desc: "Gönüllü, ekip üyesi veya etkinlik katılımcısı olarak hangi yolla katkı sunmak istediğini belirle.",
    icon: Compass,
  },
  {
    stepNumber: "02",
    title: "Başvurunu Gönder",
    desc: "Kısa başvuru formunu doldurarak ilgi alanlarını, becerilerini ve beklentilerini bizimle paylaş.",
    icon: FileText,
  },
  {
    stepNumber: "03",
    title: "Tanışalım",
    desc: "İlgili çalışma ekibinden arkadaşlarımızla 15 dakikalık samimi ve tatlı bir tanışma sohbeti yapalım.",
    icon: UserCheck,
  },
  {
    stepNumber: "04",
    title: "Birlikte Başlayalım",
    desc: "İletişim kanalımıza dahil ol, oryantasyonunu tamamla ve ilk projende heyecanla üretmeye başla!",
    icon: Rocket,
  },
];

// 3. Sık Sorulan Sorular (Aklındaki Sorular - Accordion)
const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Başvurum nasıl incelenir?",
    answer: "Başvurun, belirttiğin ilgi alanları ve katılım türüne göre ilgili çalışma ekibimizin kolaylaştırıcıları tarafından samimiyetle ve özenle değerlendirilir.",
  },
  {
    id: "faq-2",
    question: "Ne zaman dönüş yapılır?",
    answer: "Başvurular ekibimiz tarafından dönemsel ve düzenli periyotlarda incelenir. Başvuru yoğunluğuna bağlı olarak en kısa sürede e-posta veya mesaj yoluyla seninle iletişime geçiyoruz.",
  },
  {
    id: "faq-3",
    question: "Tanışma görüşmesi nasıl olur?",
    answer: "Resmi ve kasıntı bir iş mülakatı kesinlikle değil! Seni tanımak, merak ettiklerini yanıtlamak ve topluluğumuzun ruhunu anlatmak için yaptığımız 15-20 dakikalık samimi bir çevrim içi sohbet.",
  },
  {
    id: "faq-4",
    question: "Hangi ekibe yönlendirilirim?",
    answer: "Başvuru formunda belirttiğin becerilerin, ilgi alanların ve gelişmek istediğin konular doğrultusunda sana en çok değer katacak çalışma ekibine yönlendirilirsin.",
  },
  {
    id: "faq-5",
    question: "Süreçten sonra ne olur?",
    answer: "Yönlendirildiğin ekibin ortak iletişim kanalına eklenirsin. İlk oryantasyon buluşmasında takım arkadaşlarınla tanışır ve ilk etkinliğinde yerini alırsın.",
  },
];

export default function KatilimContent({ pageData }: { pageData?: any }) {
  const { language, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const isEn = language === "en";

  return (
    <PageBackground id="katilim-root" className="select-none px-0 py-0 overflow-hidden bg-white text-slate-900">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO BÖLÜMÜ (Aramıza Katıl - Sıcak, Ferah & Motive Edici)   */}
      {/* ------------------------------------------------------------- */}
      <Section padding="none" background="transparent" className="pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-100 relative overflow-hidden">
        {/* Soft Arka Plan Yuvarlak Parıltıları */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#0A5C3A]/10 via-[#128C59]/10 to-amber-200/20 blur-3xl pointer-events-none rounded-full" />

        <PageContainer className="max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center max-w-3xl mx-auto space-y-5"
          >
            {/* Üst Rozet */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5EF] border border-[#0A5C3A]/20 text-[#0A5C3A] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? "N'apsak? Community Joining Guide" : "N'apsak? Topluluk Katılım Rehberi"}</span>
            </div>

            {/* Büyük Başlık */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-headings leading-[1.15]">
              {pageData?.title ? (
                pageData.title
              ) : isEn ? (
                <>Join <span className="text-[#0A5C3A]">Us</span></>
              ) : (
                <>Aramıza <span className="text-[#0A5C3A]">Katıl</span></>
              )}
            </h1>

            {/* Açıklama Metni */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-sans font-normal max-w-2xl mx-auto">
              {pageData?.shortDescription
                ? pageData.shortDescription
                : isEn
                ? "There is always a place for your ideas, energy, and curiosity in N'apsak? Youth Community. Contribute to projects as a volunteer, produce regularly in our teams, or meet us at our events."
                : "N'apsak? Gençlik Topluluğu'nda fikirlerin, enerjin ve merakın için her zaman bir yer var. İster gönüllü olarak projelere el ver, ister ekiplerimize katılarak düzenli üret, ister etkinliklerimizde bizimle buluş."}
            </p>

            {/* CTA Butonları */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
              <a
                href="#katilim-turleri"
                className="bg-[#0A5C3A] hover:bg-[#128C59] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#0A5C3A]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isEn ? "Discover Ways to Join" : "Katılım Yollarını Keşfet"}</span>
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              </a>

              <Link
                href={ROUTES.BASVURU}
                className="bg-white border border-slate-200 text-slate-900 hover:border-[#0A5C3A]/40 hover:bg-slate-50 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>{isEn ? "Apply Now" : "Başvuru Yap"}</span>
                <ArrowRight className="w-4 h-4 text-[#0A5C3A] stroke-[2.5]" />
              </Link>
            </div>


            {/* Mini Değerler Rozeti */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0A5C3A]" />
                <span>Samimi & Açık Ekosistem</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0A5C3A]" />
                <span>Birlikte Öğrenme ve Üretim</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0A5C3A]" />
                <span>Sıfır Bürokrasi, Yüksek Enerji</span>
              </span>
            </div>
          </motion.div>
        </PageContainer>
      </Section>

      {/* ------------------------------------------------------------- */}
      {/* 2. KATILIM TÜRLERİ (3 Ferah ve Açık Renk Kart)                */}
      {/* ------------------------------------------------------------- */}
      <Section id="katilim-turleri" padding="none" background="white" className="py-16 sm:py-24 border-b border-slate-100">
        <PageContainer className="max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-14 space-y-3"
          >
            <span className="text-xs font-semibold text-[#0A5C3A] uppercase tracking-widest bg-[#EAF5EF] px-3 py-1 rounded-full border border-[#0A5C3A]/20">
              Senin Yolun Hangisi?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-headings">
              Topluluğumuza Katılım Türleri
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans font-normal leading-relaxed">
              Zamanına, hedeflerine ve enerjine en uygun katılım seçeneğini belirle.
            </p>
          </motion.div>

          {/* 3 Açık Renk Kart Düzeni */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {PARTICIPATION_TYPES.map((type, idx) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  custom={idx * 0.08}
                  variants={fadeInUp}
                  className="flex"
                >
                  <div
                    className={`w-full rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between relative group ${
                      type.featured
                        ? "bg-gradient-to-b from-[#EAF5EF]/90 via-[#F4FAFC] to-white border-[#0A5C3A]/40 shadow-md shadow-[#0A5C3A]/10"
                        : "bg-white border-slate-200/90 hover:border-[#0A5C3A]/30 shadow-2xs hover:shadow-md transition-shadow"
                    }`}
                  >
                    {type.featured && (
                      <span className="absolute -top-3 left-6 text-[10.5px] font-bold bg-[#0A5C3A] text-white px-3.5 py-0.5 rounded-full shadow-2xs">
                        Popüler Seçim
                      </span>
                    )}

                    <div>
                      {/* Üst İkon & Rozet */}
                      <div className="flex items-center justify-between mb-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type.iconBg}`}>
                          <Icon className="w-6 h-6 stroke-[2]" />
                        </div>
                        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${type.badgeBg}`}>
                          {type.subtitle}
                        </span>
                      </div>

                      {/* Başlık & Açıklama */}
                      <h3 className="text-xl font-bold font-headings text-slate-900 mb-2">
                        {type.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-sans font-normal leading-relaxed mb-6">
                        {type.desc}
                      </p>

                      {/* Avantajlar Listesi */}
                      <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                        {type.perks.map((perk, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#0A5C3A] shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alt CTA Butonu */}
                    <div className="pt-2">
                      <Link
                        href={type.actionHref}
                        className={`w-full py-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          type.featured
                            ? "bg-[#0A5C3A] hover:bg-[#128C59] text-white shadow-sm"
                            : "bg-slate-100 text-slate-800 hover:bg-[#0A5C3A] hover:text-white"
                        }`}
                      >
                        <span>{type.actionText}</span>
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </Section>

      {/* ------------------------------------------------------------- */}
      {/* 3. KATILIM SÜRECİ ("Katılım Süreci Nasıl İşler?")              */}
      {/* ------------------------------------------------------------- */}
      <Section id="katilim-sureci" padding="none" background="subtle" className="py-16 sm:py-24 border-b border-slate-100">
        <PageContainer className="max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-14 space-y-3"
          >
            <span className="text-xs font-semibold text-[#0A5C3A] uppercase tracking-widest bg-[#EAF5EF] px-3 py-1 rounded-full border border-[#0A5C3A]/20">
              Şeffaf & Akıcı Adımlar
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-headings">
              Katılım Süreci Nasıl İşler?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans font-normal leading-relaxed">
              Kafa karışıklığı yok, kasıntı mülakatlar yok. 4 basit adımda topluluk yolculuğuna başla.
            </p>
          </motion.div>

          {/* 4 Adımlı Yatay Stepper Akışı */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.stepNumber}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={idx * 0.1}
                  variants={fadeInUp}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 relative flex flex-col justify-between shadow-2xs hover:border-[#0A5C3A]/40 transition-all hover:shadow-md"
                >
                  {/* Adım Numarası & İkon */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-9 h-9 rounded-xl bg-[#EAF5EF] text-[#0A5C3A] font-bold text-xs flex items-center justify-center font-headings">
                        {step.stepNumber}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold font-headings text-slate-900 mb-2">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-sans font-normal leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Alt Adım Göstergesi */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#0A5C3A]">
                    <span>Adım {idx + 1} / 4</span>
                    {idx < 3 && <ChevronRight className="w-3.5 h-3.5 opacity-60 hidden lg:inline" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </Section>

      {/* ------------------------------------------------------------- */}
      {/* 4. SIK SORULAN SORULAR ("Aklındaki Sorular")                   */}
      {/* ------------------------------------------------------------- */}
      <Section id="aklindaki-sorular" padding="none" background="white" className="py-16 sm:py-24 border-b border-slate-100">
        <PageContainer className="max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            variants={fadeInUp}
            className="text-center max-w-xl mx-auto mb-12 space-y-3"
          >
            <span className="text-xs font-semibold text-[#0A5C3A] uppercase tracking-widest bg-[#EAF5EF] px-3 py-1 rounded-full border border-[#0A5C3A]/20">
              Merak Edilenler
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-headings">
              Aklındaki Sorular
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans font-normal leading-relaxed">
              Katılım süreci, değerlendirme ve yönlendirmeler hakkında bilmek istediklerin.
            </p>
          </motion.div>

          {/* SSS Accordion Listesi */}
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? "bg-[#EAF5EF]/50 border-[#0A5C3A]/30 shadow-2xs"
                      : "bg-white border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4.5 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold font-headings text-slate-900 hover:text-[#0A5C3A] transition-colors outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-[#0A5C3A] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[#0A5C3A]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-sans font-normal leading-relaxed border-t border-slate-100 pl-12">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Ekstra Destek & SSS Yönlendirme Bilgisi */}
          <div className="mt-8 p-4.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-[#0A5C3A] shrink-0" />
              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                Başka bir sorun mu var? SSS sayfamızı inceleyebilir veya dilediğin zaman bizimle iletişime geçebilirsin.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={ROUTES.SSS}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0A5C3A] bg-[#EAF5EF] hover:bg-[#0A5C3A] hover:text-white px-3.5 py-2 rounded-xl transition-all"
              >
                <span>Tüm SSS'leri Gör</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
              <Link
                href={ROUTES.ILETISIM}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0A5C3A] hover:underline"
              >
                <span>İletişime Geç</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* ------------------------------------------------------------- */}
      {/* 5. FINAL CTA (Referans Görsel ile Birebir Aynı Uyumlu Banner) */}
      {/* ------------------------------------------------------------- */}
      <Section id="basvuru-final" padding="none" background="transparent" className="py-12 sm:py-16">
        <PageContainer className="max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.2}
            variants={fadeInUp}
            className="rounded-[24px] bg-[#0A5C3A] text-white p-7 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 select-none shadow-[0_20px_50px_rgba(10,92,58,0.20)] relative overflow-hidden"
          >
            {/* Sağ Taraf Dairesel Gölge/Parıltı Efekti */}
            <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-black/10 pointer-events-none" />
            <div className="absolute -right-6 -bottom-6 w-60 h-60 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10 space-y-2 max-w-2xl">
              <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-lg inline-block font-sans">
                Harekete Geç
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-headings tracking-tight text-white leading-tight">
                Sen de N'apsak?'ta yerini al!
              </h3>

              <p className="text-xs sm:text-sm lg:text-base text-white/90 font-sans font-medium leading-relaxed">
                “Keşke..” diyenlerin değil, “N'apsak?” deyip harekete geçenlerin topluluğuyuz. Potansiyelini keşfetmek, projelerini üretmek ve senin gibi düşünen gençlerle buluşmak için üyelik başvurusu yapabilirsin.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <Button
                href={ROUTES.BASVURU}
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                className="!bg-white !text-[#0A5C3A] hover:!bg-[#F8F9FA] font-bold text-sm px-6 h-12 rounded-xl shadow-md cursor-pointer whitespace-nowrap w-full sm:w-auto justify-center"
              >
                Topluluğa Katıl
              </Button>
            </div>
          </motion.div>
        </PageContainer>
      </Section>
    </PageBackground>
  );
}
