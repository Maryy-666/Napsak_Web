"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Globe,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import { PublicMember, getInitials } from "../../data/members";
import { Badge, Button, Card, PageContainer, Section } from "../ui";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { InnerPageBackground } from "../common/InnerPageBackground";
import { useLanguage } from "../../context/LanguageContext";
import { ROUTES } from "../../constants/routes";

interface MemberDetailContentProps {
  member: PublicMember;
}

export function MemberDetailContent({ member }: MemberDetailContentProps) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const initials = getInitials(member.name);

  const bioText = isEn
    ? member.bioEn || member.bio || "N'apsak? Gençlik Topluluğu bünyesinde değerli katkılar sunmaktadır."
    : member.bio || "N'apsak? Gençlik Topluluğu bünyesinde değerli katkılar sunmaktadır.";

  const educationText = isEn
    ? member.educationEn || member.education || (member.school ? `${member.school} ${member.department ? `- ${member.department}` : ""}` : null)
    : member.education || (member.school ? `${member.school} ${member.department ? `- ${member.department}` : ""}` : null);

  const expertiseText = isEn
    ? member.expertiseEn || member.expertise
    : member.expertise;

  const responsibilitiesText = isEn
    ? member.responsibilitiesEn || member.responsibilities
    : member.responsibilities;

  return (
    <InnerPageBackground className="min-h-screen flex flex-col">
      {/* -------------------------------------------------------------
          1. HEADER & HERO PROFILE SECTION
      ------------------------------------------------------------- */}
      <Section padding="lg" background="transparent" className="pt-10 pb-12 border-b border-[#EEF0F2] relative">
        <PageContainer className="max-w-5xl">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5F6773] mb-8 font-medium">
            <Link
              href="/"
              className="hover:text-[#0A5C3A] transition-colors flex items-center gap-1 cursor-pointer"
            >
              Ana Sayfa
            </Link>
            <span className="text-[#CDD1D5]">/</span>
            <Link
              href={ROUTES.EKIPLER}
              className="hover:text-[#0A5C3A] transition-colors cursor-pointer"
            >
              {isEn ? "Teams & Boards" : "Ekiplerimiz & Kurullar"}
            </Link>
            <span className="text-[#CDD1D5]">/</span>
            <span className="text-[#0F1115] font-semibold line-clamp-1">{member.name}</span>
          </div>

          {/* Member Profile Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[28px] border border-[#EEF0F2] p-6 sm:p-10 shadow-sm relative overflow-hidden"
          >
            {/* Ambient Brand Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#0A5C3A]/5 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
              {/* Avatar Image / Initials Badge */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[24px] bg-gradient-to-br from-[#0A5C3A] to-[#07452C] text-white flex items-center justify-center font-headings font-extrabold text-3xl sm:text-4xl tracking-wider border-4 border-white shadow-md shrink-0 relative overflow-hidden">
                {member.avatar ? (
                  <ImageWithFallback
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <Badge variant="brand" size="md" className="!bg-[#0A5C3A]/10 !text-[#0A5C3A] font-extrabold">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#0A5C3A]" />
                    {member.primaryTeam.toUpperCase()}
                  </Badge>

                  {member.isPresident && (
                    <span className="px-3 py-1 rounded-full bg-[#0A5C3A] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs">
                      Topluluk Başkanı
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-headings text-[#0F1115] tracking-tight leading-tight">
                  {member.name}
                </h1>

                <p className="text-base sm:text-lg font-bold text-[#0A5C3A] font-sans">
                  {member.primaryRole}
                </p>

                {(member.city || member.school) && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-[#5F6773] font-medium pt-1">
                    {member.city && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0A5C3A]" />
                        {member.city}
                      </span>
                    )}
                    {member.school && (
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-[#0A5C3A]" />
                        {member.school} {member.department ? `(${member.department})` : ""}
                      </span>
                    )}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex items-center justify-center md:justify-start gap-2.5 pt-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#EEF0F2] text-[#5F6773] hover:text-[#0A5C3A] hover:bg-[#EEF7F3] hover:border-[#0A5C3A]/30 transition-all flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A]"
                      aria-label={`${member.name} LinkedIn Profili`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#EEF0F2] text-[#5F6773] hover:text-[#0A5C3A] hover:bg-[#EEF7F3] hover:border-[#0A5C3A]/30 transition-all flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A]"
                      aria-label={`${member.name} Twitter / X Profili`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#EEF0F2] text-[#5F6773] hover:text-[#0A5C3A] hover:bg-[#EEF7F3] hover:border-[#0A5C3A]/30 transition-all flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A]"
                      aria-label={`${member.name} GitHub Profili`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                      </svg>
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#EEF0F2] text-[#5F6773] hover:text-[#0A5C3A] hover:bg-[#EEF7F3] hover:border-[#0A5C3A]/30 transition-all flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A]"
                      aria-label={`${member.name} Instagram Profili`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          2. DETAILED MEMBER INFO & RESPONSIBILITIES
      ------------------------------------------------------------- */}
      <Section padding="lg" background="transparent" className="py-10 sm:py-16">
        <PageContainer className="max-w-5xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-[24px] border border-[#EEF0F2] p-6 sm:p-8 shadow-xs space-y-4 text-left"
              >
                <div className="flex items-center gap-2.5 border-b border-[#EEF0F2] pb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h2 className="text-xl font-bold font-headings text-[#0F1115]">
                    {isEn ? "Biography & Overview" : "Hakkında & Biyografi"}
                  </h2>
                </div>

                <p className="text-sm sm:text-base font-sans text-[#5F6773] font-medium leading-relaxed">
                  {bioText}
                </p>
              </motion.div>

              {/* Responsibilities & Tasks Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-[24px] border border-[#EEF0F2] p-6 sm:p-8 shadow-xs space-y-4 text-left"
              >
                <div className="flex items-center gap-2.5 border-b border-[#EEF0F2] pb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h2 className="text-xl font-bold font-headings text-[#0F1115]">
                    {isEn ? "Community Roles & Tasks" : "Topluluk İçerisindeki Görevleri"}
                  </h2>
                </div>

                {responsibilitiesText ? (
                  <p className="text-sm sm:text-base font-sans text-[#5F6773] font-medium leading-relaxed">
                    {responsibilitiesText}
                  </p>
                ) : null}

                {/* Listed Team Memberships */}
                <div className="space-y-3 pt-2">
                  {member.memberships?.map((membership, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-[#EEF0F2] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-[#0F1115] font-headings">
                          {membership.team}
                        </div>
                        <div className="text-xs font-semibold text-[#0A5C3A] font-sans">
                          {membership.role} {membership.subRole ? `(${membership.subRole})` : ""}
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Details Area */}
            <div className="space-y-6">
              {/* Education Sidebar Box */}
              {educationText && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="bg-white rounded-[24px] border border-[#EEF0F2] p-6 shadow-xs space-y-3 text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A5C3A]">
                    <GraduationCap className="w-4 h-4" />
                    <span>{isEn ? "Education" : "Eğitim Bilgisi"}</span>
                  </div>
                  <p className="text-sm text-[#0F1115] font-bold font-sans">
                    {educationText}
                  </p>
                </motion.div>
              )}

              {/* Expertise Sidebar Box */}
              {expertiseText && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="bg-white rounded-[24px] border border-[#EEF0F2] p-6 shadow-xs space-y-3 text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A5C3A]">
                    <Award className="w-4 h-4" />
                    <span>{isEn ? "Expertise Areas" : "Uzmanlık Alanları"}</span>
                  </div>
                  <p className="text-sm text-[#0F1115] font-bold font-sans">
                    {expertiseText}
                  </p>
                </motion.div>
              )}

              {/* Return Button */}
              <div className="pt-2">
                <Button
                  href={ROUTES.UYELER}
                  variant="outline"
                  size="md"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  className="w-full justify-center !border-[#EEF0F2] font-bold text-xs sm:text-sm rounded-xl py-3"
                >
                  {isEn ? "Back to All Members" : "Tüm Ekibimizi İncele"}
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </InnerPageBackground>
  );
}
