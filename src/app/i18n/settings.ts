"use server";

import { createInstance, i18n } from "i18next";
import { initReactI18next } from "react-i18next";

const initI18next = async (locale: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance.use(initReactI18next).init({
    lng: locale,
    resources: {
      [locale]: {
        [ns]: {},
      },
    },
  });
  return i18nInstance;
};

export async function useTranslation(locale: string, ns: string) {
  const i18nextInstance = await initI18next(locale, ns);
  return {
    t: i18nextInstance.getFixedT(locale, ns),
    i18n: i18nextInstance,
  };
}
