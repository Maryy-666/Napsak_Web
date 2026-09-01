"use client";

import React from "react";
import { motion } from "framer-motion";
import { PageContainer } from "../ui/PageContainer";
import { Section } from "../ui/Section";
import { useLanguage } from "../../context/LanguageContext";

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export const StatsSection: React.FC<{ stats?: StatItem[]; className?: string }> = ({
  stats,
  className = "",
}) => {
  const { t } = useLanguage();

  const defaultStats: StatItem[] = [
    {
      id: "active-members",
      value: "86+",
      label: t("stats.members", "AKTİF ÜYE"),
    },
    {
      id: "working-teams",
      value: "5+",
      label: t("stats.teams", "ÇALIŞMA EKİBİ"),
    },
    {
      id: "events",
      value: "40+",
      label: t("stats.events", "ETKİNLİK"),
    },
    {
      id: "applications",
      value: "150+",
      label: t("stats.applications", "BAŞVURU"),
    },
  ];

  const statItems = stats || defaultStats;

  return (
    <Section
      padding="none"
      background="white"
      className={`py-12 sm:py-16 border-b border-[#EEF0F2] ${className}`}
      id="statistics-section"
    >
      <PageContainer>
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 w-full">
            {statItems.map((stat, index) => {
              // Responsive delicate border dividers:
              // Index 0: right & bottom on mobile/tablet (2x2), right only on desktop (4x1)
              // Index 1: bottom on mobile/tablet, right on desktop
              // Index 2: right on mobile/tablet, right on desktop
              // Index 3: no right or bottom border
              const borderClasses =
                index === 0
                  ? "border-r border-b lg:border-b-0 border-[#EEF0F2]"
                  : index === 1
                  ? "border-b lg:border-r lg:border-b-0 border-[#EEF0F2]"
                  : index === 2
                  ? "border-r lg:border-r lg:border-b-0 border-[#EEF0F2]"
                  : "lg:border-r-0 border-none";

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className={`group relative flex flex-col items-center justify-center p-6 sm:p-8 select-none transition-all duration-300 ${borderClasses}`}
                >
                  {/* Subtle top accent bar that lights up in brand green on hover */}
                  <div className="w-6 h-0.5 rounded-full bg-transparent group-hover:bg-[#0A5C3A] mb-3 transition-colors duration-300" />

                  {/* Large Powerful Stat Number */}
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-headings tracking-tight text-[#0F1115] group-hover:text-[#0A5C3A] transition-all duration-300 group-hover:-translate-y-1.5 inline-block">
                    {stat.value}
                  </span>

                  {/* Small Uppercase Label */}
                  <span className="mt-2.5 sm:mt-3 text-xs sm:text-sm font-bold tracking-wider text-[#5F6773] uppercase font-sans group-hover:text-[#0F1115] transition-colors duration-300 text-center">
                    {stat.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
};

export default StatsSection;
