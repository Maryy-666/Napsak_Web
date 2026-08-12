"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TeamData, TeamIconKey, TEAM_ICONS, TEAMS_DATA } from "../../../data/teams";
import { getStoredTeams, saveStoredTeams } from "../../../lib/teamStore";

const iconOptions: Array<{ value: TeamIconKey; label: string }> = [
  { value: "cpu", label: "Teknoloji" },
  { value: "palette", label: "Sanat" },
  { value: "heart-pulse", label: "Çevre & Sağlık" },
  { value: "book-open", label: "Programlar" },
  { value: "share-2", label: "İletişim" },
];

const emptyTeam: TeamData = {
  id: "",
  slug: "",
  title: "",
  shortDescription: "",
  iconName: "book-open",
  bgImage: "/images/krm.png",
  about: "",
  focusAreas: [],
  whatWeDo: [],
  structure: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedId) || teams[0] || emptyTeam,
    [selectedId, teams]
  );

  useEffect(() => {
    const storedTeams = getStoredTeams();
    setTeams(storedTeams);
    setSelectedId(storedTeams[0]?.id || "");
  }, []);

  const updateSelected = (fields: Partial<TeamData>) => {
    setTeams((current) =>
      current.map((team) =>
        team.id === selectedTeam.id
          ? {
              ...team,
              ...fields,
              slug: fields.title && !fields.slug ? slugify(fields.title) : fields.slug ?? team.slug,
            }
          : team
      )
    );
  };

  const saveTeams = () => {
    const cleanTeams = teams.map((team) => ({
      ...team,
      id: team.id || slugify(team.title),
      slug: team.slug || slugify(team.title),
      focusAreas: team.focusAreas.filter(Boolean),
      whatWeDo: team.whatWeDo.filter(Boolean),
    }));

    if (cleanTeams.some((team) => !team.title.trim() || !team.slug.trim())) {
      toast.error("Ekip adı ve slug alanı zorunludur.");
      return;
    }

    saveStoredTeams(cleanTeams);
    setTeams(cleanTeams);
    toast.success("Topluluk bilgileri güncellendi.");
  };

  const addTeam = () => {
    const id = `ekip-${Date.now().toString(36)}`;
    const nextTeam = {
      ...emptyTeam,
      id,
      slug: id,
      title: "Yeni Ekip",
      shortDescription: "Yeni ekip için kısa açıklama girin.",
      about: "Ekip hakkında açıklama girin.",
      structure: "Ekip çalışma yapısını girin.",
    };

    setTeams((current) => [nextTeam, ...current]);
    setSelectedId(id);
  };

  const deleteTeam = () => {
    if (teams.length <= 1) {
      toast.error("En az bir ekip kalmalı.");
      return;
    }

    if (!confirm("Bu ekibi silmek istediğine emin misin?")) return;

    const nextTeams = teams.filter((team) => team.id !== selectedTeam.id);
    setTeams(nextTeams);
    setSelectedId(nextTeams[0]?.id || "");
  };

  const resetTeams = () => {
    if (!confirm("Ekip bilgilerini varsayılan hale döndürmek istediğine emin misin?")) return;
    saveStoredTeams(TEAMS_DATA);
    setTeams(TEAMS_DATA);
    setSelectedId(TEAMS_DATA[0]?.id || "");
    toast.success("Varsayılan ekip bilgileri geri yüklendi.");
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headings">Topluluk Yönetimi</h1>
          <p className="mt-1 text-xs text-slate-500">
            Çalışma ekiplerini ekleyin, düzenleyin ve site tarafında güncel görünmesini sağlayın.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={resetTeams} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            Varsayılana Dön
          </button>
          <button onClick={addTeam} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A5C3A] px-4 text-xs font-semibold text-white hover:bg-[#0D7449]">
            <Plus className="h-4 w-4" />
            Ekip Ekle
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-2">
            {teams.map((team) => {
              const Icon = TEAM_ICONS[team.iconName];
              const active = team.id === selectedTeam.id;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedId(team.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-[#0A5C3A]/30 bg-[#EEF7F3] text-[#0A5C3A]"
                      : "border-transparent bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm font-semibold">{team.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0F1115]">Ekip Bilgileri</h2>
              <p className="text-xs text-slate-500">Bu bilgiler ana sayfa ve ekip detaylarında kullanılır.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={deleteTeam} className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-xs font-semibold text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                Sil
              </button>
              <button onClick={saveTeams} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A5C3A] px-4 text-xs font-semibold text-white hover:bg-[#0D7449]">
                <Check className="h-4 w-4" />
                Kaydet
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TextField label="Ekip Adı" value={selectedTeam.title} onChange={(value) => updateSelected({ title: value })} />
            <TextField label="Slug" value={selectedTeam.slug} onChange={(value) => updateSelected({ slug: slugify(value) })} />
            <SelectField label="İkon" value={selectedTeam.iconName} onChange={(value) => updateSelected({ iconName: value as TeamIconKey })} />
            <TextField label="Arka Plan Görseli" value={selectedTeam.bgImage} onChange={(value) => updateSelected({ bgImage: value })} />
          </div>

          <TextArea label="Kısa Açıklama" value={selectedTeam.shortDescription} onChange={(value) => updateSelected({ shortDescription: value })} />
          <TextArea label="Ekip Hakkında" value={selectedTeam.about} onChange={(value) => updateSelected({ about: value })} rows={5} />
          <TextArea label="Odak Alanları" help="Her satıra bir madde yaz." value={selectedTeam.focusAreas.join("\n")} onChange={(value) => updateSelected({ focusAreas: value.split("\n") })} rows={5} />
          <TextArea label="Neler Yapıyoruz" help="Her satıra bir madde yaz." value={selectedTeam.whatWeDo.join("\n")} onChange={(value) => updateSelected({ whatWeDo: value.split("\n") })} rows={5} />
          <TextArea label="Ekip & Çalışma Yapısı" value={selectedTeam.structure} onChange={(value) => updateSelected({ structure: value })} rows={4} />
        </section>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10"
      />
    </label>
  );
}

function SelectField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10"
      >
        {iconOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  help?: string;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-relaxed outline-none focus:border-[#0A5C3A] focus:ring-4 focus:ring-[#0A5C3A]/10"
      />
      {help && <span className="mt-1 block text-[11px] font-medium text-slate-500">{help}</span>}
    </label>
  );
}
