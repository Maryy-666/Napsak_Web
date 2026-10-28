import React from "react";
import { Toaster } from "sonner";
import "../styles/globals.css";
import { AccessibilityWidget } from "../components/common/AccessibilityWidget";
import { SkipLink } from "../components/common/SkipLink";
import { LanguageProvider } from "../context/LanguageContext";

export const metadata = {
  title: "Ne Yapsak? Gençlik Derneği",
  description: "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji derneği.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-white">
        <LanguageProvider>
          <SkipLink />
          <div id="main-content" className="flex-1 flex flex-col min-h-0">
            {children}
          </div>
          <AccessibilityWidget />
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              style: {
                fontFamily: "var(--font-sans)",
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}

