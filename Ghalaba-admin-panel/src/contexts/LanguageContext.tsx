import React, { createContext, useContext } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (ar: string, en: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // لوحة التحكم ثابتة باللغة العربية دائماً
  const language: Language = "ar";

  if (typeof document !== "undefined") {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }

  const toggleLanguage = () => {
    // لوحة التحكم عربية فقط - لا يوجد تبديل للغة
  };

  const t = (ar: string, _en: string) => ar;

  const dir = "rtl";

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
