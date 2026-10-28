import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import ForgotPasswordContent from "../../components/auth/ForgotPasswordContent";

// Premium SEO Metadata Configuration for Ne Yapsak? Gençlik Derneği Forgot Password
export const metadata: Metadata = {
  title: "Şifremi Unuttum | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği platformu şifre sıfırlama bağlantı talebi sayfası. Güvenli şekilde şifrenizi sıfırlayın.",
  openGraph: {
    title: "Şifremi Unuttum | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği platformu şifre sıfırlama bağlantı talebi sayfası. Güvenli şekilde şifrenizi sıfırlayın.",
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
