"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  Send,
  Ticket,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Badge, Button, PageContainer, Section } from "../ui";
import { EventItem, EventsRepository } from "../../lib/eventsStore";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

const categoryColorMap: Record<string, string> = {
  teknoloji: "bg-[#0A5C3A]/10 text-[#0A5C3A] border-[#0A5C3A]/25",
  sanat: "bg-[#0D7A4D]/10 text-[#0D7A4D] border-[#0D7A4D]/25",
  "cevre-saglik": "bg-[#128C59]/10 text-[#128C59] border-[#128C59]/25",
  programlar: "bg-[#08472D]/10 text-[#08472D] border-[#08472D]/25",
};

export default function EtkinliklerContent() {
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
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesTab = activeTab === "aktif" ? event.status === "aktif" : event.status === "gecmis";
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesTab && matchesCategory;
  });

  const activeCount = events.filter((event) => event.status === "aktif").length;
  const pastCount = events.filter((event) => event.status === "gecmis").length;

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !school.trim() ||
      !department.trim() ||
      !grade.trim() ||
      !note.trim()
    ) {
      setFormError("Lütfen tüm zorunlu (*) alanları eksiksiz doldurunuz.");
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
    <div className="w-full flex flex-col bg-white overflow-hidden" id="etkinlikler-root">
      <Section padding="none" background="white" className="pt-16 sm:pt-22 pb-16 sm:pb-22 border-b border-[#EEF0F2] relative">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto select-none space-y-5"
          >
            <Badge variant="brand" size="md" className="mb-2">
              Etkinlik Takvimi
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings leading-tight">
              Keşfet, Katıl ve <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#0A5C3A] to-[#128C59] bg-clip-text text-transparent font-black">
                Birlikte Üret.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium max-w-3xl mx-auto">
              Topluluğumuzun düzenlediği zirveler, atölyeler, doğa yürüyüşleri ve sosyal sorumluluk buluşmaları.
              Aktif etkinliklere kaydolabilir, geçmiş faaliyetlerimizi inceleyebilirsin.
            </p>
          </motion.div>
        </PageContainer>
      </Section>

      <Section padding="none" background="subtle" className="py-10 sm:py-14 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 select-none mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-3 sm:p-4 shadow-[0_14px_34px_rgba(15,17,21,0.05)]">
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] w-full lg:w-auto">
              <button
                onClick={() => setActiveTab("aktif")}
                className={`flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-headings transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "aktif"
                    ? "bg-[#0F1115] text-white shadow-[0_10px_24px_rgba(15,17,21,0.16)]"
                    : "bg-white text-[#5F6773] border border-[#E5E7EB] hover:text-[#0F1115] hover:border-[#C9D8D0]"
                }`}
              >
                <Zap className="w-3.5 h-3.5 stroke-[2]" />
                <span>Yaklaşan & Aktif Etkinlikler</span>
                <span className={`text-[10px] px-1.5 rounded-md font-sans ${
                  activeTab === "aktif" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {activeCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("gecmis")}
                className={`flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-headings transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "gecmis"
                    ? "bg-[#0F1115] text-white shadow-[0_10px_24px_rgba(15,17,21,0.18)]"
                    : "bg-white text-[#5F6773] border border-[#E5E7EB] hover:text-[#0F1115] hover:border-[#C9D8D0]"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                <span>Geçmiş Etkinlikler</span>
                <span className={`text-[10px] px-1.5 rounded-md font-sans ${
                  activeTab === "gecmis" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {pastCount}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              {[
                { id: "all", label: "Tümü" },
                { id: "teknoloji", label: "Teknoloji" },
                { id: "sanat", label: "Sanat" },
                { id: "cevre-saglik", label: "Çevre & Sağlık" },
                { id: "programlar", label: "Programlar" },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-sans shrink-0 transition-all ${
                    selectedCategory === category.id
                      ? "bg-[#0F1115] text-white font-bold shadow-sm"
                      : "bg-[#F8FAFC] text-[#4B5563] border border-[#E5E7EB] hover:bg-white hover:border-[#0A5C3A]/35 hover:text-[#0F1115]"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-[20px] border border-[#EEF0F2] p-8">
              <Calendar className="w-10 h-10 text-[#5F6773] mx-auto mb-3 opacity-40 stroke-[1.5]" />
              <h3 className="text-base font-bold text-[#0F1115] font-headings mb-1">
                Bu kategoride henüz etkinlik bulunmuyor
              </h3>
              <p className="text-xs text-[#5F6773] font-sans">
                Farklı bir kategori seçerek etkinliklerimizi listeleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
              {filteredEvents.map((event, index) => {
                const catStyle = categoryColorMap[event.category] || categoryColorMap.programlar;
                return (
                  <motion.div
                    key={event.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={index * 0.05}
                    variants={fadeInUp}
                    className="h-full"
                  >
                    <div className="h-full rounded-[24px] border border-[#E5E7EB] hover:border-[#B8C7BF] transition-all duration-300 bg-white group shadow-[0_12px_28px_rgba(15,17,21,0.05)] hover:shadow-[0_18px_42px_rgba(15,17,21,0.09)] flex flex-col overflow-hidden">
                      <div className="h-1 w-full bg-[#0A5C3A]" />
                      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-4 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-2.5">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg font-sans border ${catStyle}`}>
                              {event.categoryLabel}
                            </span>
                            {event.status === "aktif" ? (
                              <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#0A5C3A] bg-white px-2.5 py-1 rounded-full border border-[#0A5C3A]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0A5C3A] animate-pulse" />
                                Yayında
                              </span>
                            ) : (
                              <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-600 font-sans border border-slate-200">
                                Tamamlandı
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold font-headings text-[#0F1115] mb-4 group-hover:text-[#0A5C3A] transition-colors leading-snug line-clamp-2 min-h-[56px]">
                            {event.title}
                          </h3>

                          <div className="grid gap-2 mb-4 text-xs font-semibold text-[#0F1115] font-sans">
                            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-2.5">
                              <Calendar className="w-4 h-4 text-[#0A5C3A] shrink-0 stroke-[2]" />
                              <span>{event.date} - {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-2.5">
                              <MapPin className="w-4 h-4 text-[#0A5C3A] shrink-0 stroke-[2]" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>

                          <p className="text-sm text-[#4B5563] font-sans leading-relaxed mb-5 line-clamp-3">
                            {event.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#EEF0F2] mt-auto">
                          <div className="mb-3 text-[11px] font-bold font-sans text-[#5F6773]">
                            <span>{event.badge}</span>
                          </div>
                          {event.status === "aktif" ? (
                            <button
                              onClick={() => {
                                setApplyingEvent(event);
                                setIsSubmitted(false);
                              }}
                              className="w-full h-10 rounded-xl bg-gradient-to-r from-[#0A5C3A] to-[#128C59] hover:from-[#08472D] hover:to-[#0A5C3A] text-white font-bold text-xs transition-all shadow-md shadow-[#0A5C3A]/20 hover:shadow-lg hover:shadow-[#0A5C3A]/30 flex items-center justify-center gap-2 tracking-wide"
                            >
                              <Ticket className="w-4 h-4 stroke-[2]" />
                              <span>Başvuru Yap</span>
                              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setDetailEvent(event)}
                              className="w-full h-10 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-center"
                            >
                              Detayları İncele
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </PageContainer>
      </Section>

      <ApplyModal
        event={applyingEvent}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        formError={formError}
        values={{ fullName, email, phone, city, school, department, grade, note }}
        setters={{ setFullName, setEmail, setPhone, setCity, setSchool, setDepartment, setGrade, setNote }}
        onSubmit={handleFormSubmit}
        onClose={closeApplyModal}
      />

      <DetailModal event={detailEvent} onClose={() => setDetailEvent(null)} />
    </div>
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
}: {
  event: EventItem | null;
  isSubmitted: boolean;
  isSubmitting: boolean;
  formError: string;
  values: ApplyValues;
  setters: ApplySetters;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg bg-white rounded-[24px] border border-[#EEF0F2] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F9FA] text-[#5F6773] hover:text-[#0F1115] hover:bg-[#EEF0F2] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2 mb-5 pb-3.5 border-b border-[#EEF0F2]">
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-[#0A5C3A] bg-[#0A5C3A]/10 px-3 py-1 rounded-lg border border-[#0A5C3A]/20">
                    <Ticket className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Etkinlik Kayıt Formu</span>
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-headings text-[#0F1115] leading-snug pt-1">
                    {event.title}
                  </h2>
                  <p className="text-xs text-[#5F6773] font-sans font-medium pt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0A5C3A]" />
                    <span>{event.date} - {event.location}</span>
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {formError}
                  </div>
                )}

                <div className="space-y-3.5 pt-2">
                  <Field icon={User} label="Ad Soyad" required value={values.fullName} onChange={setters.setFullName} placeholder="Adınız ve soyadınız" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field icon={Mail} label="E-posta Adresi" required type="email" value={values.email} onChange={setters.setEmail} placeholder="ornek@domain.com" />
                    <Field icon={Phone} label="Telefon Numarası" required type="tel" value={values.phone} onChange={setters.setPhone} placeholder="05XX XXX XX XX" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field icon={MapPin} label="Yaşadığınız Şehir" required value={values.city} onChange={setters.setCity} placeholder="Örn: İstanbul" />
                    <Field icon={Award} label="Sınıf / Seviye" required value={values.grade} onChange={setters.setGrade} placeholder="Örn: 2. Sınıf" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field icon={BookOpen} label="Okul / Üniversite" required value={values.school} onChange={setters.setSchool} placeholder="Okulunuz" />
                    <Field icon={BookOpen} label="Bölüm" required value={values.department} onChange={setters.setDepartment} placeholder="Bölümünüz" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#0F1115] font-headings mb-1 block">
                      Etkinlikten Beklentiniz <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Bu etkinlikten beklentileriniz ve katmak istediğiniz değerler..."
                      value={values.note}
                      onChange={(event) => setters.setNote(event.target.value)}
                      className="w-full p-3 rounded-xl border border-[#EEF0F2] text-xs font-sans text-[#0F1115] focus:outline-none focus:border-[#0A5C3A] focus:ring-1 focus:ring-[#0A5C3A]"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    size="lg"
                    rightIcon={<Send className="w-4 h-4 stroke-[2]" />}
                    className="w-full justify-center font-bold text-sm h-12 rounded-xl"
                  >
                    {isSubmitting ? "Başvuru Gönderiliyor..." : "Başvuruyu Tamamla"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto shadow-xs border border-[#0A5C3A]/20">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F1115] font-headings mb-1.5">
                    Başvurunuz Başarıyla Alındı!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6773] font-sans font-medium max-w-sm mx-auto leading-relaxed">
                    {event.title} için kaydınız oluşturulmuştur.
                  </p>
                </div>
                <Button onClick={onClose} variant="primary" size="md" className="w-full justify-center font-bold text-xs h-11 rounded-xl mt-2">
                  Tamamdır, Teşekkürler
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Field({
  icon: Icon,
  label,
  required = false,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-[#0F1115] font-headings mb-1 block">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-3 stroke-[2]" />
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EEF0F2] text-xs font-sans text-[#0F1115] focus:outline-none focus:border-[#0A5C3A] focus:ring-1 focus:ring-[#0A5C3A]"
        />
      </div>
    </div>
  );
}

function DetailModal({ event, onClose }: { event: EventItem | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-white rounded-[24px] border border-[#EEF0F2] shadow-2xl p-6 sm:p-7 z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F9FA] text-[#5F6773] hover:text-[#0F1115] flex items-center justify-center"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
            <div className="space-y-4">
              <span className="text-[10.5px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-md inline-block font-sans">
                Tamamlanan Etkinlik
              </span>
              <h3 className="text-xl font-bold font-headings text-[#0F1115]">{event.title}</h3>
              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#EEF0F2] text-xs font-medium space-y-2 text-[#5F6773]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0A5C3A]" />
                  <span>Tarih: {event.date} ({event.time})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0A5C3A]" />
                  <span>Konum: {event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0A5C3A]" />
                  <span>Katılımcı Sayısı: {event.appliedCount} Kişi</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#5F6773] leading-relaxed font-sans font-normal">
                {event.description}
              </p>
              <div className="pt-2 flex justify-end">
                <Button onClick={onClose} variant="outline" size="md" className="font-bold text-xs px-5 h-10 rounded-xl">
                  Kapat
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
