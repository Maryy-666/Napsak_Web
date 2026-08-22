export type LegalSection = {
  title: string;
  content: string | string[];
};

export const KVKK_SECTIONS_FALLBACK: LegalSection[] = [
  {
    title: "Veri Sorumlusunun Kimliği",
    content:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, N'apsak? Gençlik Topluluğu olarak kişisel verilerinizi mevzuata uygun şekilde işliyor ve koruyoruz.",
  },
  {
    title: "Kişisel Verilerin İşlenme Amacı",
    content: [
      "Kişisel verileriniz; üyelik başvurularının değerlendirilmesi, topluluk içi iletişimin sağlanması, etkinlik ve eğitim organizasyonlarının yürütülmesi amacıyla işlenmektedir.",
      "Ayrıca kurumsal e-posta ve duyuru bültenlerinin iletilmesi ve yasal yükümlülüklerin ifası amacıyla verileriniz işlenmektedir.",
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

export const COOKIE_SECTIONS_FALLBACK: LegalSection[] = [
  {
    title: "Çerezlerin Kullanımı",
    content:
      "Bu web sitesinde zorunlu çerezler; oturum güvenliği, form işlemleri ve temel site işlevlerinin çalışması için kullanılır.",
  },
  {
    title: "Kullanılan Çerez Türleri",
    content: [
      "Zorunlu çerezler: Site ve oturum güvenliği için gereklidir.",
      "Tercih çerezleri: Kullanıcı deneyimini iyileştirmek için tercihleri hatırlayabilir.",
      "Analitik çerezler: Kullanıldığı durumda site performansını ve ziyaretçi davranışını anonim olarak anlamaya yardımcı olur.",
    ],
  },
  {
    title: "Çerez Tercihleri",
    content:
      "Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezlerin kapatılması sitenin bazı bölümlerinin çalışmasını etkileyebilir.",
  },
  {
    title: "İletişim",
    content:
      "Çerez ve gizlilik uygulamalarımız hakkındaki talepleriniz için kurumsal@napsak.org adresinden bizimle iletişime geçebilirsiniz.",
  },
];

const normalizeParagraphs = (value: string): string[] => {
  return value
    .split(/\n{2,}/)
    .map((item) => item.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
};

export const parseLegalSections = (
  content: string | null | undefined,
  fallback: LegalSection[]
): LegalSection[] => {
  const raw = content?.trim();
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const sections = parsed
        .map((item) => ({
          title: String(item?.title || "").trim(),
          content: Array.isArray(item?.content)
            ? item.content.map((part: unknown) => String(part).trim()).filter(Boolean)
            : String(item?.content || "").trim(),
        }))
        .filter((item) => item.title && (Array.isArray(item.content) ? item.content.length > 0 : item.content));

      if (sections.length > 0) return sections;
    }
  } catch {
    // Non-JSON content is parsed as a simple markdown-like document below.
  }

  const lines = raw.split(/\r?\n/);
  const sections: LegalSection[] = [];
  let currentTitle = "";
  let currentBody: string[] = [];

  const flush = () => {
    if (!currentTitle) return;
    const paragraphs = normalizeParagraphs(currentBody.join("\n").trim());
    sections.push({
      title: currentTitle,
      content: paragraphs.length > 1 ? paragraphs : paragraphs[0] || "",
    });
  };

  lines.forEach((line) => {
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      flush();
      currentTitle = headingMatch[1].trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  });

  flush();

  if (sections.length > 0) return sections;

  const paragraphs = normalizeParagraphs(raw);
  return [
    {
      title: "Genel Bilgilendirme",
      content: paragraphs.length > 1 ? paragraphs : paragraphs[0] || raw,
    },
  ];
};

export const serializeLegalSections = (sections: LegalSection[]): string => {
  return JSON.stringify(sections, null, 2);
};
