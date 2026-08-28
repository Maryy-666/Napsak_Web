import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import HakkimizdaContent from "../../components/hakkimizda/HakkimizdaContent";
import { PagesRepository } from "../../lib/pagesStore";

const fallbackTitle = "Hakkımızda | N'apsak? Gençlik Topluluğu";
const fallbackDescription =
  "N'apsak? Gençlik Topluluğu'nun vizyonu, kuruluş hikayesi, çalışma ekipleri, bağımsız idari yapısı ve temel değerleri.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("hakkimizda");

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

export default function HakkimizdaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <HakkimizdaContent />
      </main>
      <Footer />
    </>
  );
}
