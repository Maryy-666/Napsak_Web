import React from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "../../../components/common/Navbar";
import { Footer } from "../../../components/common/Footer";
import { PageContainer, Section } from "../../../components/ui";
import { InnerPageBackground } from "../../../components/common/InnerPageBackground";
import { PagesRepository } from "../../../lib/pagesStore";
import { ArrowLeft, Sparkles, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface DynamicPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  if (params.slug === "hakkimizda") {
    return {
      title: "Hakkımızda | N'apsak? Gençlik Topluluğu",
    };
  }
  if (params.slug === "katilim") {
    return {
      title: "Katılım | N'apsak? Gençlik Topluluğu",
    };
  }
  if (params.slug === "iletisim") {
    return {
      title: "İletişim | N'apsak? Gençlik Topluluğu",
    };
  }

  const page = await PagesRepository.fetchPageBySlugFromDB(params.slug);

  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: "Sayfa Bulunamadı | N'apsak? Gençlik Topluluğu",
    };
  }

  const metaTitle = page.metaTitle || `${page.title} | N'apsak? Gençlik Topluluğu`;
  const metaDescription =
    page.metaDescription || page.shortDescription || "N'apsak? Gençlik Topluluğu bağımsız gençlik projeleri ve çalışmaları.";

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
                  <span>N'APSAK? BİLGİ SAYFASI</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headings text-[#0F1115] tracking-tight leading-[1.15]">
                  {page.title}
                </h1>

                {page.shortDescription && (
                  <p className="text-lg sm:text-xl text-[#5F6773] font-sans leading-relaxed max-w-3xl">
                    {page.shortDescription}
                  </p>
                )}
              </div>
            </PageContainer>
          </Section>

          {/* Page Content Body */}
          <Section padding="lg" background="transparent" className="py-12">
            <PageContainer className="max-w-5xl">
              <div className="bg-white rounded-[28px] border border-[#EEF0F2] p-8 sm:p-12 shadow-sm text-left space-y-6">
                {paragraphs.map((p, idx) => {
                  const trimmed = p.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith("# ")) {
                    return (
                      <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold font-headings text-[#0F1115] pt-4 pb-2 border-b border-[#EEF0F2]">
                        {trimmed.replace("# ", "")}
                      </h1>
                    );
                  }
                  if (trimmed.startsWith("## ")) {
                    return (
                      <h2 key={idx} className="text-xl sm:text-2xl font-bold font-headings text-[#0F1115] pt-3 pb-1">
                        {trimmed.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="text-lg font-bold font-headings text-[#0A5C3A] pt-2">
                        {trimmed.replace("### ", "")}
                      </h3>
                    );
                  }

                  return (
                    <p key={idx} className="text-base sm:text-lg font-sans text-[#5F6773] leading-relaxed">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </PageContainer>
          </Section>
        </InnerPageBackground>
      </main>
      <Footer />
    </>
  );
}
