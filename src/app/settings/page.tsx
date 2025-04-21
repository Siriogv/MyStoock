'use client';

import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';
import {useState, useEffect} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function SettingsPage() {
  const router = useRouter();
  const {toast} = useToast();
  const { t, i18n } = useTranslation();


  const [currency, setCurrency] = useLocalStorage("currency", "EUR");
  const [market, setMarket] = useLocalStorage("market", "NYSE");
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [commissionType, setCommissionType] = useLocalStorage("commissionType", "fixed");
  const [commissionValue, setCommissionValue] = useLocalStorage("commissionValue", "5");
  const [language, setLanguage] = useLocalStorage("language", i18n.language);

  const goBackToDashboard = () => {
    router.push('/');
  };

  useEffect(() => {
    if (i18n && language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);


  const handleSaveSettings = async () => {
    toast({
      title: t("Settings Saved"),
      description: t("Your settings have been saved successfully."),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("User Settings")}</h1>

      <div className="mb-4">
        <Label htmlFor="currency">{t("Currency")}</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="currency">
            <SelectValue placeholder={t("Select Currency")}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="market">{t("Market")}</Label>
        <Select value={market} onValueChange={setMarket}>
          <SelectTrigger id="market">
            <SelectValue placeholder={t("Select Market")}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NYSE">NYSE</SelectItem>
            <SelectItem value="NASDAQ">NASDAQ</SelectItem>
            <SelectItem value="MIL">MIL</SelectItem>
            <SelectItem value="LSE">LSE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="theme">{t("Theme")}</Label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger id="theme">
            <SelectValue placeholder={t("Select Theme")}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="language">{t("Language")}</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder={t("Select Language")}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="it">Italiano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label>{t("Commission Type")}</Label>
        <div className="flex items-center space-x-2">
          <Button
            variant={commissionType === "fixed" ? "default" : "outline"}
            onClick={() => setCommissionType("fixed")}
          >
            {t("Fixed")}
          </Button>
          <Button
            variant={commissionType === "percentage" ? "default" : "outline"}
            onClick={() => setCommissionType("percentage")}
          >
            {t("Percentage")}
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="commissionValue">{t("Commission Value")}</Label>
        <input
          type="number"
          id="commissionValue"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={commissionValue}
          onChange={(e) => setCommissionValue(e.target.value)}
          placeholder={t("Enter commission value")}
        />
      </div>

      <Button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {t("Save Settings")}
      </Button>

      <Button variant="secondary" onClick={goBackToDashboard}>{t("Back to Dashboard")}</Button>
    </div>
  );
}
