import React from "react";
import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import SSSContent from "../../components/faq/SSSContent";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular (SSS) | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu hakkında en çok merak edilen sorular ve cevapları.",
  openGraph: {
    title: "Sıkça Sorulan Sorular (SSS) | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu hakkında en çok merak edilen sorular ve cevapları.",
    type: "website",
  },
};

export default function SSSPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <SSSContent />
      </main>
      <Footer />
    </>
  );
}
