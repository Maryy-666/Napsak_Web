import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import KatilimContent from "../../components/katilim/KatilimContent";
import { PagesRepository } from "../../lib/pagesStore";

const fallbackTitle = "Katılım | Ne Yapsak? Gençlik Derneği";
const fallbackDescription =
  "İster gönüllü ol, ister ekip üyesi ol, ister etkinliklerimize katıl. Ne Yapsak? Gençlik Derneği'nda katkı sunmanın ve birlikte üretmenin birçok yolu var.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("katilim");

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
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function KatilimPage() {
  const page = await PagesRepository.fetchPageBySlugFromDB("katilim");
  const pageData = page?.publicationStatus === "PUBLISHED" ? page : undefined;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <KatilimContent pageData={pageData} />
      </main>
      <Footer />
    </>
  );
}
