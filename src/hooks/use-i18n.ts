"use client";

import { useEffect, useState } from 'react';
import { i18n, createInstance } from 'i18next';
import { useTranslation } from 'react-i18next';

export function useI18n() {
  const i18nInstance = createInstance();
  const { i18n: i18nFromUseTranslation } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initI18next = async () => {
      if (!i18nInstance.isInitialized) {
        await i18nInstance.init({
          lng: 'en', // Default language
          fallbackLng: 'en',
          resources: {
            en: {
              translation: {
                "User Settings": "User Settings",
                "Currency": "Currency",
                "Select Currency": "Select Currency",
                "Market": "Market",
                "Select Market": "Select Market",
                "Theme": "Theme",
                "Select Theme": "Select Theme",
                "Language": "Language",
                "Select Language": "Select Language",
                "Commission Type": "Commission Type",
                "Fixed": "Fixed",
                "Percentage": "Percentage",
                "Commission Value": "Commission Value",
                "Enter commission value": "Enter commission value",
                "Save Settings": "Save Settings",
                "Back to Dashboard": "Back to Dashboard",
                "Settings Saved": "Settings Saved",
                "Your settings have been saved successfully.": "Your settings have been saved successfully.",
                "Error": "Error",
                "Failed to save settings. Please try again.": "Failed to save settings. Please try again.",
                "You must be logged in to save settings.": "You must be logged in to save settings."
              }
            },
            it: {
              translation: {
                "User Settings": "Impostazioni Utente",
                "Currency": "Valuta",
                "Select Currency": "Seleziona Valuta",
                "Market": "Mercato",
                "Select Market": "Seleziona Mercato",
                "Theme": "Tema",
                "Select Theme": "Seleziona Tema",
                "Language": "Lingua",
                "Select Language": "Seleziona Lingua",
                "Commission Type": "Tipo di Commissione",
                "Fixed": "Fisso",
                "Percentage": "Percentuale",
                "Commission Value": "Valore Commissione",
                "Enter commission value": "Inserisci valore commissione",
                "Save Settings": "Salva Impostazioni",
                "Back to Dashboard": "Torna alla Dashboard",
                "Settings Saved": "Impostazioni Salva",
                "Your settings have been saved successfully.": "Le tue impostazioni sono state salvate con successo.",
                "Error": "Errore",
                "Failed to save settings. Please try again.": "Impossibile salvare le impostazioni. Per favore riprova.",
                "You must be logged in to save settings.": "Devi essere loggato per salvare le impostazioni."
              }
            }
          }
        });
        setIsInitialized(true);
      }
    };

    initI18next();
  }, [i18nInstance]);

  return { i18n: i18nInstance, isInitialized };
}
