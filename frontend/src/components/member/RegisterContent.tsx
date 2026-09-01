"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Button, PageContainer } from "../ui";
import { PageBackground } from "../common/PageBackground";
import { ROUTES } from "../../constants/routes";
import {
  AuthUser,
  MemberProfile,
  saveCurrentUser,
  saveMemberProfile,
} from "../../lib/memberAuth";

const STEPS = ["İletişim Bilgileri", "Eğitim & Deneyim", "Yetenekler & Tercihler"];
const INTERESTS = ["Teknoloji", "Sanat", "Girişimcilik", "Sosyal Sorumluluk", "Çevre", "Kariyer", "Tasarım", "İçerik"];
const CAREER_OPTIONS = ["Yazılım", "Tasarım", "Pazarlama", "İnsan Kaynakları", "Etkinlik Yönetimi", "İçerik Üretimi", "Veri Bilimi", "Girişimcilik"];

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  linkedin: string;
  university: string;
  universityType: string;
  department: string;
  graduationStatus: string;
  grade: string;
  startDate: string;
  graduationDate: string;
  gpa: string;
  experience: string;
  interests: string[];
  careerPreferences: string[];
  skills: string;
  bio: string;
  kvkkAccepted: boolean;
};

const initialForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  birthDate: "",
  linkedin: "",
  university: "",
  universityType: "",
  department: "",
  graduationStatus: "Öğrenci",
  grade: "1. Sınıf",
  startDate: "",
  graduationDate: "",
  gpa: "",
  experience: "",
  interests: [],
  careerPreferences: [],
  skills: "",
  bio: "",
  kvkkAccepted: false,
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
}

