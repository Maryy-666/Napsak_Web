export type Language = "tr" | "en";

export type TranslationDictionary = {
  [key: string]: string;
};

export const translations: Record<Language, TranslationDictionary> = {
  tr: {
    // Navigasyon
    "nav.home": "Ana Sayfa",
    "nav.about": "Hakkımızda",
    "nav.events": "Etkinlikler",
    "nav.news": "Haberler",
    "nav.activities": "Faaliyetler",
    "nav.magazines": "Dergiler",
    "nav.teams": "Ekipler",
    "nav.reports": "Raporlar",
    "nav.contact": "İletişim",
    "nav.faq": "SSS",
    "nav.members": "Üyeler",
    "nav.positions": "Açık Pozisyonlar",
    "nav.partners": "Paydaşlarımız",
    "nav.works": "Çalışmalarımız",
    "nav.community": "Dernek",
    "nav.join": "Derneğe Katıl",
    "nav.login": "Giriş Yap",
    "nav.register": "Kayıt Ol",
    "nav.profile": "Profilim",
    "nav.admin": "Admin Paneli",
    "nav.logout": "Çıkış Yap",
    "nav.comingSoon": "Yakında",

    // Ortak Butonlar ve Başlıklar
    "common.learnMore": "Daha Fazla Bilgi",
    "common.readMore": "Devamını Oku",
    "common.apply": "Başvur",
    "common.search": "Ara...",
    "common.all": "Tümü",
    "common.category": "Kategori",
    "common.date": "Tarih",
    "common.location": "Konum",
    "common.close": "Kapat",
    "common.submit": "Gönder",
    "common.reset": "Sıfırla",
    "common.back": "Geri",
    "common.next": "İleri",
    "common.success": "Başarılı",
    "common.error": "Hata",
    "common.loading": "Yükleniyor...",
    "common.noResults": "Henüz kayıt bulunamadı",
    "common.backToHome": "Ana Sayfaya Dön",
    "common.cancel": "İptal",
    "common.save": "Kaydet",
    "common.delete": "Sil",
    "common.edit": "Düzenle",
    "common.viewDetails": "Detayları Gör",
    "common.sending": "Gönderiliyor...",
    "common.saving": "Kaydediliyor...",
    "common.filter": "Filtrele",
    "common.allCategories": "Tüm Kategoriler",
    "common.required": "Zorunlu",
    "common.name": "Ad Soyad",
    "common.email": "E-posta",
    "common.phone": "Telefon",
    "common.city": "Şehir",
    "common.school": "Okul / Üniversite",
    "common.department": "Bölüm",
    "common.note": "Not / Açıklama",

    // Hero Bölümü
    "hero.badge": "2025'ten Beri Harekete Geçenler",
    "hero.title": "Ne Yapsak? Gençlik Derneği",
    "hero.highlight": "“Keşke..” diyenlerin değil, “Ne Yapsak?” deyip harekete geçenlerin derneğiyiz.",
    "hero.description": "Üreten, öğrenen ve birlikte gelişen gençlerin buluşma noktasıyız. Farklı alanlarda kendini geliştirmek, yeni insanlarla tanışmak ve birlikte üretmenin gücünü keşfetmek için buradayız.",

    // Kültür & Süreç Bölümü
    "culture.badge": "Nasıl Çalışırız?",
    "culture.title": "Ne Yapsak? Kültürü ve Adımları",
    "culture.subtitle": "Gençlerin fikirlerini projelere, projelerini ise geleceğe taşıyan dinamik gelişim adımları.",
    "culture.step1.title": "Keşfet",
    "culture.step1.desc": "İlgi alanlarını keşfet, derneğimizi ve ekiplerimizi tanı.",
    "culture.step2.title": "Katıl",
    "culture.step2.desc": "Sana en yakın çalışma alanına dahil ol, diğer gençlerle birlikte üret.",
    "culture.step3.title": "Üret",
    "culture.step3.desc": "Projelerde, etkinliklerde ve ekip çalışmalarında aktif rol al.",
    "culture.step4.title": "Geliş",
    "culture.step4.desc": "Yeni şeyler öğren, deneyim kazan ve derneğin gelişimine katkı sağla.",

    // Ekiplerimiz
    "teams.badge": "Uzmanlık Alanlarımız",
    "teams.title": "Dinamik Ekiplerimiz",
    "teams.subtitle": "Teknolojiden sanata, çevre sağlıktan medyaya kendi alanında üreten genç çalışma grupları.",

    // İstatistikler
    "stats.members": "Aktif Üye",
    "stats.cities": "Temsil Edilen Şehir",
    "stats.projects": "Gerçekleşen Proje",
    "stats.events": "Düzenlenen Etkinlik",

    // Değerlerimiz
    "values.badge": "Bizi Biz Yapan İlkeler",
    "values.title": "Temel Değerlerimiz",
    "values.subtitle": "Derneğimizin sürdürülebilir gelişimini ve kültürel bağlarını oluşturan prensipler.",

    // Türkiye Haritası
    "map.badge": "Türkiye Geneli",
    "map.title": "Dernek Etki Alanımız",
    "map.subtitle": "Türkiye'nin dört bir yanından gençlerle kurduğumuz güçlü bağlar ve temsil ağı.",

    // Haberler & Etkinlikler
    "news.badge": "Güncel Duyurular",
    "news.title": "Son Haberler & Etkinlikler",
    "news.subtitle": "Ne Yapsak? dünyasından en son haberler, yaklaşan etkinlikler ve içerikler.",
    "news.viewAll": "Tümünü Gör",

    // CTA Bölümü
    "cta.badge": "Seni de Bekliyoruz!",
    "cta.title": "Sen de Ne Yapsak? Ailesine Katıl",
    "cta.subtitle": "Geleceğini şekillendirmek, projelerini hayata geçirmek ve büyük bir gençlik derneğinin parçası olmak için ilk adımı at.",

    // Erişilebilirlik
    "a11y.title": "Erişilebilirlik Masası",
    "a11y.triggerLabel": "Erişilebilirlik Paneli",
    "a11y.skipToContent": "Ana İçeriğe Geç",
    "a11y.languageSelector": "Dil Seçimi",

    // Footer
    "footer.tagline": "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji derneği.",
    "footer.quickLinks": "Hızlı Bağlantılar",
    "footer.contact": "İletişim",
    "footer.rights": "Tüm hakları saklıdır.",
    "footer.kvkk": "KVKK Aydınlatma Metni",
    "footer.cookies": "Çerez Politikası",

    // Hakkımızda
    "about.badge": "Hikayemiz & Misyonumuz",
    "about.title": "Geleceği Birlikte Şekillendiren Gençlik Derneği",
    "about.subtitle": "Farklı alanlarda üreten gençleri bir araya getiren, sürekli öğrenmeyi ve paylaşmayı odağına alan dinamik bir ekosistem.",

    // İletişim
    "contact.badge": "Bize Ulaşın",
    "contact.title": "İletişime Geçin",
    "contact.subtitle": "Sorularınız, iş birliği teklifleriniz veya geri bildirimleriniz için mesaj gönderebilirsiniz.",
    "contact.successMsg": "Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız.",

    // Etkinlikler
    "events.badge": "Gelişim & Buluşma",
    "events.title": "Dernek Etkinlikleri",
    "events.subtitle": "Online atölyeler, yüz yüze zirveler ve sosyal buluşmalar.",
    "events.applyModalTitle": "Etkinliğe Kaydol",
    "events.applySuccess": "Etkinlik başvurunuz başarıyla alındı!",

    // Bizden Haberdar Ol
    "haberdar.badge": "Başvurunuz Alındı",
    "haberdar.title": "Bizden Haberdar Ol",
    "haberdar.subtitle": "Artık Ne Yapsak? Gençlik Derneği'nun bir parçası olmak için ilk adımı attın. Gelişmeleri kaçırmamak için bizi takip etmeyi unutma.",
    "haberdar.mainChannel": "Ana İletişim Kanalı",
    "haberdar.whatsappBtn": "WhatsApp Derneğine Katıl",
    "haberdar.otherChannels": "Diğer Takip Kanallarımız",
    "haberdar.follow": "Takip Et",
    "haberdar.backHome": "Ana Sayfaya Geri Dön",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.events": "Events",
    "nav.news": "News",
    "nav.activities": "Activities",
    "nav.magazines": "Magazines",
    "nav.teams": "Teams",
    "nav.reports": "Reports",
    "nav.contact": "Contact",
    "nav.faq": "FAQ",
    "nav.members": "Members",
    "nav.positions": "Open Positions",
    "nav.partners": "Partners & Supporters",
    "nav.works": "Our Works",
    "nav.community": "Association",
    "nav.join": "Join Association",
    "nav.login": "Sign In",
    "nav.register": "Register",
    "nav.profile": "My Profile",
    "nav.admin": "Admin Panel",
    "nav.logout": "Sign Out",
    "nav.comingSoon": "Coming Soon",

    // Common Buttons & Headings
    "common.learnMore": "Learn More",
    "common.readMore": "Read More",
    "common.apply": "Apply Now",
    "common.search": "Search...",
    "common.all": "All",
    "common.category": "Category",
    "common.date": "Date",
    "common.location": "Location",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.reset": "Reset",
    "common.back": "Back",
    "common.next": "Next",
    "common.success": "Success",
    "common.error": "Error",
    "common.loading": "Loading...",
    "common.noResults": "No items found",
    "common.backToHome": "Back to Home",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.viewDetails": "View Details",
    "common.sending": "Sending...",
    "common.saving": "Saving...",
    "common.filter": "Filter",
    "common.allCategories": "All Categories",
    "common.required": "Required",
    "common.name": "Full Name",
    "common.email": "Email Address",
    "common.phone": "Phone Number",
    "common.city": "City",
    "common.school": "School / University",
    "common.department": "Department",
    "common.note": "Note / Description",

    // Hero Section
    "hero.badge": "Taking Action Since 2025",
    "hero.title": "Ne Yapsak? Youth Association",
    "hero.highlight": "We are an association not of those saying 'I wish..', but of those asking 'Ne Yapsak?' and taking action.",
    "hero.description": "We are the meeting point for youth who produce, learn, and grow together. We are here to develop skills in different areas, meet new people, and discover the power of producing together.",

    // Culture & Process Section
    "culture.badge": "How We Work",
    "culture.title": "Ne Yapsak? Culture & Steps",
    "culture.subtitle": "Dynamic development steps taking youth ideas into projects and projects into the future.",
    "culture.step1.title": "Discover",
    "culture.step1.desc": "Explore your interests, get to know our association and teams.",
    "culture.step2.title": "Join",
    "culture.step2.desc": "Get involved in your nearest domain and produce alongside fellow youth.",
    "culture.step3.title": "Produce",
    "culture.step3.desc": "Take an active role in projects, events, and teamwork.",
    "culture.step4.title": "Grow",
    "culture.step4.desc": "Learn new things, gain experience, and contribute to association growth.",

    // Our Teams
    "teams.badge": "Domains of Expertise",
    "teams.title": "Our Dynamic Teams",
    "teams.subtitle": "Youth working groups creating impact across technology, art, health, and media.",

    // Stats
    "stats.members": "Active Members",
    "stats.cities": "Cities Represented",
    "stats.projects": "Projects Completed",
    "stats.events": "Events Organized",

    // Core Values
    "values.badge": "Principles Shaping Us",
    "values.title": "Our Core Values",
    "values.subtitle": "The principles forming the sustainable growth and cultural bonds of our association.",

    // Turkey Map
    "map.badge": "Nationwide Reach",
    "map.title": "Our Network & Impact",
    "map.subtitle": "Strong bonds and representation network established with youth all across Turkey.",

    // News & Events
    "news.badge": "Latest Announcements",
    "news.title": "Latest News & Events",
    "news.subtitle": "The latest updates, upcoming events, and stories from the Ne Yapsak? world.",
    "news.viewAll": "View All",

    // CTA Section
    "cta.badge": "We Are Waiting For You!",
    "cta.title": "Join the Ne Yapsak? Family Today",
    "cta.subtitle": "Take the first step to shape your future, bring your projects to life, and become part of a thriving youth association.",

    // Accessibility
    "a11y.title": "Accessibility Desk",
    "a11y.triggerLabel": "Accessibility Panel",
    "a11y.skipToContent": "Skip to Main Content",
    "a11y.languageSelector": "Language Selection",

    // Footer
    "footer.tagline": "A technology association of youth who produce, learn, and grow together.",
    "footer.quickLinks": "Quick Links",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.kvkk": "Privacy Policy (KVKK)",
    "footer.cookies": "Cookie Policy",

    // About Us
    "about.badge": "Our Story & Mission",
    "about.title": "Youth Association Shaping the Future Together",
    "about.subtitle": "A dynamic ecosystem uniting youth across fields, focusing on continuous learning and sharing.",

    // Contact
    "contact.badge": "Get in Touch",
    "contact.title": "Contact Us",
    "contact.subtitle": "Feel free to send us your inquiries, partnership proposals, or feedback.",
    "contact.successMsg": "Your message has been sent successfully. We will get back to you soon.",

    // Events
    "events.badge": "Growth & Gatherings",
    "events.title": "Association Events",
    "events.subtitle": "Online workshops, in-person summits, and social meetups.",
    "events.applyModalTitle": "Register for Event",
    "events.applySuccess": "Your event registration was received successfully!",

    // Stay Updated
    "haberdar.badge": "Application Received",
    "haberdar.title": "Stay Updated With Us",
    "haberdar.subtitle": "You have taken the first step to join Ne Yapsak? Youth Association. Follow us to not miss any updates.",
    "haberdar.mainChannel": "Main Communication Channel",
    "haberdar.whatsappBtn": "Join WhatsApp Association",
    "haberdar.otherChannels": "Our Other Channels",
    "haberdar.follow": "Follow",
    "haberdar.backHome": "Back to Home",
  },
};

