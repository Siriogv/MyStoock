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
import { useI18n } from "@/hooks/use-i18n";
import { useSession } from "next-auth/react";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseApp } from "@/services/firebase";
import { initializeApp } from 'firebase/app';
import { getApp } from 'firebase/app';


export default function SettingsPage() {
  const router = useRouter();
  const {toast} = useToast();
  const { i18n, isInitialized } = useI18n();
  const { data: session } = useSession()

  const [currency, setCurrency] = useLocalStorage("currency", "EUR");
  const [market, setMarket] = useLocalStorage("market", "NYSE");
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [commissionType, setCommissionType] = useLocalStorage("commissionType", "fixed");
  const [commissionValue, setCommissionValue] = useLocalStorage("commissionValue", "5");
  const [language, setLanguage] = useLocalStorage("language", i18n.language);
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);


  useEffect(() => {
    try {
      initializeApp(firebaseApp);
      setDb(getFirestore(getApp()));
      setAuth(getAuth(getApp()));
    } catch (e: any) {
      console.error("Firebase configuration is not valid. Check your environment variables.");
    }
  }, []);

  useEffect(() => {
    if (language && i18n.language !== language && isInitialized) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n, isInitialized]);

  const goBackToDashboard = () => {
    router.push('/');
  };

  const handleSaveSettings = async () => {
    if (!session?.user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save settings.",
      });
      return;
    }
    try {
        // TODO: Implement save settings logic here
        // save settings to the database
        toast({
          title: "Settings Saved",
          description: "Your settings have been saved successfully.",
        });

      } catch (error) {
        console.error("Failed to save settings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save settings. Please try again.",
        });
      }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>

      <div className="mb-4">
        <Label htmlFor="currency">Currency</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="currency">
            <SelectValue placeholder="Select Currency"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="market">Market</Label>
        <Select value={market} onValueChange={setMarket}>
          <SelectTrigger id="market">
            <SelectValue placeholder="Select Market"/>
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
        <Label htmlFor="theme">Theme</Label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger id="theme">
            <SelectValue placeholder="Select Theme"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select Language"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="it">Italiano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label>Commission Type</Label>
        <div className="flex items-center space-x-2">
          <Button
            variant={commissionType === "fixed" ? "default" : "outline"}
            onClick={() => setCommissionType("fixed")}
          >
            Fixed
          </Button>
          <Button
            variant={commissionType === "percentage" ? "default" : "outline"}
            onClick={() => setCommissionType("percentage")}
          >
            Percentage
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="commissionValue">Commission Value</Label>
        <input
          type="number"
          id="commissionValue"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={commissionValue}
          onChange={(e) => setCommissionValue(e.target.value)}
          placeholder="Enter commission value"
        />
      </div>

      <Button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save Settings
      </Button>

      <Button variant="secondary" onClick={goBackToDashboard}>Back to Dashboard</Button>
    </div>
  );
}
