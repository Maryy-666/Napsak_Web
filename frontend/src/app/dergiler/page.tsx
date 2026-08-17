import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import DergilerContent from "../../components/dergiler/DergilerContent";

export const metadata: Metadata = {
  title: "Dergiler & Yayınlar | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu dijital dergileri, fanzinleri ve özel yayınları. Gençlerin kaleme aldığı makaleler, röportajlar ve kültür-sanat yazıları.",
  keywords: [
    "N'apsak",
    "Gençlik Dergisi",
    "Dijital Dergi",
    "Fanzin",
    "Gençlik Yazıları",
    "Kültür Sanat",
    "Açık Kaynak Yayın",
  ],
  openGraph: {
    title: "Dergiler & Yayınlar | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu dijital dergileri, fanzinleri ve kültür-sanat yazıları.",
    type: "website",
  },
};

export default function DergilerPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DergilerContent />
      </main>
      <Footer />
    </>
  );
}
