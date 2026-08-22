import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import HakkimizdaContent from "../../components/hakkimizda/HakkimizdaContent";
import { PagesRepository } from "../../lib/pagesStore";

const fallbackTitle = "Hakkimizda | N'apsak? Genclik Toplulugu";
const fallbackDescription =
  "N'apsak? Genclik Toplulugu'nun vizyonu, kurulus hikayesi, calisma ekipleri, bagimsiz idari yapisi ve temel degerleri.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("hakkimizda");

  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }

  const title = page.metaTitle || `${page.title} | N'apsak? Genclik Toplulugu`;
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

export default async function HakkimizdaPage() {
  const page = await PagesRepository.fetchPageBySlugFromDB("hakkimizda");
  const pageData = page?.publicationStatus === "PUBLISHED" ? page : undefined;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <HakkimizdaContent pageData={pageData} />
      </main>
      <Footer />
    </>
  );
}
