import { Metadata } from "next";
import { Navbar } from "../../components/common/Navbar";
import { Footer } from "../../components/common/Footer";
import LegalDocumentContent from "../../components/legal/LegalDocumentContent";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | N'apsak? Gençlik Topluluğu",
  description: "N'apsak? Gençlik Topluluğu Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni.",
};

const KVKK_SECTIONS = [
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

export default function KvkkPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-16">
        <LegalDocumentContent
          title="KVKK Aydınlatma Metni"
          subtitle="Kişisel Verilerin Korunması Kanunu kapsamında haklarınız ve verilerinizin işlenme ilkeleri."
          lastUpdated="Ağustos 2025"
          sections={KVKK_SECTIONS}
        />
      </main>
      <Footer />
    </>
  );
}