export default function RegisterContent() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullName = useMemo(() => `${form.firstName.trim()} ${form.lastName.trim()}`.trim(), [form.firstName, form.lastName]);

  const updateField = (field: keyof RegisterForm, value: any) => {
    setForm((current) => ({
      ...current,
      [field]: field === "phone" ? formatPhone(value) : value,
    }));
  };

  const toggleListValue = (field: "interests" | "careerPreferences", value: string, max?: number) => {
    setForm((current) => {
      const exists = current[field].includes(value);
      if (!exists && max && current[field].length >= max) {
        toast.info(`En fazla ${max} tercih seçebilirsin.`);
        return current;
      }

      return {
        ...current,
        [field]: exists ? current[field].filter((item) => item !== value) : [...current[field], value],
      };
    });
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
        toast.error("Ad, soyad, e-posta ve şifre alanlarını doldur.");
        return false;
      }
      if (!form.email.includes("@")) {
        toast.error("Geçerli bir e-posta adresi gir.");
        return false;
      }
      if (form.password.length < 8) {
        toast.error("Şifre en az 8 karakter olmalı.");
        return false;
      }
    }

    if (step === 1 && (!form.university.trim() || !form.department.trim())) {
      toast.error("Okul ve alan/bölüm bilgilerini doldur.");
      return false;
    }

    if (step === 2) {
      if (form.interests.length === 0) {
        toast.error("En az bir ilgi alanı seç.");
        return false;
      }
      if (!form.kvkkAccepted) {
        toast.error("Kayıt olabilmek için KVKK aydınlatma metnini onaylamalısınız.");
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok || !responseData.success) {
        toast.error(responseData.error || "Kayıt oluşturulamadı.");
        setIsSubmitting(false);
        return;
      }

      const returnedUser = responseData.user;
      const user: AuthUser = {
        id: String(returnedUser?.id || `user-${Date.now()}`),
        email: (returnedUser?.email || form.email).trim().toLowerCase(),
        name: returnedUser?.name || fullName,
        role: returnedUser?.role === "ADMIN" ? "admin" : "member",
      };

      const profile: MemberProfile = {
        fullName,
        email: user.email,
        phone: form.phone,
        birthDate: form.birthDate,
        linkedin: form.linkedin.trim(),
        city: "",
        university: form.university.trim(),
        universityType: form.universityType,
        school: form.university.trim(),
        department: form.department.trim(),
        grade: form.graduationStatus === "Mezun" ? "Mezun" : form.grade,
        startDate: form.startDate,
        graduationDate: form.graduationDate,
        gpa: form.gpa,
        experience: form.experience.trim(),
        interests: form.interests,
        careerPreferences: form.careerPreferences,
        skills: form.skills.trim(),
        bio: form.bio.trim(),
      };

      saveCurrentUser(user);
      saveMemberProfile(user, profile);
      toast.success(responseData.message || "Kaydın oluşturuldu. Profilin hazır.");
      setIsSubmitting(false);
      router.replace(ROUTES.PROFIL);
    } catch (error: any) {
      toast.error(error.message || "Kayıt işlemi sırasında bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  return (
    <PageBackground className="justify-center pt-10 pb-12 sm:pt-12" glowOpacity={0.75} watermarkOpacity={0.045}>
      <PageContainer className="relative z-10 max-w-6xl">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(260px,0.75fr)_minmax(560px,720px)]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex max-w-xl flex-col justify-center text-center lg:mx-0 lg:min-h-[520px] lg:pl-6 lg:text-left"
          >
            <span className="inline-flex w-fit self-center rounded-full border border-[#DDE7E1] bg-white/80 px-3 py-1 text-xs font-semibold text-[#0A5C3A] shadow-sm lg:self-start">
              Kayıt ol
            </span>
            <h1 className="mt-4 max-w-[420px] font-headings text-3xl font-bold tracking-tight text-[#0F1115] sm:text-[40px] sm:leading-[1.12]">
              Sen de N&apos;apsak? diyenlerden misin?
            </h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-[#5F6773]">
              Hesabını oluştur; etkinlikleri, ekipleri ve duyuruları tek yerden takip et.
            </p>
          </motion.div>

          <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          onSubmit={handleSubmit}
            className="mx-auto w-full rounded-2xl border border-[#DDE7E1] bg-white px-5 py-6 shadow-[0_28px_90px_rgba(15,17,21,0.16),0_0_0_1px_rgba(255,255,255,0.9)] backdrop-blur-[18px] sm:px-7"
        >
          <Stepper activeStep={step} />

          <div className="mt-8">
            {step === 0 && (
              <section className="space-y-6">
                <p className="hidden">
                  <strong>Merhaba,</strong> seni etkinlikler ve topluluk çalışmalarıyla daha iyi eşleştirebilmek için birkaç bilgi alıyoruz.
                </p>
                <p className="text-xs font-medium text-[#5F6773]">* işaretli alanlar zorunludur.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Ad*" value={form.firstName} onChange={(value) => updateField("firstName", value)} placeholder="Ad" autoComplete="given-name" />
                  <Field label="Soyad*" value={form.lastName} onChange={(value) => updateField("lastName", value)} placeholder="Soyad" autoComplete="family-name" />
                  <Field label="E-posta*" value={form.email} onChange={(value) => updateField("email", value)} placeholder="ornek@domain.com" type="email" autoComplete="email" />
                  <Field label="Şifre*" value={form.password} onChange={(value) => updateField("password", value)} placeholder="En az 8 karakter" type="password" autoComplete="new-password" />
                  <Field label="Telefon Numarası" value={form.phone} onChange={(value) => updateField("phone", value)} placeholder="+90 5__ ___ __ __" type="tel" inputMode="tel" />
                  <Field label="Doğum Tarihi" value={form.birthDate} onChange={(value) => updateField("birthDate", value)} placeholder="GG-AA-YYYY" type="date" />
                </div>
                <Field label="LinkedIn" value={form.linkedin} onChange={(value) => updateField("linkedin", value)} placeholder="https://www.linkedin.com/in/" />
              </section>
            )}

            {step === 1 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold text-[#0F1115]">Okul Bilgileri</h2>
                <div className="rounded-xl border border-[#DDE7E1] bg-white p-4 shadow-[0_8px_28px_rgba(15,17,21,0.04)] sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Okul*"
                      value={form.university}
                      onChange={(value) => updateField("university", value)}
                      placeholder="Okulunuzun adı"
                    />
                    <Field
                      label="Alan / Bölüm*"
                      value={form.department}
                      onChange={(value) => updateField("department", value)}
                      placeholder="Alanınız / Bölümünüz"
                    />
                    <SelectField
                      label="Eğitim Durumu*"
                      value={form.graduationStatus || "Öğrenci"}
                      onChange={(value) => {
                        setForm((prev) => ({
                          ...prev,
                          graduationStatus: value,
                          grade: value === "Mezun" ? "Mezun" : prev.grade === "Mezun" ? "1. Sınıf" : prev.grade,
                        }));
                      }}
                      options={["Öğrenci", "Mezun"]}
                    />
                    {form.graduationStatus !== "Mezun" && (
                      <SelectField
                        label="Sınıf"
                        value={form.grade || "1. Sınıf"}
                        onChange={(value) => updateField("grade", value)}
                        options={["Hazırlık", "1. Sınıf", "2. Sınıf", "3. Sınıf", "4. Sınıf", "Yüksek Lisans / Doktora"]}
                      />
                    )}
                    <Field
                      label="Başlangıç"
                      value={form.startDate}
                      onChange={(value) => updateField("startDate", value)}
                      placeholder="AA-YYYY"
                    />
                    <Field
                      label="Mezuniyet / Tahmini"
                      value={form.graduationDate}
                      onChange={(value) => updateField("graduationDate", value)}
                      placeholder="AA-YYYY"
                    />
                    <Field
                      label="Not Ortalaması"
                      value={form.gpa}
                      onChange={(value) => updateField("gpa", value)}
                      placeholder="Örn: 3.25"
                      inputMode="decimal"
                    />
                  </div>
                </div>
                <label className="mt-6 block">
                  <span className="mb-2 block text-sm font-semibold text-[#0F1115]">Deneyim / Katıldığın çalışmalar</span>
                  <textarea
                    value={form.experience}
                    onChange={(event) => updateField("experience", event.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#0F1115] outline-none transition placeholder:text-[#9FA6B2] focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10"
                    placeholder="Kulüp, gönüllülük, staj, proje veya etkinlik deneyimlerinden bahsedebilirsin."
                  />
                </label>
              </section>
            )}

            {step === 2 && (
              <section className="rounded-xl border border-[#DDE7E1] bg-white p-4 shadow-[0_8px_28px_rgba(15,17,21,0.04)] sm:p-5">
                <h2 className="text-lg font-bold text-[#0A5C3A]">Yetenekler & Tercihler</h2>
                <p className="mt-1 text-sm font-medium text-[#5F6773]">TC gibi hassas bilgiler istemiyoruz; sadece ilgini çeken alanları seç.</p>

                <div className="mt-7">
                  <h3 className="mb-4 text-sm font-bold text-[#0F1115]">İlgi Alanların*</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {INTERESTS.map((item) => (
                      <CheckOption key={item} label={item} checked={form.interests.includes(item)} onChange={() => toggleListValue("interests", item)} />
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-[#EEF0F2] pt-7">
                  <h3 className="text-base font-semibold text-[#0F1115]">Kariyer / Çalışma Tercihlerin</h3>
                  <p className="mt-2 text-sm font-medium text-[#0A5C3A]">En fazla 3 tane seçebilirsin. Seçtiklerin profilinde görünür.</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {CAREER_OPTIONS.map((item) => (
                      <CheckOption key={item} label={item} checked={form.careerPreferences.includes(item)} onChange={() => toggleListValue("careerPreferences", item, 3)} />
                    ))}
                  </div>
                  <div className="mt-6 space-y-2">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="flex h-10 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#5F6773]">
                        <GripVertical className="h-4 w-4" />
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#9FA6B2] text-xs font-bold text-white">{index + 1}</span>
                        <span>{form.careerPreferences[index] || "---"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Yetenekler" value={form.skills} onChange={(value) => updateField("skills", value)} placeholder="Tasarım, yazılım, sunum, fotoğraf..." />
                  <Field label="Kısa Tanıtım" value={form.bio} onChange={(value) => updateField("bio", value)} placeholder="Kendini kısaca anlat" />
                </div>

                {/* KVKK Onay Kutusu */}
                <div className="mt-6 border-t border-[#EEF0F2] pt-4">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#0F1115] select-none">
                    <input
                      type="checkbox"
                      checked={form.kvkkAccepted}
                      onChange={(e) => setForm((prev) => ({ ...prev, kvkkAccepted: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0A5C3A] focus:ring-[#0A5C3A] cursor-pointer"
                    />
                    <span className="leading-snug">
                      <Link href={ROUTES.KVKK} target="_blank" className="font-semibold text-[#0A5C3A] hover:underline">
                        KVKK kapsamında kişisel verilerimin işlenmesine ilişkin aydınlatma metnini
                      </Link>{" "}
                      okudum ve kabul ediyorum. <span className="text-rose-500">*</span>
                    </span>
                  </label>
                </div>
              </section>
            )}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0} leftIcon={<ArrowLeft className="h-4 w-4" />} className="h-11 rounded-xl">
              Geri
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext} rightIcon={<ArrowRight className="h-4 w-4" />} className="h-11 rounded-xl bg-[#0A5C3A] px-7 hover:bg-[#0D7449]">
                İlerle
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting} rightIcon={<Check className="h-4 w-4" />} className="h-11 rounded-xl bg-[#0A5C3A] px-7 hover:bg-[#0D7449]">
                Kaydı Tamamla
              </Button>
            )}
          </div>
          </motion.form>
        </div>
      </PageContainer>
    </PageBackground>
  );
}

function Stepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="border-b border-[#EEF0F2] pb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {STEPS.map((label, index) => (
          <div
            key={label}
            className={`flex items-center gap-2 transition ${
              index === activeStep
                ? "text-[#0F1115]"
                : index < activeStep
                ? "text-[#0A5C3A]"
                : "text-[#5F6773]"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                index <= activeStep ? "bg-[#0A5C3A] text-white" : "bg-[#F8F9FA] text-[#5F6773] ring-1 ring-[#E5E7EB]"
              }`}
            >
              {index + 1}
            </span>
            <span className="text-xs font-semibold sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F1F3F5]">
        <div className="h-full rounded-full bg-[#0A5C3A] transition-all" style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}) {
  return (
    <label className={`block ${className || ""}`}>
      <span className="mb-1.5 block text-xs font-semibold text-[#0A5C3A]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#0F1115] outline-none transition placeholder:text-[#9FA6B2] focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#0A5C3A]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#0F1115] outline-none transition focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10 cursor-pointer"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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
