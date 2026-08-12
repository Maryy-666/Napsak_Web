import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import RegisterContent from "../../components/member/RegisterContent";

export const metadata: Metadata = {
  title: "Kayıt Ol | N'apsak? Gençlik Topluluğu",
  description: "N'apsak? Gençlik Topluluğu üye hesabını oluştur.",
};

export default function KayitPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <RegisterContent />
      </main>
      <Footer />
    </>
  );
}
