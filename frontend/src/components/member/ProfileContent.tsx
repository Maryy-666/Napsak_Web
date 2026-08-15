"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, LogOut, Mail, Save, Settings, Trash2, Upload, User } from "lucide-react";
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
const INTERESTS = ["Teknoloji", "Sanat", "Girişimcilik", "Sosyal Sorumluluk", "Çevre", "Kariyer", "Tasarım", "İçerik"];
const CAREER_OPTIONS = ["Yazılım", "Tasarım", "Pazarlama", "İnsan Kaynakları", "Etkinlik Yönetimi", "İçerik Üretimi", "Veri Bilimi", "Girişimcilik"];

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
    const hasProfileDetails = Boolean(
      savedProfile.phone ||
        savedProfile.university ||
        savedProfile.school ||
        savedProfile.department ||
        savedProfile.interests?.length ||
        savedProfile.careerPreferences?.length ||
        savedProfile.skills ||
        savedProfile.bio
    );

    setUser(currentUser);
    setProfile(savedProfile);
    setIsEditing(!hasProfileDetails);
    setApplications(EventsRepository.getApplications());
    setEvents(EventsRepository.getAllEvents());
  }, [router]);

  const updateField = (field: keyof MemberProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: field === "phone" ? formatPhone(value) : value });
  };

  const toggleListValue = (field: "interests" | "careerPreferences", value: string, max?: number) => {
    if (!profile) return;
    const currentValues = profile[field] || [];
    const exists = currentValues.includes(value);

    if (!exists && max && currentValues.length >= max) {
      toast.info(`En fazla ${max} tercih seçebilirsin.`);
      return;
    }

    setProfile({
      ...profile,
      [field]: exists ? currentValues.filter((item) => item !== value) : [...currentValues, value],
    });
  };

  const handleSave = () => {
    if (!user || !profile) return;

    const normalizedProfile: MemberProfile = {
      ...profile,
      fullName: profile.fullName.trim(),
      email: profile.email.trim().toLowerCase(),
      phone: formatPhone(profile.phone),
      birthDate: profile.birthDate?.trim() || "",
      linkedin: profile.linkedin?.trim() || "",
      city: profile.city.trim(),
      university: profile.university?.trim() || profile.school.trim(),
      universityType: profile.universityType?.trim() || "",
      school: profile.university?.trim() || profile.school.trim(),
      department: profile.department.trim(),
      grade: profile.grade.trim(),
      startDate: profile.startDate?.trim() || "",
      graduationDate: profile.graduationDate?.trim() || "",
      gpa: profile.gpa?.trim() || "",
      experience: profile.experience?.trim() || "",
      interests: profile.interests || [],
      careerPreferences: profile.careerPreferences || [],
      skills: profile.skills.trim(),
      bio: profile.bio.trim(),
    };

    if (!emailPattern.test(normalizedProfile.email)) {
      toast.error("Geçerli bir e-posta adresi gir.");
      return;
    }

    saveMemberProfile(user, normalizedProfile);
    setProfile(normalizedProfile);
    setIsEditing(false);
    toast.success("Profil bilgilerin kaydedildi.");
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

  const handleLogout = () => {
    clearCurrentUser();
    router.replace(ROUTES.LOGIN);
  };

  const handleDeleteAccount = () => {
    if (!confirm("Hesabını silmek istediğine emin misin? Bu işlem bu cihazdaki oturum ve profil bilgilerini kaldırır.")) return;
    clearCurrentUser();
    toast.success("Hesabın silindi.");
    router.replace(ROUTES.KAYIT);
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

  const userEmail = (profile.email || user.email).toLowerCase();
  const userApplications = applications.filter((application) => application.email.toLowerCase() === userEmail);
  const appliedEventIds = new Set(userApplications.map((application) => application.eventId));
  const activeAppliedEvents = events.filter((event) => appliedEventIds.has(event.id) && event.status === "aktif");
  const attendedEvents = events.filter((event) => appliedEventIds.has(event.id) && event.status === "gecmis");

  return (
    <PageBackground className="pt-28 pb-20">
      <PageContainer className="max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.045)] lg:sticky lg:top-28 lg:self-start">
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
              <PanelButton active={activePanel === "account"} onClick={() => setActivePanel("account")} label="Profil Bilgileri" />
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
            className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_30px_rgba(15,17,21,0.045)] sm:p-6 lg:mt-8"
          >
            <div className="mb-7 border-b border-[#EEF0F2] pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#0F1115]">
                    {activePanel === "account" && "Profil Bilgileri"}
                    {activePanel === "events" && "Etkinliklerim"}
                    {activePanel === "cv" && "CV Dosyası"}
                    {activePanel === "settings" && "Hesap Ayarları"}
                  </h2>
                  <p className="mt-1.5 text-sm font-normal text-[#5F6773]">
                    {activePanel === "account" && "Kayıt formundaki alanları buradan güncelleyebilirsin. TC kimlik numarası istemiyoruz."}
                    {activePanel === "events" && "Başvurduğun ve katıldığın etkinlikleri buradan takip edebilirsin."}
                    {activePanel === "cv" && "Başvurular için CV dosyanı hazır tut."}
                    {activePanel === "settings" && "Bu demo akışında hesap bilgileri cihazında saklanır."}
                  </p>
                </div>
                {activePanel === "account" && (
                  isEditing ? (
                    <Button onClick={handleSave} className="h-10 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] font-semibold" leftIcon={<Save className="h-4 w-4" />}>
                      Kaydet
                    </Button>
                  ) : (
                    <Button variant="secondary" onClick={() => setIsEditing(true)} className="h-10 rounded-xl font-semibold" leftIcon={<Settings className="h-4 w-4" />}>
                      Güncelle
                    </Button>
                  )
                )}
              </div>
            </div>

            {activePanel === "account" && (
              isEditing ? (
                <ProfileEditor profile={profile} updateField={updateField} toggleListValue={toggleListValue} />
              ) : (
                <ProfileSummary user={user} profile={profile} />
              )
            )}

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
                  <div className="flex items-center gap-2 break-all text-sm font-semibold text-[#0F1115]">
                    <Mail className="h-4 w-4 text-[#0A5C3A]" />
                    {user.email}
                  </div>
                  <p className="mt-2 text-xs font-normal leading-relaxed text-[#5F6773]">
                    Bu demo sürümde CV dosyasının kendisi değil, dosya bilgisi saklanır.
                  </p>
                </div>
              </div>
            )}

            {activePanel === "settings" && (
              <div className="rounded-2xl border border-[#DDE7E1] bg-[#F8FBF9] p-4">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0A5C3A] ring-1 ring-[#DDE7E1]">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F1115]">Hesap Ayarları</h3>
                    <p className="text-xs font-medium text-[#5F6773]">Hesabınla ilgili işlemleri buradan yönetebilirsin.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-3 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Hesabı Sil
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </PageContainer>
    </PageBackground>
  );
}

