"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Upload,
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { OpenPosition } from "../../lib/positionsStore";
import { useLanguage } from "../../context/LanguageContext";
import { getCurrentUser, getMemberProfile, AuthUser } from "../../lib/memberAuth";
import { PositionApplicationsRepository, PositionApplication } from "../../lib/positionApplicationsStore";
import Link from "next/link";
import { ROUTES } from "../../constants/routes";

interface PositionApplicationModalProps {
  position: OpenPosition | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PositionApplicationModal({
  position,
  isOpen,
  onClose,
}: PositionApplicationModalProps) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [user, setUser] = useState<AuthUser | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState<boolean>(false);
  const [checkingApplications, setCheckingApplications] = useState<boolean>(false);

  // Form State
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [whyApply, setWhyApply] = useState("");
  const [experience, setExperience] = useState("");
  const [kvkkConsent, setKvkkConsent] = useState(false);

  // Status & Error States
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Prevent background scroll when modal is open and add ESC key listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  const titleText = isEn ? position.titleEn || position.title : position.title;
  const teamText = isEn ? position.teamEn || position.team : position.team;
  const modeText = isEn ? position.workTypeEn || position.workType : position.workType;
  const locText = isEn ? position.locationEn || position.location : position.location;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(isEn ? "CV file size must be less than 10MB." : "CV dosya boyutu 10MB'dan küçük olmalıdır.");
      return;
    }

    setCvFileName(file.name);
    setErrorMessage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCvUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!kvkkConsent) {
      setErrorMessage(isEn ? "Please accept the KVKK agreement." : "Lütfen KVKK ve açık rıza metnini onaylayın.");
      return;
    }

    if (!whyApply.trim()) {
      setErrorMessage(isEn ? "Please state why you are applying." : "Lütfen pozisyona başvuru nedeninizi belirtin.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const result = await PositionApplicationsRepository.createApplication({
      positionId: position.id,
      name: user.name,
      email: user.email,
      phone,
      school,
      department,
      cvUrl,
      whyApply,
      experience,
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      setAlreadyApplied(true);
    } else {
      if (result.alreadyApplied) {
        setAlreadyApplied(true);
      }
      setErrorMessage(result.error || (isEn ? "Application failed." : "Başvuru gönderilemedi."));
    }
  };

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-hidden"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2 }}
          className="relative w-[94%] sm:w-full max-w-[900px] bg-white rounded-[24px] border border-[#EEF0F2] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col text-left"
        >
          {/* Top Header Card */}
          <div className="bg-[#0A5C3A] text-white p-4 sm:px-6 sm:py-4.5 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-4.5 sm:right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-white/15 text-white uppercase tracking-wider">
                {teamText}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-white/90">
                {modeText} • {locText}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold font-headings tracking-tight">
              {titleText}
            </h2>
            <p className="text-[11px] sm:text-xs text-white/80 font-sans mt-0.5">
              {isEn ? "Position Application Form" : "Pozisyon Başvuru Formu"}
            </p>
          </div>

          {/* Body Content Container */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* SUCCESS SCREEN */}
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 overflow-y-auto p-6 text-center space-y-4 flex flex-col justify-center items-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9 stroke-[2]" />
                </div>
                <h3 className="text-xl font-bold font-headings text-[#0F1115]">
                  {isEn ? "Application Received!" : "Başvurunuz Alındı!"}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6773] max-w-md mx-auto leading-relaxed">
                  {isEn
                    ? `Your application for the ${titleText} position has been successfully submitted. We will review it shortly.`
                    : `${titleText} pozisyonu için başvurunuz başarıyla veritabanımıza kaydedilmiştir. Ekibimiz en kısa sürede sizinle iletişime geçecektir.`}
                </p>
                <div className="pt-3">
                  <button
                    onClick={onClose}
                    className="px-7 py-2.5 rounded-xl bg-[#0A5C3A] text-white font-bold text-xs hover:bg-[#084A2F] transition-all shadow-md"
                  >
                    {isEn ? "Close" : "Tamam"}
                  </button>
                </div>
              </motion.div>
            ) : !user ? (
              /* LOGGED OUT USER PROMPT */
              <div className="flex-1 overflow-y-auto p-6 text-center space-y-5 flex flex-col justify-center items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headings text-[#0F1115] mb-1.5">
                    {isEn ? "Account Required to Apply" : "Başvuru İçin Giriş Yapmalısınız"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6773] max-w-md mx-auto leading-relaxed font-sans">
                    {isEn
                      ? "To apply for this open position, please log in or create an account. You won't need to re-fill your information later."
                      : "Bu pozisyona başvurabilmek için giriş yapmalı veya hızlıca bir hesap oluşturmalısınız. Profil bilgileriniz başvurunuza otomatik aktarılacaktır."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  <Link
                    href={`${ROUTES.LOGIN}?redirect=/acik-pozisyonlar`}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0A5C3A] text-white font-bold text-xs hover:bg-[#084A2F] transition-all text-center"
                    onClick={onClose}
                  >
                    {isEn ? "Log In" : "Giriş Yap"}
                  </Link>
                  <Link
                    href={`${ROUTES.KAYIT}?redirect=/acik-pozisyonlar`}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#EEF0F2] text-[#0F1115] font-semibold text-xs hover:bg-white text-center"
                    onClick={onClose}
                  >
                    {isEn ? "Create Account" : "Hesap Oluştur"}
                  </Link>
                </div>
              </div>
            ) : alreadyApplied ? (
              /* ALREADY APPLIED NOTICE */
              <div className="flex-1 overflow-y-auto p-6 text-center space-y-4 flex flex-col justify-center items-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headings text-[#0F1115] mb-1.5">
                    {isEn ? "Already Applied" : "Bu Pozisyona Zaten Başvurdunuz"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6773] max-w-md mx-auto leading-relaxed">
                    {isEn
                      ? `You have already submitted an application for ${titleText}. Each account can apply to a position once.`
                      : `${titleText} pozisyonuna daha önce başvurunuz alınmıştır. Aynı kullanıcı aynı pozisyona tekrar başvuramaz.`}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0A5C3A] text-white font-bold text-xs hover:bg-[#084A2F] transition-all"
                >
                  {isEn ? "Close" : "Anladım"}
                </button>
              </div>
            ) : (
              /* APPLICATION FORM WITH PINNED FOOTER */
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Pre-filled Account Info */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#EEF0F2] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#0A5C3A] uppercase tracking-wider block">
                      {isEn ? "ACCOUNT INFORMATION (AUTO-FILLED)" : "HESAP BİLGİLERİNİZ (OTOMATİK DOLDURULDU)"}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-[#0F1115] font-semibold">
                        <User className="w-3.5 h-3.5 text-[#5F6773]" />
                        <span>{user.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0F1115] font-semibold">
                        <Mail className="w-3.5 h-3.5 text-[#5F6773]" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone, School, Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0F1115] mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#0A5C3A]" />
                        {isEn ? "Phone Number *" : "Telefon *"}:
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05xx xxx xx xx"
                        className="w-full h-9 px-3 rounded-xl border border-[#EEF0F2] bg-[#F8FAFC] text-xs font-medium text-[#0F1115] outline-none focus:border-[#0A5C3A] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F1115] mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-[#0A5C3A]" />
                        {isEn ? "School / University *" : "Okul / Üniversite *"}:
                      </label>
                      <input
                        type="text"
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder={isEn ? "e.g. Istanbul University" : "örn: İstanbul Üniversitesi"}
                        className="w-full h-9 px-3 rounded-xl border border-[#EEF0F2] bg-[#F8FAFC] text-xs font-medium text-[#0F1115] outline-none focus:border-[#0A5C3A] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F1115] mb-1 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#0A5C3A]" />
                        {isEn ? "Department *" : "Bölüm / Alan *"}:
                      </label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder={isEn ? "e.g. Computer Science" : "örn: Yazılım Mühendisliği"}
                        className="w-full h-9 px-3 rounded-xl border border-[#EEF0F2] bg-[#F8FAFC] text-xs font-medium text-[#0F1115] outline-none focus:border-[#0A5C3A] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* CV File Upload */}
                  <div>
                    <label className="block text-xs font-bold text-[#0F1115] mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#0A5C3A]" />
                      {isEn ? "CV File (PDF)" : "Özgeçmiş / CV (PDF)"}:
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3.5 py-2 rounded-xl border border-dashed border-[#0A5C3A]/40 bg-[#0A5C3A]/5 hover:bg-[#0A5C3A]/10 transition-colors text-xs font-bold text-[#0A5C3A] flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isEn ? "Upload CV" : "CV Yükle"}</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {cvFileName && (
                        <span className="text-xs text-[#5F6773] font-medium truncate max-w-xs">
                          {cvFileName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Why Apply */}
                  <div>
                    <label className="block text-xs font-bold text-[#0F1115] mb-1">
                      {isEn
                        ? "Why do you want to apply for this position? *"
                        : "Bu pozisyona neden başvuruyorsun? *"}:
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={whyApply}
                      onChange={(e) => setWhyApply(e.target.value)}
                      placeholder={
                        isEn
                          ? "Briefly describe your motivation..."
                          : "Motivasyonunu ve bu pozisyonda ne katmak istediğini kısaca açıkla..."
                      }
                      className="w-full p-2.5 rounded-xl border border-[#EEF0F2] bg-[#F8FAFC] text-xs font-medium text-[#0F1115] outline-none focus:border-[#0A5C3A] focus:bg-white resize-none"
                    />
                  </div>

                  {/* Experience / Skills */}
                  <div>
                    <label className="block text-xs font-bold text-[#0F1115] mb-1">
                      {isEn ? "Relevant Experience / Skills:" : "İlgili Deneyim & Yeteneklerin:"}
                    </label>
                    <textarea
                      rows={2}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder={
                        isEn
                          ? "Projects, tools, software, or prior volunteer work..."
                          : "Kullandığın araçlar, aldığın sorumluluklar veya geçmiş çalışmaların..."
                      }
                      className="w-full p-2.5 rounded-xl border border-[#EEF0F2] bg-[#F8FAFC] text-xs font-medium text-[#0F1115] outline-none focus:border-[#0A5C3A] focus:bg-white resize-none"
                    />
                  </div>

                  {/* KVKK Consent */}
                  <div className="flex items-start gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="kvkkConsent"
                      checked={kvkkConsent}
                      onChange={(e) => setKvkkConsent(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-[#0A5C3A] focus:ring-[#0A5C3A]"
                    />
                    <label htmlFor="kvkkConsent" className="text-[11px] text-[#5F6773] font-medium leading-tight">
                      {isEn
                        ? "I approve the processing of my personal data for position evaluation under KVKK."
                        : "Kişisel verilerimin pozisyon değerlendirmesi amacıyla işlenmesini kabul ediyorum."}
                    </label>
                  </div>
                </div>

                {/* PINNED ACTION FOOTER */}
                <div className="shrink-0 bg-white border-t border-[#EEF0F2] px-4 sm:px-5 py-3 flex items-center justify-end gap-3 z-10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-[#EEF0F2] text-[#5F6773] font-semibold text-xs hover:bg-[#F8FAFC] transition-colors"
                  >
                    {isEn ? "Cancel" : "İptal"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl bg-[#0A5C3A] text-white font-bold text-xs hover:bg-[#084A2F] transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <span>{isEn ? "Submitting..." : "Gönderiliyor..."}</span>
                    ) : (
                      <>
                        <span>{isEn ? "Submit Application" : "Başvuruyu Tamamla"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
