"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  Palette,
  ShieldAlert,
  Cpu,
  Megaphone,
  Layers,
  Calendar,
  Rocket,
  Award,
  UserCheck,
  FileText,
  Users2,
  Sparkles,
  Zap,
  Target,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge, Button, Card, PageContainer, Section } from "../ui";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";

// Kaydırdıkça süzülerek açılan Framer Motion varyantı
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut",
    },
  }),
};

// DİNAMİK DEĞİŞEN KELİMELER
const DYNAMIC_WORDS = ["üretime", "projeye", "yeniliğe", "gelişime", "başarıya"];

// --- 5 ÇALIŞMA EKİBİ (YEŞİLİN ZENGİN VE FARKLI TONLARI İLE) ---
const WORKING_TEAMS = [
  {
    id: "sanat",
    title: "Sanat Ekibi",
    icon: Palette,
    tag: "Kültür & Estetik",
    description: "Resim, müzik, edebiyat, dijital sanat ve seramik atölyeleriyle sanatsal üretimi destekler.",
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white",
    tagBg: "bg-emerald-100/70 text-emerald-800 font-bold",
  },
  {
    id: "saglik-cevre",
    title: "Sağlık ve Çevre Ekibi",
    icon: ShieldAlert,
    tag: "Sürdürülebilirlik",
    description: "Çevre farkındalığı, sürdürülebilirlik projeleri ve gençlerin fiziksel/ruhsal sağlığı için çalışır.",
    iconBg: "bg-teal-50 text-teal-600 border border-teal-200/80 group-hover:bg-teal-600 group-hover:text-white",
    tagBg: "bg-teal-100/70 text-teal-800 font-bold",
  },
  {
    id: "teknoloji",
    title: "Teknoloji Ekibi",
    icon: Cpu,
    tag: "İnovasyon & Dijital",
    description: "Yazılım, yapay zeka ve dijital ürünler geliştirir; yarışmalarda topluluğumuzu temsil eder.",
    iconBg: "bg-emerald-100/60 text-[#0A5C3A] border border-emerald-300/60 group-hover:bg-[#0A5C3A] group-hover:text-white",
    tagBg: "bg-[#0A5C3A]/10 text-[#0A5C3A] font-bold",
  },
  {
    id: "iletisim",
    title: "Medya ve İletişim Ekibi",
    icon: Megaphone,
    tag: "İçerik & Yayın",
    description: "Sosyal medya yönetimi, dijital yayınlar, görsel tasarım ve topluluk duyurularını yürütür.",
    iconBg: "bg-lime-50 text-lime-700 border border-lime-300/80 group-hover:bg-lime-600 group-hover:text-white",
    tagBg: "bg-lime-100 text-lime-800 font-bold",
  },
  {
    id: "programlar",
    title: "Programlar Ekibi",
    icon: Layers,
    tag: "Eğitim & Etkinlik",
    description: "Kişisel gelişim seminerleri, buluşmalar, atölyeler ve hobi programları tasarlar.",
    iconBg: "bg-green-50 text-green-700 border border-green-200/80 group-hover:bg-green-700 group-hover:text-white",
    tagBg: "bg-green-100/80 text-green-800 font-bold",
  },
];

// --- NASIL KURULDUK ADIMLARI ---
const TIMELINE_STEPS = [
  {
    step: "01",
    title: "2025 - Fikrin Doğuşu",
    desc: "Gençlerin 'Keşke' demek yerine fikirlerini harekete geçireceği bağımsız bir topluluk kurma fikri doğdu.",
  },
  {
    step: "02",
    title: "Mülakatlı Üyelik Yapısının Kurulması",
    desc: "Kriterleri belirleyerek nitelikli ve üretken bir üye yapısı oluşturduk (86+ Aktif Lise ve Üniversite Üyesi).",
  },
  {
    step: "03",
    title: "Çalışma Ekiplerinin ve İlk Sahaların Oluşumu",
    desc: "Sanat, Çevre & Sağlık, Teknoloji, İletişim ve Programlar ekipleri kuruldu; uygulamalı atölyeler yapıldı.",
  },
  {
    step: "04",
    title: "Gelecek Vizyonu & Projeler",
    desc: "Ulusal ölçekte tanınan Gençlik Zirveleri ve atölye serileriyle üretkenliği büyütmeye devam ediyoruz.",
  },
];

