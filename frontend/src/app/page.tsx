import { Metadata } from "next";
import { Navbar } from "../components/common/Navbar";
import HomeContent from "../components/home/HomeContent";
import { Footer } from "../components/common/Footer";

export const metadata: Metadata = {
  title: "N'apsak? Gençlik Topluluğu | Gençlik Üretiyor, Topluluk Dönüştürüyor",
  description:
    "Üreten, öğrenen ve birlikte gelişen gençlerin buluşma noktası. Sanat, teknoloji, çevre, sağlık ve programlar ekiplerimizle geleceği tasarlıyoruz.",
  alternates: {
    canonical: "https://napsak.org",
  },
  openGraph: {
    title: "N'apsak? Gençlik Topluluğu",
    description:
      "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji ve kültür topluluğu.",
    url: "https://napsak.org",
    siteName: "N'apsak? Gençlik Topluluğu",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://napsak.org/images/forest-hero.jpg", alt: "N'apsak? Gençlik Topluluğu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "N'apsak? Gençlik Topluluğu",
    description: "Gençlik üretiyor, topluluk dönüştürüyor.",
    images: ["https://napsak.org/images/forest-hero.jpg"],
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "N'apsak? Gençlik Topluluğu",
    url: "https://napsak.org",
    logo: "https://napsak.org/logo.png",
    description: "Üreten, öğrenen ve birlikte gelişen gençlerin bağımsız topluluğu.",
    sameAs: [
      "https://instagram.com/napsakgenclik",
      "https://linkedin.com/company/napsakgenclik",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <HomeContent />
      <Footer />
    </>
  );
}
