"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { i18n, createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/i18n/locales/en.json";
import it from "@/i18n/locales/it.json";

const resources: Record<string, { translation: Record<string, string> }> = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
};  
export function useI18n() {
  // useRef to hold the i18n instance, persisting across renders without causing re-renders
  const i18nInstanceRef = useRef<i18n | null>(null);

  // State to track if the i18n instance has been initialized
  const [isInitialized, setIsInitialized] = useState(false);
  // State to hold the translation function, initially null
  const [t, setT] = useState<((key: string) => string) | null>(null);

  // Function to initialize i18next
  const initializeI18next = useCallback(async () => {    
    if (i18nInstanceRef.current) {
        setIsInitialized(true);
        return;
    }

    i18nInstanceRef.current = createInstance();
    await i18nInstanceRef.current
      .use(initReactI18next)
      .init({
        lng: "en",
        fallbackLng: "en",
        resources,
      });

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    initializeI18next();
  }, [initializeI18next]);

  useEffect(() => {
    if (isInitialized && i18nInstanceRef.current) {
      setT(() => i18nInstanceRef.current!.t.bind(i18nInstanceRef.current));
    }
  }, [isInitialized]);
  const changeLanguage = useCallback((lng: string) => {
    if (i18nInstanceRef.current) {
      i18nInstanceRef.current.changeLanguage(lng);
    }
  }, []);

  return {
    i18n: i18nInstanceRef.current, // Return the i18n instance
    isInitialized,
    t: t || ((key: string) => key), // Return the translation function, or a fallback function if not initialized
    changeLanguage,
  };
}