// --- MANİFESTOMUZ (5 DİKEY LİSTE MADDESİ) ---
const MANIFESTO_ITEMS = [
  {
    num: "01",
    text: "Bir fikri tek başına büyütmek zorunda olmadığımızı biliyoruz.",
  },
  {
    num: "02",
    text: "Merak ettiğimiz şeyi denemek, öğrenmek ve paylaşmak için bir araya geliyoruz.",
  },
  {
    num: "03",
    text: "Kod yazan, çizim yapan, etkinlik planlayan, içerik üreten ve sosyal fayda peşinde koşan herkes için alan açıyoruz.",
  },
  {
    num: "04",
    text: "Bazen bir atölye, bazen bir buluşma, bazen de çocukların yüzünü güldüren bir etkinlik bizim için aynı hikayenin parçası.",
  },
  {
    num: "05",
    text: "N'apsak? bizim için büyük sözlerden çok, birlikte atılan küçük ama gerçek adımlar demek.",
  },
];

// --- NASIL KATILINIR? (KATILIM SÜRECİ ADIMLARI) ---
const JOINING_STEPS = [
  {
    num: "01",
    title: "Başvuru Formunu Doldur",
    description: "Katılım formumuz üzerinden yeteneklerini, ilgi alanlarını ve hedeflerini bizlerle paylaşırsın.",
    icon: FileText,
  },
  {
    num: "02",
    title: "Tanışma Mülakatı",
    description: "Ekibimizle samimi ve keyifli bir çevrim içi tanışma mülakatı gerçekleştirirsin.",
    icon: UserCheck,
  },
  {
    num: "03",
    title: "Çalışma Ekibine Dahil Ol",
    description: "İlgi duyduğun (Sanat, Teknoloji, Çevre vb.) çalışma grubuna katılarak rolünü alırsın.",
    icon: Users2,
  },
  {
    num: "04",
    title: "Birlikte Üret & Geliş",
    description: "Atölyelerde, projelerde ve saha çalışmalarında aktif rol alarak fikirlerini hayata geçirirsin.",
    icon: Sparkles,
  },
];

// --- MERKEZİ GÖRSEL SLIDESHOW ARRAY'İ ---
const ABOUT_SLIDES = [
  {
    src: "/images/news-ani-cover.jpg",
    alt: "N'apsak? Gençlik Topluluğu Anı Defteri Atölyesi",
    tag: "Gençlik Hareketi",
    caption: "Bilgiyi tecrübeye, merakı üretime dönüştüren bir gençlik alanı.",
  },
  {
    src: "/images/news-kariyer-cover.jpg",
    alt: "N'apsak? Gençlik Topluluğu Kariyer Buluşması",
    tag: "Gelişim & Zirve",
    caption: "Gençlerin kendi geleceğinin mimarı olduğu özgür bir alan.",
  },
  {
    src: "/images/news-kil-main.png",
    alt: "N'apsak? Gençlik Topluluğu Sanat Atölyesi",
    tag: "Sanat & Atölye",
    caption: "Resim, müzik, seramik ve dijital sanatla üretimi destekliyoruz.",
  },
  {
    src: "/images/news-23nisan-cover.jpg",
    alt: "N'apsak? Gençlik Topluluğu 23 Nisan Buluşması",
    tag: "Topluluk Ruhu",
    caption: "Birlikte gelişen, paylaşan ve geleceğe yön veren gençlik.",
  },
  {
    src: "/images/news-cd-cover.jpg",
    alt: "N'apsak? Gençlik Topluluğu Sosyal Buluşma Etkinliği",
    tag: "Sosyal Fayda",
    caption: "Küçük adımlarla büyük değişimler yaratan tutkulu topluluk.",
  },
];

