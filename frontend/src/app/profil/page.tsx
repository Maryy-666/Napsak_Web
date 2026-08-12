import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import ProfileContent from "../../components/member/ProfileContent";

export const metadata: Metadata = {
  title: "Profilim | N'apsak? Gençlik Topluluğu",
  description: "N'apsak? üye profil bilgilerini ve CV dosyanı yönet.",
};

export default function ProfilPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ProfileContent />
      </main>
      <Footer />
    </>
  );
}
