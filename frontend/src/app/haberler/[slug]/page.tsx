import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/common/Navbar";
import { Footer } from "../../../components/common/Footer";
import { NewsDetailContent } from "../../../components/news/NewsDetailContent";
import { getNewsBySlug, NEWS_DATA } from "../../../data/news";

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const news = getNewsBySlug(params.slug);
  if (!news) {
    return {
      title: "Haber Bulunamadı | N'apsak? Gençlik Topluluğu",
    };
  }
  return {
    title: `${news.title} | N'apsak? Gençlik Topluluğu`,
    description: news.excerpt,
    openGraph: {
      title: `${news.title} | N'apsak? Gençlik Topluluğu`,
      description: news.excerpt,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  return NEWS_DATA.map((news) => ({
    slug: news.slug,
  }));
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const news = getNewsBySlug(params.slug);

  if (!news) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <NewsDetailContent news={news} />
      </main>
      <Footer />
    </>
  );
}
