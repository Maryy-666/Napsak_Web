import { Metadata } from "next";
import { Navbar } from "../components/common/Navbar";
import HomeContent from "../components/home/HomeContent";
import { Footer } from "../components/common/Footer";

export const metadata: Metadata = {
  title: "Ne Yapsak? Gençlik Derneği | Gençlik Üretiyor, Dernek Dönüştürüyor",
  description:
    "Üreten, öğrenen ve birlikte gelişen gençlerin buluşma noktası. Sanat, teknoloji, çevre, sağlık ve programlar ekiplerimizle geleceği tasarlıyoruz.",
  alternates: {
    canonical: "https://napsak.org",
  },
  openGraph: {
    title: "Ne Yapsak? Gençlik Derneği",
    description:
      "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji ve kültür derneği.",
    url: "https://napsak.org",
    siteName: "Ne Yapsak? Gençlik Derneği",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "https://napsak.org/images/forest-hero.jpg", alt: "Ne Yapsak? Gençlik Derneği" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ne Yapsak? Gençlik Derneği",
    description: "Gençlik üretiyor, dernek dönüştürüyor.",
    images: ["https://napsak.org/images/forest-hero.jpg"],
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ne Yapsak? Gençlik Derneği",
    url: "https://napsak.org",
    logo: "https://napsak.org/logo.png",
    description: "Üreten, öğrenen ve birlikte gelişen gençlerin bağımsız derneği.",
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
