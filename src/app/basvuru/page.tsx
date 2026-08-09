import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import BasvuruContent from "../../components/basvuru/BasvuruContent";

export const metadata: Metadata = {
  title: "Topluluğa Katıl | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu katılım başvuru sayfası. Üreten, öğrenen ve birlikte gelişen topluluğumuzun bir parçası olmak için başvurun.",
  openGraph: {
    title: "Topluluğa Katıl | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu katılım başvuru sayfası. Üreten, öğrenen ve birlikte gelişen topluluğumuzun bir parçası olmak için başvurun.",
    type: "website",
  },
};

export default function BasvuruPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <BasvuruContent />
      </main>
      <Footer />
    </>
  );
}
