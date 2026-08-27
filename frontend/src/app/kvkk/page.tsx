import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import LegalDocumentContent from "../../components/legal/LegalDocumentContent";
import { PagesRepository } from "../../lib/pagesStore";
import { KVKK_SECTIONS_FALLBACK, parseLegalSections } from "../../lib/legalPages";

const fallbackTitle = "KVKK | N'apsak? Gençlik Topluluğu";
const fallbackDescription =
  "N'apsak? Gençlik Topluluğu Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("kvkk");

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
  };
}

export default async function KvkkPage() {
  const page = await PagesRepository.fetchPageBySlugFromDB("kvkk");
  const pageData = page?.publicationStatus === "PUBLISHED" ? page : undefined;
  const sections = parseLegalSections(pageData?.content, KVKK_SECTIONS_FALLBACK);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <LegalDocumentContent
          title={pageData?.title || "KVKK Aydınlatma Metni"}
          subtitle={
            pageData?.shortDescription ||
            "Kişisel Verilerin Korunması Kanunu kapsamında haklarınız ve verilerinizin işlenme ilkeleri."
          }
          lastUpdated="Ağustos 2025"
          sections={sections}
        />
      </main>
      <Footer />
    </>
  );
}
