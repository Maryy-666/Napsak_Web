"use client";

import React, { useMemo } from "react";
import { ExternalLink, ArrowRight, Sparkles, FileText, CheckCircle2 } from "lucide-react";

interface NewsContentFormatterProps {
  content: string;
}

interface DetectedLink {
  id: string;
  url: string;
  title: string;
  description: string;
  buttonText: string;
  iconType: "academic" | "project" | "form" | "general";
}

export function NewsContentFormatter({ content }: NewsContentFormatterProps) {
  const { cleanTextParagraphs, detectedLinks } = useMemo(() => {
    if (!content) {
      return { cleanTextParagraphs: [], detectedLinks: [] };
    }

    const linksMap = new Map<string, DetectedLink>();
    const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;

    // Split content into lines / paragraphs
    const rawParagraphs = content.split(/\n+/).filter((p) => p.trim().length > 0);
    const cleanedParagraphs: string[] = [];

    rawParagraphs.forEach((para, index) => {
      let currentParaText = para;
      const matches = para.match(urlRegex);

      if (matches) {
        matches.forEach((matchedUrl) => {
          const cleanUrl = matchedUrl.replace(/[.,;)]+$/, ""); // Trim trailing punctuation

          if (!linksMap.has(cleanUrl)) {
            const lowerPara = para.toLowerCase();
            const lowerUrl = cleanUrl.toLowerCase();

            let title = "Başvuru Formu";
            let description = "Aşağıdaki bağlantı üzerinden başvurunuzu tamamlayabilirsiniz.";
            let buttonText = "Başvuruyu Tamamla";
            let iconType: DetectedLink["iconType"] = "form";

            if (lowerPara.includes("akademik") || lowerUrl.includes("akademik")) {
              title = "🎓 Akademik Mentorluk";
              description = "Akademik hedeflerin ve ders çalışma sürecin için mentor desteği.";
              buttonText = "Akademik Başvurusu Yap";
              iconType = "academic";
            } else if (lowerPara.includes("proje") || lowerUrl.includes("proje")) {
              title = "🚀 Proje Mentorluğu";
              description = "Proje fikrini geliştirmek ve profesyonel hale getirmek için mentor desteği.";
              buttonText = "Proje Başvurusu Yap";
              iconType = "project";
            } else if (
              lowerUrl.includes("forms.gle") ||
              lowerUrl.includes("google.com/forms") ||
              lowerUrl.includes("tally.so") ||
              lowerUrl.includes("typeform") ||
              lowerPara.includes("başvuru") ||
              lowerPara.includes("basvuru")
            ) {
              title = "📝 Katılım & Başvuru Formu";
              description = "Etkinlik veya programa katılım için online başvuru formunu doldurun.";
              buttonText = "Başvuru Formunu Aç";
              iconType = "form";
            } else {
              title = "🔗 Bağlantı & Detaylar";
              description = "Daha fazla bilgi ve harici içerik için bağlantıyı ziyaret edin.";
              buttonText = "Bağlantıyı Ziyaret Et";
              iconType = "general";
            }

            linksMap.set(cleanUrl, {
              id: `link-${index}-${cleanUrl}`,
              url: cleanUrl,
              title,
              description,
              buttonText,
              iconType,
            });
          }

          // Remove raw naked URL from main text paragraph so user doesn't see raw https://...
          currentParaText = currentParaText.replace(matchedUrl, "").trim();
        });
      }

      if (currentParaText.trim().length > 0) {
        cleanedParagraphs.push(currentParaText.trim());
      }
    });

    return {
      cleanTextParagraphs: cleanedParagraphs.length > 0 ? cleanedParagraphs : [content],
      detectedLinks: Array.from(linksMap.values()),
    };
  }, [content]);

  return (
    <div className="space-y-6 text-left">
      {/* Render Paragraph Text without Naked URLs */}
      <div className="space-y-4 font-sans text-base sm:text-lg text-[#5F6773] leading-relaxed">
        {cleanTextParagraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Styled CTA Section for External & Application Links */}
      {detectedLinks.length > 0 && (
        <div className="my-8 rounded-[24px] bg-gradient-to-br from-[#F8FAFC] via-[#EEF7F3] to-[#F8FAFC] border border-[#0A5C3A]/20 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[#0A5C3A]/15 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0A5C3A] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-headings text-[#0F1115]">
                Başvuru & İletişim Alanları
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6773] font-medium font-sans">
                Aşağıdaki butonları kullanarak ilgili başvuru formlarına doğrudan erişebilirsiniz.
              </p>
            </div>
          </div>

          {/* CTA Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detectedLinks.map((link) => (
              <div
                key={link.id}
                className="flex flex-col justify-between p-5 rounded-[20px] bg-white border border-[#EEF0F2] shadow-xs hover:border-[#0A5C3A]/40 hover:shadow-md transition-all duration-300 space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#0A5C3A]/10 text-[#0A5C3A] inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#0A5C3A]" />
                      Form & Başvuru
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold font-headings text-[#0F1115] mb-1">
                    {link.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5F6773] font-medium font-sans leading-relaxed">
                    {link.description}
                  </p>
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#0A5C3A] hover:bg-[#0D7449] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20"
                  aria-label={`${link.title} (Yeni sekmede açılır)`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>{link.buttonText}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
