import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import { TeamsIndexContent } from "../../components/teams/TeamsIndexContent";

export const metadata: Metadata = {
  title: "Çalışma Ekiplerimiz | Ne Yapsak? Gençlik Derneği",
  description:
    "Ne Yapsak? Gençlik Derneği bağımsız çalışma ekipleri: Teknoloji, Sanat, Yaşam ve Sürdürülebilirlik, Programlar ve Kurumsal İletişim ekiplerimizle tanışın, üretimin bir parçası olun.",
  openGraph: {
    title: "Çalışma Ekiplerimiz | Ne Yapsak? Gençlik Derneği",
    description:
      "Ne Yapsak? Gençlik Derneği bağımsız çalışma ekipleri: Teknoloji, Sanat, Yaşam ve Sürdürülebilirlik, Programlar ve Kurumsal İletişim ekiplerimizle tanışın, üretimin bir parçası olun.",
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
