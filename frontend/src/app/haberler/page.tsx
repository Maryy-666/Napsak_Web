import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { NewsContent } from "@/components/news/NewsContent";

export const metadata: Metadata = {
  title: "Haberler & Duyurular | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği atölyeleri, duyuruları, etkinlik haberleri ve sahada üreten gençlerin hikayeleri.",
  openGraph: {
    title: "Haberler & Duyurular | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği atölyeleri, duyuruları, etkinlik haberleri ve sahada üreten gençlerin hikayeleri.",
    url: "https://napsak.org/haberler",
    siteName: "Ne Yapsak? Gençlik Derneği",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haberler & Duyurular | Ne Yapsak? Gençlik Derneği",
    description: "Ne Yapsak? Gençlik Derneği en güncel haberler ve duyurular.",
  },
  alternates: {
    canonical: "https://napsak.org/haberler",
  },
};

export default function HaberlerPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <NewsContent />
      </main>
      <Footer />
    </>
  );
}
