"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Mail, Save, Settings, Shield, Trash2, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { Button, PageContainer } from "../ui";
import { PageBackground } from "../common/PageBackground";
import {
  AuthUser,
  MemberProfile,
  clearCurrentUser,
  getCurrentUser,
  getMemberProfile,
  saveMemberProfile,
} from "../../lib/memberAuth";
import { ROUTES } from "../../constants/routes";
import { EventApplication, EventItem, EventsRepository } from "../../lib/eventsStore";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  if (digits.length <= 9) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
}

export default function ProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activePanel, setActivePanel] = useState<"account" | "events" | "cv" | "settings">("account");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace(`${ROUTES.LOGIN}?returnTo=${encodeURIComponent(ROUTES.PROFIL)}`);
      return;
    }

    const savedProfile = getMemberProfile(currentUser);
    const hasSavedDetails = Boolean(
      savedProfile.phone ||
        savedProfile.city ||
        savedProfile.school ||
        savedProfile.department ||
        savedProfile.grade ||
        savedProfile.skills ||
        savedProfile.bio ||
        savedProfile.cv
    );

    setUser(currentUser);
    setProfile(savedProfile);
    setIsSaved(hasSavedDetails);
    setIsEditing(!hasSavedDetails);
    setApplications(EventsRepository.getApplications());
    setEvents(EventsRepository.getAllEvents());
  }, [router]);

  const updateField = (field: keyof MemberProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: field === "phone" ? formatPhone(value) : value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    if (file.type !== "application/pdf") {
      toast.error("CV için PDF dosyası yükleyebilirsin.");
      return;
    }

    setProfile({
      ...profile,
      cv: {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleDateString("tr-TR"),
      },
    });
  };

  const handleSave = () => {
    if (!user || !profile) return;
    const normalizedProfile: MemberProfile = {
      ...profile,
      fullName: profile.fullName.trim(),
      email: profile.email.trim().toLowerCase(),
      phone: formatPhone(profile.phone),
      city: profile.city.trim(),
      school: profile.school.trim(),
      department: profile.department.trim(),
      grade: profile.grade.trim(),
      skills: profile.skills.trim(),
      bio: profile.bio.trim(),
    };

    if (!emailPattern.test(normalizedProfile.email)) {
      toast.error("Geçerli bir e-posta adresi gir.");
      return;
    }

    const phoneDigits = normalizedProfile.phone.replace(/\D/g, "");
    if (phoneDigits && (phoneDigits.length !== 10 || !phoneDigits.startsWith("5")) && (phoneDigits.length !== 11 || !phoneDigits.startsWith("05"))) {
      toast.error("Telefon numarasını 05XX XXX XX XX formatında gir.");
      return;
    }

    setProfile(normalizedProfile);
    saveMemberProfile(user, normalizedProfile);
    setIsSaved(true);
    setIsEditing(false);
    toast.success("Profil bilgilerin kaydedildi.");
  };

  const handleLogout = () => {
    if (!confirm("Çıkış yapmak istediğine emin misin?")) return;
    clearCurrentUser();
    router.replace(ROUTES.LOGIN);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm("Hesabı bu cihazdan kaldırmak istediğine emin misin?")) return;

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.error || "Hesap silinemedi.");
        return;
      }

      clearCurrentUser();
      toast.success("Hesabın silindi.");
      router.replace(ROUTES.KAYIT);
    } catch (error: any) {
      toast.error(error.message || "Hesap silinirken bir hata oluştu.");
    }
  };

  if (!user || !profile) {
    return (
      <PageBackground className="pt-24">
        <PageContainer>
          <p className="text-sm font-semibold text-[#5F6773]">Profil hazırlanıyor...</p>
        </PageContainer>
      </PageBackground>
    );
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-medium text-[#0F1115] outline-none transition focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10";
  const userEmail = (profile.email || user.email).toLowerCase();
  const userApplications = applications.filter((application) => application.email.toLowerCase() === userEmail);
  const appliedEventIds = new Set(userApplications.map((application) => application.eventId));
  const activeAppliedEvents = events.filter((event) => appliedEventIds.has(event.id) && event.status === "aktif");
  const attendedEvents = events.filter((event) => appliedEventIds.has(event.id) && event.status === "gecmis");

  return (
    <PageBackground className="pt-28 pb-20">
      <PageContainer className="max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.045)] lg:sticky lg:top-28 lg:self-start">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#F8FBF9] p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9D8D0] bg-[#EEF7F3] text-[#0A5C3A]">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#0F1115]">{profile.fullName || user.name}</p>
                <p className="truncate text-xs font-medium text-[#5F6773]">{user.email}</p>
              </div>
            </div>

            <div className="grid gap-2">
              <PanelButton active={activePanel === "account"} onClick={() => setActivePanel("account")} label="Hesap Bilgileri" />
              <PanelButton active={activePanel === "events"} onClick={() => setActivePanel("events")} label="Etkinliklerim" />
              <PanelButton active={activePanel === "cv"} onClick={() => setActivePanel("cv")} label="CV Dosyası" />
              <PanelButton active={activePanel === "settings"} onClick={() => setActivePanel("settings")} label="Ayarlar" />
            </div>

            <Button variant="secondary" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />} className="mt-4 h-10 w-full rounded-xl">
              Çıkış Yap
            </Button>
          </aside>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_30px_rgba(15,17,21,0.045)] sm:p-7"
          >
            <div className="mb-7 border-b border-[#EEF0F2] pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#0F1115]">
                    {activePanel === "account" && (isEditing ? "Profil Bilgileri" : "Hesap Bilgileri")}
                    {activePanel === "events" && "Etkinliklerim"}
                    {activePanel === "cv" && "CV Dosyası"}
                    {activePanel === "settings" && "Hesap Ayarları"}
                  </h2>
                  <p className="mt-1.5 text-sm font-normal text-[#5F6773]">
                    {activePanel === "account" && (isEditing
                      ? "Etkinlik başvurularında kullanacağımız temel bilgilerin."
                      : "Kayıtlı profil bilgilerin burada görünür.")}
                    {activePanel === "events" && "Başvurduğun ve katıldığın etkinlikleri buradan takip edebilirsin."}
                    {activePanel === "cv" && "Başvurular için CV dosyanı hazır tut."}
                    {activePanel === "settings" && "Hesap güncelleme ve güvenlik seçeneklerin."}
                  </p>
                </div>
                {activePanel === "account" && (isEditing ? (
                  <Button onClick={handleSave} className="h-10 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] font-semibold" leftIcon={<Save className="h-4 w-4" />}>
                    {isSaved ? "Güncelle" : "Kaydet"}
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => setIsEditing(true)} className="h-10 rounded-xl font-semibold" leftIcon={<Settings className="h-4 w-4" />}>
                    Güncelle
                  </Button>
                ))}
              </div>
            </div>

            {activePanel === "account" && (isEditing ? (
              <>
                <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
                  <Field label="Ad Soyad" value={profile.fullName} onChange={(value) => updateField("fullName", value)} placeholder="Ad Soyad" autoComplete="name" maxLength={100} />
                  <Field label="E-posta" value={profile.email} onChange={(value) => updateField("email", value)} type="email" placeholder="ornek@domain.com" autoComplete="email" maxLength={120} />
                  <Field label="Telefon" value={profile.phone} onChange={(value) => updateField("phone", value)} type="tel" placeholder="05XX XXX XX XX" autoComplete="tel" inputMode="tel" maxLength={20} />
                  <Field label="Şehir" value={profile.city} onChange={(value) => updateField("city", value)} placeholder="İstanbul" autoComplete="address-level2" maxLength={60} />
                  <Field label="Okul" value={profile.school} onChange={(value) => updateField("school", value)} placeholder="Üniversite / Lise" autoComplete="organization" maxLength={120} />
                  <Field label="Bölüm" value={profile.department} onChange={(value) => updateField("department", value)} placeholder="Bölüm / Alan" maxLength={120} />
                  <Field label="Sınıf" value={profile.grade} onChange={(value) => updateField("grade", value)} placeholder="Hazırlık, 1. sınıf..." maxLength={30} />
                  <Field label="Yetenekler" value={profile.skills} onChange={(value) => updateField("skills", value)} placeholder="Tasarım, yazılım, içerik..." maxLength={500} />
                </div>

                <label className="mt-6 block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#0F1115]">Kısa Tanıtım</span>
                  <textarea
                    value={profile.bio}
                    onChange={(event) => updateField("bio", event.target.value)}
                    rows={4}
                    maxLength={1000}
                    className={`${inputClass} h-auto resize-none py-3`}
                    placeholder="Kendinden ve ilgilendiğin alanlardan kısaca bahset."
                  />
                </label>

                <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3.5 text-xs font-medium leading-relaxed text-[#5F6773]">
                  Bu bilgiler etkinlik başvuru formuna otomatik dolabilir; başvurmadan önce yine düzenleyebilirsin.
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <InfoItem label="Ad Soyad" value={profile.fullName || user.name || "-"} />
                  <InfoItem label="E-posta" value={profile.email || user.email} />
                  <InfoItem label="Telefon" value={profile.phone || "Eklenmedi"} />
                  <InfoItem label="Şehir" value={profile.city || "Eklenmedi"} />
                  <InfoItem label="Okul" value={profile.school || "Eklenmedi"} />
                  <InfoItem label="Bölüm" value={profile.department || "Eklenmedi"} />
                  <InfoItem label="Sınıf" value={profile.grade || "Eklenmedi"} />
                  <InfoItem label="Yetenekler" value={profile.skills || "Eklenmedi"} />
                </div>

                <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                  <p className="text-xs font-semibold text-[#5F6773]">Kısa Tanıtım</p>
                  <p className="mt-2 text-sm font-normal leading-relaxed text-[#0F1115]">
                    {profile.bio || "Henüz kısa tanıtım eklenmedi."}
                  </p>
                </div>
              </>
            ))}

            {activePanel === "events" && (
              <div className="grid gap-4 lg:grid-cols-2">
                <EventList title="Başvurularım" emptyText="Henüz aktif etkinlik başvurun yok." events={activeAppliedEvents} />
                <EventList title="Katıldığım Etkinlikler" emptyText="Henüz tamamlanan etkinliğin yok." events={attendedEvents} />
              </div>
            )}

            {activePanel === "cv" && (
              <div>
                <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#C9D8D0] bg-[#FAFAFA] px-5 text-center transition hover:border-[#0A5C3A]/45 hover:bg-white">
                  <Upload className="mb-3 h-8 w-8 text-[#0A5C3A]" />
                  <span className="text-sm font-semibold text-[#0F1115]">
                    {profile.cv ? profile.cv.name : "CV yükle"}
                  </span>
                  <span className="mt-1 text-xs font-medium text-[#5F6773]">
                    {profile.cv ? `${Math.round(profile.cv.size / 1024)} KB - ${profile.cv.uploadedAt}` : "PDF dosyanı seç"}
                  </span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                </label>
                <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#0F1115] break-all">
                    <Mail className="h-4 w-4 text-[#0A5C3A]" />
                    {user.email}
                  </div>
                  <p className="mt-2 text-xs font-normal leading-relaxed text-[#5F6773]">
                    Bu demo sürümde CV dosyasının kendisi değil, dosya bilgisi saklanır. DB/storage bağlanınca gerçek dosya yükleme yapılır.
                  </p>
                </div>
              </div>
            )}

            {activePanel === "settings" && (
              <>
                <div className="rounded-3xl border border-[#DDE7E1] bg-[#F8FBF9] p-4">
                  <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0A5C3A] ring-1 ring-[#DDE7E1]">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F1115]">Hesap Ayarları</h3>
                    <p className="text-xs font-medium text-[#5F6773]">Profilin kaydedildi, hesap seçeneklerin burada.</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => toast.info("Şifre güncelleme DB/auth bağlantısı ile aktif edilecek.")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#DDE7E1] bg-white px-3 py-3 text-xs font-semibold text-[#0F1115] transition hover:border-[#0A5C3A]/40"
                  >
                    <Shield className="h-4 w-4 text-[#0A5C3A]" />
                    Şifre Güncelle
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-3 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hesabı Sil
                  </button>
                </div>
              </div>
              </>
            )}
          </motion.div>
        </div>
      </PageContainer>
    </PageBackground>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#0F1115]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-normal text-[#0F1115] outline-none transition focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10"
      />
    </label>
  );
}

function PanelButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
        active
          ? "bg-[#0A5C3A] text-white shadow-sm"
          : "bg-white text-[#5F6773] hover:bg-[#F8FAFC] hover:text-[#0F1115]"
      }`}
    >
      {label}
    </button>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-[74px] rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5F6773]">{label}</p>
      <p className="mt-1.5 text-sm font-medium text-[#0F1115] break-words">{value}</p>
    </div>
  );
}

function EventList({
  title,
  emptyText,
  events,
}: {
  title: string;
  emptyText: string;
  events: EventItem[];
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
      <h4 className="text-sm font-semibold text-[#0F1115]">{title}</h4>
      {events.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-[#DDE7E1] bg-white px-3 py-4 text-xs font-medium text-[#5F6773]">
          {emptyText}
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {events.map((event) => (
            <div key={event.id} className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-3">
              <p className="text-sm font-medium text-[#0F1115]">{event.title}</p>
              <p className="mt-1 text-xs font-normal text-[#5F6773]">
                {event.date} - {event.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
