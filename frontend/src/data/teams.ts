import {
  Cpu,
  Palette,
  HeartPulse,
  BookOpen,
  Share2,
  LucideIcon,
} from "lucide-react";

export type TeamIconKey =
  | "cpu"
  | "palette"
  | "heart-pulse"
  | "book-open"
  | "share-2";

export interface TeamGalleryItem {
  src: string;
  alt: string;
  isFeatured?: boolean;
}

export interface TeamData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  iconName: TeamIconKey;
  bgImage: string;
  about: string;
  focusAreas: string[];
  whatWeDo: string[];
  structure: string;
  featuredSectionImage?: string;
  galleryTitle?: string;
  gallery?: TeamGalleryItem[];
  status?: "Aktif" | "Pasif";
  displayOrder?: number;
  membersList?: any[];
}

export const TEAM_ICONS: Record<TeamIconKey, LucideIcon> = {
  cpu: Cpu,
  palette: Palette,
  "heart-pulse": HeartPulse,
  "book-open": BookOpen,
  "share-2": Share2,
};

export const TEAMS_DATA: TeamData[] = [
  {
    id: "teknoloji",
    slug: "teknoloji",
    title: "Teknoloji Ekibi",
    iconName: "cpu",
    bgImage: "/images/istockphoto-1173149385-612x612.jpg",
    shortDescription:
      "Dijitalleşme, inovasyon, yazılım, yapay zeka ve sürdürülebilir teknoloji alanlarında eğitim içerikleri, projeler ve etkinlikler geliştirir.",
    about:
      "Teknoloji Ekibimiz, dijital dönüşümün ve modern teknolojik gelişmelerin topluluk çalışmalarına ve gençlik projelerine entegrasyonunu sağlar. Web geliştirmeden yapay zeka çözümlerine, veri analizinden dijital ürün tasarımına kadar geniş bir yelpazede yenilikçi projeler kurgular ve hayata geçirir.",
    focusAreas: [
      "Yazılım & Web Geliştirme",
      "Yapay Zeka & Veri Bilimi",
      "Dijital Ürün Tasarımı & UX/UI",
      "Açık Kaynak Projeler & Araçlar",
      "Teknoloji Atölyeleri & Hackathonlar",
    ],
    whatWeDo: [
      "Topluluğumuzun dijital platformlarını, web sitesini ve yazılım altyapılarını geliştiriyoruz.",
      "Gençlere yönelik kodlama, yapay zeka ve dijital beceri atölyeleri düzenliyoruz.",
      "Açık kaynak ekosistemine katkı sağlayan yenilikçi projeler kurguluyoruz.",
      "Topluluk içi operasyonları otomatize eden dijital çözümler üretiyoruz.",
    ],
    structure:
      "Ekibimiz Proje Yöneticisi, Yazılım Geliştiriciler, UI/UX Tasarımcıları ve Yapay Zeka / Veri masalarından oluşur. Haftalık çevrim içi buluşmalar ve esnek çalışma modelleriyle projelerimizi sürdürürüz.",
  },
  {
    id: "sanat",
    slug: "sanat",
    title: "Sanat Ekibi",
    iconName: "palette",
    bgImage: "/images/stock-photo-close-up-of-painting-brushes-in-studio-of-artist.jpg",
    shortDescription:
      "Gençlerin sanatsal ve yaratıcı ifade becerilerini geliştirmelerini destekleyen atölyeler ve estetik projeler yürütür.",
    about:
      "Sanat Ekibimiz, görsel sanatlardan dijital tasarıma, estetik ifade biçimlerinden kültür-sanat projelerine kadar gençlerin yaratıcı potansiyellerini keşfetmelerine alan açar. Disiplinlerarası atölyeler ve sergilerle yaratıcılığı topluluk ruhuyla buluşturur.",
    focusAreas: [
      "Görsel Sanatlar & İllüstrasyon",
      "Dijital Sanat & Grafik Tasarım",
      "Fotoğrafçılık & Videografi",
      "Kültür-Sanat Atölyeleri",
      "Sergi & Disiplinlerarası Etkinlikler",
    ],
    whatWeDo: [
      "Topluluk yayınları, sosyal medya ve projeler için özgün görsel tasarımlar hazırlıyoruz.",
      "Tematik sanat atölyeleri, çizim ve yaratıcılık buluşmaları düzenliyoruz.",
      "Genç sanatçıların eserlerini sergileyebileceği dijital ve fiziki sergiler organize ediyoruz.",
      "Kültür ve sanat odaklı disiplinlerarası ortak projelere imza atıyoruz.",
    ],
    structure:
      "Grafik Tasarım, Görsel Sanatlar, Fotoğraf/Video ve Etkinlik Tasarımı çalışma masalarından oluşan ekibimiz, proje bazlı üretim modeliyle çalışmaktadır.",
    galleryTitle: "Sanatla Üretiyoruz",
    gallery: [
      {
        src: "/images/sanat-kolaj.jpg",
        alt: "Sanat Ekibi Eser Kolajı",
        isFeatured: true,
      },
      {
        src: "/images/sanat-yuz-soyut.png",
        alt: "Soyut Yüz & Doğa Sanat Çalışması",
      },
      {
        src: "/images/sanat-cicek-vazo.png",
        alt: "Çiçek ve Vazo Çizimi",
      },
      {
        src: "/images/sanat-mavi-formlar.png",
        alt: "Mavi Organik Formlar Çalışması",
      },
      {
        src: "/images/sanat-spiral-vazo.png",
        alt: "Bitki, Vazo ve Spiral Form Sanat İlhamı",
      },
      {
        src: "/images/sanat-palmiye.png",
        alt: "Palmiye ve Soyut Sahne Çizimi",
      },
    ],
  },
  {
    id: "cevre-saglik",
    slug: "cevre-saglik",
    title: "Çevre ve Sağlık Ekibi",
    iconName: "heart-pulse",
    bgImage: "/images/pngtree-vibrant-earth-planet-surrounded-by-fresh-green-leaves-eco-friendly-concept-image_21673995.webp",
    featuredSectionImage: "/images/cevre-ve-saglik.png",
    shortDescription:
      "Sürdürülebilirlik, çevre bilinci, sağlıklı yaşam ve toplumsal fayda odaklı sosyal sorumluluk projeleri gerçekleştirir.",
    about:
      "Çevre ve Sağlık Ekibimiz; ekolojik farkındalık, iklim krizi, sıfır atık bilinci, ruh ve beden sağlığı ile toplumsal esenlik alanlarında gençlerde sürdürülebilir alışkanlıklar ve sorumluluk duygusu geliştirmeyi hedefler.",
    focusAreas: [
      "Ekolojik Farkındalık & İklim Eylemi",
      "Sıfır Atık & Sürdürülebilirlik",
      "Ruh Sağlığı & Sağlıklı Yaşam Bilinci",
      "Saha Etkinlikleri & Doğa Buluşmaları",
      "Toplumsal Fayda Projeleri",
    ],
    whatWeDo: [
      "Doğa dostu yaşam ve sürdürülebilirlik odaklı farkındalık projeleri yürütüyoruz.",
      "Gençlerin bütünsel esenliğini ve ruh sağlığını destekleyen söyleşiler düzenliyoruz.",
      "Doğa yürüyüşleri, çevre temizliği ve ekolojik atölyeler kurguluyoruz.",
      "Sürdürülebilirlik rehberleri ve bilgi içerikleri hazırlayarak toplumu bilinçlendiriyoruz.",
    ],
    structure:
      "Çevre & Ekoloji Masası ve Sağlık & Esenlik Masası olmak üzere iki ana kolda faaliyet gösterir. Gönüllü katılım ve proje odaklı çalışma prensibi benimsenir.",
  },
  {
    id: "programlar",
    slug: "programlar",
    title: "Programlar Ekibi",
    iconName: "book-open",
    bgImage: "/images/krm.png",
    shortDescription:
      "Gençlerin kişisel, akademik ve mesleki gelişim yolculuklarına katkı sağlayan kapsayıcı eğitim ve gelişim programları kurgular.",
    about:
      "Programlar Ekibimiz, gençlerin geleceğe yetkin bir şekilde hazırlanması için mentörlük süreçleri, bootcamp'ler, akademi serileri ve kişisel gelişim içerikleri kurgular. Kapsayıcı ve erişilebilir öğrenme ortamları sunar.",
    focusAreas: [
      "Eğitim Müfredatı & Müfredat Tasarımı",
      "Mentörlük & Koçluk Programları",
      "Akademi & Atölye Serileri",
      "Kariyer & Becerileri Geliştirme",
      "Gençlik Buluşmaları & Kamplar",
    ],
    whatWeDo: [
      "Dönemsel beceri geliştirme akademileri ve sertifika programları tasarlıyoruz.",
      "Alanında uzman isimlerle webinarlar, paneller ve söyleşiler gerçekleştiriyoruz.",
      "Gençlerin kariyer adımlarına destek verecek mentörlük ağları kurguluyoruz.",
      "Eğitim rehberleri ve öğrenme haritaları hazırlıyoruz.",
    ],
    structure:
      "Program Tasarımı, Eğitim Koordinasyonu ve Katılımcı İlişkileri masalarından oluşur. Dönemsel takvim ve modüler eğitim planları ile ilerler.",
  },
  {
    id: "kurumsal-iletisim",
    slug: "kurumsal-iletisim",
    title: "Kurumsal İletişim Ekibi",
    iconName: "share-2",
    bgImage: "/images/world-map-global-business-communication-network-technology-connection-background_15037139(1).jpg!bw800",
    shortDescription:
      "Topluluğun kurumsal kimliğini, medya stratejilerini, dijital mecralarını ve paydaş iş birliklerini yönetir.",
    about:
      "Kurumsal İletişim Ekibimiz, N'apsak? Gençlik Topluluğu'nun vizyonunu ve ürettiği değeri kamuoyuna ve gençliğe aktarır. Dijital medya yönetimi, stratejik iletişim, basın ilişkileri ve kurumlar arası iş birliği süreçlerini yönetir.",
    focusAreas: [
      "Sosyal Medya Yönetimi & Stratejisi",
      "Marka Yönetimi & Kurumsal Kimlik",
      "Paydaş İlişkileri & İş Birlikleri",
      "Metin Yazarlığı & İçerik Pazarlaması",
      "Medya İlişkileri & Duyurular",
    ],
    whatWeDo: [
      "Topluluğumuzun tüm sosyal medya hesaplarını ve dijital iletişim kanallarını aktif şekilde yönetiyoruz.",
      "Stratejik iletişim planları kurgulayarak topluluk duyurularını ve projelerini yayınlıyoruz.",
      "Sivil toplum, akademi ve özel sektör paydaşlarıyla sürdürülebilir iş birliği süreçleri yürütüyoruz.",
      "Bültenler, basın açıklamaları ve kurumsal tanıtım materyalleri hazırlıyoruz.",
    ],
    structure:
      "Sosyal Medya, Metin & İletişim ve Dış İlişkiler masalarından oluşur. Haftalık içerik planlamaları ve kampanya yönetimi ile aktif iletişim yürütülür.",
  },
];

export function getTeamBySlug(slug: string): TeamData | undefined {
  if (!slug) return undefined;
  const normalizedSlug = slug.toLowerCase().trim();
  if (normalizedSlug === "cevre-doga") {
    return TEAMS_DATA.find((t) => t.slug === "cevre-saglik");
  }
  return TEAMS_DATA.find(
    (t) => t.slug === normalizedSlug || t.id === normalizedSlug
  );
}
