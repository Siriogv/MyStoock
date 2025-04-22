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
import { useI18n } from "@/hooks/use-i18n";
import {TextDatabase} from "@/services/text-database";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const router = useRouter();
  const {toast} = useToast();
  const { i18n, isInitialized } = useI18n();
  const {t} = i18n || {t: (str: string) => str};

  const [currency, setCurrency] = useState("EUR");
  const [market, setMarket] = useState("NYSE");
  const [theme, setTheme] = useState("light");
  const [commissionType, setCommissionType] = useState("fixed");
  const [commissionValue, setCommissionValue] = useState("5");
  const [language, setLanguage] = useState(i18n?.language || 'en');
  const [textDb, setTextDb] = useState<TextDatabase>(new TextDatabase());

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await textDb.loadSettings();
        if (settings) {
          setCurrency(settings.currency);
          setMarket(settings.market);
          setTheme(settings.theme);
          setCommissionType(settings.commissionType);
          setCommissionValue(settings.commissionValue);
          setLanguage(settings.language);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast({
          variant: "destructive",
          title: t('Error'),
          description: t("Failed to load settings. Please try again."),
        });
      }
    };

    loadSettings();
  }, [toast, textDb, t]);

  useEffect(() => {
    if (language && i18n?.language !== language && isInitialized) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n, isInitialized]);

  const goBackToDashboard = () => {
    router.push('/');
  };

  const handleSaveSettings = async () => {
    try {
      await textDb?.saveSettings({
        currency,
        market,
        theme,
        commissionType,
        commissionValue,
        language,
      });

      toast({
        title: t("Settings Saved"),
        description: t("Your settings have been saved successfully."),
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        variant: "destructive",
        title: t('Error'),
        description: t("Failed to save settings. Please try again."),
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">{t("User Settings")}</h1>

      <div className="space-y-6">
        <div>
          <Label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">{t("Currency")}</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder={t("Select Currency")}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="market" className="block text-sm font-medium text-gray-700 mb-2">{t("Market")}</Label>
          <Select value={market} onValueChange={setMarket}>
            <SelectTrigger id="market" className="w-full">
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

        <div>
          <Label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">{t("Theme")}</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder={t("Select Theme")}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">{t("Language")}</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder={t("Select Language")}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="it">Italiano</SelectItem>
            </SelectContent>
          </Select>
        </div>

         <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">{t("Commission Type")}</Label>
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

            <div>
              <Label htmlFor="commissionValue" className="block text-sm font-medium text-gray-700 mb-2">{t("Commission Value")}</Label>
              <Input
                type="number"
                id="commissionValue"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={commissionValue}
                onChange={(e) => setCommissionValue(e.target.value)}
                placeholder={t("Enter commission value")}
              />
            </div>
          </div>
      </div>

      <Separator className="my-4"/>

      <div className="flex justify-between">
        <Button onClick={handleSaveSettings}>
          {t("Save Settings")}
        </Button>
        <Button variant="secondary" onClick={goBackToDashboard}>
          {t("Back to Dashboard")}
        </Button>
      </div>
    </div>
  );
}