export default function HakkimizdaContent() {
  const [wordIndex, setWordIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const resetSlideTimer = useCallback(() => {
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
    }
    slideTimerRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % ABOUT_SLIDES.length);
    }, 5000);
  }, []);

  useEffect(() => {
    resetSlideTimer();
    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [resetSlideTimer]);

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % ABOUT_SLIDES.length);
    resetSlideTimer();
  };

  const handlePrevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + ABOUT_SLIDES.length) % ABOUT_SLIDES.length);
    resetSlideTimer();
  };

  const goToSlide = (index: number) => {
    setSlideIndex(index);
    resetSlideTimer();
  };

  const currentWord = DYNAMIC_WORDS[wordIndex];

  // SLIDER KAYDIRMA FONKSİYONU
  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <PageBackground id="hakkimizda-root" className="select-none px-0 py-0">
      {/* -------------------------------------------------------------
          1. GİRİŞ (HERO): FERAH ÜST/ALT BOŞLUK
      ------------------------------------------------------------- */}
      <Section padding="none" background="transparent" className="pt-16 sm:pt-24 pb-16 sm:pb-24 border-b border-[#EEF0F2] relative">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto select-none space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings leading-relaxed py-1.5">
              Fikirlerin cesarete, merakın <br className="hidden sm:inline" />
              <span className="inline-block relative text-[#0A5C3A] w-[145px] sm:w-[185px] lg:w-[215px] text-center align-baseline font-black">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="inline-block bg-gradient-to-r from-[#0A5C3A] to-[#128C59] bg-clip-text text-transparent font-black text-center whitespace-nowrap leading-normal"
                  >
                    {currentWord}
                  </motion.span>
                </AnimatePresence>
              </span>{" "}
              dönüştüğü gençlik alanı.
            </h1>

            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium max-w-3xl mx-auto">
              Topluluğumuz; lise ve üniversite öğrencilerinin kendi potansiyellerini keşfetmesini, çalışma gruplarıyla projeler üretmesini ve geleceğe özgüvenle hazırlanmasını sağlar.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <Button
                href={ROUTES.BASVURU}
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
                className="font-bold px-7 h-12 text-sm sm:text-base rounded-xl"
              >
                Topluluğa Katıl
              </Button>
              <Button
                href="#biz-kimiz"
                variant="outline"
                size="lg"
                className="font-semibold px-6 h-12 text-sm sm:text-base rounded-xl border-[#EEF0F2]"
              >
                Keşfetmeye Başla
              </Button>
            </div>
          </motion.div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          2. BİZ KİMİZ?: FERAH ÜST/ALT BOŞLUK
      ------------------------------------------------------------- */}
      <Section id="biz-kimiz" padding="none" background="transparent" className="py-16 sm:py-22 lg:py-24 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Sol Taraf: Scroll Reveal */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0}
              variants={fadeInUp}
              className="lg:col-span-7 select-none space-y-6"
            >
              <div className="space-y-4">
                <Badge variant="brand" size="md">
                  01 / Biz Kimiz?
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F1115] font-headings leading-tight">
                  Biz kimiz?
                </h2>

                <div className="space-y-4 pt-1">
                  <p className="text-base sm:text-lg text-[#0F1115] font-headings font-bold leading-relaxed">
                    N'apsak? Gençlik Topluluğu; lise ve üniversite öğrencilerinin potansiyellerini görünür kılmak, fikirlerini projeye dönüştürmek ve iz bırakma cesareti kazandırmak amacıyla kurulmuş bağımsız bir gelişim hareketidir.
                  </p>
                  <p className="text-sm sm:text-base text-[#5F6773] font-sans font-medium leading-relaxed">
                    Hiyerarşiden uzak, üretme heyecanını merkeze alan yapımızla; gençlerin sadece izleyici değil, kendi geleceğinin mimarı olduğu özgür bir alan açıyoruz.
                  </p>
                </div>
              </div>

              {/* MOTTO KUTUSU */}
              <div className="p-4.5 rounded-[16px] bg-white border border-[#EEF0F2] flex items-center gap-4 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                  <Quote className="w-5 h-5 stroke-[2]" />
                </div>
                <p className="text-sm sm:text-base font-medium italic text-[#0A5C3A] font-sans leading-relaxed">
                  “Keşke” diyenlerin değil, “N'apsak?” diyenlerin topluluğuyuz.
                </p>
              </div>
            </motion.div>

            {/* Sağ Taraf: Fotoğraf Çerçevesi - Otomatik Crossfade Slideshow */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.1}
              variants={fadeInUp}
              className="lg:col-span-5"
            >
              <div className="relative rounded-[24px] overflow-hidden border border-[#EEF0F2] bg-white p-3 shadow-[0_14px_36px_rgba(15,17,21,0.06)]">
                <div className="relative h-80 sm:h-96 lg:h-[400px] w-full rounded-[18px] overflow-hidden group">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                      key={slideIndex}
                      src={ABOUT_SLIDES[slideIndex].src}
                      alt={ABOUT_SLIDES[slideIndex].alt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </AnimatePresence>

                  {/* Dark Overlay with Tag & Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 z-10 pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={slideIndex}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4 }}
                        className="text-white"
                      >
                        <span className="bg-[#0A5C3A] text-white text-[11px] font-extrabold px-3.5 py-1 rounded-md uppercase tracking-wider mb-2.5 inline-block">
                          {ABOUT_SLIDES[slideIndex].tag}
                        </span>
                        <p className="text-sm font-medium text-white/95 leading-relaxed">
                          {ABOUT_SLIDES[slideIndex].caption}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Controls: Arrows & Indicators */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
                    <button
                      onClick={handlePrevSlide}
                      aria-label="Önceki Görsel"
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <div className="flex items-center gap-1 px-1">
                      {ABOUT_SLIDES.map((_: unknown, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => goToSlide(idx)}
                          aria-label={`Görsel ${idx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === slideIndex ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleNextSlide}
                      aria-label="Sonraki Görsel"
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          3. NELER YAPIYORUZ?: FERAH, GENİŞ VE RAHAT OKUNUR KARTLAR
      ------------------------------------------------------------- */}
      <Section id="neler-yapiyoruz" padding="none" background="white" className="py-16 sm:py-22 lg:py-24 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between mb-8 select-none gap-4"
          >
            <div>
              <Badge variant="brand" size="md" className="mb-2.5">
                02 / Neler Yapıyoruz?
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115] font-headings">
                Çalışma Ekiplerimiz
              </h2>
              <p className="text-sm sm:text-base text-[#5F6773] font-sans font-medium mt-1">
                5 Farklı ekibimizle kültür, sanat, teknoloji ve gelişim alanlarında üretiyoruz.
              </p>
            </div>

            {/* SLIDER SOL / SAĞ BUTONLARI */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => scrollSlider("left")}
                aria-label="Önceki Ekip"
                className="w-10 h-10 rounded-xl border border-[#EEF0F2] bg-white text-[#0F1115] hover:bg-[#0A5C3A] hover:text-white hover:border-[#0A5C3A] transition-all flex items-center justify-center shadow-xs"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2]" />
              </button>
              <button
                onClick={() => scrollSlider("right")}
                aria-label="Sonraki Ekip"
                className="w-10 h-10 rounded-xl border border-[#EEF0F2] bg-white text-[#0F1115] hover:bg-[#0A5C3A] hover:text-white hover:border-[#0A5C3A] transition-all flex items-center justify-center shadow-xs"
              >
                <ChevronRight className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </motion.div>

          {/* YANA DOĞRU KAYDIRMALI CAROUSEL - FERAH VE GENİŞ KARTLAR */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scrollbar-none select-none scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {WORKING_TEAMS.map((team, idx) => {
              const IconComp = team.icon;
              return (
                <motion.div
                  key={team.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  custom={idx * 0.08}
                  variants={fadeInUp}
                  className="min-w-[300px] sm:min-w-[340px] max-w-[360px] snap-start shrink-0"
                >
                  <Card
                    variant="default"
                    animate={false}
                    hoverElevation
                    className="h-full rounded-[22px] p-6.5 border-[#EEF0F2] flex flex-col justify-between hover:border-[#0A5C3A]/40 transition-colors bg-white group shadow-xs min-h-[250px]"
                  >
                    <div>
                      {/* İKON KUTUSU */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 shadow-xs ${team.iconBg}`}>
                        <IconComp className="w-5.5 h-5.5 stroke-[2]" />
                      </div>

                      {/* ETİKET */}
                      <span className={`text-[11px] px-3 py-1 rounded-md mb-3 inline-block font-bold ${team.tagBg}`}>
                        {team.tag}
                      </span>

                      <h3 className="text-lg sm:text-xl font-bold font-headings text-[#0F1115] mb-2 group-hover:text-[#0A5C3A] transition-colors">
                        {team.title}
                      </h3>
                      <p className="text-sm text-[#5F6773] font-sans leading-relaxed font-medium">
                        {team.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* FERAH 3 ÖZET VURGU ŞERİDİ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-[#EEF0F2] mt-3 select-none">
            {[
              {
                title: "Atölye & Üretim",
                desc: "Uygulamalı hobi ve beceri çalışmaları",
                icon: Rocket,
                iconColor: "bg-emerald-50 text-emerald-600",
              },
              {
                title: "Proje Üretimi",
                desc: "Fikirden somut çıktılara dönüşüm",
                icon: Target,
                iconColor: "bg-teal-50 text-teal-600",
              },
              {
                title: "Sosyal Sorumluluk",
                desc: "Çevre bilinci ve gençlik buluşmaları",
                icon: Award,
                iconColor: "bg-green-50 text-green-700",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F9FA] border border-[#EEF0F2]"
                >
                  <div className={`w-9.5 h-9.5 rounded-lg flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F1115] font-headings">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#5F6773] font-sans font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          4. NASIL KURULDUK? (SADECE BOYUTU AYARLANMIŞ NORMAL METİNLER & İÇİ BOŞALTILMIŞ DERECE HALKALARI)
      ------------------------------------------------------------- */}
      <Section id="nasil-kurulduk" padding="none" background="subtle" className="py-16 sm:py-22 lg:py-24 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Sol Hikaye Anlatımı - KALINLAŞTIRILMADAN SADECE BOYUTU AYARLANDI */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0}
              variants={fadeInUp}
              className="lg:col-span-5 select-none space-y-6"
            >
              <div>
                <Badge variant="brand" size="md" className="mb-2.5">
                  03 / Nasıl Kurulduk?
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115] font-headings leading-tight mb-3">
                  Nasıl kurulduk?
                </h2>
              </div>

              {/* SADECE BOYUTU AYARLANMIŞ NORMAL METİNLER (EXTRA BOLD / KALINLAŞTIRMA YOK!) */}
              <div className="space-y-3.5 text-sm sm:text-base text-[#5F6773] leading-relaxed font-sans font-medium">
                <p className="text-base sm:text-lg text-[#0F1115] font-sans font-medium leading-relaxed">
                  Topluluğumuz, gençlerin yalnızca akademik olarak değil; sosyal, kültürel, sanatsal ve teknolojik alanlarda da desteklenmesi gerektiğine olan inançla <span className="text-[#0A5C3A] font-semibold">2025 yılında</span> kuruldu.
                </p>
                <p className="text-sm sm:text-base">
                  Kuruluşumuzun temelinde <span className="text-[#0A5C3A] font-semibold">“Kendine Yeten Birey”</span> anlayışı yatar. Bizler için kendine yetmek; özgüveni yüksek, eleştirel düşünebilen, sorunlara yaratıcı çözümler üreten ve topluma değer katan gençler olmaktır.
                </p>
                <p className="text-sm sm:text-base">
                  İlk günden itibaren nitelikli gelişim ortamını korumak amacıyla <strong className="text-[#0F1115] font-semibold">mülakatlı üyelik modelini</strong> benimsedik. Bugün 86'dan fazla aktif üyemizle büyümeye devam ediyoruz.
                </p>
              </div>

              {/* BAĞIMSIZ GENÇLİK HAREKETİ KUTUCUĞU */}
              <div className="p-4 rounded-[16px] bg-[#0A5C3A]/5 border border-[#0A5C3A]/20 flex items-start gap-3.5 shadow-xs mt-2">
                <Zap className="w-5 h-5 text-[#0A5C3A] shrink-0 mt-0.5 stroke-[2]" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A5C3A] mb-0.5">
                    Bağımsız Gençlik Hareketi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6773] font-sans leading-relaxed font-medium">
                    Tamamen gençlerin kendi emeği, enerjisi ve ortak arzusuyla şekillenen bağımsız bir gelişim ağı.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sağ Zaman Çizelgesi - İÇİ BOŞALTILMIŞ DÜĞÜMLER & UZATILMAMIŞ SADE KARTLAR */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.1}
              variants={fadeInUp}
              className="lg:col-span-7"
            >
              <div className="bg-[#F8F9FA] rounded-[22px] border border-[#EEF0F2] p-6 sm:p-7 shadow-xs">
                <h3 className="text-lg sm:text-xl font-bold font-headings text-[#0F1115] mb-6 flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-[#0A5C3A] stroke-[2]" />
                  <span>Kuruluş ve Gelişim Yolculuğumuz</span>
                </h3>

                {/* SÜREÇ AKIŞI ÇİZGİSİ VE KARTLARI */}
                <div className="relative pl-7 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#0A5C3A] before:via-[#128C59] before:to-[#0A5C3A]/30">
                  {TIMELINE_STEPS.map((item, idx) => (
                    <div key={item.step} className="relative group">
                      {/* İÇİ BOŞALTILMIŞ BEYAZ BENEKLİ DAİRESEL DÜĞÜM */}
                      <div className="absolute -left-7 sm:-left-8 top-3.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-[#0A5C3A] text-[#0A5C3A] group-hover:bg-[#0A5C3A] group-hover:text-white flex items-center justify-center text-xs font-bold shadow-xs transition-colors duration-200 z-10">
                        {idx + 1}
                      </div>

                      {/* UZATILMAMIŞ SADE KART */}
                      <div className="bg-white rounded-[14px] p-3.5 sm:p-4 border border-[#EEF0F2] group-hover:border-[#0A5C3A]/40 group-hover:shadow-xs transition-all duration-300">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm sm:text-base font-semibold text-[#0F1115] font-headings group-hover:text-[#0A5C3A] transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-bold text-[#0A5C3A] bg-[#0A5C3A]/10 px-2 py-0.5 rounded-md font-sans shrink-0 ml-2">
                            Aşama 0{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#5F6773] font-sans leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          5. MANİFESTOMUZ (ORİJİNAL İLK VERSİYONA GERİ DÖNÜLDÜ)
      ------------------------------------------------------------- */}
      <Section id="manifestomuz" padding="none" background="white" className="py-16 sm:py-22 lg:py-24 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-5xl sm:max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            variants={fadeInUp}
            className="max-w-4xl mx-auto mb-8 select-none flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0A5C3A] mb-2 block font-sans">
                MANİFESTOMUZ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115] font-headings">
                İnanıyoruz ki
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] hidden sm:flex items-center justify-center">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
          </motion.div>

          {/* 5 DİKEY MADDELİ ÇİZGİSEL LİSTE */}
          <div className="max-w-4xl mx-auto space-y-3.5 select-none">
            {MANIFESTO_ITEMS.map((item, idx) => (
              <motion.div
                key={item.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={idx * 0.08}
                variants={fadeInUp}
                className="group bg-white rounded-[16px] border border-[#EEF0F2] p-5 sm:p-6 shadow-xs hover:border-[#0A5C3A]/40 hover:shadow-md transition-all duration-200 flex items-center gap-5 sm:gap-7"
              >
                <span className="text-xl sm:text-2xl font-black text-[#0A5C3A] font-headings shrink-0 min-w-[36px]">
                  {item.num}
                </span>
                <p className="text-base sm:text-lg font-semibold text-[#0F1115] font-sans leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          6. KATILIM SÜRECİ (MÜKEMMEL HİZALANMIŞ ZİGZAG ROTA AKIŞI)
      ------------------------------------------------------------- */}
      <Section id="katilim-sureci" padding="none" background="subtle" className="py-16 sm:py-22 lg:py-24">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-14 select-none"
          >
            <Badge variant="brand" size="md" className="mb-3">
              Katılım Süreci
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F1115] font-headings mb-3">
              Topluluğumuza Nasıl Katılırsın?
            </h2>
            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium">
              Mülakatlı üyelik modelimizle 4 basit adımda aramıza dahil olabilir, gelişim yolculuğuna başlayabilirsin.
            </p>
          </motion.div>

          {/* KARTLAR VE DÜĞÜMLERLE KUSURSUZ UYUMLU ZİGZAG ROTA */}
          <div className="relative max-w-6xl mx-auto mb-12 select-none">
            {/* DESKTOP ZİGZAG ROTA SVG ÇİZGİSİ */}
            <div className="hidden md:block absolute top-[28px] left-[3%] right-[3%] h-40 pointer-events-none z-0">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 160" fill="none" preserveAspectRatio="none">
                <path
                  d="M 125 28 C 220 28, 280 92, 375 92 C 470 92, 530 28, 625 28 C 720 28, 780 92, 875 92"
                  stroke="url(#route-gradient-perfect)"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                />
                <defs>
                  <linearGradient id="route-gradient-perfect" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0A5C3A" stopOpacity="0.4" />
                    <stop offset="33%" stopColor="#128C59" stopOpacity="1" />
                    <stop offset="66%" stopColor="#0A5C3A" stopOpacity="1" />
                    <stop offset="100%" stopColor="#128C59" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {JOINING_STEPS.map((step, idx) => {
                const Icon = step.icon;
                // 2. ve 4. Adım (Node + Kart) birlikte 64px aşağıya kayar -> SVG çizgisi tam düğüm ortasından geçer, kartlar asla çakışmaz!
                const marginTop = idx % 2 === 1 ? "md:mt-16" : "md:mt-0";

                return (
                  <motion.div
                    key={step.num}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    custom={idx * 0.1}
                    variants={fadeInUp}
                    className={`relative group ${marginTop} transition-all duration-300`}
                  >
                    {/* ROTA NÖDÜ / DÜĞÜM HALKASI */}
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#0A5C3A] text-[#0A5C3A] group-hover:bg-[#0A5C3A] group-hover:text-white font-black text-lg flex items-center justify-center shadow-md mx-auto transition-all duration-300 relative z-10">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    {/* ROTA KARTI */}
                    <div className="bg-white rounded-[20px] border border-[#EEF0F2] p-5 sm:p-6 text-center shadow-xs group-hover:border-[#0A5C3A]/40 group-hover:shadow-md transition-all duration-300 mt-5 flex flex-col justify-between min-h-[190px]">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#0A5C3A] bg-[#0A5C3A]/10 px-2.5 py-0.5 rounded-md font-sans mb-2.5 inline-block">
                          Adım {step.num}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold font-headings text-[#0F1115] mb-2 group-hover:text-[#0A5C3A] transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5F6773] font-sans leading-relaxed font-medium">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* KATILIM BANNER'I */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.2}
            variants={fadeInUp}
            className="rounded-[24px] bg-[#0A5C3A] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 select-none shadow-[0_20px_50px_rgba(10,92,58,0.20)] relative overflow-hidden mt-12 md:mt-20"
          >
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-md mb-3 inline-block">
                Harekete Geç
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-headings tracking-tight mb-2">
                Sen de N'apsak?'ta yerini al!
              </h3>
              <p className="text-sm sm:text-base text-white/85 font-sans font-medium max-w-xl">
                Potansiyelini keşfetmek, projelerini üretmek ve senin gibi düşünen gençlerle buluşmak için mülakatlı üyelik başvurusu yapabilirsin.
              </p>
            </div>
            <Button
              href={ROUTES.BASVURU}
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
              className="!bg-white !text-[#0A5C3A] hover:!bg-[#F8F9FA] font-bold shrink-0 shadow-lg text-base px-6 h-12 relative z-10"
            >
              Topluluğa Katıl
            </Button>
          </motion.div>
        </PageContainer>
      </Section>
    </PageBackground>
  );
}
