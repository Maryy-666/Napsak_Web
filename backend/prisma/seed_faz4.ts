import prisma from "../src/db.js";

export async function seedFaz4Data() {
  console.log("==================================================");
  console.log("FAZ 4 INITIAL SEED & BACKFILL İŞLEMİ");
  console.log("==================================================");

  // 1. Initial Pages
  const initialPages = [
    {
      title: "Hakkımızda",
      slug: "hakkimizda",
      shortDescription: "N'apsak? Gençlik Topluluğu'nun vizyonu, kuruluş hikayesi ve temel değerleri.",
      content: `# Hakkımızda\n\n**N'apsak? Gençlik Topluluğu**, gençlerin potansiyellerini ortaya çıkarmayı, onları geleceğe hazırlamayı ve farklı alanlarda kendilerini geliştirmelerine fırsat sunmayı amaçlayan bağımsız bir gençlik topluluğudur.\n\n### Vizyonumuz\nGençlerin fikirlerini projelere dönüştürdüğü, birlikte ürettiği ve toplumsal fayda sağladığı dinamik bir ekosistem kurgulamak.\n\n### Misyonumuz\nTeknoloji, sanat, çevre ve sağlık gibi farklı alanlarda sürdürülebilir çalışmalar yürütmek.`,
      publicationStatus: "PUBLISHED",
      showInMenu: true,
      displayOrder: 1,
      metaTitle: "Hakkımızda | N'apsak? Gençlik Topluluğu",
      metaDescription: "N'apsak? Gençlik Topluluğu'nun vizyonu, misyonu ve idari yapısı.",
    },
    {
      title: "İletişim",
      slug: "iletisim",
      shortDescription: "Soru, görüş, öneri ve topluluk hakkındaki tüm konular için bize ulaşın.",
      content: `# İletişim\n\nN'apsak? Gençlik Topluluğu ile iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz.\n\n- **E-Posta:** kurumsal@napsak.org\n- **Telefon:** 0535 634 06 54\n- **Adres:** İstanbul, Türkiye\n- **Instagram:** @napsakgencliktoplulugu\n- **LinkedIn:** N'apsak? Gençlik Topluluğu`,
      publicationStatus: "PUBLISHED",
      showInMenu: true,
      displayOrder: 6,
      metaTitle: "İletişim | N'apsak? Gençlik Topluluğu",
      metaDescription: "N'apsak? Gençlik Topluluğu ile iletişime geçin.",
    },
    {
      title: "Aramıza Katıl",
      slug: "katilim",
      shortDescription: "İster gönüllü ol, ister ekip üyesi ol. Birlikte üretmenin birçok yolu var.",
      content: `# Aramıza Katıl\n\nGençlerin gelişimine katkı sunmak ve topluluğumuzun bir parçası olmak için başvurunuzu hemen yapabilirsiniz.`,
      publicationStatus: "PUBLISHED",
      showInMenu: true,
      displayOrder: 5,
      metaTitle: "Aramıza Katıl | N'apsak? Gençlik Topluluğu",
      metaDescription: "N'apsak? Gençlik Topluluğu katılım ve gönüllülük fırsatları.",
    },
    {
      title: "KVKK Aydınlatma Metni",
      slug: "kvkk",
      shortDescription: "Kişisel Verilerin Korunması Kanunu kapsamındaki haklarınız ve bilgilendirme metni.",
      content: `# KVKK Aydınlatma Metni\n\n6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, N'apsak? Gençlik Topluluğu olarak kişisel verilerinizi mevzuata uygun şekilde işliyor ve koruyoruz.\n\n### Veri Sorumlusunun Kimliği\nN'apsak? Gençlik Topluluğu`,
      publicationStatus: "PUBLISHED",
      showInMenu: false,
      displayOrder: 10,
      metaTitle: "KVKK Aydınlatma Metni | N'apsak? Gençlik Topluluğu",
      metaDescription: "Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni.",
    },
    {
      title: "Sıkça Sorulan Sorular",
      slug: "sss",
      shortDescription: "Topluluğumuz hakkında en çok merak edilen sorular ve cevapları.",
      content: `# Sıkça Sorulan Sorular (SSS)\n\n**1. N'apsak? Gençlik Topluluğu nedir?**\nGençlerin gelişimini ve üretkenliğini destekleyen bağımsız bir gençlik topluluğudur.\n\n**2. Nasıl üye olabilirim?**\nTopluluğa Katıl butonunu kullanarak üyelik formunu doldurabilirsiniz.`,
      publicationStatus: "PUBLISHED",
      showInMenu: true,
      displayOrder: 8,
      metaTitle: "Sıkça Sorulan Sorular | N'apsak? Gençlik Topluluğu",
      metaDescription: "Topluluk hakkında sık sorulan sorular ve yanıtları.",
    },
  ];

  for (const page of initialPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        shortDescription: page.shortDescription,
      },
      create: page,
    });
  }
  console.log("✅ Initial Sayfalar Upsert Edildi.");

  // Fetch created page map
  const pages = await prisma.page.findMany();
  const pageMap = new Map<string, number>();
  pages.forEach((p) => pageMap.set(p.slug, p.id));

  // 2. Initial Navbar Navigation
  const existingNav = await prisma.navigationItem.count();
  if (existingNav === 0) {
    console.log("İlişkisel Menü Öğeleri Oluşturuluyor...");

    // Ana Sayfa
    await prisma.navigationItem.create({
      data: {
        label: "Ana Sayfa",
        targetType: "CUSTOM_URL",
        href: "/",
        location: "BOTH",
        displayOrder: 1,
      },
    });

    // Hakkımızda
    await prisma.navigationItem.create({
      data: {
        label: "Hakkımızda",
        targetType: "PAGE",
        pageId: pageMap.get("hakkimizda"),
        location: "BOTH",
        displayOrder: 2,
      },
    });

    // Etkinlikler
    await prisma.navigationItem.create({
      data: {
        label: "Etkinlikler",
        targetType: "CUSTOM_URL",
        href: "/etkinlikler",
        location: "BOTH",
        displayOrder: 3,
      },
    });

    // Çalışmalar Dropdown
    const calismalarParent = await prisma.navigationItem.create({
      data: {
        label: "Çalışmalar",
        targetType: "DROPDOWN_PARENT",
        href: "#calismalar",
        location: "BOTH",
        displayOrder: 4,
      },
    });

    await prisma.navigationItem.create({
      data: {
        label: "Dergiler",
        targetType: "CUSTOM_URL",
        href: "/dergiler",
        parentId: calismalarParent.id,
        location: "NAVBAR",
        displayOrder: 1,
      },
    });

    await prisma.navigationItem.create({
      data: {
        label: "Raporlar",
        targetType: "CUSTOM_URL",
        href: "/raporlar",
        parentId: calismalarParent.id,
        location: "NAVBAR",
        displayOrder: 2,
      },
    });

    await prisma.navigationItem.create({
      data: {
        label: "Faaliyetler",
        targetType: "CUSTOM_URL",
        href: "/faaliyetler",
        parentId: calismalarParent.id,
        location: "NAVBAR",
        displayOrder: 3,
      },
    });

    // Topluluk Dropdown
    const toplulukParent = await prisma.navigationItem.create({
      data: {
        label: "Topluluk",
        targetType: "DROPDOWN_PARENT",
        href: "#topluluk",
        location: "BOTH",
        displayOrder: 5,
      },
    });

    await prisma.navigationItem.create({
      data: {
        label: "Çalışma Ekiplerimiz",
        targetType: "CUSTOM_URL",
        href: "/ekipler",
        parentId: toplulukParent.id,
        location: "NAVBAR",
        displayOrder: 1,
      },
    });

    await prisma.navigationItem.create({
      data: {
        label: "Üyelerimiz",
        targetType: "CUSTOM_URL",
        href: "/uyeler",
        parentId: toplulukParent.id,
        location: "NAVBAR",
        displayOrder: 2,
      },
    });

    await prisma.navigationItem.create({
      data: {
        label: "Etkileşim / Katılım",
        targetType: "PAGE",
        pageId: pageMap.get("katilim"),
        parentId: toplulukParent.id,
        location: "NAVBAR",
        displayOrder: 3,
      },
    });

    await prisma.navigationItem.create({
      data: {
        label: "SSS",
        targetType: "PAGE",
        pageId: pageMap.get("sss"),
        parentId: toplulukParent.id,
        location: "NAVBAR",
        displayOrder: 4,
      },
    });

    // İletişim
    await prisma.navigationItem.create({
      data: {
        label: "İletişim",
        targetType: "PAGE",
        pageId: pageMap.get("iletisim"),
        location: "BOTH",
        displayOrder: 6,
      },
    });

    console.log("✅ Initial Navigation Menü Öğeleri Oluşturuldu.");
  } else {
    console.log("Menü öğeleri zaten mevcut.");
  }
}

if (process.argv[1] && process.argv[1].includes("seed_faz4")) {
  seedFaz4Data()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
