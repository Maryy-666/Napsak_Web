import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// STATİK TEAMS VERİSİ
const TEAMS_DATA = [
  {
    externalId: "teknoloji",
    slug: "teknoloji",
    title: "Teknoloji Ekibi",
    iconName: "cpu",
    bgImage: "/images/istockphoto-1173149385-612x612.jpg",
    shortDescription:
      "Dijitalleşme, inovasyon, yazılım, yapay zeka ve sürdürülebilir teknoloji alanlarında eğitim içerikleri, projeler ve etkinlikler geliştirir.",
    about:
      "Teknoloji Ekibimiz, dijital dönüşümün ve modern teknolojik gelişmelerin dernek çalışmalarına ve gençlik projelerine entegrasyonunu sağlar. Web geliştirmeden yapay zeka çözümlerine, veri analizinden dijital ürün tasarımına kadar geniş bir yelpazede yenilikçi projeler kurgular ve hayata geçirir.",
    focusAreas: [
      "Yazılım & Web Geliştirme",
      "Yapay Zeka & Veri Bilimi",
      "Dijital Ürün Tasarımı & UX/UI",
      "Açık Kaynak Projeler & Araçlar",
      "Teknoloji Atölyeleri & Hackathonlar",
    ],
    whatWeDo: [
      "Derneğimizin dijital platformlarını, web sitesini ve yazılım altyapılarını geliştiriyoruz.",
      "Gençlere yönelik kodlama, yapay zeka ve dijital beceri atölyeleri düzenliyoruz.",
      "Açık kaynak ekosistemine katkı sağlayan yenilikçi projeler kurguluyoruz.",
      "Dernek içi operasyonları otomatize eden dijital çözümler üretiyoruz.",
    ],
    structure:
      "Ekibimiz Proje Yöneticisi, Yazılım Geliştiriciler, UI/UX Tasarımcıları ve Yapay Zeka / Veri masalarından oluşur. Haftalık çevrim içi buluşmalar ve esnek çalışma modelleriyle projelerimizi sürdürürüz.",
    displayOrder: 1,
  },
  {
    externalId: "sanat",
    slug: "sanat",
    title: "Sanat Ekibi",
    iconName: "palette",
    bgImage: "/images/stock-photo-close-up-of-painting-brushes-in-studio-of-artist.jpg",
    shortDescription:
      "Gençlerin sanatsal ve yaratıcı ifade becerilerini geliştirmelerini destekleyen atölyeler ve estetik projeler yürütür.",
    about:
      "Sanat Ekibimiz, görsel sanatlardan dijital tasarıma, estetik ifade biçimlerinden kültür-sanat projelerine kadar gençlerin yaratıcı potansiyellerini keşfetmelerine alan açar. Disiplinlerarası atölyeler ve sergilerle yaratıcılığı dernek ruhuyla buluşturur.",
    focusAreas: [
      "Görsel Sanatlar & İllüstrasyon",
      "Dijital Sanat & Grafik Tasarım",
      "Fotoğrafçılık & Videografi",
      "Kültür-Sanat Atölyeleri",
      "Sergi & Disiplinlerarası Etkinlikler",
    ],
    whatWeDo: [
      "Dernek yayınları, sosyal medya ve projeler için özgün görsel tasarımlar hazırlıyoruz.",
      "Tematik sanat atölyeleri, çizim ve yaratıcılık buluşmaları düzenliyoruz.",
      "Genç sanatçıların eserlerini sergileyebileceği dijital ve fiziki sergiler organize ediyoruz.",
      "Kültür ve sanat odaklı disiplinlerarası ortak projelere imza atıyoruz.",
    ],
    structure:
      "Grafik Tasarım, Görsel Sanatlar, Fotoğraf/Video ve Etkinlik Tasarımı çalışma masalarından oluşan ekibimiz, proje bazlı üretim modeliyle çalışmaktadır.",
    galleryTitle: "Sanatla Üretiyoruz",
    gallery: [
      { src: "/images/sanat-kolaj.jpg", alt: "Sanat Ekibi Eser Kolajı", isFeatured: true },
      { src: "/images/sanat-yuz-soyut.png", alt: "Soyut Yüz & Doğa Sanat Çalışması" },
      { src: "/images/sanat-cicek-vazo.png", alt: "Çiçek ve Vazo Çizimi" },
      { src: "/images/sanat-mavi-formlar.png", alt: "Mavi Organik Formlar Çalışması" },
      { src: "/images/sanat-spiral-vazo.png", alt: "Bitki, Vazo ve Spiral Form Sanat İlhamı" },
      { src: "/images/sanat-palmiye.png", alt: "Palmiye ve Soyut Sahne Çizimi" },
    ],
    displayOrder: 2,
  },
  {
    externalId: "cevre-saglik",
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
    displayOrder: 3,
  },
  {
    externalId: "programlar",
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
    displayOrder: 4,
  },
  {
    externalId: "kurumsal-iletisim",
    slug: "kurumsal-iletisim",
    title: "Kurumsal İletişim Ekibi",
    iconName: "share-2",
    bgImage: "/images/world-map-global-business-communication-network-technology-connection-background_15037139(1).jpg!bw800",
    shortDescription:
      "Derneğin kurumsal kimliğini, medya stratejilerini, dijital mecralarını ve paydaş iş birliklerini yönetir.",
    about:
      "Kurumsal İletişim Ekibimiz, Ne Yapsak? Gençlik Derneği'nun vizyonunu ve ürettiği değeri kamuoyuna ve gençliğe aktarır. Dijital medya yönetimi, stratejik iletişim, basın ilişkileri ve kurumlar arası iş birliği süreçlerini yönetir.",
    focusAreas: [
      "Sosyal Medya Yönetimi & Stratejisi",
      "Marka Yönetimi & Kurumsal Kimlik",
      "Paydaş İlişkileri & İş Birlikleri",
      "Metin Yazarlığı & İçerik Pazarlaması",
      "Medya İlişkileri & Duyurular",
    ],
    whatWeDo: [
      "Derneğimizin tüm sosyal medya hesaplarını ve dijital iletişim kanallarını aktif şekilde yönetiyoruz.",
      "Stratejik iletişim planları kurgulayarak dernek duyurularını ve projelerini yayınlıyoruz.",
      "Sivil toplum, akademi ve özel sektör paydaşlarıyla sürdürülebilir iş birliği süreçleri yürütüyoruz.",
      "Bültenler, basın açıklamaları ve kurumsal tanıtım materyalleri hazırlıyoruz.",
    ],
    structure:
      "Sosyal Medya, Metin & İletişim ve Dış İlişkiler masalarından oluşur. Haftalık içerik planlamaları ve kampanya yönetimi ile aktif iletişim yürütülür.",
    displayOrder: 5,
  },
  {
    externalId: "yonetim-kurulu",
    slug: "yonetim-kurulu",
    title: "Yönetim Kurulu",
    iconName: "shield-check",
    bgImage: "/images/krm.png",
    shortDescription:
      "Ne Yapsak? Gençlik Derneği'nun stratejik kararlarını alan ve genel yönetim süreçlerini icra eden ana yönetim kuruludur.",
    about:
      "Yönetim Kurulu, derneğimizin vizyonunu, operasyonel hedeflerini ve genel yönetim ilkelerini belirleyen, ekipler arası koordinasyonu sağlayan karar organıdır.",
    focusAreas: [
      "Stratejik Planlama & Karar Alma",
      "Dernek Yönetimi & Vizyon",
      "Operasyonel Koordinasyon",
      "Paydaş & Kurumsal İlişkiler",
    ],
    whatWeDo: [
      "Derneğimizin stratejik hedeflerini ve vizyon belgelerini oluşturuyoruz.",
      "Tüm çalışma ekiplerinin eş güdüm içerisinde faaliyet göstermesini sağlıyoruz.",
      "Kurumsal ve sivil toplum ortaklıklarının yönetimini yürütüyoruz.",
    ],
    structure: "Yönetim Kurulu 5 üyeden oluşur.",
    displayOrder: 6,
  },
  {
    externalId: "danisma-kurulu",
    slug: "danisma-kurulu",
    title: "Danışma Kurulu",
    iconName: "award",
    bgImage: "/images/world-map-global-business-communication-network-technology-connection-background_15037139(1).jpg!bw800",
    shortDescription:
      "Derneğimizin vizyon, büyüme ve sürdürülebilirlik odaklı çalışmalarına rehberlik eden kıdemli danışmanlar kurulu.",
    about:
      "Danışma Kurulu; alanında uzman isimler ve kurumsal liderlerden oluşarak Ne Yapsak? Gençlik Derneği'nun stratejik yönelimlerine ve toplumsal etki projelerine rehberlik etmektedir.",
    focusAreas: [
      "Stratejik Danışmanlık & Rehberlik",
      "Sürdürülebilirlik & Gelecek Vizyonu",
      "Toplumsal Etki & Gençlik Politikaları",
    ],
    whatWeDo: [
      "Derneğin uzun vadeli büyüme stratejilerine danışmanlık sağlıyoruz.",
      "Gençlik alanındaki yenilikçi projelere kurumsal rehberlik sunuyoruz.",
    ],
    structure: "Danışma Kurulu seçkin liderler ve danışmanlardan oluşur.",
    displayOrder: 7,
  },
];

