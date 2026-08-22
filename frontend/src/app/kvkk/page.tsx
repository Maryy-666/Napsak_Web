import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import LegalDocumentContent from "../../components/legal/LegalDocumentContent";
import { PagesRepository } from "../../lib/pagesStore";

const KVKK_SECTIONS_FALLBACK = [
  {
    title: "Veri Sorumlusunun Kimliği",
    content:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, N'apsak? Gençlik Topluluğu olarak kişisel verilerinizi mevzuata uygun şekilde işliyor ve koruyoruz.",
  },
  {
    title: "Kişisel Verilerin İşlenme Amacı",
    content: [
      "Kişisel verileriniz (ad, soyad, e-posta adresi, telefon numarası, eğitim durumu); üyelik başvurularının değerlendirilmesi, topluluk içi iletişimin sağlanması, etkinlik ve eğitim organizasyonlarının yürütülmesi amacıyla işlenmektedir.",
      "Ayrıca kurumsal e-posta ve duyuru bültenlerimizin iletilmesi ve yasal yükümlülüklerin ifası amacıyla verileriniz işlenmektedir.",
    ],
  },
  {
    title: "Kişisel Verilerin Aktarılması",
    content:
      "Kişisel verileriniz; kanunen yetkili kamu kurum ve kuruluşları hariç olmak üzere, açık rızanız olmaksızın üçüncü şahıslarla veya ticari amaçlarla paylaşılmamaktadır.",
  },
  {
    title: "KVKK Kapsamındaki Haklarınız",
    content:
      "KVKK'nın 11. maddesi uyarınca veri sahipleri; kişisel verilerinin işlenip işlenmediğini öğrenme, düzeltilmesini talep etme ve silinmesini isteme hakkına sahiptir. Taleplerinizi kurumsal@napsak.org e-posta adresimize iletebilirsiniz.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await PagesRepository.fetchPageBySlugFromDB("kvkk");
  if (!page || page.publicationStatus !== "PUBLISHED") {
    return {
      title: "Sayfa Bulunamadı | N'apsak? Gençlik Topluluğu",
    };
  }

  const title = page.metaTitle || `${page.title} | N'apsak? Gençlik Topluluğu`;
  const description =
    page.metaDescription ||
    page.shortDescription ||
    "N'apsak? Gençlik Topluluğu Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni.";

  return {
    title,
    description,
  };
}

export default async function KvkkPage() {
  const page = await PagesRepository.fetchPageBySlugFromDB("kvkk");

  if (!page || page.publicationStatus !== "PUBLISHED") {
    notFound();
  }

  let sections = KVKK_SECTIONS_FALLBACK;
  if (page.content) {
    try {
      const parsed = JSON.parse(page.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        sections = parsed;
      }
    } catch {
      // Content is markdown/plain text, fallback sections remain intact
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <LegalDocumentContent
          title={page.title}
          subtitle={
            page.shortDescription ||
            "Kişisel Verilerin Korunması Kanunu kapsamında haklarınız ve verilerinizin işlenme ilkeleri."
          }
          lastUpdated="Ağustos 2025"
          sections={sections}
        />
      </main>
      <Footer />
    </>
  );
}