function ProfileEditor({
  profile,
  updateField,
  toggleListValue,
}: {
  profile: MemberProfile;
  updateField: (field: keyof MemberProfile, value: string) => void;
  toggleListValue: (field: "interests" | "careerPreferences", value: string, max?: number) => void;
}) {
  return (
    <>
      <ProfileSection title="1. İletişim Bilgileri">
        <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
          <Field label="Ad Soyad" value={profile.fullName} onChange={(value) => updateField("fullName", value)} placeholder="Ad Soyad" autoComplete="name" maxLength={100} />
          <Field label="E-posta" value={profile.email} onChange={(value) => updateField("email", value)} type="email" placeholder="ornek@domain.com" autoComplete="email" maxLength={120} />
          <Field label="Telefon" value={profile.phone} onChange={(value) => updateField("phone", value)} type="tel" placeholder="05XX XXX XX XX" autoComplete="tel" inputMode="tel" maxLength={20} />
          <Field label="Doğum Tarihi" value={profile.birthDate || ""} onChange={(value) => updateField("birthDate", value)} type="date" maxLength={20} />
          <Field label="LinkedIn" value={profile.linkedin || ""} onChange={(value) => updateField("linkedin", value)} placeholder="https://www.linkedin.com/in/" className="lg:col-span-2" maxLength={160} />
        </div>
      </ProfileSection>

      <ProfileSection title="2. Üniversite & Deneyim">
        <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
          <Field label="Üniversite" value={profile.university || profile.school} onChange={(value) => {
            updateField("university", value);
            updateField("school", value);
          }} placeholder="Üniversite" maxLength={120} />
          <Field label="Üniversite Tipi" value={profile.universityType || ""} onChange={(value) => updateField("universityType", value)} placeholder="Devlet / Vakıf" maxLength={60} />
          <Field label="Bölüm" value={profile.department} onChange={(value) => updateField("department", value)} placeholder="Bölüm / Alan" maxLength={120} />
          <Field label="Sınıf" value={profile.grade} onChange={(value) => updateField("grade", value)} placeholder="Hazırlık, 1. sınıf..." maxLength={30} />
          <Field label="Başlangıç" value={profile.startDate || ""} onChange={(value) => updateField("startDate", value)} placeholder="AA-YYYY" maxLength={20} />
          <Field label="Bitiş / Tahmini" value={profile.graduationDate || ""} onChange={(value) => updateField("graduationDate", value)} placeholder="AA-YYYY" maxLength={20} />
          <Field label="Genel Not Ortalaması" value={profile.gpa || ""} onChange={(value) => updateField("gpa", value)} placeholder="Örn: 3.25" inputMode="decimal" maxLength={10} />
          <Field label="Deneyim" value={profile.experience || ""} onChange={(value) => updateField("experience", value)} placeholder="Kulüp, proje, staj..." maxLength={500} />
        </div>
      </ProfileSection>

      <ProfileSection title="3. Yetenekler & Tercihler">
        <p className="mb-4 text-xs font-medium text-[#5F6773]">TC gibi hassas bilgiler istemiyoruz; sadece ilgini çeken alanları tutuyoruz.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INTERESTS.map((item) => (
            <CheckOption key={item} label={item} checked={(profile.interests || []).includes(item)} onChange={() => toggleListValue("interests", item)} />
          ))}
        </div>

        <div className="mt-6 border-t border-[#EEF0F2] pt-6">
          <p className="text-sm font-semibold text-[#0F1115]">Kariyer / Çalışma Tercihleri</p>
          <p className="mt-1 text-xs font-medium text-[#0A5C3A]">En fazla 3 tercih seçebilirsin.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CAREER_OPTIONS.map((item) => (
              <CheckOption key={item} label={item} checked={(profile.careerPreferences || []).includes(item)} onChange={() => toggleListValue("careerPreferences", item, 3)} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-x-6 gap-y-5 lg:grid-cols-2">
          <Field label="Yetenekler" value={profile.skills} onChange={(value) => updateField("skills", value)} placeholder="Tasarım, yazılım, içerik..." maxLength={500} />
          <Field label="Şehir" value={profile.city} onChange={(value) => updateField("city", value)} placeholder="İstanbul" autoComplete="address-level2" maxLength={60} />
        </div>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-xs font-semibold text-[#0F1115]">Kısa Tanıtım</span>
          <textarea
            value={profile.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            rows={4}
            maxLength={1000}
            className="h-auto w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-sm font-medium text-[#0F1115] outline-none transition focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10"
            placeholder="Kendinden ve ilgilendiğin alanlardan kısaca bahset."
          />
        </label>
      </ProfileSection>
    </>
  );
}

function ProfileSummary({ user, profile }: { user: AuthUser; profile: MemberProfile }) {
  const sections = [
    {
      title: "İletişim",
      items: [
        { label: "Ad Soyad", value: profile.fullName || user.name || "-" },
        { label: "E-posta", value: profile.email || user.email },
        { label: "Telefon", value: profile.phone || "Eklenmedi" },
        { label: "Doğum Tarihi", value: profile.birthDate || "Eklenmedi" },
        { label: "LinkedIn", value: profile.linkedin || "Eklenmedi" },
        { label: "Şehir", value: profile.city || "Eklenmedi" },
      ],
    },
    {
      title: "Eğitim",
      items: [
        { label: "Üniversite", value: profile.university || profile.school || "Eklenmedi" },
        { label: "Üniversite Tipi", value: profile.universityType || "Eklenmedi" },
        { label: "Bölüm", value: profile.department || "Eklenmedi" },
        { label: "Sınıf", value: profile.grade || "Eklenmedi" },
        { label: "Başlangıç", value: profile.startDate || "Eklenmedi" },
        { label: "Bitiş / Tahmini", value: profile.graduationDate || "Eklenmedi" },
        { label: "Ortalama", value: profile.gpa || "Eklenmedi" },
      ],
    },
    {
      title: "Yetenekler & Tercihler",
      items: [
        { label: "Yetenekler", value: profile.skills || "Eklenmedi" },
        { label: "İlgi Alanları", value: (profile.interests || []).join(", ") || "Eklenmedi" },
        { label: "Kariyer Tercihleri", value: (profile.careerPreferences || []).join(", ") || "Eklenmedi" },
        { label: "Deneyim", value: profile.experience || "Eklenmedi" },
      ],
    },
  ];
  const [activeSection, setActiveSection] = useState(sections[0].title);
  const currentSection = sections.find((section) => section.title === activeSection) || sections[0];

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FBF9] p-2">
        {sections.map((section) => (
          <button
            key={section.title}
            type="button"
            onClick={() => setActiveSection(section.title)}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
              activeSection === section.title
                ? "bg-[#0A5C3A] text-white shadow-sm"
                : "bg-white text-[#5F6773] hover:text-[#0F1115]"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      <SummarySection title={currentSection.title}>
        {currentSection.items.map((item) => (
          <InfoItem key={item.label} label={item.label} value={item.value} />
        ))}
      </SummarySection>

      <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
        <p className="text-xs font-semibold text-[#5F6773]">Kısa Tanıtım</p>
        <p className="mt-2 text-sm font-normal leading-relaxed text-[#0F1115]">
          {profile.bio || "Henüz kısa tanıtım eklenmedi."}
        </p>
      </div>
    </>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-3">
        <h3 className="text-sm font-bold text-[#0A5C3A]">{title}</h3>
        <div className="h-px flex-1 bg-[#EEF0F2]" />
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="mb-3 rounded-2xl border border-[#E5E7EB] bg-white p-0 open:p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold text-[#0A5C3A] transition hover:bg-[#F8FBF9] open:mb-5">
        <span>{title}</span>
        <span className="text-xs font-semibold text-[#5F6773]">Aç / Kapat</span>
      </summary>
      {children}
    </details>
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
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className || ""}`}>
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

function CheckOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-3 rounded-xl px-1 py-1 text-left text-sm font-medium text-[#5F6773]">
      <span className={`flex h-5 w-5 items-center justify-center rounded border ${checked ? "border-[#0A5C3A] bg-[#0A5C3A]" : "border-[#D1D5DB] bg-white"}`}>
        {checked && <Check className="h-3.5 w-3.5 text-white" />}
      </span>
      <span>{label}</span>
    </button>
  );
}

function PanelButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
        active ? "bg-[#0A5C3A] text-white shadow-sm" : "bg-white text-[#5F6773] hover:bg-[#F8FAFC] hover:text-[#0F1115]"
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
      <p className="mt-1.5 break-words text-sm font-medium text-[#0F1115]">{value}</p>
    </div>
  );
}

function EventList({ title, emptyText, events }: { title: string; emptyText: string; events: EventItem[] }) {
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
