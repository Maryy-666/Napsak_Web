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
} from "lucide-react";
import { Badge, Button, PageContainer, Section } from "../ui";
import { EventItem, EventsRepository } from "../../lib/eventsStore";
import { getCurrentUser, getMemberProfile } from "../../lib/memberAuth";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

export default function EtkinliklerContent() {
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
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesTab = activeTab === "aktif" ? event.status === "aktif" : event.status === "gecmis";
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesTab && matchesCategory;
  });

  const activeCount = events.filter((event) => event.status === "aktif").length;
  const pastCount = events.filter((event) => event.status === "gecmis").length;

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
    <PageBackground id="etkinlikler-root" className="px-0 py-0">
      <Section padding="none" background="transparent" className="pt-16 sm:pt-22 pb-9 sm:pb-12 border-b border-[#EEF0F2] relative">
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

      <Section padding="none" background="transparent" className="pt-4 sm:pt-6 pb-10 sm:pb-14 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 select-none mb-8 rounded-[24px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,17,21,0.045)]">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={() => setActiveTab("aktif")}
                className={`flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-headings transition-all duration-200 flex items-center justify-center gap-2 border ${
                  activeTab === "aktif"
                    ? "bg-[#0A5C3A] text-white border-[#0A5C3A] shadow-[0_8px_20px_rgba(10,92,58,0.18)]"
                    : "bg-[#F8FAFC] text-[#5F6773] border-[#E5E7EB] hover:text-[#0A5C3A] hover:border-[#C9D8D0] hover:bg-white"
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
                className={`flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-headings transition-all duration-200 flex items-center justify-center gap-2 border ${
                  activeTab === "gecmis"
                    ? "bg-[#0A5C3A] text-white border-[#0A5C3A] shadow-[0_8px_20px_rgba(10,92,58,0.18)]"
                    : "bg-[#F8FAFC] text-[#5F6773] border-[#E5E7EB] hover:text-[#0A5C3A] hover:border-[#C9D8D0] hover:bg-white"
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
                      ? "bg-[#0A5C3A] text-white font-semibold shadow-sm"
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
                          <h3 className="text-lg sm:text-xl font-semibold font-headings text-[#0F1115] mb-4 group-hover:text-[#0A5C3A] transition-colors leading-snug line-clamp-2 min-h-[56px]">
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
                          {event.status === "aktif" ? (
                            <button
                              onClick={() => {
                                openApplication(event);
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
            className="relative w-full max-w-lg bg-white rounded-[24px] border border-[#EEF0F2] shadow-2xl p-6 sm:p-7 z-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F9FA] text-[#5F6773] hover:text-[#0F1115] hover:bg-[#EEF0F2] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={onSubmit} className="space-y-5">
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

                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F1115]">Başvuru bilgilerin</h3>
                      <p className="mt-1 text-xs font-normal text-[#5F6773]">Profilindeki bilgilerle başvuru yapılacak.</p>
                    </div>
                    <Button
                      href={ROUTES.PROFIL}
                      variant="secondary"
                      size="sm"
                      className="h-8 rounded-lg text-xs font-semibold"
                    >
                      Güncelle
                    </Button>
                  </div>

                  <div className="grid gap-2 text-xs sm:grid-cols-2">
                    <SummaryItem label="Ad Soyad" value={values.fullName || "Profilde yok"} />
                    <SummaryItem label="E-posta" value={values.email || "Profilde yok"} />
                    <SummaryItem label="Telefon" value={values.phone || "Profilde yok"} />
                    <SummaryItem label="Okul / Bölüm" value={[values.school, values.department].filter(Boolean).join(" / ") || "Profilde yok"} />
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-sm font-semibold text-[#0F1115] font-headings mb-2 block">
                      Bu etkinlikten beklentin nedir? <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Örn: Yeni insanlarla tanışmak, konu hakkında pratik yapmak, projeme fikir almak..."
                      value={values.note}
                      onChange={(event) => setters.setNote(event.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#E5E7EB] text-sm font-sans font-normal text-[#0F1115] leading-relaxed focus:outline-none focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10"
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
              <div className="text-center py-3 sm:py-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF7F3] text-[#0A5C3A] flex items-center justify-center mx-auto border border-[#C9D8D0]">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#0F1115] font-headings mb-2">
                    Başvurunuz alındı
                  </h3>
                  <p className="text-sm text-[#5F6773] font-sans font-normal max-w-sm mx-auto leading-relaxed">
                    {event.title} için başvurun kaydedildi.
                  </p>
                </div>
                <Button onClick={onClose} variant="primary" size="md" className="w-full justify-center font-semibold text-sm h-11 rounded-xl mt-1">
                  Tamam
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-[#5F6773]">{label}</p>
      <p className="mt-1 truncate text-xs font-medium text-[#0F1115]">{value}</p>
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
