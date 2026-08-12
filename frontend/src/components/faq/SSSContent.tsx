"use client";

import React from "react";
import { LayoutGroup } from "framer-motion";
import { PageContainer } from "../ui/PageContainer";
import { PageHeader } from "../common/PageHeader";
import { FAQSection } from "./FAQSection";
import { PageBackground } from "../common/PageBackground";

export default function SSSContent() {
  return (
    <LayoutGroup id="sss-layout-group">
      <PageBackground id="sss-page-root" className="select-none">
        <PageContainer>
          <PageHeader
            title="Sıkça Sorulan Sorular"
            description="Merak ettiğin tüm soruların cevaplarını burada bulabilirsin."
            badge="Destek & Bilgi"
            centered
          />
        </PageContainer>

        <FAQSection showHeader={false} background="transparent" />
      </PageBackground>
    </LayoutGroup>
  );
}
