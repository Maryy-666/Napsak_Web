import React from "react";
import { Navbar } from "../../components/common/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* Top spacing to account for the sticky navbar and prevent layout overlaps */}
      <main className="flex-1 w-full flex flex-col pt-20">
        {children}
      </main>
    </>
  );
}
