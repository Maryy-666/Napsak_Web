import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import FaaliyetlerContent from "../../components/faaliyetler/FaaliyetlerContent";

export const metadata: Metadata = {
  title: "Faaliyetlerimiz & Projeler | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği çalışma ekiplerinin dönemsel faaliyetleri, projeleri, atölyeleri ve ekoloji/teknoloji/sanat alanlarındaki toplumsal etki çalışmaları.",
  keywords: [
    "Ne Yapsak",
    "Gençlik Faaliyetleri",
    "Dönemsel Projeler",
    "Açık Kod Kampüsü",
    "Sıfır Atık Atölyesi",
    "Sanat Duvar Resmi",
    "Çalışma Ekipleri",
  ],
  openGraph: {
    title: "Faaliyetlerimiz & Projeler | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği çalışma ekiplerinin dönemsel faaliyetleri, projeleri ve toplumsal etki çalışmaları.",
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
