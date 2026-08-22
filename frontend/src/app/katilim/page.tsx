import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import KatilimContent from "../../components/katilim/KatilimContent";
import { PagesRepository } from "../../lib/pagesStore";

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("katilim");
  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: "Sayfa Bulunamadı | N'apsak? Gençlik Topluluğu",
    };
  }

  const title = page.metaTitle || `${page.title} | N'apsak? Gençlik Topluluğu`;
  const description =
    page.metaDescription ||
    page.shortDescription ||
    "İster gönüllü ol, ister ekip üyesi ol, ister etkinliklerimize katıl. N'apsak? Gençlik Topluluğu'nda katkı sunmanın ve birlikte üretmenin birçok yolu var.";

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

  if (!page || page.publicationStatus !== "PUBLISHED") {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <KatilimContent pageData={page} />
      </main>
      <Footer />
    </>
  );
}
