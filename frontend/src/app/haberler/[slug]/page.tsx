import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { NewsDetailContent } from "@/components/news/NewsDetailContent";
import { getNewsBySlug, NEWS_DATA } from "@/data/news";

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

async function fetchNewsItem(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/news/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // Fallback to static
  }
  const staticItem = getNewsBySlug(slug);
  if (staticItem) {
    return {
      id: staticItem.id,
      slug: staticItem.slug,
      title: staticItem.title,
      summary: staticItem.excerpt,
      content: staticItem.content,
      coverImage: staticItem.coverImage,
      category: staticItem.category,
      publishDate: staticItem.date,
      publicationStatus: "PUBLISHED",
      quoteText: staticItem.quote?.text,
      quoteAuthor: staticItem.quote?.author,
      quoteTitle: staticItem.quote?.title,
      images: staticItem.images || [],
    };
  }
  return null;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const news = await fetchNewsItem(params.slug);
  if (!news) {
    return {
      title: "Haber Bulunamadı | Ne Yapsak? Gençlik Derneği",
    };
  }

  const title = `${news.title} | Ne Yapsak? Gençlik Derneği`;
  const description = news.summary || news.content?.substring(0, 160) || "Ne Yapsak? Gençlik Derneği haberi.";
  const url = `https://napsak.org/haberler/${news.slug}`;
  const ogImage = news.coverImage || "/images/forest-hero.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ne Yapsak? Gençlik Derneği",
      type: "article",
      images: [{ url: ogImage, alt: news.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const newsItem = await fetchNewsItem(params.slug);

  if (!newsItem) {
    notFound();
  }

  const newsForComponent = {
    id: String(newsItem.id),
    slug: newsItem.slug,
    title: newsItem.title,
    date: newsItem.publishDate || "2026",
    category: newsItem.category || "Duyuru",
    excerpt: newsItem.summary || "",
    coverImage: newsItem.coverImage || "/images/forest-hero.jpg",
    content: newsItem.content || "",
    quote: newsItem.quoteText
      ? {
          text: newsItem.quoteText,
          author: newsItem.quoteAuthor || "Ne Yapsak?",
          title: newsItem.quoteTitle,
        }
      : undefined,
    images: newsItem.images || [],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: newsItem.title,
    description: newsItem.summary || "",
    image: newsItem.coverImage || "https://napsak.org/images/forest-hero.jpg",
    datePublished: newsItem.publishDate || new Date().toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Ne Yapsak? Gençlik Derneği",
      url: "https://napsak.org",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <NewsDetailContent news={newsForComponent} />
      </main>
      <Footer />
    </>
  );
}
