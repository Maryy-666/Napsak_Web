import React from "react";
import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import IletisimContent from "../../components/contact/IletisimContent";
import { PagesRepository } from "../../lib/pagesStore";

const fallbackTitle = "İletişim | N'apsak? Gençlik Topluluğu";
const fallbackDescription =
  "N'apsak? Gençlik Topluluğu ile iletişime geçin. Soru, görüş, öneri ve topluluk hakkındaki tüm konular için bize ulaşın.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("iletisim");

  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }

  const title = page.metaTitle || `${page.title} | N'apsak? Gençlik Topluluğu`;
  const description = page.metaDescription || page.shortDescription || fallbackDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function IletisimPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <IletisimContent />
      </main>
      <Footer />
    </>
  );
}
