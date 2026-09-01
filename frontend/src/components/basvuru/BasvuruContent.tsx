"use client";

import React, { useState, useEffect } from "react";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Send,
  ArrowLeft,
  Loader2,
  Sparkles,
  FileText,
  UploadCloud,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Logo } from "../common/Logo";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";
import { ApplicationsRepository } from "../../lib/applicationsStore";
import { TeamsRepository } from "../../lib/teamsStore";
import { useLanguage } from "../../context/LanguageContext";

export default function BasvuruContent() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const router = useRouter();

  const [teamsList, setTeamsList] = useState<string[]>([
    "Teknoloji Ekibi",
    "Sanat Ekibi",
    "Yaşam ve Sürdürülebilirlik Ekibi",
    "Programlar Ekibi",
    "Kurumsal İletişim Ekibi",
    "Genel Topluluk Üyeliği & Gönüllü",
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    district: "",
    school: "",
    department: "",
    graduationStatus: "Öğrenci",
    grade: "1. Sınıf",
    program: "Teknoloji Ekibi",
    pastMember: "Hayır",
    pastTeam: "",
    note: "",
    kvkkAccepted: false,
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("CV dosya boyutu maksimum 10MB olmalıdır.");
        return;
      }
      setCvFile(file);
      setErrorMsg("");

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setCvUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCv = () => {
    setCvFile(null);
    setCvUrl("");
  };

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
      !formData.district.trim() ||
      !formData.school.trim() ||
      !formData.department.trim() ||
      !formData.graduationStatus.trim() ||
      !formData.grade.trim() ||
      !formData.program.trim() ||
      !formData.pastMember.trim() ||
      !formData.note.trim()
    ) {
      setErrorMsg("Lütfen başvuru formundaki tüm zorunlu alanları doldurunuz.");
      return;
    }

    if (formData.pastMember === "Evet" && !formData.pastTeam.trim()) {
      setErrorMsg("Lütfen daha önce yer aldığınız ekibi/alanı belirtiniz.");
      return;
    }

    if (!formData.kvkkAccepted) {
      setErrorMsg("Başvurunuzu gönderebilmek için KVKK aydınlatma metnini okuyup kabul etmelisiniz.");
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
        district: formData.district.trim(),
        school: formData.school.trim(),
        department: formData.department.trim(),
        graduationStatus: formData.graduationStatus.trim(),
        grade: formData.grade.trim(),
        program: formData.program.trim(),
        pastMember: formData.pastMember.trim(),
        pastTeam: formData.pastMember === "Evet" ? formData.pastTeam.trim() : "",
        note: formData.note.trim(),
        kvkkAccepted: formData.kvkkAccepted,
        cvUrl: cvUrl || undefined,
        cvFileName: cvFile ? cvFile.name : undefined,
      });

      setSubmitted(true);
      router.push(ROUTES.BIZDEN_HABERDAR_OL);
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
                    <span>{isEn ? "Join Us" : "Aramıza Katıl"}</span>
                  </span>
                  <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#0F1115] font-headings leading-tight">
                    {isEn ? "Community Membership Application" : "Topluluğa Katıl Başvurusu"}
                  </h1>
                </div>
              </div>

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
                          district: "",
                          school: "",
                          department: "",
                          graduationStatus: "Öğrenci",
                          grade: "1. Sınıf",
                          program: teamsList[0] || "Teknoloji Ekibi",
                          pastMember: "Hayır",
                          pastTeam: "",
                          note: "",
                          kvkkAccepted: false,
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all text-center"
                    >
                      Yeni Başvuru Yap
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs">
                  <p className="text-xs text-[#5F6773] font-medium leading-relaxed">
                    Formu doldurarak topluluğumuza doğrudan başvuru yapabilirsiniz. Başvurunuz ekibimize anında iletilecektir.
                  </p>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  {/* 1. KİŞİSEL BİLGİLER */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#0A5C3A] uppercase tracking-wider">
                      1. Kişisel Bilgiler
                    </h3>

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
                          placeholder="Ad Soyad"
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
                          placeholder="E-posta adresi"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Telefon, İl & İlçe */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          İl <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="İliniz"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          İlçe <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="district"
                          required
                          value={formData.district}
                          onChange={handleChange}
                          placeholder="İlçeniz"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. EĞİTİM BİLGİLERİ */}
                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-[#0A5C3A] uppercase tracking-wider">
                      2. Eğitim Bilgileri
                    </h3>

                    {/* Okul & Bölüm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Okul <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="school"
                          required
                          value={formData.school}
                          onChange={handleChange}
                          placeholder="Okulunuzun adı"
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
                          placeholder="Bölümünüz veya alanınız"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Durum (Mezuniyet Durumu) & Sınıf */}
                    <div className={`grid grid-cols-1 ${formData.graduationStatus === "Öğrenci" ? "sm:grid-cols-2" : "sm:grid-cols-1"} gap-4`}>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Durum <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="graduationStatus"
                          required
                          value={formData.graduationStatus}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              graduationStatus: val,
                              grade: val === "Mezun" ? "Mezun" : prev.grade === "Mezun" ? "1. Sınıf" : prev.grade,
                            }));
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="Öğrenci">Öğrenci</option>
                          <option value="Mezun">Mezun</option>
                        </select>
                      </div>

                      {formData.graduationStatus === "Öğrenci" && (
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Sınıf <span className="text-rose-500">*</span>
                          </label>
                          <select
                            name="grade"
                            required
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all cursor-pointer"
                          >
                            <option value="Hazırlık">Hazırlık</option>
                            <option value="1. Sınıf">1. Sınıf</option>
                            <option value="2. Sınıf">2. Sınıf</option>
                            <option value="3. Sınıf">3. Sınıf</option>
                            <option value="4. Sınıf">4. Sınıf</option>
                            <option value="Yüksek Lisans / Doktora">Yüksek Lisans / Doktora</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. TOPLULUK BİLGİLERİ */}
                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-[#0A5C3A] uppercase tracking-wider">
                      3. Topluluk Bilgileri
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      <div className="flex flex-col justify-between h-full">
                        <label className="block font-bold text-slate-700 mb-1">
                          Tercih Edilen Ekip / Çalışma Alanı <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="program"
                          required
                          value={formData.program}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all cursor-pointer"
                        >
                          {teamsList.map((teamName) => (
                            <option key={teamName} value={teamName}>
                              {teamName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col justify-between h-full">
                        <label className="block font-bold text-slate-700 mb-1">
                          Daha önce herhangi bir sivil toplum kuruluşunda veya toplulukta yer aldınız mı? <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="pastMember"
                          required
                          value={formData.pastMember}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="Evet">Evet</option>
                          <option value="Hayır">Hayır</option>
                        </select>
                      </div>
                    </div>

                    {formData.pastMember === "Evet" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block font-bold text-slate-700 mb-1">
                          Daha önce hangi STK / topluluk veya ekipte yer aldınız? <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pastTeam"
                          required={formData.pastMember === "Evet"}
                          value={formData.pastTeam}
                          onChange={handleChange}
                          placeholder="Örn: Gençlik Kulübü, Kızılay vb."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* 4. BAŞVURU / MOTİVASYON */}
                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-[#0A5C3A] uppercase tracking-wider">
                      4. Başvuru / Motivasyon
                    </h3>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Kendinizden Bahsedin ve Topluluğa Katılma Motivasyonunuzu Açıklayın. <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        name="note"
                        required
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="İlgi alanlarınızdan, deneyimlerinizden ve neden N'apsak? topluluğuna katılmak istediğinizden kısaca bahsedebilirsiniz..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs focus:outline-none focus:border-[#0A5C3A] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* 5. CV / ÖZGEÇMİŞ */}
                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-[#0A5C3A] uppercase tracking-wider">
                      5. CV / Özgeçmiş
                    </h3>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Özgeçmiş / CV Ekle <span className="text-slate-400 font-normal text-[11px]">(Opsiyonel - PDF, DOC, DOCX)</span>
                      </label>

                      <div className="relative">
                        <input
                          type="file"
                          id="cv-upload-input"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleCvFileChange}
                          className="hidden"
                        />

                        {cvFile ? (
                          <div className="w-full px-3.5 py-3 rounded-xl border border-[#0A5C3A]/30 bg-[#EAF4EE]/60 flex items-center justify-between text-xs transition-all">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-[#0F1115] truncate">{cvFile.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveCv}
                              className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                            >
                              Kaldır
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="cv-upload-input"
                            className="w-full px-3.5 py-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100/70 hover:border-[#0A5C3A]/40 flex items-center justify-center gap-2.5 text-xs text-slate-600 font-semibold cursor-pointer transition-all"
                          >
                            <UploadCloud className="w-4 h-4 text-[#0A5C3A]" />
                            <span>CV / Özgeçmiş Dosyanı Seç (PDF, DOC, DOCX)</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 6. KVKK */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        name="kvkkAccepted"
                        required
                        checked={formData.kvkkAccepted}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, kvkkAccepted: e.target.checked }))
                        }
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0A5C3A] focus:ring-[#0A5C3A] cursor-pointer"
                      />
                      <span className="leading-snug">
                        <Link
                          href={ROUTES.KVKK}
                          target="_blank"
                          className="font-semibold text-[#0A5C3A] hover:underline"
                        >
                          KVKK kapsamında kişisel verilerimin işlenmesine ilişkin aydınlatma metnini
                        </Link>{" "}
                        okudum ve kabul ediyorum. <span className="text-rose-500">*</span>
                      </span>
                    </label>
                  </div>

                  {/* Submit button */}
                  <div className="pt-3 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading || !formData.kvkkAccepted}
                      className="w-full h-12 rounded-xl text-sm font-bold text-white bg-[#0A5C3A] hover:bg-[#084A2F] shadow-md shadow-[#0A5C3A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

                    <div className="flex items-center justify-start text-xs pt-2">
                      <Link
                        href={ROUTES.LOGIN}
                        className="inline-flex items-center gap-1 font-semibold text-[#5F6773] hover:text-[#0A5C3A] transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Giriş Sayfasına Dön</span>
                      </Link>
                    </div>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </PageBackground>
    </LayoutGroup>
  );
}
