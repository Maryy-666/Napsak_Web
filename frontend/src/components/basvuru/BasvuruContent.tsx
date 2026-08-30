"use client";

import React, { useState, useEffect } from "react";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  Send,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Sparkles,
  Zap,
  FileText,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Logo } from "../common/Logo";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";
import { ApplicationsRepository } from "../../lib/applicationsStore";
import { TeamsRepository } from "../../lib/teamsStore";

const DEFAULT_GOOGLE_FORM_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSfdVNOuIb8ynpYORbOP6ujQstbsqDd7432nc-z31E3rTc3dxA/viewform?usp=dialog";

export default function BasvuruContent() {
  const [activeTab, setActiveTab] = useState<"SITE_FORM" | "GOOGLE_FORM">("SITE_FORM");

  const [teamsList, setTeamsList] = useState<string[]>([
    "Teknoloji Ekibi",
    "Sanat Ekibi",
    "Çevre ve Sağlık Ekibi",
    "Programlar Ekibi",
    "Kurumsal İletişim Ekibi",
    "Genel Topluluk Üyeliği & Gönüllü",
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    school: "",
    department: "",
    grade: "2. Sınıf",
    program: "Teknoloji Ekibi",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    TeamsRepository.fetchTeamsFromDB().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const titles = data
          .map((t) => t.title)
          .filter(
            (t) =>
              !t.toLowerCase().includes("yönetim") &&
              !t.toLowerCase().includes("danışma") &&
              !t.toLowerCase().includes("kurul")
          );
        const combined = Array.from(new Set([...titles, "Genel Topluluk Üyeliği & Gönüllü"]));
        setTeamsList(combined);
        if (titles.length > 0) {
          setFormData((prev) => ({
            ...prev,
            program: titles[0],
          }));
        }
      }
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !formData.school.trim() ||
      !formData.department.trim() ||
      !formData.grade.trim() ||
      !formData.program.trim() ||
      !formData.note.trim()
    ) {
      setErrorMsg("Lütfen başvuru formundaki tüm alanları doldurunuz.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      await ApplicationsRepository.addApplication({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        school: formData.school.trim(),
        department: formData.department.trim(),
        grade: formData.grade,
        program: formData.program,
        note: formData.note.trim(),
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Başvuru gönderimi hatası:", err);
      setErrorMsg("Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutGroup id="basvuru-layout-group">
      <PageBackground id="basvuru-page-root" className="justify-center select-none py-12">
        <div className="w-full max-w-[680px] px-4 sm:px-6 flex justify-center items-center z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <Card
              variant="auth"
              animate={false}
              className="w-full px-6 py-8 sm:px-10 sm:py-10 rounded-[24px] bg-white/90 backdrop-blur-[20px] border border-white/70 shadow-[0_30px_80px_rgba(15,17,21,0.08)] flex flex-col text-left"
            >
              {/* Header section */}
              <div className="flex items-center gap-5 mb-6 select-none w-full">
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.05 }}
                  className="shrink-0 flex items-center justify-center w-14 h-14 sm:w-[64px] sm:h-[64px] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,17,21,0.04)] ring-1 ring-white/70"
                >
                  <Logo size={64} variant="default" priority />
                </motion.div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#0A5C3A] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Aramıza Katıl</span>
                  </span>
                  <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#0F1115] font-headings leading-tight">
                    Topluluğa Katıl Başvurusu
                  </h1>
                </div>
              </div>

              {/* TAB SEÇİMİ (İki Farklı Başvuru Yolu) */}
              {!submitted && (
                <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("SITE_FORM")}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === "SITE_FORM"
                        ? "bg-white text-[#0A5C3A] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Site İçi Hızlı Form</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("GOOGLE_FORM")}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === "GOOGLE_FORM"
                        ? "bg-white text-[#0A5C3A] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Google Form ile Başvur</span>
                  </button>
                </div>
              )}

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-[#0A5C3A] rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9 stroke-[2]" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-headings text-slate-900">
                      Başvurunuz Başarıyla Alındı!
                    </h2>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      N'apsak? Gençlik Topluluğu'na gösterdiğin ilgi için teşekkür ederiz. Başvurun ekibimiz tarafından değerlendirilecek ve belirtmiş olduğun iletişim bilgileri üzerinden dönüş yapılacaktır.
                    </p>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href={ROUTES.HOME}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-all shadow-md text-center"
                    >
                      Ana Sayfaya Dön
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: "",
                          email: "",
                          phone: "",
                          city: "",
                          school: "",
                          department: "",
                          grade: "2. Sınıf",
                          program: "Yazılım & Tasarım Ekibi",
                          note: "",
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all text-center"
                    >
                      Yeni Başvuru Yap
                    </button>
                  </div>
                </motion.div>
              ) : activeTab === "SITE_FORM" ? (
                /* TAB 1: SITE IÇI FORM (Yönetici Paneline düşer) */
                <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                  <p className="text-xs text-[#5F6773] font-medium leading-relaxed mb-4">
                    Formu doldurarak topluluğumuza doğrudan başvuru yapabilirsiniz. Başvurunuz yönetici panelimize anında iletilecektir.
                  </p>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  {/* Ad Soyad & E-posta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Ad Soyad <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        E-posta Adresi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ahmet@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Telefon & Şehir */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Telefon Numarası <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="05xx xxx xx xx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Yaşadığınız Şehir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Örn: İstanbul, Ankara"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Okul & Bölüm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Üniversite / Okul <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="school"
                        required
                        value={formData.school}
                        onChange={handleChange}
                        placeholder="Örn: Yıldız Teknik Üniversitesi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Bölüm / Alan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="department"
                        required
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Örn: Yazılım Mühendisliği"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Tercih Edilen Ekip & Sınıf */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Tercih Edilen Ekip / Çalışma Alanı <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="program"
                        required
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      >
                        {teamsList.map((teamName) => (
                          <option key={teamName} value={teamName}>
                            {teamName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Sınıf / Durum <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="grade"
                        required
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      >
                        <option value="Hazırlık">Hazırlık</option>
                        <option value="1. Sınıf">1. Sınıf</option>
                        <option value="2. Sınıf">2. Sınıf</option>
                        <option value="3. Sınıf">3. Sınıf</option>
                        <option value="4. Sınıf">4. Sınıf</option>
                        <option value="Yüksek Lisans / Doktora">Yüksek Lisans / Doktora</option>
                        <option value="Mezun">Mezun</option>
                        <option value="Lise / Diğer">Lise / Diğer</option>
                      </select>
                    </div>
                  </div>

                  {/* Ön Yazı / Not */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ön Yazı / Kendinden Bahset (İlgi Alanların & Deneyimlerin) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      name="note"
                      required
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Neden N'apsak? topluluğuna katılmak istiyorsun? İlgi duyduğun alanlardan kısaca bahsedebilirsin..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="pt-3 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl text-sm font-bold text-white bg-[#0A5C3A] hover:bg-[#084A2F] shadow-md shadow-[#0A5C3A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Başvuru Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <span>Başvurumu Gönder</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <Link
                        href={ROUTES.LOGIN}
                        className="inline-flex items-center gap-1 font-semibold text-[#5F6773] hover:text-[#0A5C3A] transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Giriş Sayfasına Dön</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setActiveTab("GOOGLE_FORM")}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0A5C3A] hover:underline"
                      >
                        <span>Google Form ile Devam Et →</span>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* TAB 2: GOOGLE FORM (Harici Bağlantı) */
                <div className="space-y-6 text-center py-4 font-sans select-none">
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-left space-y-2">
                    <h3 className="text-sm font-bold text-[#0A5C3A] flex items-center gap-2 font-headings">
                      <Sparkles className="w-4 h-4" />
                      Google Form Başvuru Yolu
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Google hesabınızla resmi katılım formunu doldurmayı tercih ederseniz aşağıdaki buton ile yeni sekmede Google Form'a erişebilirsiniz.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col items-center">
                    <a
                      href={DEFAULT_GOOGLE_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        ApplicationsRepository.addApplication({
                          fullName: "Google Form Ziyaretçisi",
                          email: "google-form@napsak.org",
                          phone: "-",
                          program: "Google Form Başvurusu",
                          city: "-",
                          school: "-",
                          department: "-",
                          grade: "-",
                          note: "Kullanıcı Google Form üzerinden başvuru yapmak için dış bağlantıya geçti.",
                        });
                      }}
                      className="w-full inline-flex items-center justify-center gap-2.5 h-[54px] rounded-xl text-sm font-bold text-white bg-[#0A5C3A] hover:bg-[#084A2F] shadow-md shadow-[#0A5C3A]/20 transition-all cursor-pointer text-center"
                    >
                      <span>Google Formu Aç</span>
                      <ExternalLink className="w-4.5 h-4.5 stroke-[2]" />
                    </a>
                    <p className="text-[11px] text-slate-400 font-medium mt-3">
                      Google Form yeni bir sekmede açılacaktır.
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between text-xs border-t border-slate-100">
                    <Link
                      href={ROUTES.LOGIN}
                      className="inline-flex items-center gap-1 font-semibold text-[#5F6773] hover:text-[#0A5C3A] transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Giriş Sayfasına Dön</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setActiveTab("SITE_FORM")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A5C3A] hover:underline"
                    >
                      <span>← Site İçi Forma Dön</span>
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </PageBackground>
    </LayoutGroup>
  );
}
