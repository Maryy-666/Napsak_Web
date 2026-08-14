"use client";

import React, { useEffect } from "react";
import { X, Sparkles, Layers, ShieldCheck, UserCheck } from "lucide-react";
import { PublicMember } from "../../data/members";

export interface PublicMemberModalProps {
  member: PublicMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PublicMemberModal({ member, isOpen, onClose }: PublicMemberModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none font-sans">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-md bg-white rounded-[28px] border border-[#EEF0F2] shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh] transition-all">
        
        {/* EXECUTIVE INTEGRATED HEADER BANNER */}
        <div className="relative bg-gradient-to-br from-[#0A5C3A] via-[#084A2F] to-[#128C59] p-6 text-white space-y-4 shrink-0 text-left">
          {/* TOP BAR WITH CLOSE BUTTON */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold bg-black/25 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>N'apsak? Üye Detayı</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AVATAR & NAME INTEGRATED ROW */}
          <div className="flex items-center gap-4 pt-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-[#0A5C3A] flex items-center justify-center font-headings font-black text-2xl sm:text-3xl border-2 border-white/30 shadow-lg shrink-0">
              {member.initials}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200 bg-white/15 px-2.5 py-0.5 rounded-md inline-block">
                {member.isPresident ? "Topluluk Eş Başkanı" : "Topluluk Üyesi"}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold font-headings text-white leading-tight">
                {member.name}
              </h2>
            </div>
          </div>
        </div>

        {/* PROFILE BODY */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* WORKING GROUPS & ROLES */}
          <div className="space-y-3 text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F1115] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#0A5C3A]" /> Çalışma Alanları ve Görevleri
            </span>

            <div className="space-y-2.5">
              {member.memberships.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#EEF0F2] flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#0F1115]">
                      {m.team}
                    </h4>
                    <p className="text-xs font-semibold text-[#0A5C3A] mt-0.5">
                      {m.role}
                    </p>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER VERIFICATION BADGE */}
          <div className="pt-4 border-t border-[#EEF0F2] flex items-center justify-between text-xs text-[#5F6773] font-medium">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#0A5C3A]" /> Doğrulanmış Topluluk Üyesi
            </span>
            <span className="text-[10px] font-extrabold uppercase text-[#0A5C3A] bg-[#0A5C3A]/10 px-2 py-1 rounded-md">
              N'apsak? 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
