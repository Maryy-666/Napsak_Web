"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, Layers, UserCheck, ShieldCheck } from "lucide-react";
import { PublicMember } from "../../data/members";
import { ImageWithFallback } from "../common/ImageWithFallback";

export interface PublicMemberModalProps {
  member: PublicMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PublicMemberModal({ member, isOpen, onClose }: PublicMemberModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Calculate exact scrollbar width to prevent body layout shift when locking scroll
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Group memberships by team name for structured multi-role display
  const groupedMemberships = useMemo(() => {
    if (!member) return [];
    return member.memberships.map((m) => ({
      team: m.team,
      roles: [m.role],
    }));
  }, [member]);

  if (!isOpen || !member || !mounted) return null;

  const modalJSX = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp overflow-hidden border border-[#EEF0F2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#5F6773] hover:text-[#0F1115] hover:bg-slate-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER: AVATAR + BASIC INFO */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          {member.avatar ? (
            <ImageWithFallback
              src={member.avatar}
              alt={member.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[#0A5C3A]/20 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0A5C3A] to-[#07452C] text-white font-extrabold text-2xl flex items-center justify-center border-2 border-white shadow-md">
              {member.initials}
            </div>
          )}

          <div>
            <h3 className="text-xl font-extrabold text-[#0F1115] flex items-center justify-center gap-2">
              {member.name}
              {member.isPresident && (
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              )}
            </h3>
            <p className="text-sm font-semibold text-[#0A5C3A] mt-0.5">
              {member.primaryRole}
            </p>
          </div>
        </div>

        {/* BODY: GROUPED MEMBERSHIPS */}
        <div className="space-y-3 text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F1115] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#0A5C3A]" /> Ekip & Kurul Üyelikleri
          </span>

          <div className="space-y-3">
            {groupedMemberships.map(({ team, roles }, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#EEF0F2] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#0F1115]">
                    {team}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                </div>
                <div className="space-y-1 pl-2 border-l-2 border-[#0A5C3A]/40">
                  {roles.map((role, rIdx) => (
                    <p key={rIdx} className="text-xs font-semibold text-[#0A5C3A]">
                      {role}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER VERIFICATION BADGE */}
        <div className="pt-4 border-t border-[#EEF0F2] flex items-center justify-between text-xs text-[#5F6773] font-medium">
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#0A5C3A]" /> Doğrulanmış Ekip Üyesi
          </span>
          <span>N'apsak? Gençlik Topluluğu</span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
