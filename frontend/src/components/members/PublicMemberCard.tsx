"use client";

import React, { useMemo } from "react";
import { PublicMember, getInitials } from "../../data/members";

export interface PublicMemberCardProps {
  member: PublicMember;
  activeFilter?: string;
  variant?: "featured" | "compact";
  index?: number;
  onSelect: (member: PublicMember) => void;
}

export function PublicMemberCard({
  member,
  activeFilter,
  variant = "compact",
  index = 0,
  onSelect,
}: PublicMemberCardProps) {
  const initials = useMemo(() => getInitials(member.name), [member.name]);

  // Compute active role and team tag text based on current context/filter
  const { roleText, teamTagText } = useMemo(() => {
    if (member.isPresident) {
      return {
        roleText: "Topluluk Eş Başkanı",
        teamTagText: "TOPLULUK EŞ BAŞKANLARI",
      };
    }

    if (activeFilter && activeFilter !== "Topluluk Eş Başkanları") {
      const matched = member.memberships.find((m) =>
        m.team.toLowerCase().includes(activeFilter.toLowerCase())
      );
      if (matched) {
        return {
          roleText: matched.role,
          teamTagText: matched.team.toUpperCase(),
        };
      }
    }

    const primaryMembership = member.memberships[0];
    return {
      roleText: member.primaryRole,
      teamTagText: primaryMembership ? primaryMembership.team.toUpperCase() : member.primaryTeam.toUpperCase(),
    };
  }, [member, activeFilter]);

  // FEATURED CARD (For Topluluk Eş Başkanları as shown in screenshot)
  if (variant === "featured" || member.isPresident) {
    return (
      <div
        onClick={() => onSelect(member)}
        className="group relative flex items-center gap-4 sm:gap-6 bg-white border border-[#EEF0F2] rounded-[24px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(10,92,58,0.12)] hover:border-[#0A5C3A]/40 transition-all duration-300 cursor-pointer select-none overflow-hidden min-w-0 w-full text-left"
      >
        {/* DECORATIVE VECTOR GRAPHICS (LIKE SCREENSHOT) */}
        {index === 0 ? (
          <div className="absolute top-3 right-4 text-[#0A5C3A]/30 group-hover:text-[#0A5C3A]/60 transition-colors pointer-events-none">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
              <path d="M20 6V34M6 20H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          <div className="absolute top-3 right-4 text-[#0A5C3A]/30 group-hover:text-[#0A5C3A]/60 transition-colors pointer-events-none">
            <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
              <path d="M20 4L36 20L20 36L4 20Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* LARGE AVATAR CIRCLE */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#07452C] text-white flex items-center justify-center font-headings font-black text-2xl sm:text-3xl tracking-widest border-4 border-white shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
          {initials}
        </div>

        {/* MEMBER DETAILS */}
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-base sm:text-xl font-extrabold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors leading-tight truncate">
            {member.name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-[#5F6773] font-sans truncate">
            {roleText}
          </p>
          <p className="text-[10px] sm:text-xs font-black text-[#0A5C3A] uppercase tracking-wider font-sans pt-0.5 truncate">
            {teamTagText}
          </p>
        </div>
      </div>
    );
  }

  // COMPACT HORIZONTAL CARD (Matching exact screenshot for Working Group Members)
  return (
    <div
      onClick={() => onSelect(member)}
      className="group relative flex items-center gap-3.5 bg-white border border-[#EEF0F2] rounded-2xl p-3.5 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(10,92,58,0.08)] hover:border-[#0A5C3A]/30 transition-all duration-300 cursor-pointer select-none min-w-0 w-full text-left"
    >
      {/* SMALLER CIRCULAR INITIALS AVATAR */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#07452C] text-white flex items-center justify-center font-headings font-bold text-xs sm:text-sm tracking-wider border-2 border-white shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
        {initials}
      </div>

      {/* MEMBER NAME, ROLE & TEAM TAG */}
      <div className="space-y-0.5 min-w-0 flex-1 overflow-hidden">
        <h4 className="text-sm sm:text-base font-bold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors leading-tight truncate">
          {member.name}
        </h4>
        <p className="text-xs font-medium text-[#5F6773] font-sans truncate">
          {roleText}
        </p>
        <p className="text-[10px] font-extrabold text-[#0A5C3A] uppercase tracking-wider font-sans truncate">
          {teamTagText}
        </p>
      </div>
    </div>
  );
}
