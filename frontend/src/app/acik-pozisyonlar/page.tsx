import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import AcikPozisyonlarContent from "../../components/acik-pozisyonlar/AcikPozisyonlarContent";

export const metadata: Metadata = {
  title: "Açık Pozisyonlar | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği olarak ekibimizi büyütüyor, birlikte üretmek isteyen gönüllüler arıyoruz. Ekip çalışma ve gönüllülük pozisyonlarını inceleyin.",
  openGraph: {
    title: "Açık Pozisyonlar | Ne Yapsak? Gençlik Derneği",
    description:
      "Dernek içerisinde aktif olarak gönüllü ve ekip üyesi aranan pozisyonların listelendiği açık pozisyonlar sayfası.",
    type: "website",
  },
};

export default function AcikPozisyonlarPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <AcikPozisyonlarContent />
      </main>
      <Footer />
    </>
  );
}
