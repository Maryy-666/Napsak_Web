import React from "react";
import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import IletisimContent from "../../components/contact/IletisimContent";

// Premium SEO Metadata Configuration for N'apsak? Gençlik Topluluğu Contact Page
export const metadata: Metadata = {
  title: "İletişim | N'apsak? Gençlik Topluluğu",
  description:
    "N'apsak? Gençlik Topluluğu ile iletişime geçin. Soru, görüş, öneri ve topluluk hakkındaki tüm konular için bize ulaşın.",
  openGraph: {
    title: "İletişim | N'apsak? Gençlik Topluluğu",
    description:
      "N'apsak? Gençlik Topluluğu ile iletişime geçin. Soru, görüş, öneri ve topluluk hakkındaki tüm konular için bize ulaşın.",
    type: "website",
  },
};

export default function IletisimPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <IletisimContent />
      </main>
      <Footer />
    </>
  );
}
