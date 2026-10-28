import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import ReportsContent from "../../components/reports/ReportsContent";

export const metadata: Metadata = {
  title: "Raporlar & Gençlik Gözlemleri | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği araştırmaları, saha gözlemleri, etkinlik çıktıları ve çalışma ekipleri faaliyet raporları. Veriye dayalı şeffaf sivil gençlik üretimi.",
  keywords: [
    "Ne Yapsak",
    "Gençlik Raporları",
    "Gençlik Katılımı",
    "Sivil Toplum Raporları",
    "Etkinlik Geri Bildirimleri",
    "Saha Gözlemi",
    "Çalışma Ekipleri",
  ],
  openGraph: {
    title: "Raporlar & Gençlik Gözlemleri | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği araştırmaları, saha gözlemleri ve çalışma ekipleri faaliyet raporları.",
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

