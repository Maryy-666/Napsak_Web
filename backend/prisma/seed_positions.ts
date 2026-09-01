import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const POSITIONS = [
  {
    slug: "sosyal-medya-ve-icerik-ekibi",
    title: "Sosyal Medya ve İçerik Ekibi Gönüllüsü",
    titleEn: "Social Media & Content Creator Volunteer",
    team: "İletişim ve Medya",
    teamEn: "Communication & Media",
    teamCategory: "iletisim",
    shortDescription:
      "Topluluğumuzun dijital platformlardaki sesini güçlendirmek, yaratıcı içerik stratejileri geliştirmek ve sosyal medya etkileşimini yönetmek üzere ekip arkadaşları arıyoruz.",
    shortDescriptionEn:
      "We are looking for team members to amplify our community's voice across digital platforms, develop creative content strategies, and manage social media engagement.",
    workType: "Gönüllü",
    workTypeEn: "Volunteer / Remote",
    location: "Uzaktan / Çevrim İçi",
    locationEn: "Remote / Online",
    isUrgent: true,
    isActive: true,
    displayOrder: 1,
    responsibilities: [
      "Haftalık sosyal medya içerik takviminin hazırlanması ve güncellenmesi",
      "Instagram, LinkedIn ve YouTube için özgün görsel metinlerin (caption) kaleme alınması",
      "Topluluk duyurularının ve etkinlik lansmanlarının dijital platformlarda yaygınlaştırılması",
      "Sosyal medya takipçi etkileşiminin ve gelen mesajların düzenli takibi",
    ],
    responsibilitiesEn: [
      "Preparing and updating weekly social media content calendars",
      "Drafting engaging captions and copy for Instagram, LinkedIn, and YouTube",
      "Promoting community announcements and event launches on digital platforms",
      "Monitoring audience engagement and community inquiries on social channels",
    ],
    requirements: [
      "Sosyal medya dinamiklerine ve içerik trendlerine ilgili olmak",
      "Türkçe dil bilgisi ve imla kurallarına yüksek özen göstermek",
      "Sorumluluk bilinciyle hareket etmek ve ekip içi iletişimi güçlü tutmak",
      "Haftada ortalama 3-5 saatini gönüllü üretime ayırabilmek",
    ],
    requirementsEn: [
      "Interest in social media dynamics and digital content trends",
      "High attention to grammar, tone, and editorial standards",
      "Strong sense of responsibility and active team collaboration",
      "Ability to allocate ~3-5 hours per week for voluntary production",
    ],
    preferredQualifications: [
      "Canva veya Figma gibi görsel düzenleme araçlarını temel düzeyde kullanabilmek",
      "Kısa video (Reels / Shorts) kurgusuna meraklı olmak",
      "Metin yazarlığı (copywriting) deneyimi",
    ],
    preferredQualificationsEn: [
      "Basic proficiency in visual design tools like Canva or Figma",
      "Interest or experience in short-form video editing (Reels / Shorts)",
      "Background or interest in creative copywriting",
    ],
  },
  {
    slug: "grafik-tasarim-gonullusu",
    title: "Grafik Tasarım Gönüllüsü",
    titleEn: "Graphic Design Volunteer",
    team: "İletişim ve Medya",
    teamEn: "Communication & Media",
    teamCategory: "iletisim",
    shortDescription:
      "N'apsak? markasının görsel kimliğini besleyecek afiş, sosyal medya postları, dergi kapakları ve lansman materyalleri tasarlayacak yaratıcı gönüllüler arıyoruz.",
    shortDescriptionEn:
      "We are seeking creative volunteers to design posters, social media graphics, magazine covers, and launch materials that nurture N'apsak?'s visual identity.",
    workType: "Gönüllü",
    workTypeEn: "Volunteer / Remote",
    location: "Uzaktan / Çevrim İçi",
    locationEn: "Remote / Online",
    isUrgent: false,
    isActive: true,
    displayOrder: 2,
    responsibilities: [
      "Topluluk etkinlikleri için dijital afiş ve duyuru görselleri tasarlamak",
      "Dergilerimiz ve raporlarımız için yayın materyali ve kapak konseptleri üretmek",
      "Marka kimliği standartlarımızı koruyarak özgün görsel bileşenler oluşturmak",
    ],
    responsibilitiesEn: [
      "Designing digital posters and announcement visuals for community events",
      "Creating publication layouts and cover concepts for our magazines and reports",
      "Crafting original visual assets while maintaining brand identity guidelines",
    ],
    requirements: [
      "Temel tasarım ilkelerine (hizalama, tipografi, renk teorisi) hâkimiyet",
      "Tasarım programlarından en az birini (Figma, Photoshop, Illustrator veya Canva) aktif kullanabilmek",
      "Geri bildirimlere açık ve fikir geliştirmeye istekli olmak",
    ],
    requirementsEn: [
      "Understanding of core design principles (alignment, typography, color balance)",
      "Active proficiency in at least one design tool (Figma, Photoshop, Illustrator, or Canva)",
      "Openness to feedback and collaborative brainstorming",
    ],
    preferredQualifications: [
      "İllüstrasyon veya 3D tasarım deneyimi",
      "Daha önce hazırlanmış grafik tasarım portfolyosu",
    ],
    preferredQualificationsEn: [
      "Experience in digital illustration or 3D graphics",
      "Existing graphic design portfolio or sample work",
    ],
  },
  {
    slug: "yazilim-gelistirme-gonullusu",
    title: "Yazılım Geliştirme Gönüllüsü",
    titleEn: "Software Development Volunteer",
    team: "Teknoloji",
    teamEn: "Technology",
    teamCategory: "teknoloji",
    shortDescription:
      "Topluluk web platformumuzu, açık kaynak araçlarımızı ve iç otomasyon sistemlerimizi geliştirecek kod odaklı gönüllüler arıyoruz.",
    shortDescriptionEn:
      "We are looking for code-passionate volunteers to build our web platform, open-source community tools, and internal automation systems.",
    workType: "Hibrit",
    workTypeEn: "Volunteer / Hybrid",
    location: "Uzaktan & Kampüs",
    locationEn: "Remote & Campus",
    isUrgent: true,
    isActive: true,
    displayOrder: 3,
    responsibilities: [
      "Next.js ve React tabanlı modern web arayüz bileşenleri geliştirmek",
      "Kullanıcı deneyimi (UX) ve erişilebilirlik (a11y) standartlarına uygun kod yazmak",
      "Topluluğun açık kaynak projelerine katkı sağlamak ve kod incelemelerine (PR review) katılmak",
    ],
    responsibilitiesEn: [
      "Building modern web interface components with Next.js and React",
      "Writing accessible code complying with UX and web standards",
      "Contributing to community open-source repositories and participating in PR code reviews",
    ],
    requirements: [
      "JavaScript / TypeScript veya Web Teknolojilerine temel düzeyde hâkim olmak",
      "Git ve GitHub kullanımı konusunda temel bilgiye sahip olmak",
      "Öğrenmeye, araştırmaya ve açık kaynak projelere ilgi duymak",
    ],
    requirementsEn: [
      "Foundational knowledge of JavaScript / TypeScript or modern Web technologies",
      "Basic understanding of Git and GitHub workflows",
      "Eagerness to learn, research, and contribute to open-source initiatives",
    ],
    preferredQualifications: [
      "Next.js 14+ App Router ve Tailwind CSS tecrübesi",
      "RESTful API veya Node.js / Prisma tecrübesi",
      "Temel UI/UX duyarlılığı",
    ],
    preferredQualificationsEn: [
      "Experience with Next.js 14 App Router and Tailwind CSS",
      "Familiarity with REST APIs or Node.js / Prisma",
      "Sensibility for clean UI/UX design",
    ],
  },
  {
    slug: "siber-guvenlik-gonullusu",
    title: "Siber Güvenlik Gönüllüsü",
    titleEn: "Cybersecurity Volunteer",
    team: "Teknoloji",
    teamEn: "Technology",
    teamCategory: "teknoloji",
    shortDescription:
      "N'apsak? altyapısının güvenliğini sağlamak, güvenlik farkındalığı içerikleri üretmek ve zafiyet analizleri gerçekleştirmek üzere gönüllü arıyoruz.",
    shortDescriptionEn:
      "We are looking for cybersecurity volunteers to audit our infrastructure, craft security awareness guides, and perform vulnerability assessments.",
    workType: "Gönüllü",
    workTypeEn: "Volunteer / Remote",
    location: "Uzaktan / Çevrim İçi",
    locationEn: "Remote / Online",
    isUrgent: false,
    isActive: true,
    displayOrder: 4,
    responsibilities: [
      "Web uygulamalarımız ve API sistemlerimiz üzerinde temel güvenlik testleri yürütmek",
      "Topluluk üyeleri için siber güvenlik ve veri gizliliği farkındalık dokümanları hazırlamak",
      "Olası güvenlik zafiyetlerine karşı iyileştirme önerileri sunmak",
    ],
    responsibilitiesEn: [
      "Conducting fundamental security testing on web applications and API endpoints",
      "Preparing cybersecurity and privacy awareness resources for community members",
      "Proposing remediation strategies for identified vulnerability risks",
    ],
    requirements: [
      "Ağ temelleri, web protokolleri (HTTP/S) ve bilgi güvenliği ilkelerine meraklı olmak",
      "Etik korsanlık ve güvenlik araştırmalarına ilgi duymak",
      "Dürüstlük, gizlilik ve topluluk güvenliği ilkelerine bağlılık",
    ],
    requirementsEn: [
      "Curiosity about network fundamentals, web protocols (HTTP/S), and info-security concepts",
      "Interest in ethical hacking, vulnerability research, and defensive security",
      "Adherence to integrity, confidentiality, and community safety guidelines",
    ],
    preferredQualifications: [
      "OWASP Top 10 zafiyetlerine hâkimiyet",
      "Burp Suite, Nmap veya Linux sistem yönetim deneyimi",
      "CTF (Capture The Flag) yarışmaları tecrübesi",
    ],
    preferredQualificationsEn: [
      "Familiarity with OWASP Top 10 vulnerabilities",
      "Hands-on practice with Burp Suite, Nmap, or Linux system admin tools",
      "Experience in CTF (Capture The Flag) cybersecurity competitions",
    ],
  },
  {
    slug: "etkinlik-ve-organizasyon-gonullusu",
    title: "Etkinlik ve Organizasyon Gönüllüsü",
    titleEn: "Event & Organization Volunteer",
    team: "Etkinlik",
    teamEn: "Events",
    teamCategory: "etkinlik",
    shortDescription:
      "Gençlerin bir araya geldiği fiziksel ve çevrim içi atölyeleri, zirveleri ve buluşmaları uçtan uca planlayıp yönetecek dinamik ekip üyeleri arıyoruz.",
    shortDescriptionEn:
      "We are recruiting dynamic team members to plan, coordinate, and host online and on-site workshops, summits, and youth meetups.",
    workType: "Hibrit",
    workTypeEn: "Volunteer / Hybrid",
    location: "İstanbul & Çevrim İçi",
    locationEn: "Istanbul & Online",
    isUrgent: false,
    isActive: true,
    displayOrder: 5,
    responsibilities: [
      "Etkinlik konseptlerinin, akış planlarının ve konuşmacı listelerinin oluşturulması",
      "Etkinlik öncesi lojistik, mekân veya çevrim içi yayın hazırlıklarının yapılması",
      "Etkinlik sırasında katılımcı yönlendirmesi ve operasyonel akışın sorunsuz yürütülmesi",
    ],
    responsibilitiesEn: [
      "Developing event concepts, run-of-show schedules, and speaker lineups",
      "Managing venue logistics or digital streaming setups prior to event dates",
      "Guiding participants and overseeing smooth operational flow during live events",
    ],
    requirements: [
      "İletişim ve organizasyon becerileri yüksek olmak",
      "Çözüm odaklı, heyecanlı ve pratik düşünebilen kişilik",
      "Ekip çalışmasına yatkın ve zaman yönetimine özen gösteren olmak",
    ],
    requirementsEn: [
      "Excellent interpersonal and organizational communication skills",
      "Proactive, solution-oriented mindset with high energy",
      "Strong team player with effective time management",
    ],
    preferredQualifications: [
      "Daha önce kulüp veya STK etkinliklerinde görev almış olmak",
      "Topluluk önünde sunum veya sunuculuk deneyimi",
    ],
    preferredQualificationsEn: [
      "Prior experience organizing university club or NGO events",
      "Public speaking or event moderation skills",
    ],
  },
  {
    slug: "insan-kaynaklari-gonullu-yonetimi",
    title: "İnsan Kaynakları / Gönüllü Yönetimi",
    titleEn: "HR & Volunteer Management",
    team: "Yönetim",
    teamEn: "Management",
    teamCategory: "yonetim",
    shortDescription:
      "Topluluğumuza yeni katılacak gençlerin mülakat süreçlerini yönetmek, üye oryantasyonunu sağlamak ve topluluk içi bağları güçlendirmek üzere çalışacak arkadaşlar arıyoruz.",
    shortDescriptionEn:
      "We are seeking teammates to facilitate membership interviews, coordinate volunteer onboarding, and strengthen community bonds.",
    workType: "Gönüllü",
    workTypeEn: "Volunteer / Remote",
    location: "Uzaktan / Çevrim İçi",
    locationEn: "Remote / Online",
    isUrgent: false,
    isActive: true,
    displayOrder: 6,
    responsibilities: [
      "Topluluk üyelik başvurularının ön değerlendirmesinin yapılması",
      "Çevrim içi mülakat oturumlarının planlanması ve yürütülmesi",
      "Yeni üyelerin topluluğa uyum (onboarding) sürecine rehberlik etmek",
      "Gönüllü memnuniyeti ve topluluk içi etkileşimi artırıcı etkinlikler kurgulamak",
    ],
    responsibilitiesEn: [
      "Reviewing and screening incoming community membership applications",
      "Scheduling and conducting online volunteer interview sessions",
      "Guiding new members through community orientation and onboarding",
      "Designing initiatives to enhance volunteer satisfaction and member bonding",
    ],
    requirements: [
      "İnsan ilişkilerinde güçlü, empati yeteneği yüksek ve tarafsız yaklaşım",
      "Gizlilik ilkelerine ve nesnel değerlendirme kriterlerine sadık kalmak",
      "Düzenli dosyalama ve takip alışkanlığına sahip olmak",
    ],
    requirementsEn: [
      "Empathetic, objective, and warm interpersonal communication skills",
      "Strict adherence to confidentiality and unbiased evaluation criteria",
      "Strong habit of organized documentation and timely follow-ups",
    ],
    preferredQualifications: [
      "Psikoloji, PDR, İK veya Sosyoloji alanlarına ilgili ya da bu bölümlerde öğrenci olmak",
      "Google Workspace (Forms, Sheets, Calendar) araçlarına hâkimiyet",
    ],
    preferredQualificationsEn: [
      "Background or interest in HR, Psychology, Guidance, or Sociology",
      "Proficiency in Google Workspace tools (Forms, Sheets, Calendar)",
    ],
  },
];

async function main() {
  console.log("🌱 Pozisyonlar Seed Başlıyor...");

  for (const posData of POSITIONS) {
    await prisma.position.upsert({
      where: { slug: posData.slug },
      update: { ...posData },
      create: { ...posData },
    });
  }

  console.log("✅ Pozisyonlar başarıyla veritabanına eklendi!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
