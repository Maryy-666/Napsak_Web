import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/common/Navbar";
import { Footer } from "../../../components/common/Footer";
import { TeamDetailContent } from "../../../components/teams/TeamDetailContent";
import { getTeamBySlug, TEAMS_DATA } from "../../../data/teams";

interface TeamDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: TeamDetailPageProps): Promise<Metadata> {
  const team = getTeamBySlug(params.slug);
  if (!team) {
    return {
      title: "Ekip Bulunamadı | N'apsak? Gençlik Topluluğu",
    };
  }
  return {
    title: `${team.title} | N'apsak? Gençlik Topluluğu`,
    description: team.shortDescription,
    openGraph: {
      title: `${team.title} | N'apsak? Gençlik Topluluğu`,
      description: team.shortDescription,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return TEAMS_DATA.map((team) => ({
    slug: team.slug,
  }));
}

export default function TeamDetailPage({ params }: TeamDetailPageProps) {
  const team = getTeamBySlug(params.slug);

  if (!team) {
    notFound();
  }

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
