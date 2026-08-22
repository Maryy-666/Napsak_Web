import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import HakkimizdaContent from "../../components/hakkimizda/HakkimizdaContent";
import { PagesRepository } from "../../lib/pagesStore";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("hakkimizda");
  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: "Sayfa Bulunamadı | N'apsak? Gençlik Topluluğu",
    };
  }

  const title = page.metaTitle || `${page.title} | N'apsak? Gençlik Topluluğu`;
  const description =
    page.metaDescription ||
    page.shortDescription ||
    "N'apsak? Gençlik Topluluğu'nun vizyonu, kuruluş hikayesi, çalışma ekipleri, bağımsız idari yapısı ve temel değerleri.";

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

export default async function HakkimizdaPage() {
  const page = await PagesRepository.fetchPageBySlugFromDB("hakkimizda");

  if (!page || page.publicationStatus !== "PUBLISHED") {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <HakkimizdaContent pageData={page} />
      </main>
      <Footer />
    </>
  );
}
