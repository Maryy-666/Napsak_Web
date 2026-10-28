import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/common/Navbar";
import { Footer } from "../../../components/common/Footer";
import { TeamDetailContent } from "../../../components/teams/TeamDetailContent";
import { MemberDetailContent } from "../../../components/teams/MemberDetailContent";
import { getTeamBySlug, TEAMS_DATA } from "../../../data/teams";
import { getMemberBySlug, PUBLIC_MEMBERS, slugifyMemberName } from "../../../data/members";

interface DetailPageProps {
  params: {
    slug: string;
  };
}

async function fetchMemberFromBackendOrStatic(slug: string) {
  try {
    const res = await fetch(`http://localhost:3001/members`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const target = slug.toLowerCase().trim();
        const found = json.data.find((m: any) => {
          const mSlug = m.slug || (m.name ? slugifyMemberName(m.name) : "");
          const mIdSlug = (m.id || "").replace(/^m-/, "");
          return mSlug === target || m.id === target || mIdSlug === target;
        });
        if (found) return found;
      }
    }
  } catch (err) {
    // Fallback to static
  }
  return getMemberBySlug(slug) || null;
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  // Check team first
  const team = getTeamBySlug(params.slug);
  if (team) {
    return {
      title: `${team.title} | Ne Yapsak? Gençlik Derneği`,
      description: team.shortDescription,
      openGraph: {
        title: `${team.title} | Ne Yapsak? Gençlik Derneği`,
        description: team.shortDescription,
        type: "website",
      },
    };
  }

  // Check member second
  const member = await fetchMemberFromBackendOrStatic(params.slug);
  if (member) {
    const roleText = member.primaryRole || "Üye";
    const teamText = member.primaryTeam || "Ne Yapsak Gençlik Derneği";
    return {
      title: `${member.name} - ${roleText} | Ne Yapsak? Gençlik Derneği`,
      description: `${member.name}, Ne Yapsak? Gençlik Derneği ${teamText} bünyesinde ${roleText} olarak görev yapmaktadır.`,
      openGraph: {
        title: `${member.name} - ${roleText} | Ne Yapsak? Gençlik Derneği`,
        description: `${member.name}, Ne Yapsak? Gençlik Derneği ${teamText} bünyesinde ${roleText} olarak görev yapmaktadır.`,
        type: "profile",
      },
    };
  }

  return {
    title: "Sayfa Bulunamadı | Ne Yapsak? Gençlik Derneği",
  };
}

export async function generateStaticParams() {
  const teamParams = TEAMS_DATA.map((team) => ({
    slug: team.slug,
  }));

  const memberParams = PUBLIC_MEMBERS.map((member) => ({
    slug: member.slug || slugifyMemberName(member.name),
  }));

  return [...teamParams, ...memberParams];
}

export default async function DetailPage({ params }: DetailPageProps) {
  // Check if target slug is a team
  const team = getTeamBySlug(params.slug);
  if (team) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full flex flex-col pt-20">
          <TeamDetailContent team={team} />
        </main>
        <Footer />
      </>
    );
  }

  // Check if target slug is a member
  const member = await fetchMemberFromBackendOrStatic(params.slug);
  if (member) {
    return (
      <>
        <Navbar />
        <main className="flex-1 w-full flex flex-col pt-20">
          <MemberDetailContent member={member} />
        </main>
        <Footer />
      </>
    );
  }

  notFound();
}
