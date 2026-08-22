import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import SSSContent from "../../components/faq/SSSContent";
import { PagesRepository } from "../../lib/pagesStore";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("sss");
  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: "Sayfa Bulunamadı | N'apsak? Gençlik Topluluğu",
    };
  }

  const title = page.metaTitle || `${page.title} | N'apsak? Gençlik Topluluğu`;
  const description =
    page.metaDescription ||
    page.shortDescription ||
    "N'apsak? Gençlik Topluluğu hakkında en çok merak edilen sorular ve cevapları.";

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
  const page = await PagesRepository.fetchPageBySlugFromDB("sss");

  if (!page || page.publicationStatus !== "PUBLISHED") {
    notFound();
  }

  let customFaqs: Array<{ question: string; answer: string }> | undefined = undefined;
  if (page.content) {
    try {
      const parsed = JSON.parse(page.content);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question) {
        customFaqs = parsed;
      }
    } catch {
      // Plain text content or markdown fallback
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <SSSContent pageData={page} customFaqs={customFaqs} />
      </main>
      <Footer />
    </>
  );
}
