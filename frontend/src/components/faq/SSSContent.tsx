"use client";

import React from "react";
import { LayoutGroup } from "framer-motion";
import { PageContainer } from "../ui/PageContainer";
import { PageHeader } from "../common/PageHeader";
import { FAQSection } from "./FAQSection";
import { PageBackground } from "../common/PageBackground";

export default function SSSContent({
  pageData,
  customFaqs,
}: {
  pageData?: any;
  customFaqs?: Array<{ question: string; answer: string }>;
}) {
  return (
    <LayoutGroup id="sss-layout-group">
      <PageBackground id="sss-page-root" className="select-none">
        <PageContainer>
          <PageHeader
            title={pageData?.title ? pageData.title : "Sıkça Sorulan Sorular"}
            description={
              pageData?.shortDescription
                ? pageData.shortDescription
                : "Merak ettiğin tüm soruların cevaplarını burada bulabilirsin."
            }
            badge="Destek & Bilgi"
            centered
          />
        </PageContainer>

        <FAQSection showHeader={false} background="transparent" customFaqs={customFaqs} />
      </PageBackground>
    </LayoutGroup>
  );
}
