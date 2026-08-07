import { Metadata } from "next";
import LoginPageContent from "../../components/auth/LoginPageContent";

// Premium SEO Metadata Configuration for N'apsak? Gençlik Topluluğu Login
export const metadata: Metadata = {
  title: "Giriş Yap | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu resmi platformuna giriş yapın. Teknoloji, girişimcilik ve gençlik ekosistemine katılın.",
  openGraph: {
    title: "Giriş Yap | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu resmi platformuna giriş yapın. Teknoloji, girişimcilik ve gençlik ekosistemine katılın.",
    type: "website",
  },
};

export default function LoginPage() {
  return <LoginPageContent />;
}
