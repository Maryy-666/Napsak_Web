export interface NewsQuote {
  text: string;
  author: string;
  title?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  date: string;
  category: string;
  categoryEn?: string;
  excerpt: string;
  excerptEn?: string;
  coverImage: string;
  content: string;
  contentEn?: string;
  quote?: NewsQuote;
  images: string[];
}

export const NEWS_DATA: NewsItem[] = [
  {
    id: "mentorluk-programi-basvurulari-basladi",
    slug: "mentorluk-programi-basvurulari-basladi",
    title: "N'apsak? Mentorluk Programı Başvuruları Başladı!",
    date: "1 Aralık 2025",
    category: "Gelişim & Mentorluk",
    excerpt:
      "Akademik gelişim ve proje üretimi süreçlerinde deneyimli mentorlarımızdan bire bir rehberlik almak için başvurular açıldı.",
    coverImage: "/images/news-kariyer-cover.jpg",
    content:
      "N'apsak? Gençlik Topluluğu Mentorluk Programı ile geleceğine yön vermek isteyen gençleri alanında uzman mentorlarla bir araya getiriyoruz. Program kapsamında Akademik Mentorluk ve Proje Mentorluğu olmak üzere iki farklı kulvarda destek sunulmaktadır. Akademik hedeflerin ve ders çalışma sürecin için mentor desteği almak istersen Akademik Mentorluk başvurusunu https://forms.gle/academic-mentor-demo adresinden tamamlayabilirsin. Proje fikrini geliştirmek ve profesyonel hale getirmek için ise Proje Mentorluğu başvurusunu https://forms.gle/project-mentor-demo adresi üzerinden iletebilirsin.",
    images: [
      "/images/news-kariyer-cover.jpg",
      "/images/news-kariyer-1.jpg",
    ],
  },
  {
    id: "kil-atolyesi",
    slug: "kil-atolyesi",

    title: "Kil Atölyesi: Çamurdan Hayallere",
    date: "15 Ekim 2025",
    category: "Sanat & Atölye",
    excerpt:
      "Gençlerimizin elleriyle şekil verdiği, el becerilerini ve sanatsal ifade güçlerini ortaya çıkardığı keyifli bir kil atölyesi gerçekleştirdik.",
    coverImage: "/images/news-kil-cover.jpg",
    content:
      "N'apsak? Gençlik Topluluğu Sanat Ekibi organizasyonuyla düzenlenen Kil Atölyesi'nde gençler bir araya gelerek doğal kil hamuru ile kendi özgün tasarımlarını oluşturdular. Dokunsal üretimin huzuru ve yaratıcılığın coşkusuyla geçen etkinlikte katılımcılar hem stres attı hem de evlerine götürebilecekleri el yapımı seramik objeler ürettiler. Atölye boyunca seramik şekillendirme, rölyef dokuları ve renklendirme teknikleri deneyimlendi.",
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
    id: "cadilar-bayrami",
    slug: "cadilar-bayrami",
    title: "Cadılar Bayramı Konseptli Gençlik Buluşması",
    date: "31 Ekim 2025",
    category: "Etkinlik & Eğlence",
    excerpt:
      "Renkli kostümler, yaratıcı makyajlar ve tematik oyunlarla dolu eğlenceli bir Cadılar Bayramı buluşmasında bir araya geldik.",
    coverImage: "/images/news-cd-cover.jpg",
    content:
      "Topluluğumuzun eğlenceli ve sosyalleşme odaklı etkinliklerinden biri olan Cadılar Bayramı temalı akşamda gençler yaratıcı kostümleriyle geceye renk kattı. Tematik oyunlar, müzik dinletisi ve lezzetli ikramlar eşliğinde gerçekleşen etkinlikte topluluk üyelerimiz arasındaki bağlar daha da güçlendi. Fotoğraf köşesi ve kostüm yarışması etkinliğin öne çıkan anları arasındaydı.",
    images: [
      "/images/news-cd-cover.jpg",
      "/images/news-cd-1.jpg",
    ],
  },
  {
    id: "ani-defteri-atolyesi",
    slug: "ani-defteri-atolyesi",
    title: "Anı Defteri Atölyesi: Anıları Ölümsüzleştiriyoruz",
    date: "12 Kasım 2025",
    category: "Tasarım & Üretim",
    excerpt:
      "Fotoğraflar, illüstrasyonlar ve el yazılarıyla kişiselleştirilen özel anı defteri tasarımı atölyemizde yaratıcı fikirler buluştu.",
    coverImage: "/images/news-ani-cover.jpg",
    content:
      "Görsel sanatlar ve tasarım meraklısı gençlerle gerçekleştirdiğimiz Anı Defteri Atölyesi'nde her katılımcı kendi hikayesini ve topluluk anılarını özgün defter sayfalarına dönüştürdü. Scrapbooking teknikleri, suluboya dokunuşları ve özel dikiş ciltleme yöntemleriyle hazırlanan defterler unutulmaz birer hatıra oldu. Katılımcılar fotoğraflarla süsledikleri sayfalarla kendi kişisel günlüklerini tasarladılar.",
    images: [
      "/images/news-ani-cover.jpg",
      "/images/news-ani-1.jpg",
      "/images/news-ani-2.jpg",
      "/images/news-ani-3.jpg",
    ],
  },
  {
    id: "kariyer-z-1923-is-birligi",
    slug: "kariyer-z-1923-is-birligi",
    title: "Kariyer Z × 1923 İş Birliği",
    date: "28 Kasım 2025",
    category: "Kariyer & İş Birliği",
    excerpt:
      "Gençliğin geleceğe yön veren yetkinliklerini artırmak amacıyla Kariyer Z ve 1923 vizyonu ile ortak projeler ve buluşmalar kurguladık.",
    coverImage: "/images/news-kariyer-cover.jpg",
    content:
      "N'apsak? Gençlik Topluluğu ve Kariyer Z iş birliğinde düzenlenen stratejik gençlik buluşmasında, Z kuşağının iş hayatındaki rolü, girişimcilik ve geleceğin meslekleri ele alındı. İş birliği kapsamında düzenlenen törende gençler tecrübe paylaşımı fırsatı bulurken ilham verici sunumlar ve networking oturumları gerçekleştirildi. Cumhuriyetimizin 100 yılı aşan birikiminden güç alarak gençliğe vizyon katan ortak projeler duyuruldu.",
    images: [
      "/images/news-kariyer-cover.jpg",
      "/images/news-kariyer-1.jpg",
      "/images/news-kariyer-2.jpg",
      "/images/news-kariyer-3.jpg",
      "/images/hero-slide-1.jpg",
    ],
  },
  {
    id: "23-nisan",
    slug: "23-nisan",
    title: "23 Nisan Coşkusu: Atatürk'ün Çocuklara Armağanı",
    date: "23 Nisan 2025",
    category: "Toplumsal Fayda & Milli Bayram",
    excerpt:
      "Gazi Mustafa Kemal Atatürk'ün çocuklara ve yarınlarımıza armağan ettiği 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı'nı coşkuyla kutladık.",
    coverImage: "/images/ataturk-portrait.jpg",
    content:
      "Gazi Mustafa Kemal Atatürk, Türkiye Büyük Millet Meclisi'nin açıldığı 23 Nisan gününü dünyada ilk ve tek çocuk bayramı olarak ulusumuzun ve tüm dünya çocuklarına armağan etmiştir. Atatürk'ün 'Çocuklar geleceğimizin güvencesi, yaşama sevincimizdir. Bugünün çocuğunu yetiştirmek yarının büyüğünü yetiştirmektir' anlayışından ilham alarak N'apsak? Gençlik Topluluğu olarak 23 Nisan coşkusunu sahada çocuklarla buluşturduk. Yüz boyama, oyun parkurları, resim atölyeleri ve tiyatro gösterileriyle 'Birlikte düşleyelim, birlikte değiştirelim!' sloganımızı hayata geçirdik.",
    quote: {
      text: "Küçük hanımlar, küçük beyler! Sizler hepiniz geleceğin bir gülü, yıldızı ve ikbal ışığısınız. Memleketi asıl ışığa boğacak olan sizsiniz.",
      author: "Gazi Mustafa Kemal Atatürk",
      title: "Türkiye Cumhuriyeti'nin Kurucusu",
    },
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

export function getNewsBySlug(slug: string): NewsItem | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return NEWS_DATA.find((n) => n.slug === normalized || n.id === normalized);
}
