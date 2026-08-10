"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Badge, Card, PageContainer, Section } from "../ui";

const FAQS = [
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

export function FAQSection() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  return (
    <>
      <Section padding="lg" background="subtle">
        <PageContainer>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge variant="brand" size="md" className="mb-3">
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

          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {FAQS.map((faq, index) => (
              <Card
                key={index}
                variant="outlined"
                animate={false}
                className="!p-0 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-[#F8FAF9] transition-colors"
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

      <AnimatePresence>
        {selectedQuestion !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedQuestion(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card
                variant="elevated"
                animate={false}
                className="!p-6 sm:!p-8"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0F1115] font-headings">
                    {FAQS[selectedQuestion].question}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setSelectedQuestion(null)}
                    aria-label="Kapat"
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#EEF0F2] transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5F6773]" />
                  </button>
                </div>

                <p className="text-base text-[#5F6773] leading-relaxed">
                  {FAQS[selectedQuestion].answer}
                </p>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
