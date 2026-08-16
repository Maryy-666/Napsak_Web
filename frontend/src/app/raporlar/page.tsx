import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import ReportsContent from "../../components/reports/ReportsContent";

export const metadata: Metadata = {
  title: "Raporlar & Gençlik Gözlemleri | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu araştırmaları, saha gözlemleri, etkinlik çıktıları ve çalışma ekipleri faaliyet raporları. Veriye dayalı şeffaf sivil gençlik üretimi.",
  keywords: [
    "N'apsak",
    "Gençlik Raporları",
    "Gençlik Katılımı",
    "Sivil Toplum Raporları",
    "Etkinlik Geri Bildirimleri",
    "Saha Gözlemi",
    "Çalışma Ekipleri",
  ],
  openGraph: {
    title: "Raporlar & Gençlik Gözlemleri | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu araştırmaları, saha gözlemleri ve çalışma ekipleri faaliyet raporları.",
    type: "website",
  },
};

export default function RaporlarPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ReportsContent />
      </main>
      <Footer />
    </>
  );
}

