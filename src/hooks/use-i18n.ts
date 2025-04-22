"use client";

import { useEffect, useState, useCallback } from 'react';
import { i18n, createInstance } from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from '@/i18n/locales/en.json';
import it from '@/i18n/locales/it.json';

const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
};

let i18nInstance: i18n | null = null;

export function useI18n() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [t, setT] = useState<((key: string) => string) | null>(null);
  const [i18nFromHook, setI18nFromHook] = useState<i18n | null>(null);

  const initializeI18next = useCallback(async () => {
    if (!i18nInstance) {
      i18nInstance = createInstance();
      i18nInstance
        .use(initReactI18next)
        .init({
          lng: 'en', // Default language
          fallbackLng: 'en',
          resources: resources,
        })
        .then(() => {
          setIsInitialized(true);
          setI18nFromHook(i18nInstance);
        });
    } else {
      setIsInitialized(true);
      setI18nFromHook(i18nInstance);
    }
  }, []);

  useEffect(() => {
    initializeI18next();
  }, [initializeI18next]);

  useEffect(() => {
    if (isInitialized && i18nFromHook) {
      setT(() => i18nFromHook.t.bind(i18nFromHook));
    }
  }, [isInitialized, i18nFromHook]);

  const changeLanguage = useCallback(
    (lng: string) => {
      if (i18nInstance) {
        i18nInstance.changeLanguage(lng);
      }
    },
    []
  );

  return {
    i18n: i18nFromHook,
    isInitialized,
    t: t || ((key: string) => key),
    changeLanguage,
  };
}
