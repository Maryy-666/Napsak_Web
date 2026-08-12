"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

interface AdminThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  isDark: true,
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("napsak_admin_theme") as Theme;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("napsak_admin_theme", next);
      return next;
    });
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export const useAdminTheme = () => useContext(AdminThemeContext);
