"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useTranslation } from 'react-i18next';
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "@/services/firebase";

// Initialize Firebase if it hasn't been initialized yet
if (!getApps().length && firebaseConfig && firebaseConfig.apiKey) {
  initializeApp(firebaseConfig);
}


export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { i18n, t } = useTranslation();

  const [currency, setCurrency] = useState("EUR");
  const [market, setMarket] = useState("NYSE");
  const [theme, setTheme] = useState("light");
  const [commissionType, setCommissionType] = useState("fixed");
  const [commissionValue, setCommissionValue] = useState("5");
  const [language, setLanguage] = useState(i18n.language);

  const goBackToDashboard = () => {
    router.push('/');
  };

  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    if (firebaseConfig && firebaseConfig.apiKey) {
      setDb(getFirestore());
      setAuth(getAuth());
    } else {
      console.error("Firebase configuration is not valid. Check your environment variables.");
    }
  }, []);


  useEffect(() => {
    const loadSettings = async () => {
      if (!auth) return;

      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrency(data.currency || "EUR");
          setMarket(data.market || "NYSE");
          setTheme(data.theme || "light");
          setCommissionType(data.commissionType || "fixed");
          setCommissionValue(data.commissionValue || "5");
          setLanguage(data.language || i18n.language);
          i18n.changeLanguage(data.language || i18n.language);
        }
      }
    };

    if (db && auth) {
      loadSettings();
    }
  }, [auth, db, i18n]);

  const handleSaveSettings = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Firebase not initialized. Check your environment variables."),
      });
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          currency,
          market,
          theme,
          commissionType,
          commissionValue,
          language,
        });

        i18n.changeLanguage(language);

        toast({
          title: t("Settings Saved"),
          description: t("Your settings have been saved successfully."),
        });
      } catch (error: any) {
        console.error("Error saving settings:", error);
        toast({
          variant: "destructive",
          title: t("Error"),
          description: t("Failed to save settings. Please try again."),
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("You must be logged in to save settings."),
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("User Settings")}</h1>

      <div className="mb-4">
        <Label htmlFor="currency">{t("Currency")}</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="currency">
            <SelectValue placeholder={t("Select Currency")} />
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
            <SelectValue placeholder={t("Select Market")} />
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
            <SelectValue placeholder={t("Select Theme")} />
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
            <SelectValue placeholder={t("Select Language")} />
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