// STATİK MEMBERS VERİSİ
const PUBLIC_MEMBERS = [
  // DERNEK EŞ BAŞKANLARI & YÖNETİM/DANIŞMA KURULU
  { id: "m-kadir-colmekci", name: "Kadir Çölmekci", initials: "KÇ", primaryTeam: "Dernek Eş Başkanları", primaryRole: "Dernek Eş Başkanı", isPresident: true, memberships: [{ team: "Dernek Başkanlığı", role: "Dernek Eş Başkanı" }, { team: "Yönetim Kurulu", role: "Yönetim Kurulu Üyesi" }] },
  { id: "m-humeyra-erdonmez", name: "Hümeyra Erdönmez", initials: "HE", primaryTeam: "Dernek Eş Başkanları", primaryRole: "Dernek Eş Başkanı", isPresident: true, memberships: [{ team: "Dernek Başkanlığı", role: "Dernek Eş Başkanı" }, { team: "Yönetim Kurulu", role: "Yönetim Kurulu Üyesi" }] },
  { id: "m-yunus-efe-kolukisa", name: "Yunus Efe Kolukısa", initials: "YEK", primaryTeam: "Yönetim Kurulu", primaryRole: "Yönetim Kurulu Üyesi", isPresident: false, memberships: [{ team: "Yönetim Kurulu", role: "Yönetim Kurulu Üyesi" }] },
  { id: "m-nevgul-bilsel-safkan", name: "Nevgül Bilsel Safkan", initials: "NBS", primaryTeam: "Danışma Kurulu", primaryRole: "Sabancı Vakfı Genel Müdürü", isPresident: false, memberships: [{ team: "Danışma Kurulu", role: "Sabancı Vakfı Genel Müdürü" }] },

  // 1. SANAT ÇALIŞMA GRUBU
  { id: "m-zeynep-sude-bulbul", name: "Zeynep Sude Bülbül", initials: "ZB", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Başkan", memberships: [{ team: "Sanat Çalışma Grubu", role: "Başkan" }] },
  { id: "m-eylul-deniz-yalcin", name: "Eylül Deniz Yalçın", initials: "EDY", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Başkan Yardımcısı", memberships: [{ team: "Sanat Çalışma Grubu", role: "Başkan Yardımcısı" }, { team: "Programlar Çalışma Grubu", role: "Uzman" }] },
  { id: "m-ayse-aksoy-dikici", name: "Ayşe Aksoy Dikici", initials: "AAD", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-ebrar-akkaya", name: "Ebrar Akkaya", initials: "EA", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-beren-kar", name: "Beren Kar", initials: "BK", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-beyza-ekinci", name: "Beyza Ekinci", initials: "BE", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-ebrar-gonul-kurt", name: "Ebrar Gönül Kurt", initials: "EGK", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-merve-civan", name: "Merve Civan", initials: "MC", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-meryem-bozkurt", name: "Meryem Bozkurt", initials: "MB", primaryTeam: "Teknoloji Ekibi", primaryRole: "Başkan Yardımcısı", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }, { team: "Teknoloji Ekibi", role: "Başkan Yardımcısı" }] },
  { id: "m-meryem-rana-aslan", name: "Meryem Rana Aslan", initials: "MRA", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-kevser-sagir", name: "Kevser Sağır", initials: "KS", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-ecenaz-yilmaz", name: "Ecenaz Yılmaz", initials: "EY", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }] },
  { id: "m-yagmur-cetin", name: "Yağmur Çetin", initials: "YÇ", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman" }, { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }, { team: "Programlar Çalışma Grubu", role: "Uzman" }] },
  { id: "m-pinar-cicek", name: "Pınar Çiçek", initials: "PÇ", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Uzman-Raportör", memberships: [{ team: "Sanat Çalışma Grubu", role: "Uzman-Raportör" }, { team: "Kurumsal İletişim Departmanı", role: "SM Uzman" }, { team: "Kurumsal İletişim Departmanı", role: "SDM Uzman" }] },
  { id: "m-eylul-burcu-kara", name: "Eylül Burcu Kara", initials: "EBK", primaryTeam: "Sanat Çalışma Grubu", primaryRole: "Tiyatro Koordinatörü", memberships: [{ team: "Sanat Çalışma Grubu", role: "Tiyatro Koordinatörü" }, { team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }] },

  // 2. KURUMSAL İLETİŞİM DEPARTMANI
  { id: "m-zehranur-vardar", name: "Zehranur Vardar", initials: "ZV", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Başkan", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Başkan" }] },
  { id: "m-feyza-soyturk", name: "Feyza Soytürk", initials: "FS", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Başkan Yardımcısı", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Başkan Yardımcısı" }] },
  { id: "m-aysegul-tugce-kartal", name: "Ayşegül Tuğçe Kartal", initials: "ATK", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Kİ Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }] },
  { id: "m-deniz-ayse-brijavi", name: "Deniz Ayşe Brıjavı", initials: "DAB", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Kİ Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }, { team: "Sağlık ve Çevre Çalışma Grubu", role: "Uzman" }] },
  { id: "m-erdeniz-erdaloglu", name: "Erdeniz Erdaloğlu", initials: "EE", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Kİ Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }] },
  { id: "m-feyza-dinc", name: "Feyza Dinç", initials: "FD", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Kİ Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }] },
  { id: "m-melike-saglik", name: "Melike Sağlık", initials: "MS", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Kİ Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }] },
  { id: "m-rumeysa-aki", name: "Rümeysa Akı", initials: "RA", primaryTeam: "Sağlık ve Çevre Çalışma Grubu", primaryRole: "Başkan Yardımcısı", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }, { team: "Sağlık ve Çevre Çalışma Grubu", role: "Başkan Yardımcısı" }] },
  { id: "m-ekin-ozbay", name: "Ekin Özbay", initials: "EÖ", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Kİ Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Kİ Uzman" }] },
  { id: "m-aybike-gurbuzce", name: "Aybike Gürbüzce", initials: "AG", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "SM Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "SM Uzman" }, { team: "Programlar Çalışma Grubu", role: "Uzman" }] },
  { id: "m-gulsah-sena-kilic", name: "Gülşah Sena Kılıç", initials: "GSK", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "SM Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "SM Uzman" }] },
  { id: "m-sila-gulagaoglu", name: "Sıla Gülağaoğlu", initials: "SG", primaryTeam: "Programlar Çalışma Grubu", primaryRole: "Başkan Yardımcısı", memberships: [{ team: "Programlar Çalışma Grubu", role: "Başkan Yardımcısı" }, { team: "Kurumsal İletişim Departmanı", role: "SM Uzman" }, { team: "Sağlık ve Çevre Çalışma Grubu", role: "Uzman" }] },
  { id: "m-melis-ada-yazar", name: "Melis Ada Yazar", initials: "MAY", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "SM Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "SM Uzman" }] },
  { id: "m-batuhan-orak", name: "Batuhan Orak", initials: "BO", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "Sohbet Düzeni ve Moderasyon Koordinatörü", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "Sohbet Düzeni ve Moderasyon Koordinatörü" }] },
  { id: "m-alime-cam", name: "Alime Çam", initials: "AÇ", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "SDM Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "SDM Uzman" }] },
  { id: "m-elif-tuana-akpinar", name: "Elif Tuana Akpınar", initials: "ETA", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "SDM Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "SDM Uzman" }, { team: "Programlar Çalışma Grubu", role: "Uzman" }] },
  { id: "m-bilal-cevik", name: "Bilal Çevik", initials: "BÇ", primaryTeam: "Kurumsal İletişim Departmanı", primaryRole: "SDM Uzman", memberships: [{ team: "Kurumsal İletişim Departmanı", role: "SDM Uzman" }] },

  // 3. PROGRAMLAR ÇALIŞMA GRUBU
  { id: "m-aysegul-kartal", name: "Ayşegül Kartal", initials: "AK", primaryTeam: "Programlar Çalışma Grubu", primaryRole: "Başkan", memberships: [{ team: "Programlar Çalışma Grubu", role: "Başkan" }] },
  { id: "m-buglem-yavuz", name: "Buğlem Yavuz", initials: "BY", primaryTeam: "Programlar Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Programlar Çalışma Grubu", role: "Uzman" }] },
  { id: "m-emine-savci", name: "Emine Savcı", initials: "ES", primaryTeam: "Programlar Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Programlar Çalışma Grubu", role: "Uzman" }] },
  { id: "m-abdullah-nazim-karanfil", name: "Abdullah Nazım Karanfil", initials: "ANK", primaryTeam: "Programlar Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Programlar Çalışma Grubu", role: "Uzman" }, { team: "Teknoloji Ekibi", role: "Uzman" }] },

  // 4. SAĞLIK VE ÇEVRE ÇALIŞMA GRUBU
  { id: "m-sude-erol", name: "Sude Erol", initials: "SE", primaryTeam: "Sağlık ve Çevre Çalışma Grubu", primaryRole: "Başkan", memberships: [{ team: "Sağlık ve Çevre Çalışma Grubu", role: "Başkan" }] },
  { id: "m-ayse-ilayda-eracar", name: "Ayşe İlayda Eracar", initials: "AİE", primaryTeam: "Sağlık ve Çevre Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sağlık ve Çevre Çalışma Grubu", role: "Uzman" }] },
  { id: "m-sedanur-balta", name: "Sedanur Balta", initials: "SB", primaryTeam: "Sağlık ve Çevre Çalışma Grubu", primaryRole: "Uzman", memberships: [{ team: "Sağlık ve Çevre Çalışma Grubu", role: "Uzman" }] },

  // 5. TEKNOLOJİ EKİBİ
  { id: "m-ege-berk-oter", name: "Ege Berk Oter", initials: "EBO", primaryTeam: "Teknoloji Ekibi", primaryRole: "Başkan", memberships: [{ team: "Teknoloji Ekibi", role: "Başkan" }] },
  { id: "m-azra-fatma-kalayci", name: "Azra Fatma Kalaycı", initials: "AFK", primaryTeam: "Teknoloji Ekibi", primaryRole: "Uzman", memberships: [{ team: "Teknoloji Ekibi", role: "Uzman" }] },
  { id: "m-iskender-aras-ocak", name: "İskender Aras Ocak", initials: "İAO", primaryTeam: "Teknoloji Ekibi", primaryRole: "Uzman", memberships: [{ team: "Teknoloji Ekibi", role: "Uzman" }] },
  { id: "m-helin-akalin", name: "Helin Akalın", initials: "HA", primaryTeam: "Teknoloji Ekibi", primaryRole: "Uzman", memberships: [{ team: "Teknoloji Ekibi", role: "Uzman" }] },
  { id: "m-elif-yaldiz", name: "Elif Yaldız", initials: "EY", primaryTeam: "Teknoloji Ekibi", primaryRole: "Uzman", memberships: [{ team: "Teknoloji Ekibi", role: "Uzman", subRole: "Web Sitesi Ekibi" }, { team: "Web Sitesi", role: "Web Sitesi Ekibi" }] },
  { id: "m-dilara-ozocak", name: "Dilara Özocak", initials: "DÖ", primaryTeam: "Teknoloji Ekibi", primaryRole: "Uzman", memberships: [{ team: "Teknoloji Ekibi", role: "Uzman" }] },
  { id: "m-yusuf-barut", name: "Yusuf Barut", initials: "YB", primaryTeam: "Teknoloji Ekibi", primaryRole: "Uzman", memberships: [{ team: "Teknoloji Ekibi", role: "Uzman", subRole: "Web Sitesi Sorumlusu" }, { team: "Web Sitesi", role: "Web Sitesi Sorumlusu" }] },
  { id: "m-feyzanur-olcay", name: "Feyzanur Olçay", initials: "FO", primaryTeam: "Teknoloji Ekibi", primaryRole: "Uzman", memberships: [{ team: "Teknoloji Ekibi", role: "Uzman", subRole: "Web Sitesi Ekibi" }, { team: "Web Sitesi", role: "Web Sitesi Ekibi" }] },
  { id: "m-ayoub-rebhi", name: "Ayoub Rebhi", initials: "AR", primaryTeam: "Teknoloji Ekibi", primaryRole: "Uzman", memberships: [{ team: "Teknoloji Ekibi", role: "Uzman" }] },
];

