import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import ForgotPasswordContent from "../../components/auth/ForgotPasswordContent";

// Premium SEO Metadata Configuration for N'apsak? Gençlik Topluluğu Forgot Password
export const metadata: Metadata = {
  title: "Şifremi Unuttum | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu platformu şifre sıfırlama bağlantı talebi sayfası. Güvenli şekilde şifrenizi sıfırlayın.",
  openGraph: {
    title: "Şifremi Unuttum | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu platformu şifre sıfırlama bağlantı talebi sayfası. Güvenli şekilde şifrenizi sıfırlayın.",
    type: "website",
  },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <ForgotPasswordContent />
      </main>
      <Footer />
    </>
  );
}
