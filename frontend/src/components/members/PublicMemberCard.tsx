"use client";

import React, { useMemo } from "react";
import { UserPlus } from "lucide-react";
import { PublicMember, getInitials } from "../../data/members";
import { ImageWithFallback } from "../common/ImageWithFallback";

export interface PublicMemberCardProps {
  member: PublicMember;
  activeFilter?: string;
  variant?: "featured" | "compact";
  index?: number;
  onSelect?: (member: PublicMember) => void;
}

export function PublicMemberCard({
  member,
  activeFilter,
  index = 0,
  onSelect,
}: PublicMemberCardProps) {
  const initials = useMemo(() => getInitials(member.name), [member.name]);

  // Compute active role and team tag text based on current context/filter
  const { roleText, teamTagText } = useMemo(() => {
    // If "Tümü" filter is selected or no filter specified, show simple name (sade ad ve soyad)
    if (!activeFilter || activeFilter === "Tümü") {
      return {
        roleText: "",
        teamTagText: "",
      };
    }

    if (activeFilter) {
      const matched = member.memberships?.find((m) =>
        m.team.toLowerCase().includes(activeFilter.toLowerCase())
      );
      if (matched) {
        let tag = matched.team.toUpperCase();
        if (matched.subRole) {
          const cleanTeamName = matched.team
            .replace(" Ekibi", "")
            .replace(" Çalışma Grubu", "")
            .replace(" Departmanı", "")
            .trim()
            .toUpperCase();
          tag = `${cleanTeamName} • ${matched.subRole.toUpperCase()}`;
        } else if (matched.isLeader) {
          tag = `${matched.team.toUpperCase()} • EKİP SORUMLUSU`;
        }
        return {
          roleText: matched.role,
          teamTagText: tag,
        };
      }
    }

    const primaryMembership = member.memberships?.[0];
    let tag = primaryMembership
      ? primaryMembership.team.toUpperCase()
      : (member.primaryTeam || "N'APSAK TOPLULUĞU").toUpperCase();

    if (primaryMembership?.subRole) {
      const cleanTeamName = primaryMembership.team
        .replace(" Ekibi", "")
        .replace(" Çalışma Grubu", "")
        .replace(" Departmanı", "")
        .trim()
        .toUpperCase();
      tag = `${cleanTeamName} • ${primaryMembership.subRole.toUpperCase()}`;
    } else if (primaryMembership?.isLeader) {
      tag = `${primaryMembership.team.toUpperCase()} • EKİP SORUMLUSU`;
    }

    const fullRole = primaryMembership?.role || member.primaryRole;

    return {
      roleText: fullRole,
      teamTagText: tag,
    };
  }, [member, activeFilter]);

  // UNIFORM NORMAL CARD (Identical appearance for all members)
  return (
    <div
      onClick={() => onSelect && onSelect(member)}
      className="group relative flex items-center gap-3.5 bg-white border border-[#EEF0F2] rounded-2xl p-3.5 sm:p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(10,92,58,0.12)] hover:border-[#0A5C3A] transition-all duration-300 cursor-pointer select-none min-w-0 w-full text-left"
    >
      {/* CIRCULAR INITIALS/IMAGE AVATAR */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#07452C] text-white flex items-center justify-center font-headings font-bold text-xs sm:text-sm tracking-wider border-2 border-white shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden relative">
        {member.avatar ? (
          <ImageWithFallback
            src={member.avatar}
            alt={member.name}
            fill
            className="object-cover"
            fallbackSrc=""
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* MEMBER NAME & OPTIONAL ROLE/TAG WHEN FILTERED */}
      <div className="space-y-0.5 min-w-0 flex-1 overflow-hidden">
        <h4 className="text-sm sm:text-base font-bold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors leading-tight truncate">
          {member.name}
        </h4>

        {roleText ? (
          <p className="text-xs font-semibold text-[#0A5C3A] font-sans truncate">
            {roleText}
          </p>
        ) : null}
        {teamTagText ? (
          <p className="text-[10px] font-extrabold text-[#5F6773] uppercase tracking-wider font-sans truncate">
            {teamTagText}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function PublicMemberPlaceholderCard() {
  return (
    <div className="relative flex items-center gap-3.5 rounded-2xl p-3.5 sm:p-4 bg-slate-50/60 border-2 border-dashed border-[#DDE7E1] hover:border-[#0A5C3A]/40 transition-all duration-300 select-none min-w-0 w-full text-left">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center border-2 border-white shadow-xs shrink-0">
        <UserPlus className="w-5 h-5 opacity-70" />
      </div>
      <div className="space-y-0.5 min-w-0 flex-1 overflow-hidden">
        <h4 className="text-sm sm:text-base font-bold font-headings text-slate-700 leading-tight truncate">
          Yönetim Kurulu Üyesi
        </h4>
        <p className="text-xs font-semibold text-[#0A5C3A]/80 font-sans truncate">
          Pozisyon Açık
        </p>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-sans truncate">
          YÖNETİM KURULU
        </p>
      </div>
    </div>
  );
}
