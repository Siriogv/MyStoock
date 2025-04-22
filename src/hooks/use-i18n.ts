"use client";

import { useEffect, useState } from 'react';
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

export function useI18n() {
  const i18nInstance = createInstance();
  const { i18n: i18nFromUseTranslation } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initI18next = async () => {
      if (!i18nInstance.isInitialized) {
        i18nInstance
          .use(initReactI18next)
          .init({
            lng: 'en', // Default language
            fallbackLng: 'en',
            resources: resources,
          })
          .then(() => setIsInitialized(true));
      }
    };

    initI18next();
  }, [i18nInstance]);

  return { i18n: i18nInstance, isInitialized };
}
