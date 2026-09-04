"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  MapPin,
  Send,
  Ticket,
  Users,
  X,
  Zap,
  Clock,
} from "lucide-react";
import { Badge, Button, PageContainer, Section } from "../ui";
import { EventItem, EventsRepository } from "../../lib/eventsStore";
import { getCurrentUser, getMemberProfile } from "../../lib/memberAuth";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";
import { useLanguage } from "../../context/LanguageContext";


// Framer Motion animasyon varyantı
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: "easeOut" },
  }),
};

// Tarih Bloğu İçin Ay Ayrıştırma Yardımcısı (Örn: "26 Eylül 2025" -> { day: "26", month: "EYL" })
function parseDateBlock(dateStr: string) {
  if (!dateStr) return { day: "--", month: "ETK" };
  const parts = dateStr.trim().split(" ");
  const day = parts[0] || "--";
  const rawMonth = (parts[1] || "").toUpperCase();
  const month = rawMonth.slice(0, 3) || "ETK";
  return { day, month };
}

export default function EtkinliklerContent() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"aktif" | "gecmis">("aktif");

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [applyingEvent, setApplyingEvent] = useState<EventItem | null>(null);
  const [detailEvent, setDetailEvent] = useState<EventItem | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [grade, setGrade] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setEvents(EventsRepository.getAllEvents());
    EventsRepository.fetchEventsFromDB().then((data) => {
      if (Array.isArray(data)) {
        setEvents(data);
      }
    });
  }, []);

  // Modal açıkken arka plan sayfasının kaymasını engelle
  useEffect(() => {
    if (applyingEvent || detailEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [applyingEvent, detailEvent]);

  const filteredEvents = events.filter((event) => {
    const pubStatus = (event as any).publicationStatus;
    if (pubStatus && pubStatus !== "PUBLISHED") return false; // Strictly hide DRAFT or ARCHIVED events

    const isUpcoming = event.status === "aktif" || event.status === "Yaklaşan" || event.status === "Devam Ediyor";
    const isPast = event.status === "gecmis" || event.status === "Geçmiş";
    const matchesTab = activeTab === "aktif" ? isUpcoming : isPast;
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesTab && matchesCategory;
  });

  const activeCount = events.filter((event) => {
    const pub = (event as any).publicationStatus;
    if (pub && pub !== "PUBLISHED") return false;
    return event.status === "aktif" || event.status === "Yaklaşan" || event.status === "Devam Ediyor";
  }).length;

  const pastCount = events.filter((event) => {
    const pub = (event as any).publicationStatus;
    if (pub && pub !== "PUBLISHED") return false;
    return event.status === "gecmis" || event.status === "Geçmiş";
  }).length;

  const openApplication = (event: EventItem) => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.push(`${ROUTES.LOGIN}?returnTo=${encodeURIComponent(ROUTES.ETKINLIKLER)}`);
      return;
    }

    const profile = getMemberProfile(currentUser);
    setFullName(profile.fullName || currentUser.name || "");
    setEmail(profile.email || currentUser.email);
    setPhone(profile.phone);
    setCity(profile.city);
    setSchool(profile.school);
    setDepartment(profile.department);
    setGrade(profile.grade);
    setNote("");
    setApplyingEvent(event);
    setIsSubmitted(false);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!note.trim()) {
      setFormError("Lütfen etkinlikten beklentini kısaca yaz.");
      return;
    }

    if (!applyingEvent) return;

    setFormError("");
    setIsSubmitting(true);

    setTimeout(() => {
      EventsRepository.applyToEvent({
        eventId: applyingEvent.id,
        eventTitle: applyingEvent.title,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        school: school.trim(),
        department: department.trim(),
        grade: grade.trim(),
        note: note.trim(),
      });

      setEvents([...EventsRepository.getAllEvents()]);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const closeApplyModal = () => {
    setApplyingEvent(null);
    setIsSubmitted(false);
    setFormError("");
    setFullName("");
    setEmail("");
    setPhone("");
    setCity("");
    setSchool("");
    setDepartment("");
    setGrade("");
    setNote("");
  };

  return (
    <PageBackground id="etkinlikler-root" className="select-none px-0 py-0 overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. ÜST ALAN (HERO - Önceki Zengin Başlık)                     */}
      {/* ------------------------------------------------------------- */}
      <Section padding="none" background="transparent" className="pt-14 sm:pt-18 pb-8 sm:pb-10 border-b border-slate-100 relative">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto select-none space-y-4"
          >
            <Badge variant="brand" size="md" className="mb-2">
              {isEn ? "Events Calendar" : "Etkinlik Takvimi"}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings leading-tight">
              {isEn ? (
                <>Discover, Join & <br className="hidden sm:inline" /><span className="bg-gradient-to-r from-[#0A5C3A] to-[#128C59] bg-clip-text text-transparent font-black">Produce Together.</span></>
              ) : (
                <>Keşfet, Katıl ve <br className="hidden sm:inline" /><span className="bg-gradient-to-r from-[#0A5C3A] to-[#128C59] bg-clip-text text-transparent font-black">Birlikte Üret.</span></>
              )}
            </h1>
            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium max-w-3xl mx-auto">
              {isEn
                ? "Summits, workshops, nature walks, and social responsibility gatherings by our community. Register for upcoming events or browse past activities."
                : "Topluluğumuzun düzenlediği zirveler, atölyeler, doğa yürüyüşleri ve sosyal sorumluluk buluşmaları. Aktif etkinliklere kaydolabilir, geçmiş faaliyetlerimizi inceleyebilirsin."}
            </p>
          </motion.div>
        </PageContainer>
      </Section>

      {/* ------------------------------------------------------------- */}
      {/* 2. FİLTRE ALANI (Tek Satır, Sade Chip & Tab Tasarımı)         */}
      {/* ------------------------------------------------------------- */}
      <Section padding="none" background="transparent" className="py-8 sm:py-12 border-b border-slate-100">
        <PageContainer className="max-w-6xl">
          {/* Tek Temiz Filtre Çubuğu */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            {/* Sol: Durum Sekmeleri (Aktif & Geçmiş) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("aktif")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-headings transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "aktif"
                    ? "bg-[#0A5C3A] text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:text-[#0A5C3A] hover:bg-slate-100"
                }`}
              >
                <Zap className="w-3.5 h-3.5 stroke-[2]" />
                <span>{isEn ? "Upcoming & Active" : "Yaklaşan & Aktif"}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-sans ${
                  activeTab === "aktif" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {activeCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("gecmis")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-headings transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "gecmis"
                    ? "bg-[#0A5C3A] text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:text-[#0A5C3A] hover:bg-slate-100"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                <span>{isEn ? "Past" : "Geçmiş"}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-sans ${
                  activeTab === "gecmis" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {pastCount}
                </span>
              </button>
            </div>

            {/* Sağ: Kategori Pill Butonları */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: "all", label: isEn ? "All" : "Tümü" },
                { id: "teknoloji", label: isEn ? "Technology" : "Teknoloji" },
                { id: "sanat", label: isEn ? "Art" : "Sanat" },
                { id: "cevre-saglik", label: isEn ? "Health & Sustainability" : "Yaşam ve Sürdürülebilirlik" },
                { id: "programlar", label: isEn ? "Programs" : "Programlar" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-[#0A5C3A] text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 3. ETKİNLİK KARTLARI (Responsive Kompakt Grid)                */}
          {/* ------------------------------------------------------------- */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md mx-auto">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-base font-bold text-slate-900 font-headings mb-1">
                {isEn ? "No events found in this category" : "Bu kategoride etkinlik bulunmuyor"}
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                {isEn
                  ? "You can select a different category to view other events."
                  : "Farklı bir kategori seçerek diğer etkinlikleri listeleyebilirsiniz."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredEvents.map((event, index) => {
                const dateInfo = parseDateBlock(event.date);
                const isFull = event.quota && event.appliedCount >= event.quota;

                return (
                  <motion.div
                    key={event.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={index * 0.05}
                    variants={fadeInUp}
                    className="flex"
                  >
                    <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                      <div>
                        {/* Üst Alan: Soft Tarih Bloğu & Kategori Etiketi */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="flex items-center justify-center flex-col px-3 py-1.5 rounded-xl bg-[#EAF5EF] border border-[#0A5C3A]/20 text-[#0A5C3A] font-bold shrink-0">
                            <span className="text-sm leading-none font-headings font-extrabold">{dateInfo.day}</span>
                            <span className="text-[10px] leading-none uppercase tracking-wider font-sans font-bold mt-0.5">{dateInfo.month}</span>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60 truncate">
                            {event.categoryLabel}
                          </span>
                        </div>

                        {/* Etkinlik Başlığı */}
                        <h3 className="text-base sm:text-lg font-bold font-headings text-slate-900 leading-snug line-clamp-2 group-hover:text-[#0A5C3A] transition-colors mb-3 min-h-[48px]">
                          {event.title}
                        </h3>

                        {/* Sade İkonlu Bilgi Satırları (Box/Border YOK!) */}
                        <div className="space-y-1.5 mb-3 text-xs font-medium text-slate-700 font-sans">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#0A5C3A] shrink-0" />
                            <span>{event.date} · {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-[#0A5C3A] shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        {/* Maksimum 2 Satır Açıklama */}
                        <p className="text-xs sm:text-sm text-slate-600 font-sans font-normal leading-relaxed line-clamp-2 mb-5">
                          {event.description}
                        </p>
                      </div>

                      {/* Alt CTA Butonu */}
                      <div className="pt-3 border-t border-slate-100">
                        {event.status === "aktif" ? (
                          isFull ? (
                            <button
                              disabled
                              className="w-full h-10 rounded-full text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed text-center"
                            >
                              {isEn ? "Quota Full" : "Kontenjan Doldu"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openApplication(event)}
                              className="w-full h-10 rounded-full bg-[#0A5C3A] hover:bg-[#128C59] text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>{isEn ? "Apply Now" : "Başvuru Yap"}</span>
                              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDetailEvent(event)}
                            className="w-full h-10 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-center cursor-pointer"
                          >
                            {isEn ? "View Details" : "Detayları Gör"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </PageContainer>
      </Section>

      {/* Başvuru & Detay Modalları */}
      <ApplyModal
        event={applyingEvent}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        formError={formError}
        values={{ fullName, email, phone, city, school, department, grade, note }}
        setters={{ setFullName, setEmail, setPhone, setCity, setSchool, setDepartment, setGrade, setNote }}
        onSubmit={handleFormSubmit}
        onClose={closeApplyModal}
        isEn={isEn}
      />

      <DetailModal event={detailEvent} onClose={() => setDetailEvent(null)} isEn={isEn} />
    </PageBackground>
  );
}

type ApplyValues = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  school: string;
  department: string;
  grade: string;
  note: string;
};

type ApplySetters = {
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setCity: (value: string) => void;
  setSchool: (value: string) => void;
  setDepartment: (value: string) => void;
  setGrade: (value: string) => void;
  setNote: (value: string) => void;
};

function ApplyModal({
  event,
  isSubmitted,
  isSubmitting,
  formError,
  values,
  setters,
  onSubmit,
  onClose,
  isEn,
}: {
  event: EventItem | null;
  isSubmitted: boolean;
  isSubmitting: boolean;
  formError: string;
  values: ApplyValues;
  setters: ApplySetters;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
  isEn: boolean;
}) {
  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto select-none">
          {/* Siyah Yarı-Şeffaf Arka Plan Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Hizalama Konteynırı */}
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center relative z-10 pointer-events-none">
            {/* Açılan Kart Penceremiz (Kaydırılabilir Alan) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 text-left my-8 max-h-[85vh] overflow-y-auto pointer-events-auto"
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>

              {!isSubmitted ? (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="space-y-2 mb-5 pb-3.5 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#0A5C3A] bg-[#EAF5EF] px-3 py-1 rounded-full border border-[#0A5C3A]/20">
                      <Ticket className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{isEn ? "Event Registration Form" : "Etkinlik Kayıt Formu"}</span>
                    </span>
                    <h2 className="text-xl font-extrabold font-headings text-slate-900 leading-snug pt-1">
                      {event.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-sans font-medium pt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0A5C3A]" />
                      <span>{event.date} · {event.location}</span>
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 font-headings">
                          {isEn ? "Your Application Info" : "Başvuru Bilgilerin"}
                        </h3>
                        <p className="mt-0.5 text-[11px] font-normal text-slate-500">
                          {isEn ? "Will apply with your profile info." : "Profilindeki bilgilerle başvuru yapılacak."}
                        </p>
                      </div>
                      <Button
                        href={ROUTES.PROFIL}
                        variant="secondary"
                        size="sm"
                        className="h-8 rounded-lg text-xs font-semibold"
                      >
                        {isEn ? "Update" : "Güncelle"}
                      </Button>
                    </div>

                    <div className="grid gap-2 text-xs sm:grid-cols-2">
                      <SummaryItem label={isEn ? "Full Name" : "Ad Soyad"} value={values.fullName || (isEn ? "Not set" : "Profilde yok")} />
                      <SummaryItem label={isEn ? "Email" : "E-posta"} value={values.email || (isEn ? "Not set" : "Profilde yok")} />
                      <SummaryItem label={isEn ? "Phone" : "Telefon"} value={values.phone || (isEn ? "Not set" : "Profilde yok")} />
                      <SummaryItem label={isEn ? "School / Dept" : "Okul / Bölüm"} value={[values.school, values.department].filter(Boolean).join(" / ") || (isEn ? "Not set" : "Profilde yok")} />
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-xs font-bold text-slate-900 font-headings mb-1.5 block">
                        {isEn ? "What are your expectations from this event?" : "Bu etkinlikten beklentin nedir?"} <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder={
                          isEn
                            ? "e.g. Meet new people, practice skills, learn about the topic..."
                            : "Örn: Yeni insanlarla tanışmak, konu hakkında pratik yapmak, projeme fikir almak..."
                        }
                        value={values.note}
                        onChange={(event) => setters.setNote(event.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-sans font-normal text-slate-900 leading-relaxed focus:outline-none focus:border-[#0A5C3A]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0A5C3A] hover:bg-[#128C59] text-white font-bold text-xs h-11 rounded-full flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4 stroke-[2]" />
                      <span>{isSubmitting ? (isEn ? "Submitting Application..." : "Başvuru Gönderiliyor...") : (isEn ? "Complete Registration" : "Başvuruyu Tamamla")}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-3 sm:py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#EAF5EF] text-[#0A5C3A] flex items-center justify-center mx-auto border border-[#0A5C3A]/20">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-headings mb-1">
                      {isEn ? "Registration Received" : "Başvurunuz alındı"}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans font-normal max-w-sm mx-auto leading-relaxed">
                      {isEn ? `Your registration for "${event.title}" has been recorded.` : `"${event.title}" için başvurun kaydedildi.`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-[#0A5C3A] text-white font-semibold text-xs h-10 rounded-full cursor-pointer"
                  >
                    {isEn ? "OK" : "Tamam"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 truncate text-xs font-medium text-slate-900">{value}</p>
    </div>
  );
}

function DetailModal({ event, onClose, isEn }: { event: EventItem | null; onClose: () => void; isEn: boolean }) {
  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center relative z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 text-left my-8 max-h-[85vh] overflow-y-auto pointer-events-auto"
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
              <div className="space-y-4">
                <span className="text-[10.5px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block font-sans">
                  {isEn ? "Past Event" : "Tamamlanan Etkinlik"}
                </span>
                <h3 className="text-lg font-bold font-headings text-slate-900">{event.title}</h3>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium space-y-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0A5C3A]" />
                    <span>{isEn ? `Date: ${event.date} (${event.time})` : `Tarih: ${event.date} (${event.time})`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0A5C3A]" />
                    <span>{isEn ? `Location: ${event.location}` : `Konum: ${event.location}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0A5C3A]" />
                    <span>{isEn ? `Participants: ${event.appliedCount} People` : `Katılımcı Sayısı: ${event.appliedCount} Kişi`}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-normal">
                  {event.description}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 h-10 rounded-full cursor-pointer"
                  >
                    {isEn ? "Close" : "Kapat"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
