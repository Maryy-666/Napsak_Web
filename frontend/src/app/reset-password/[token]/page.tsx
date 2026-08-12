import { Metadata } from "next";
import { Navbar } from "../../../components/common/Navbar";
import { Footer } from "../../../components/common/Footer";
import ResetPasswordContent from "../../../components/auth/ResetPasswordContent";

// Premium SEO Metadata Configuration for N'apsak? Gençlik Topluluğu Reset Password
export const metadata: Metadata = {
  title: "Yeni Şifre Oluştur | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu platformu şifre sıfırlama ve yeni şifre oluşturma sayfası. Güvenli şekilde şifrenizi sıfırlayın.",
  openGraph: {
    title: "Yeni Şifre Oluştur | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu platformu şifre sıfırlama ve yeni şifre oluşturma sayfası. Güvenli şekilde şifrenizi sıfırlayın.",
    type: "website",
  },
};

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <ResetPasswordContent token={params.token} />
      </main>
      <Footer />
    </>
  );
}
