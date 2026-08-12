import { Metadata } from "next";
import { Navbar } from "../components/common/Navbar";
import HomeContent from "../components/home/HomeContent";
import { Footer } from "../components/common/Footer";

// SEO Metadata for N'apsak? Gençlik Topluluğu Home Page
export const metadata: Metadata = {
  title: "N'apsak? Gençlik Topluluğu",
  description:
    "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji topluluğu.",
  openGraph: {
    title: "N'apsak? Gençlik Topluluğu",
    description:
      "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji topluluğu.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HomeContent />
      <Footer />
    </>
  );
}