const NEWS_DATA = [
  {
    slug: "kil-atolyesi",
    title: "Kil Atölyesi: Çamurdan Hayallere",
    publishDate: "15 Ekim 2025",
    category: "Sanat & Atölye",
    summary:
      "Gençlerimizin elleriyle şekil verdiği, el becerilerini ve sanatsal ifade güçlerini ortaya çıkardığı keyifli bir kil atölyesi gerçekleştirdik.",
    coverImage: "/images/news-kil-cover.jpg",
    content:
      "Ne Yapsak? Gençlik Derneği Sanat Ekibi organizasyonuyla düzenlenen Kil Atölyesi'nde gençler bir araya gelerek doğal kil hamuru ile kendi özgün tasarımlarını oluşturdular. Dokunsal üretimin huzuru ve yaratıcılığın coşkusuyla geçen etkinlikte katılımcılar hem stres attı hem de evlerine götürebilecekleri el yapımı seramik objeler ürettiler. Atölye boyunca seramik şekillendirme, rölyef dokuları ve renklendirme teknikleri deneyimlendi.",
    images: [
      "/images/news-kil-main.png",
      "/images/news-kil-cover.jpg",
      "/images/news-kil-1.jpg",
      "/images/news-kil-2.jpg",
      "/images/news-kil-3.jpg",
      "/images/news-kil-4.jpg",
      "/images/news-kil-5.jpg",
    ],
  },
  {
    slug: "cadilar-bayrami",
    title: "Cadılar Bayramı Konseptli Gençlik Buluşması",
    publishDate: "31 Ekim 2025",
    category: "Etkinlik & Eğlence",
    summary:
      "Renkli kostümler, yaratıcı makyajlar ve tematik oyunlarla dolu eğlenceli bir Cadılar Bayramı buluşmasında bir araya geldik.",
    coverImage: "/images/news-cd-cover.jpg",
    content:
      "Derneğimizin eğlenceli ve sosyalleşme odaklı etkinliklerinden biri olan Cadılar Bayramı temalı akşamda gençler yaratıcı kostümleriyle geceye renk kattı. Tematik oyunlar, müzik dinletisi ve lezzetli ikramlar eşliğinde gerçekleşen etkinlikte dernek üyelerimiz arasındaki bağlar daha da güçlendi. Fotoğraf köşesi ve kostüm yarışması etkinliğin öne çıkan anları arasındaydı.",
    images: ["/images/news-cd-cover.jpg", "/images/news-cd-1.jpg"],
  },
  {
    slug: "ani-defteri-atolyesi",
    title: "Anı Defteri Atölyesi: Anıları Ölümsüzleştiriyoruz",
    publishDate: "12 Kasım 2025",
    category: "Tasarım & Üretim",
    summary:
      "Fotoğraflar, illüstrasyonlar ve el yazılarıyla kişiselleştirilen özel anı defteri tasarımı atölyemizde yaratıcı fikirler buluştu.",
    coverImage: "/images/news-ani-cover.jpg",
    content:
      "Görsel sanatlar ve tasarım meraklısı gençlerle gerçekleştirdiğimiz Anı Defteri Atölyesi'nde her katılımcı kendi hikayesini ve dernek anılarını özgün defter sayfalarına dönüştürdü. Scrapbooking teknikleri, suluboya dokunuşları ve özel dikiş ciltleme yöntemleriyle hazırlanan defterler unutulmaz birer hatıra oldu. Katılımcılar fotoğraflarla süsledikleri sayfalarla kendi kişisel günlüklerini tasarladılar.",
    images: [
      "/images/news-ani-cover.jpg",
      "/images/news-ani-1.jpg",
      "/images/news-ani-2.jpg",
      "/images/news-ani-3.jpg",
    ],
  },
  {
    slug: "kariyer-z-1923-is-birligi",
    title: "Kariyer Z x 1923 İş Birliği",
    publishDate: "28 Kasım 2025",
    category: "Kariyer & İş Birliği",
    summary:
      "Gençliğin geleceğe yön veren yetkinliklerini artırmak amacıyla Kariyer Z ve 1923 vizyonu ile ortak projeler ve buluşmalar kurguladık.",
    coverImage: "/images/news-kariyer-cover.jpg",
    content:
      "Ne Yapsak? Gençlik Derneği ve Kariyer Z iş birliğinde düzenlenen stratejik gençlik buluşmasında, Z kuşağının iş hayatındaki rolü, girişimcilik ve geleceğin meslekleri ele alındı. İş birliği kapsamında düzenlenen törende gençler tecrübe paylaşımı fırsatı bulurken ilham verici sunumlar ve networking oturumları gerçekleştirildi. Cumhuriyetimizin 100 yılı aşan birikiminden güç alarak gençliğe vizyon katan ortak projeler duyuruldu.",
    images: [
      "/images/news-kariyer-cover.jpg",
      "/images/news-kariyer-1.jpg",
      "/images/news-kariyer-2.jpg",
      "/images/news-kariyer-3.jpg",
      "/images/hero-slide-1.jpg",
    ],
  },
  {
    slug: "23-nisan",
    title: "23 Nisan Coşkusu: Atatürk'ün Çocuklara Armağanı",
    publishDate: "23 Nisan 2025",
    category: "Toplumsal Fayda & Milli Bayram",
    summary:
      "Gazi Mustafa Kemal Atatürk'ün çocuklara ve yarınlarımıza armağan ettiği 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı'nı coşkuyla kutladık.",
    coverImage: "/images/ataturk-portrait.jpg",
    content:
      "Gazi Mustafa Kemal Atatürk, Türkiye Büyük Millet Meclisi'nin açıldığı 23 Nisan gününü dünyada ilk ve tek çocuk bayramı olarak ulusumuzun ve tüm dünya çocuklarına armağan etmiştir. Atatürk'ün 'Çocuklar geleceğimizin güvencesi, yaşama sevincimizdir. Bugünün çocuğunu yetiştirmek yarının büyüğünü yetiştirmektir' anlayışından ilham alarak Ne Yapsak? Gençlik Derneği olarak 23 Nisan coşkusunu sahada çocuklarla buluşturduk. Yüz boyama, oyun parkurları, resim atölyeleri ve tiyatro gösterileriyle 'Birlikte düşleyelim, birlikte değiştirelim!' sloganımızı hayata geçirdik.",
    quoteText:
      "Küçük hanımlar, küçük beyler! Sizler hepiniz geleceğin bir gülü, yıldızı ve ikbal ışığısınız. Memleketi asıl ışığa boğacak olan sizsiniz.",
    quoteAuthor: "Gazi Mustafa Kemal Atatürk",
    quoteTitle: "Türkiye Cumhuriyeti'nin Kurucusu",
    images: [
      "/images/ataturk-portrait.jpg",
      "/images/news-23nisan-banner.png",
      "/images/news-23nisan-cover.jpg",
      "/images/news-23nisan-1.jpg",
      "/images/news-23nisan-2.jpg",
      "/images/news-23nisan-3.jpg",
      "/images/news-23nisan-4.jpg",
      "/images/news-23nisan-5.jpg",
    ],
  },
];

