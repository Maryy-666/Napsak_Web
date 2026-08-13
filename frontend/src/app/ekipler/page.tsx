import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import { TeamsIndexContent } from "../../components/teams/TeamsIndexContent";

export const metadata: Metadata = {
  title: "Çalışma Ekiplerimiz | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu bağımsız çalışma ekipleri: Teknoloji, Sanat, Çevre & Sağlık, Programlar ve Kurumsal İletişim ekiplerimizle tanışın, üretimin bir parçası olun.",
  openGraph: {
    title: "Çalışma Ekiplerimiz | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu bağımsız çalışma ekipleri: Teknoloji, Sanat, Çevre & Sağlık, Programlar ve Kurumsal İletişim ekiplerimizle tanışın, üretimin bir parçası olun.",
    type: "website",
  },
};

export default function TeamsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <TeamsIndexContent />
      </main>
      <Footer />
    </>
  );
}
