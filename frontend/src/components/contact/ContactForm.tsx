"use client";

import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  kvkk?: string;
}

const DEFAULT_GOOGLE_FORM_CONTACT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_CONTACT_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSeIkmdWvNoqqmnVKMHOB6uxF6UVxy__CGHR95yctgvAnS3x5Q/viewform";

// Real Google Form Entry IDs extracted directly from Google Form HTML (FB_PUBLIC_LOAD_DATA_)
const GOOGLE_FORM_ENTRY_IDS = {
  name: "entry.1692400855",    // Ad Soyad
  email: "entry.132812769",    // E-posta Adresi
  subject: "entry.1314719314", // Konu
  message: "entry.1907423653", // Mesaj
} as const;

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Genel Bilgi",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const [isKvkkAccepted, setIsKvkkAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Field validation functions
  const isNameValid = formData.name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isSubjectValid = formData.subject.trim().length > 0;
  const isMessageValid = formData.message.trim().length > 0;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ad Soyad alanı zorunludur.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-posta alanı zorunludur.";
    } else if (!isEmailValid) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Konu seçimi zorunludur.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Mesaj alanı zorunludur.";
    }

    if (!isKvkkAccepted) {
      newErrors.kvkk = "Devam etmek için kişisel verilerin işlenmesini onaylamalısınız.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build formResponse URL from base viewform URL
      const formResponseUrl = DEFAULT_GOOGLE_FORM_CONTACT_URL.replace(
        /\/viewform.*$/,
        "/formResponse"
      );

      const params = new URLSearchParams();
      params.append(GOOGLE_FORM_ENTRY_IDS.name, formData.name.trim());
      params.append(GOOGLE_FORM_ENTRY_IDS.email, formData.email.trim());
      params.append(GOOGLE_FORM_ENTRY_IDS.subject, formData.subject.trim());
      params.append(GOOGLE_FORM_ENTRY_IDS.message, formData.message.trim());
      params.append("fvv", "1");
      params.append("pageHistory", "0");

      // 1. Submit via fetch with mode 'no-cors'
      await fetch(formResponseUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      // 2. Submit via hidden iframe form as secondary fail-safe
      if (typeof document !== "undefined") {
        const hiddenForm = document.createElement("form");
        hiddenForm.action = formResponseUrl;
        hiddenForm.method = "POST";
        hiddenForm.target = "gform_hidden_iframe";

        const fields = [
          { name: GOOGLE_FORM_ENTRY_IDS.name, value: formData.name.trim() },
          { name: GOOGLE_FORM_ENTRY_IDS.email, value: formData.email.trim() },
          { name: GOOGLE_FORM_ENTRY_IDS.subject, value: formData.subject.trim() },
          { name: GOOGLE_FORM_ENTRY_IDS.message, value: formData.message.trim() },
          { name: "fvv", value: "1" },
          { name: "pageHistory", value: "0" },
        ];

        fields.forEach((field) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = field.name;
          input.value = field.value;
          hiddenForm.appendChild(input);
        });

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
        document.body.removeChild(hiddenForm);
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "Genel Bilgi",
        message: "",
      });
      setIsKvkkAccepted(false);
      setTouched({
        name: false,
        email: false,
        subject: false,
        message: false,
      });
      setErrors({});
    } catch (err) {
      console.error("Form gönderim hatası:", err);
      setIsSubmitting(false);
      setSubmitError(
        "Mesajınız gönderilirken bir sorun oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyiniz."
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on user edit
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <>
      <iframe
        id="gform_hidden_iframe"
        name="gform_hidden_iframe"
        style={{ display: "none" }}
        aria-hidden="true"
      />

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 select-none" noValidate>
        {/* Toast / Alert Feedback Banner (Success Message) */}
        {submitSuccess && (
          <div
            className="w-full p-4 rounded-[12px] bg-[#0A5C3A]/8 border border-[#0A5C3A]/25 flex items-start gap-3 text-[#0A5C3A] text-sm font-medium animate-in fade-in duration-200 shadow-sm"
            role="alert"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 stroke-[2]" />
            <div>
              <p className="font-semibold text-base">Mesajınız başarıyla iletildi.</p>
              <p className="text-xs text-[#0A5C3A]/90 mt-0.5">
                İlettiğiniz mesaj ekibimize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          </div>
        )}

        {/* Toast / Alert Feedback Banner (Error Message) */}
        {submitError && (
          <div
            className="w-full p-4 rounded-[12px] bg-[#DC2626]/8 border border-[#DC2626]/25 flex items-start gap-3 text-[#DC2626] text-sm font-medium animate-in fade-in duration-200 shadow-sm"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 stroke-[2]" />
            <div>
              <p className="font-semibold text-base">Gönderim Başarısız</p>
              <p className="text-xs text-[#DC2626]/90 mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        {/* Ad Soyad */}
        <Input
          label="Ad Soyad"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur("name")}
          placeholder="Adınız ve soyadınız"
          required
          errorText={errors.name}
          isValid={touched.name && isNameValid}
          disabled={isSubmitting}
        />

        {/* E-posta */}
        <Input
          label="E-posta"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          placeholder="eposta@ornek.com"
          required
          errorText={errors.email}
          isValid={touched.email && isEmailValid}
          disabled={isSubmitting}
        />

        {/* Konu (Özel Tasarlanmış Dropdown/Select) */}
        <div className="flex flex-col w-full text-left">
          <label
            htmlFor="contact-subject-select"
            className="text-[15px] font-medium text-[#0F1115] mb-2 inline-flex items-center gap-1 select-none"
          >
            Konu
            <span className="text-[#DC2626]" aria-hidden="true">
              *
            </span>
            <span className="text-xs text-[#9FA6B2] font-normal font-sans ml-0.5">
              (zorunlu)
            </span>
          </label>

          <div className="relative w-full">
            <select
              id="contact-subject-select"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={() => handleBlur("subject")}
              disabled={isSubmitting}
              aria-invalid={!!errors.subject}
              className={`w-full h-10 text-base bg-white text-[#0F1115] rounded-[8px] border pl-3.5 pr-10 appearance-none outline-none shadow-sm transition-all duration-150 ease-in-out font-sans cursor-pointer ${
                isSubmitting
                  ? "bg-[#F8F9FA] text-[#9FA6B2] border-[#EEF0F2] cursor-not-allowed"
                  : errors.subject
                  ? "border-[#DC2626] bg-[#DC2626]/[0.02] focus:border-[#DC2626] focus:ring-[4px] focus:ring-[#DC2626]/12"
                  : touched.subject && isSubjectValid
                  ? "border-[#0A5C3A] focus:border-[#0A5C3A] focus:ring-[4px] focus:ring-[#0A5C3A]/12"
                  : "border-[#EEF0F2] hover:border-[#D1D5DB] focus:border-[#0A5C3A] focus:ring-[4px] focus:ring-[#0A5C3A]/12"
              }`}
            >
              <option value="Genel Bilgi">Genel Bilgi</option>
              <option value="Topluluk Hakkında">Topluluk Hakkında</option>
              <option value="Etkinlikler">Etkinlikler</option>
              <option value="İş Birliği">İş Birliği</option>
              <option value="Sponsorluk">Sponsorluk</option>
              <option value="Teknik Destek">Teknik Destek</option>
              <option value="Öneri / Geri Bildirim">Öneri / Geri Bildirim</option>
              <option value="Diğer">Diğer</option>
            </select>

            {/* Custom Arrow Icon - Thin Elegant Stroke */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              {errors.subject ? (
                <AlertCircle className="w-4 h-4 text-[#DC2626]" aria-hidden="true" />
              ) : touched.subject && isSubjectValid ? (
                <CheckCircle2 className="w-4 h-4 text-[#0A5C3A]" aria-hidden="true" />
              ) : null}
              <ChevronDown className="w-4 h-4 stroke-[1.5] text-[#5F6773]" aria-hidden="true" />
            </div>
          </div>

          {errors.subject && (
            <p className="text-xs text-[#DC2626] mt-1.5 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2px]" aria-hidden="true" />
              {errors.subject}
            </p>
          )}
        </div>

        {/* Mesaj */}
        <div className="flex flex-col w-full text-left">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="contact-message-input"
              className="text-[15px] font-medium text-[#0F1115] inline-flex items-center gap-1 select-none"
            >
              Mesaj
              <span className="text-[#DC2626]" aria-hidden="true">
                *
              </span>
              <span className="text-xs text-[#9FA6B2] font-normal font-sans ml-0.5">
                (zorunlu)
              </span>
            </label>
            {touched.message && isMessageValid && !errors.message && (
              <span className="text-xs text-[#0A5C3A] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Geçerli
              </span>
            )}
          </div>
          <textarea
            id="contact-message-input"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            onBlur={() => handleBlur("message")}
            disabled={isSubmitting}
            placeholder="Mesajınızı buraya yazın..."
            aria-invalid={!!errors.message}
            className={`w-full text-base bg-white text-[#0F1115] rounded-[8px] border p-3.5 outline-none shadow-sm transition-all duration-150 ease-in-out font-sans ${
              isSubmitting
                ? "bg-[#F8F9FA] text-[#9FA6B2] border-[#EEF0F2] cursor-not-allowed"
                : errors.message
                ? "border-[#DC2626] bg-[#DC2626]/[0.02] focus:border-[#DC2626] focus:ring-[4px] focus:ring-[#DC2626]/12"
                : touched.message && isMessageValid
                ? "border-[#0A5C3A] focus:border-[#0A5C3A] focus:ring-[4px] focus:ring-[#0A5C3A]/12"
                : "border-[#EEF0F2] placeholder-[#9FA6B2] hover:border-[#D1D5DB] focus:border-[#0A5C3A] focus:ring-[4px] focus:ring-[#0A5C3A]/12"
            }`}
          />
          {errors.message && (
            <p className="text-xs text-[#DC2626] mt-1.5 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2px]" aria-hidden="true" />
              {errors.message}
            </p>
          )}
        </div>

        {/* KVKK / Gizlilik Onay Kutusu */}
        <div className="flex flex-col text-left">
          <label className="flex items-start gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              name="kvkk"
              checked={isKvkkAccepted}
              onChange={(e) => {
                setIsKvkkAccepted(e.target.checked);
                if (errors.kvkk) {
                  setErrors((prev) => ({ ...prev, kvkk: undefined }));
                }
              }}
              disabled={isSubmitting}
              className="mt-0.5 w-[18px] h-[18px] rounded-[5px] border-[#EEF0F2] text-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/12 cursor-pointer accent-[#0A5C3A] shrink-0 transition-all"
            />
            <span className="text-xs text-[#5F6773] font-medium leading-relaxed font-sans pt-0.5">
              Kişisel verilerimin işlenmesini kabul ediyorum ({" "}
              <a
                href="#kvkk"
                onClick={(e) => {
                  e.preventDefault();
                  alert("KVKK Aydınlatma Metni: Gönderdiğiniz kişisel veriler yalnızca iletişim talebinizi yanıtlamak amacıyla 6698 sayılı KVKK kapsamında işlenmektedir.");
                }}
                className="text-[#0A5C3A] underline underline-offset-2 font-semibold hover:text-[#0D7449]"
              >
                KVKK Aydınlatma Metni
              </a>
              )
            </span>
          </label>

          {errors.kvkk && (
            <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2px]" />
              {errors.kvkk}
            </p>
          )}
        </div>

        {/* Submit Button (Disabled unless KVKK accepted) */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isKvkkAccepted || isSubmitting}
          isLoading={isSubmitting}
          className="mt-1 text-base font-semibold"
        >
          Mesaj Gönder
        </Button>
      </form>
    </>
  );
};

ContactForm.displayName = "ContactForm";
