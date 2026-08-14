import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import { MembersContent } from "../../components/members/MembersContent";

export const metadata: Metadata = {
  title: "Üyelerimiz | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? topluluğuna değer katan, farklı alanlarda üreten ve birlikte öğrenen üyelerimiz.",
  openGraph: {
    title: "Üyelerimiz | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? topluluğuna değer katan, farklı alanlarda üreten ve birlikte öğrenen üyelerimiz.",
    type: "website",
  },
};

export default function UyelerPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <MembersContent />
      </main>
      <Footer />
    </>
  );
}
