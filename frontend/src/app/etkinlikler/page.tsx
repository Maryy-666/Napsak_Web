import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import EtkinliklerContent from "../../components/etkinlikler/EtkinliklerContent";

export const metadata: Metadata = {
  title: "Etkinlikler | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği etkinlik takvimi, zirveler, atölyeler ve geçmiş faaliyetlerimiz.",
  openGraph: {
    title: "Etkinlikler | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği etkinlik takvimi, zirveler, atölyeler ve geçmiş faaliyetlerimiz.",
    type: "website",
  },
};

export default function EtkinliklerPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <EtkinliklerContent />
      </main>
      <Footer />
    </>
  );
}
