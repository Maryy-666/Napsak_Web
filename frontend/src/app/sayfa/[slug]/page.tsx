import React from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "../../../components/common/Navbar";
import { Footer } from "../../../components/common/Footer";
import { PageContainer, Section } from "../../../components/ui";
import { InnerPageBackground } from "../../../components/common/InnerPageBackground";
import { PagesRepository } from "../../../lib/pagesStore";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

interface DynamicPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  if (params.slug === "hakkimizda") {
    return {
      title: "Hakkımızda | Ne Yapsak? Gençlik Derneği",
    };
  }
  if (params.slug === "katilim") {
    return {
      title: "Katılım | Ne Yapsak? Gençlik Derneği",
    };
  }
  if (params.slug === "iletisim") {
    return {
      title: "İletişim | Ne Yapsak? Gençlik Derneği",
    };
  }

  const page = await PagesRepository.fetchPageBySlugFromDB(params.slug);

  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: "Sayfa Bulunamadı | Ne Yapsak? Gençlik Derneği",
    };
  }

  const metaTitle = page.metaTitle || `${page.title} | Ne Yapsak? Gençlik Derneği`;
  const metaDescription =
    page.metaDescription || page.shortDescription || "Ne Yapsak? Gençlik Derneği bağımsız gençlik projeleri ve çalışmaları.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "website",
    },
  };
}

export default async function DynamicSlugPage({ params }: DynamicPageProps) {
  if (params.slug === "hakkimizda") {
    redirect("/hakkimizda");
  }
  if (params.slug === "katilim") {
    redirect("/katilim");
  }
  if (params.slug === "iletisim") {
    redirect("/iletisim");
  }
  if (params.slug === "sss") {
    redirect("/sss");
  }
  if (params.slug === "uyeler") {
    redirect("/uyeler");
  }
  if (params.slug === "ekipler") {
    redirect("/ekipler");
  }
  if (params.slug === "faaliyetler") {
    redirect("/faaliyetler");
  }
  if (params.slug === "etkinlikler") {
    redirect("/etkinlikler");
  }
  if (params.slug === "dergiler") {
    redirect("/dergiler");
  }
  if (params.slug === "haberler") {
    redirect("/haberler");
  }
  if (params.slug === "raporlar") {
    redirect("/raporlar");
  }

  const page = await PagesRepository.fetchPageBySlugFromDB(params.slug);

  if (!page || page.publicationStatus !== "PUBLISHED") {
    notFound();
  }

  // Basic Markdown paragraph splitter for rendering paragraphs cleanly
  const paragraphs = page.content ? page.content.split("\n\n") : [];

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <InnerPageBackground className="min-h-screen flex flex-col">
          {/* Hero Banner Header */}
          <Section padding="lg" background="transparent" className="pt-10 pb-12 border-b border-[#EEF0F2] relative">
            <PageContainer className="max-w-5xl">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-sm text-[#5F6773] mb-6 font-medium">
                <Link href="/" className="hover:text-[#0A5C3A] transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-4 h-4" /> Ana Sayfa
                </Link>
                <span className="text-[#CDD1D5]">/</span>
                <span className="text-[#0F1115] font-semibold">{page.title}</span>
              </div>

              <div className="space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NE YAPSAK? BİLGİ SAYFASI</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings">
                  {page.title}
                </h1>

                {page.shortDescription && (
                  <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed max-w-3xl font-medium">
                    {page.shortDescription}
                  </p>
                )}
              </div>
            </PageContainer>
          </Section>

          {/* Main Body Content */}
          <Section padding="lg" background="transparent" className="py-12 flex-1">
            <PageContainer className="max-w-4xl">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EEF0F2] shadow-sm space-y-6 text-left">
                {paragraphs.length > 0 ? (
                  paragraphs.map((para, idx) => (
                    <p key={idx} className="text-[#0F1115] text-base leading-relaxed font-sans font-normal whitespace-pre-line">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-500 italic text-center py-10">Bu sayfa için henüz içerik girilmemiştir.</p>
                )}
              </div>
            </PageContainer>
          </Section>
        </InnerPageBackground>
      </main>
      <Footer />
    </>
  );
}
