import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import PaydaslarimizContent from "../../components/paydaslarimiz/PaydaslarimizContent";

export const metadata: Metadata = {
  title: "Paydaşlarımız & Destekçilerimiz | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği ile iş birliği yapan, destek veren ve gençlik projelerimize katkı sağlayan paydaşlarımız ve destekçilerimiz.",
  openGraph: {
    title: "Paydaşlarımız & Destekçilerimiz | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği ile iş birliği yapan, destek veren ve gençlik projelerimize katkı sağlayan paydaşlarımız ve destekçilerimiz.",
    type: "website",
  },
};

export default function PaydaslarimizPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <PaydaslarimizContent />
      </main>
      <Footer />
    </>
  );
}
