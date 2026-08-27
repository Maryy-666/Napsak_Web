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
  const page = await PagesRepository.fetchPageBySlugFromDB("sss");
  const pageData = page?.publicationStatus === "PUBLISHED" ? page : undefined;

  let customFaqs: Array<{ question: string; answer: string }> | undefined = undefined;
  if (pageData?.content) {
    try {
      const parsed = JSON.parse(pageData.content);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question) {
        customFaqs = parsed;
      }
    } catch {
      // Plain text content or markdown fallback.
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <SSSContent pageData={pageData} customFaqs={customFaqs} />
      </main>
      <Footer />
    </>
  );
}
