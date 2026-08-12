import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import HakkimizdaContent from "../../components/hakkimizda/HakkimizdaContent";

export const metadata: Metadata = {
  title: "Hakkımızda | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu'nun vizyonu, kuruluş hikayesi, çalışma ekipleri, bağımsız idari yapısı ve temel değerleri.",
  openGraph: {
    title: "Hakkımızda | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu'nun vizyonu, kuruluş hikayesi, çalışma ekipleri, bağımsız idari yapısı ve temel değerleri.",
    type: "website",
  },
};

export default function HakkimizdaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <HakkimizdaContent />
      </main>
      <Footer />
    </>
  );
}
