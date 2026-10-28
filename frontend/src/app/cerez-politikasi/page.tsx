import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import LegalDocumentContent from "../../components/legal/LegalDocumentContent";
import { PagesRepository } from "../../lib/pagesStore";
import { COOKIE_SECTIONS_FALLBACK, parseLegalSections } from "../../lib/legalPages";

const fallbackTitle = "Çerez Politikası | Ne Yapsak? Gençlik Derneği";
const fallbackDescription =
  "Ne Yapsak? Gençlik Derneği web sitesinde kullanılan çerezler ve gizlilik tercihleri hakkında bilgilendirme.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("cerez-politikasi");

  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }

  const title = page.metaTitle || `${page.title} | Ne Yapsak? Gençlik Derneği`;
  const description = page.metaDescription || page.shortDescription || fallbackDescription;

  return {
    title,
    description,
  };
}

export default async function CerezPolitikasiPage() {
  const page = await PagesRepository.fetchPageBySlugFromDB("cerez-politikasi");
  const pageData = page?.publicationStatus === "PUBLISHED" ? page : undefined;
  const sections = parseLegalSections(pageData?.content, COOKIE_SECTIONS_FALLBACK);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <LegalDocumentContent
          title={pageData?.title || "Çerez Politikası"}
          subtitle={
            pageData?.shortDescription ||
            "Web sitemizde kullanılan çerezler, tercih ayarları ve gizlilik uygulamaları hakkında bilgilendirme."
          }
          lastUpdated="Ağustos 2025"
          sections={sections}
        />
      </main>
      <Footer />
    </>
  );
}
