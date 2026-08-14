"use client";

import React, { useMemo } from "react";
import {
  Sparkles,
  Sprout,
  Globe,
  Palette,
  Brush,
  Music,
  Clapperboard,
  Camera,
  MessageSquare,
  Share2,
  Megaphone,
  Radio,
  Network,
  Calendar,
  Briefcase,
  Target,
  Compass,
  GitBranch,
  Layers,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";
import { PublicMember, MemberTeamRole } from "../../data/members";

export interface PublicMemberCardProps {
  member: PublicMember;
  activeFilter?: string;
  index?: number;
  onSelect: (member: PublicMember) => void;
}

// 1. Geometric Accent vector shape floating in corner
function GeometricAccentShape({ variant = 0, colorClass = "text-[#0A5C3A]" }: { variant?: number; colorClass?: string }) {
  const shapes = [
    <svg key="0" className={`w-10 h-10 ${colorClass}`} viewBox="0 0 40 40" fill="none">
      <path d="M20 5V35M5 20H35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>,
    <svg key="1" className={`w-10 h-10 ${colorClass}`} viewBox="0 0 40 40" fill="none">
      <path d="M20 4L36 20L20 36L4 20Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>,
    <svg key="2" className={`w-10 h-10 ${colorClass}`} viewBox="0 0 40 40" fill="none">
      <path d="M8 32V8H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    <svg key="3" className={`w-10 h-10 ${colorClass}`} viewBox="0 0 40 40" fill="none">
      <path d="M20 6L33 13.5V28.5L20 36L7 28.5V13.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>,
  ];

  return shapes[variant % shapes.length];
}

// 2. Resolved team motif and theme colors
interface TeamTheme {
  icon: LucideIcon;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badgeTag: string;
}

function resolveMemberTheme(member: PublicMember, activeFilter?: string, index: number = 0): TeamTheme {
  const roleLower = member.primaryRole.toLowerCase();

  // A. Topluluk Başkanları (Liderlik)
  if (member.isPresident || activeFilter === "Topluluk Başkanları") {
    const leaderIcons = [Sprout, Sparkles, Globe, ShieldCheck];
    return {
      icon: leaderIcons[index % leaderIcons.length],
      accentBg: "from-[#0A5C3A]/8 to-emerald-500/5",
      accentBorder: "border-[#0A5C3A]/30",
      accentText: "text-[#0A5C3A]",
      badgeTag: "Liderlik",
    };
  }

  // Determine target team scope
  let teamScope = member.primaryTeam;
  if (activeFilter && activeFilter !== "Tümü" && activeFilter !== "Topluluk Başkanları") {
    teamScope = activeFilter;
  }

  const teamScopeLower = teamScope.toLowerCase();

  // B. Sanat Çalışma Grubu
  if (teamScopeLower.includes("sanat")) {
    const artIcons = [Palette, Brush, Music, Clapperboard, Camera];
    // Tiyatro rolu kontrolü
    let chosenIcon = artIcons[index % artIcons.length];
    if (roleLower.includes("tiyatro")) {
      chosenIcon = Clapperboard;
    }
    return {
      icon: chosenIcon,
      accentBg: "from-[#0A5C3A]/6 via-amber-500/5 to-transparent",
      accentBorder: "border-amber-500/20",
      accentText: "text-[#0A5C3A]",
      badgeTag: "Sanat",
    };
  }

  // C. Kurumsal İletişim
  if (teamScopeLower.includes("kurumsal") || teamScopeLower.includes("iletişim")) {
    const commIcons = [MessageSquare, Share2, Megaphone, Radio, Network];
    return {
      icon: commIcons[index % commIcons.length],
      accentBg: "from-[#0A5C3A]/6 via-teal-500/5 to-transparent",
      accentBorder: "border-teal-500/20",
      accentText: "text-[#0A5C3A]",
      badgeTag: "Kurumsal İletişim",
    };
  }

  // D. Programlar Çalışma Grubu
  if (teamScopeLower.includes("program")) {
    const progIcons = [Calendar, Briefcase, Target, Compass, GitBranch];
    return {
      icon: progIcons[index % progIcons.length],
      accentBg: "from-[#0A5C3A]/6 via-indigo-500/5 to-transparent",
      accentBorder: "border-indigo-500/20",
      accentText: "text-[#0A5C3A]",
      badgeTag: "Programlar",
    };
  }

  // E. Varsayılan / Çoklu Ekipler
  return {
    icon: Layers,
    accentBg: "from-[#0A5C3A]/6 to-transparent",
    accentBorder: "border-[#EEF0F2]",
    accentText: "text-[#0A5C3A]",
    badgeTag: "Topluluk",
  };
}

export function PublicMemberCard({ member, activeFilter, index = 0, onSelect }: PublicMemberCardProps) {
  // Dynamically resolve team theme
  const theme = useMemo(
    () => resolveMemberTheme(member, activeFilter, index),
    [member, activeFilter, index]
  );

  const ThemeIcon = theme.icon;

  // Dynamically compute active role and unique teams text
  const { roleText, teamsText } = useMemo(() => {
    if (member.isPresident) {
      return {
        roleText: "Topluluk Eş Başkanı",
        teamsText: "Topluluk Başkanlığı",
      };
    }

    const uniqueTeams = Array.from(
      new Set(member.memberships.map((m: MemberTeamRole) => m.team.replace(" Çalışma Grubu", "")))
    ).join(" • ");

    if (activeFilter && activeFilter !== "Tümü" && activeFilter !== "Topluluk Başkanları") {
      const matched = member.memberships.find((m: MemberTeamRole) =>
        m.team.toLowerCase().includes(activeFilter.toLowerCase())
      );
      if (matched) {
        return {
          roleText: matched.role,
          teamsText: uniqueTeams,
        };
      }
    }

    return {
      roleText: member.primaryRole,
      teamsText: uniqueTeams,
    };
  }, [member, activeFilter]);

  return (
    <div
      onClick={() => onSelect(member)}
      className="group relative flex flex-col cursor-pointer select-none text-left"
    >
      {/* PORTRAIT CONTAINER WITH GEOMETRIC & DECORATIVE BACKDROP MOTIFS */}
      <div className="relative w-full">
        {/* GEOMETRIC VECTOR ACCENT FLOATING BEHIND PORTRAIT */}
        <div className="absolute -top-3 -right-3 z-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-6 opacity-75 group-hover:opacity-100 pointer-events-none">
          <GeometricAccentShape variant={index} colorClass={theme.accentText} />
        </div>

        {/* HEADSHOT / AVATAR FRAME */}
        <div
          className={`relative z-10 w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-gradient-to-b ${theme.accentBg} border ${theme.accentBorder} transition-all duration-500 flex items-center justify-center p-6 shadow-xs group-hover:shadow-[0_20px_40px_rgba(10,92,58,0.14)]`}
        >
          {/* DECORATIVE LINE-ART TEAM ICON BACKGROUND MOTIF */}
          <div className="absolute -bottom-3 -right-3 z-0 opacity-15 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <ThemeIcon className={`w-24 h-24 stroke-[1.5] ${theme.accentText}`} />
          </div>

          {/* EDITORIAL INITIALS PORTRAIT */}
          <div
            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full text-white flex items-center justify-center font-headings font-black text-2xl sm:text-3xl tracking-widest border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500 ${
              member.isPresident
                ? "bg-gradient-to-br from-[#0A5C3A] via-[#084A2F] to-[#0A5C3A] ring-2 ring-[#0A5C3A]/30"
                : "bg-gradient-to-br from-[#0A5C3A] via-[#084A2F] to-[#128C59]"
            }`}
          >
            {member.initials}
          </div>

          {/* LEADERSHIP SUBTLE BADGE IF PRESIDENT */}
          {member.isPresident && (
            <div className="absolute top-3 left-3 bg-[#0A5C3A] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs z-10">
              Liderlik
            </div>
          )}

          {/* BOTTOM ACCENT GREEN GLOW LINE */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0A5C3A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        </div>
      </div>

      {/* MEMBER INFO BELOW PORTRAIT */}
      <div className="pt-4 space-y-1">
        {/* MEMBER NAME */}
        <h3 className="text-base sm:text-lg font-extrabold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors leading-tight">
          {member.name}
        </h3>

        {/* ROLE */}
        <p className="text-xs sm:text-sm font-semibold text-[#5F6773] font-sans">
          {roleText}
        </p>

        {/* TEAMS SUMMARY */}
        <p className="text-[11px] font-extrabold text-[#0A5C3A] uppercase tracking-wider font-sans pt-0.5">
          {teamsText}
        </p>
      </div>
    </div>
  );
}
