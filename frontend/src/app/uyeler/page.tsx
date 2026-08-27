import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import { MembersContent } from "../../components/members/MembersContent";

export const metadata: Metadata = {
  title: "Ekibimiz | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? topluluğuna değer katan ekip ve kurul üyelerimiz.",
  openGraph: {
    title: "Ekibimiz | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? topluluğuna değer katan ekip ve kurul üyelerimiz.",
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