function getTeamSlugByName(teamName: string): string | null {
  const t = teamName.toLowerCase().trim();
  if (t.includes("teknoloji")) return "teknoloji";
  if (t.includes("sanat")) return "sanat";
  if (t.includes("sağlık") || t.includes("çevre")) return "cevre-saglik";
  if (t.includes("program")) return "programlar";
  if (t.includes("kurumsal") || t.includes("iletişim")) return "kurumsal-iletisim";
  if (t.includes("yönetim")) return "yonetim-kurulu";
  if (t.includes("danışma")) return "danisma-kurulu";
  return null;
}

async function main() {
  console.log("🌱 SEED İŞLEMİ BAŞLIYOR...");

  // 1. Ekipleri veritabanına ekle/güncelle
  const createdTeamsMap = new Map<string, any>();
  for (const t of TEAMS_DATA) {
    const teamRecord = await prisma.team.upsert({
      where: { externalId: t.externalId },
      update: {
        slug: t.slug,
        title: t.title,
        shortDescription: t.shortDescription,
        iconName: t.iconName,
        bgImage: t.bgImage,
        about: t.about,
        focusAreas: t.focusAreas,
        whatWeDo: t.whatWeDo,
        structure: t.structure,
        featuredSectionImage: t.featuredSectionImage || null,
        galleryTitle: t.galleryTitle || null,
        gallery: (t.gallery as any) || undefined,
        displayOrder: t.displayOrder,
        isActive: true,
      },
      create: {
        externalId: t.externalId,
        slug: t.slug,
        title: t.title,
        shortDescription: t.shortDescription,
        iconName: t.iconName,
        bgImage: t.bgImage,
        about: t.about,
        focusAreas: t.focusAreas,
        whatWeDo: t.whatWeDo,
        structure: t.structure,
        featuredSectionImage: t.featuredSectionImage || null,
        galleryTitle: t.galleryTitle || null,
        gallery: (t.gallery as any) || undefined,
        displayOrder: t.displayOrder,
        isActive: true,
      },
    });
    createdTeamsMap.set(t.slug, teamRecord);
    console.log(`✅ Ekip DB'ye yazıldı: ${teamRecord.title} (ID: ${teamRecord.id})`);
  }

  // 2. Üyeleri ve Üyelik İlişkilerini veritabanına ekle
  for (const m of PUBLIC_MEMBERS) {
    const profile = await prisma.memberProfile.upsert({
      where: { externalId: m.id },
      update: {
        name: m.name,
        initials: m.initials,
        primaryTeam: m.primaryTeam,
        primaryRole: m.primaryRole,
        isPresident: m.isPresident || false,
      },
      create: {
        externalId: m.id,
        name: m.name,
        initials: m.initials,
        primaryTeam: m.primaryTeam,
        primaryRole: m.primaryRole,
        isPresident: m.isPresident || false,
      },
    });

    // Üyeliklerini (TeamMembership) bağla
    for (const mem of m.memberships) {
      const teamSlug = getTeamSlugByName(mem.team);
      if (!teamSlug) continue;

      const teamObj = createdTeamsMap.get(teamSlug);
      if (!teamObj) continue;

      const isLeader = mem.role === "Başkan";

      await prisma.teamMembership.upsert({
        where: {
          memberId_teamId: {
            memberId: profile.id,
            teamId: teamObj.id,
          },
        },
        update: {
          roleTitle: mem.role,
          subRole: (mem as any).subRole || null,
          isLeader: isLeader,
        },
        create: {
          memberId: profile.id,
          teamId: teamObj.id,
          roleTitle: mem.role,
          subRole: (mem as any).subRole || null,
          isLeader: isLeader,
        },
      });

      // Eğer Ekip Başkanı ise Team.leaderId de güncellensin
      if (isLeader) {
        await prisma.team.update({
          where: { id: teamObj.id },
          data: { leaderId: profile.id },
        });
        console.log(`👑 ${teamObj.title} Başkanı olarak atandı: ${profile.name}`);
      }
    }
  }

  // 3. Doğrulama Sayıları
  for (const [index, news] of NEWS_DATA.entries()) {
    const newsRecord = await prisma.news.upsert({
      where: { slug: news.slug },
      update: {
        title: news.title,
        summary: news.summary,
        content: news.content,
        coverImage: news.coverImage,
        category: news.category,
        publishDate: news.publishDate,
        readTime: "3 dk",
        publicationStatus: "PUBLISHED",
        isFeatured: index < 3,
        displayOrder: index + 1,
        quoteText: news.quoteText || null,
        quoteAuthor: news.quoteAuthor || null,
        quoteTitle: news.quoteTitle || null,
        images: news.images,
      },
      create: {
        slug: news.slug,
        title: news.title,
        summary: news.summary,
        content: news.content,
        coverImage: news.coverImage,
        category: news.category,
        publishDate: news.publishDate,
        readTime: "3 dk",
        publicationStatus: "PUBLISHED",
        isFeatured: index < 3,
        displayOrder: index + 1,
        quoteText: news.quoteText || null,
        quoteAuthor: news.quoteAuthor || null,
        quoteTitle: news.quoteTitle || null,
        images: news.images,
      },
    });

    console.log(`Haber DB'ye yazildi: ${newsRecord.title} (ID: ${newsRecord.id})`);
  }

  const teamCount = await prisma.team.count();
  const memberCount = await prisma.memberProfile.count();
  const membershipCount = await prisma.teamMembership.count();

  console.log("\n📊 SEED TAMAMLANDI VERİTABANI DOĞRULAMA:");
  console.log(`- Toplam Ekip Sayısı: ${teamCount}`);
  console.log(`- Toplam Üye Profili Sayısı: ${memberCount}`);
  console.log(`- Toplam Üyelik İlişkisi Sayısı: ${membershipCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed Hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
