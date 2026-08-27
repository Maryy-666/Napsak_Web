"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Badge, Card, PageContainer, Section } from "../ui";

export const FAQS = [
  {
    question: "Nasıl katılabilirim?",
    answer:
      "DM üzerinden otomatik yanıtları kullanabilir ya da biyografimizdeki başvuru formunu doldurarak aramıza katılabilirsiniz :).",
  },
  {
    question: "Kimler katılabilir?",
    answer:
      "Liseden itibaren her genç, şehir fark etmeksizin başvuru yapabilir.",
  },
  {
    question: "N'apsak? Gençlik Topluluğu ne yapar?",
    answer:
      "Hayata geçirmek istediğimiz fikirleri birlikte üretmek için kuruldu. Amacımız sadece etkinlik yapmak değil; gençlerin potansiyelini keşfetmesini, yeteneklerini geliştirmesini ve topluma değer katan projeler üretmesini sağlamak.",
  },
  {
    question: "Hangi alanlarda yer alabilirim?",
    answer:
      "Sanat, teknoloji, çevre & sağlık, programlar ve kurumsal iletişim ekiplerimiz bulunuyor. Yazmayı, çizmeyi, kodlamayı ya da organizasyon yapmayı seviyorsanız kendinize uygun bir alan mutlaka bulursunuz.",
  },
  {
    question: "Tecrübem yok, katılabilir miyim?",
    answer:
      `Eğer gelişmeye açık, öğrenmeye istekli ve "N'apsak?" deyip harekete geçmeye hazırsan hiçbir tecrübeye ihtiyacın yok. Biz, tecrübesi olmayan arkadaşlarımızın da tecrübe kazanması için buradayız.`,
  },
  {
    question: "Daha önce böyle bir ortamda bulunmadım, süreç nasıl ilerliyor?",
    answer:
      "Endişelenmene hiç gerek yok :). Süreç boyunca sana destek oluyor, ekiplerle tanışmanı sağlıyor ve adım adım adapte olmanı kolaylaştırıyoruz. Burada herkes bir zamanlar ilk adımını attı.",
  },
  {
    question: "Kısaca...",
    answer:
      `Biz "keşke" diyen değil, "N'apsak?" deyip harekete geçenlerin topluluğuyuz.`,
  },
];

export interface FAQSectionProps {
  showHeader?: boolean;
  background?: "transparent" | "white" | "subtle";
  customFaqs?: Array<{ question: string; answer: string }>;
}

export function FAQSection({
  showHeader = true,
  background = "transparent",
  customFaqs,
}: FAQSectionProps) {
  const faqList = customFaqs && customFaqs.length > 0 ? customFaqs : FAQS;
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // References for focus management & accessibility
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll & listen for ESC key when modal is open
  useEffect(() => {
    if (selectedQuestion !== null) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setSelectedQuestion(null);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // Focus close button once modal mounts
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
      // Return focus to previous trigger button on modal close
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [selectedQuestion]);

  const handleOpenModal = (index: number) => {
    setSelectedQuestion(index);
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
  };

  return (
    <>
      {/* FAQ ALANI */}
      <Section padding="none" background={background} className="py-4 sm:py-6">
        <PageContainer>

          {/* Başlık (Opsiyonel) */}
          {showHeader && (
            <div className="text-center max-w-3xl mx-auto mb-10">
              <Badge
                variant="brand"
                size="md"
                className="mb-3"
              >
                Sıkça Sorulan Sorular
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F1115] font-headings mb-4">
                Merak Ettikleriniz
              </h2>

              <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans">
                N'apsak? hakkında en çok merak edilen soruların cevaplarını
                burada bulabilirsin.
              </p>
            </div>
          )}

          {/* SORULAR */}
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqList.map((faq, index) => (
              <Card
                key={index}
                variant="outlined"
                animate={false}
                className="!p-0 overflow-hidden !bg-[#F7FBF8] !border-[#DCEAE1]"
              >
                <button
                  ref={(el) => {
                    triggerRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => handleOpenModal(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-[#EAF4EE] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20 transition-colors"
                  aria-haspopup="dialog"
                  aria-expanded={selectedQuestion === index}
                >
                  <span className="text-base sm:text-lg font-semibold text-[#0F1115]">
                    {faq.question}
                  </span>

                  <Plus className="w-5 h-5 flex-shrink-0 text-[#0A5C3A]" />
                </button>
              </Card>
            ))}
          </div>

        </PageContainer>
      </Section>

      {/* MODAL */}
      <AnimatePresence>
        {selectedQuestion !== null && faqList[selectedQuestion] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03261A]/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`faq-modal-title-${selectedQuestion}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-2xl flex flex-col"
            >

              {/* MODAL KUTUSU */}
              <Card
                variant="elevated"
                animate={false}
                className="!p-6 sm:!p-8 !bg-[#0A5C3A]/95 !border-white/10 backdrop-blur-xl max-h-[85vh] overflow-y-auto"
              >

                {/* Modal başlık */}
                <div className="flex items-start justify-between gap-4 mb-6">

                  <h3
                    id={`faq-modal-title-${selectedQuestion}`}
                    className="text-xl sm:text-2xl font-bold text-white font-headings"
                  >
                    {faqList[selectedQuestion].question}
                  </h3>

                  {/* Kapat */}
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={handleCloseModal}
                    aria-label="Pencereyi Kapat"
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                </div>

                {/* Cevap */}
                <p className="text-base text-[#E8F5EE] leading-relaxed">
                  {faqList[selectedQuestion].answer}
                </p>

              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
