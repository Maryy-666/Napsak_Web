import React from "react";
import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import HaberdarContent from "../../components/haberdar/HaberdarContent";

export const metadata: Metadata = {
  title: "Bizden Haberdar Ol | N'apsak? Gençlik Topluluğu",
  description:
    "Başvurunu aldık! N'apsak? Gençlik Topluluğu'ndan etkinlikleri, duyuruları ve yeni gelişmeleri kaçırmamak için bizi sosyal medya hesaplarımızdan takip edebilirsin.",
  openGraph: {
    title: "Bizden Haberdar Ol | N'apsak? Gençlik Topluluğu",
    description:
      "Başvurunu aldık! N'apsak? Gençlik Topluluğu'ndan etkinlikleri, duyuruları ve yeni gelişmeleri kaçırmamak için bizi sosyal medya hesaplarımızdan takip edebilirsin.",
    type: "website",
  },
};

export default function BizdenHaberdarOlPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-20">
        <HaberdarContent />
      </main>
      <Footer />
    </>
  );
}
