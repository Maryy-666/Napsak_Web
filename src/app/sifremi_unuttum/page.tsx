import { Metadata } from "next";
import ForgotPasswordContent from "../../components/auth/ForgotPasswordContent";

export const metadata: Metadata = {
  title: "Şifremi Unuttum | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu platformu şifre sıfırlama bağlantı talebi sayfası. Güvenli şekilde şifrenizi sıfırlayın.",
};

export default function SifremiUnuttumUnderscorePage() {
  return <ForgotPasswordContent />;
}
