import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import LoginPageContent from "../../components/auth/LoginPageContent";

// Premium SEO Metadata Configuration for Ne Yapsak? Gençlik Derneği Login
export const metadata: Metadata = {
  title: "Giriş Yap | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği resmi platformuna giriş yapın. Teknoloji, girişimcilik ve gençlik ekosistemine katılın.",
  openGraph: {
    title: "Giriş Yap | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği resmi platformuna giriş yapın. Teknoloji, girişimcilik ve gençlik ekosistemine katılın.",
    type: "website",
  },
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <LoginPageContent />
      </main>
      <Footer />
    </>
  );
}
