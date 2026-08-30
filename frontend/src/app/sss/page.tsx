import React from "react";
import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import SSSContent from "../../components/faq/SSSContent";
import { PagesRepository } from "../../lib/pagesStore";

const fallbackTitle = "SSS | N'apsak? Gençlik Topluluğu";
const fallbackDescription =
  "N'apsak? Gençlik Topluluğu hakkında en çok merak edilen sorular ve cevapları.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("sss");

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

export default async function SSSPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <SSSContent />
      </main>
      <Footer />
    </>
  );
}
