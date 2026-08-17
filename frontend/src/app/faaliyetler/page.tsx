import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import FaaliyetlerContent from "../../components/faaliyetler/FaaliyetlerContent";

export const metadata: Metadata = {
  title: "Faaliyetlerimiz & Projeler | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu çalışma ekiplerinin dönemsel faaliyetleri, projeleri, atölyeleri ve ekoloji/teknoloji/sanat alanlarındaki toplumsal etki çalışmaları.",
  keywords: [
    "N'apsak",
    "Gençlik Faaliyetleri",
    "Dönemsel Projeler",
    "Açık Kod Kampüsü",
    "Sıfır Atık Atölyesi",
    "Sanat Duvar Resmi",
    "Çalışma Ekipleri",
  ],
  openGraph: {
    title: "Faaliyetlerimiz & Projeler | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu çalışma ekiplerinin dönemsel faaliyetleri, projeleri ve toplumsal etki çalışmaları.",
    type: "website",
  },
};

export default function FaaliyetlerPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <FaaliyetlerContent />
      </main>
      <Footer />
    </>
  );
}
