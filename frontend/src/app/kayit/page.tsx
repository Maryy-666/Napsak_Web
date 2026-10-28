import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import RegisterContent from "../../components/member/RegisterContent";

export const metadata: Metadata = {
  title: "Kayıt Ol | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği platformuna kayıt olun. Gençlik ekosistemine katılın, etkinlikleri ve dernek çalışmalarını takip edin.",
  openGraph: {
    title: "Kayıt Ol | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği platformuna kayıt olun. Gençlik ekosistemine katılın, etkinlikleri ve dernek çalışmalarını takip edin.",
    type: "website",
  },
};

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <RegisterContent />
      </main>
      <Footer />
    </>
  );
}
