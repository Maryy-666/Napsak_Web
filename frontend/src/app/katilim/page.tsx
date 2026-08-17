import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import KatilimContent from "../../components/katilim/KatilimContent";

export const metadata: Metadata = {
  title: "Aramıza Katıl | N'apsak? Gençlik Topluluğu",
  description:
    "İster gönüllü ol, ister ekip üyesi ol, ister etkinliklerimize katıl. N'apsak? Gençlik Topluluğu'nda katkı sunmanın ve birlikte üretmenin birçok yolu var.",
  openGraph: {
    title: "Aramıza Katıl | N'apsak? Gençlik Topluluğu",
    description:
      "İster gönüllü ol, ister ekip üyesi ol, ister etkinliklerimize katıl. N'apsak? Gençlik Topluluğu'nda katkı sunmanın ve birlikte üretmenin bir çok yolu var.",
    type: "website",
  },
};

export default function KatilimPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <KatilimContent />
      </main>
      <Footer />
    </>
  );
}
