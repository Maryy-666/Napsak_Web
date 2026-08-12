"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { Button, PageContainer, Section } from "../ui";
import { ROUTES } from "../../constants/routes";

export default function RegisterContent() {
  const router = useRouter();
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 pl-10 text-sm font-normal text-[#0F1115] outline-none transition placeholder:text-[#9FA6B2] focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10";

  useEffect(() => {
    setReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        toast.error(data.error || "Kayıt oluşturulamadı.");
        return;
      }

      toast.success("Hesabın oluşturuldu. Şimdi giriş yapabilirsin.");

      router.replace(`${ROUTES.LOGIN}${returnTo && returnTo.startsWith("/") ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`);
    } catch (error: any) {
      toast.error(error.message || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section padding="none" background="white" className="relative min-h-[calc(100vh-4rem)] overflow-hidden pt-24 pb-16">
      <div className="absolute top-1/2 left-1/2 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(10,92,58,0.04)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(10,92,58,0.14)_2px,transparent_2px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-noise opacity-[0.015] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-0 left-0 z-0 h-[500px] w-[500px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-[rgba(10,92,58,0.28)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 z-0 h-[550px] w-[550px] translate-x-1/4 translate-y-1/4 rounded-full bg-[rgba(10,92,58,0.32)] blur-[130px] pointer-events-none" />

      <PageContainer className="relative z-10 max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-2xl space-y-5 text-center lg:mx-0 lg:text-left"
          >
            <span className="inline-flex rounded-full border border-[#C9D8D0] bg-white/80 px-3 py-1 text-xs font-semibold text-[#0A5C3A] shadow-sm">
              Aramıza katıl
            </span>
            <h1 className="font-headings text-3xl font-bold tracking-tight text-[#0F1115] sm:text-4xl lg:text-[44px] lg:leading-[1.08]">
              Seni de aramızda görmek isteriz
            </h1>
            <p className="mx-auto max-w-xl text-[15px] font-normal leading-7 text-[#5F6773] lg:mx-0">
              Fikirlerini paylaşabileceğin, yeni insanlarla tanışabileceğin ve ilgini çeken etkinliklere dahil olabileceğin bir alan seni bekliyor.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {["Kendini tanıt", "Etkinlikleri yakala"].map((item) => (
                <div key={item} className="inline-flex items-center rounded-full border border-[#C9D8D0] bg-white/75 px-3.5 py-1.5 text-xs font-semibold text-[#0A5C3A] shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            onSubmit={handleSubmit}
            className="rounded-[26px] border border-white/70 bg-white/86 p-7 shadow-[0_24px_64px_rgba(15,17,21,0.07)] backdrop-blur-[20px] sm:p-8"
          >
            <div className="mb-7">
              <h2 className="font-headings text-[26px] font-bold tracking-tight text-[#0F1115]">Kayıt Ol</h2>
              <p className="mt-1.5 text-[13px] font-normal leading-6 text-[#5F6773]">Hesabını oluştur, sonra giriş yaparak profilini tamamla.</p>
            </div>

            <div className="space-y-[18px]">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#0F1115]">Ad Soyad</span>
                <span className="relative block">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6773]" />
                  <input
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder="Ad Soyad"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#0F1115]">E-posta</span>
                <span className="relative block">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6773]" />
                  <input
                    className={inputClass}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="ornek@domain.com"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#0F1115]">Şifre</span>
                <span className="relative block">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6773]" />
                  <input
                    className={inputClass}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="En az 8 karakter"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#0F1115]">Şifre Tekrar</span>
                <span className="relative block">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6773]" />
                  <input
                    className={inputClass}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Şifreni tekrar gir"
                  />
                </span>
              </label>
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-7 h-12 rounded-xl font-semibold" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Hesap Oluştur
            </Button>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[#5F6773]">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-medium">Güvenli bağlantı ile korunmaktadır.</span>
            </div>

            <p className="mt-5 text-center text-sm font-normal text-[#5F6773]">
              Hesabın var mı?{" "}
              <a className="font-semibold text-[#0A5C3A]" href={`${ROUTES.LOGIN}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}>
                Giriş yap
              </a>
            </p>
          </motion.form>
        </div>
      </PageContainer>
    </Section>
  );
}
