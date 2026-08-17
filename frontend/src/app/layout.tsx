import React from "react";
import { Toaster } from "sonner";
import "../styles/globals.css";
import { AccessibilityWidget } from "../components/common/AccessibilityWidget";

export const metadata = {
  title: "N'apsak? Gençlik Topluluğu",
  description: "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji topluluğu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-white">
        {children}
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
      </body>
    </html>
  );
}
