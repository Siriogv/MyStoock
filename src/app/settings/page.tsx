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
import {useI18n} from "@/hooks/use-i18n";
import {TextDatabase} from "@/services/text-database";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as countries from 'countries-list';

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function SettingsPage() {
  const router = useRouter();
  const {toast} = useToast();
  const {i18n, isInitialized, t, changeLanguage} = useI18n();
  const [currency, setCurrency] = useState("EUR");
  const [market, setMarket] = useState("NYSE");
  const [theme, setTheme] = useState("light");
  const [commissionType, setCommissionType] = useState("fixed");
  const [commissionValue, setCommissionValue] = useState("5");
  const [taxRate, setTaxRate] = useState("26");
  const [language, setLanguage] = useState('en');
  const [nationality, setNationality] = useState('US');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  });

  useEffect(() => {
    if (i18n && isInitialized) {
      setLanguage(i18n.language);
    }
  }, [i18n, isInitialized]);

  useEffect(() => {
    if (language && i18n && i18n.language !== language && isInitialized) {
      changeLanguage(language);
    }
  }, [language, i18n, isInitialized, changeLanguage]);

  useEffect(() => {
    const loadSettings = async () => {
      const textDb = new TextDatabase();
      try {
        const settings = await textDb.loadSettings();
        if (settings) {
          setCurrency(settings.currency || "EUR");
          setMarket(settings.market || "NYSE");
          setTheme(settings.theme || "light");
          setCommissionType(settings.commissionType || "fixed");
          setCommissionValue(settings.commissionValue || "5");
          setTaxRate(settings.taxRate || "26");
          setLanguage(settings.language || 'en');
          setNationality(settings.nationality || 'US');
          form.setValue("username", settings.username || "");
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
  }, [toast, t, form]);

    useEffect(() => {
        // Apply theme on the client side
        if (theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            // For system theme, you might want to listen to OS preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [theme]);

  const goBackToDashboard = () => {
    router.push('/');
  };

  const handleNationalityChange = (newNationality: string) => {
    setNationality(newNationality);

    // Logic to set default language, market, and tax rate based on nationality
    // This is just an example, you'll need to adjust it based on your needs
    const countryData = countries.countries[newNationality];
    if (countryData) {
      switch (newNationality) {
        case 'IT':
          setLanguage('it');
          setMarket('MIL');
          setTaxRate('26');
          break;
        case 'US':
          setLanguage('en');
          setMarket('NYSE');
          setTaxRate('0');
          break;
        // Add more cases for other nationalities as needed
        default:
          setLanguage('en');
          setMarket('NYSE');
          setTaxRate('0');
      }
    }
  };

  const handleSaveSettings = async (values: z.infer<typeof formSchema>) => {
    const textDb = new TextDatabase();
    try {
      await textDb.saveSettings({
        currency,
        market,
        theme,
        commissionType,
        commissionValue,
        taxRate,
        language,
        nationality,
        username: values.username,
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveSettings)} className="space-y-6">
          <div className="md:grid md:grid-cols-2 md:gap-6">
            <div className="md:col-span-1">
              <div className="space-y-6">
                <div>
                  <FormItem>
                    <FormLabel htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">{t("Username")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="username"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...form.register("username")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>

                <div>
                  <FormItem>
                    <FormLabel htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">{t("Password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        id="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...form.register("password")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>

                <div>
                  <Label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">{t("Nationality")}</Label>
                  <Select value={nationality} onValueChange={handleNationalityChange}>
                    <SelectTrigger id="nationality" className="w-full">
                      <SelectValue placeholder={t("Select Nationality")}/>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(countries.countries).map((countryCode) => (
                          <SelectItem key={countryCode} value={countryCode}>
                              {countries.countries[countryCode].name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="commissionType" className="block text-sm font-medium text-gray-700 mb-2">{t("Commission Type")}</Label>
                    <Select value={commissionType} onValueChange={setCommissionType}>
                      <SelectTrigger id="commissionType" className="w-full">
                        <SelectValue placeholder={t("Select Commission Type")}/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">{t("Fixed")}</SelectItem>
                        <SelectItem value="percentage">{t("Percentage")}</SelectItem>
                      </SelectContent>
                    </Select>
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

                <div>
                  <Label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">{t("Tax Rate")}</Label>
                  <Input
                    type="number"
                    id="taxRate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder={t("Enter tax rate")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:flex md:items-center md:justify-between mt-8">
            <Button type="submit">
              {t("Save Settings")}
            </Button>
            <Button variant="secondary" onClick={goBackToDashboard}>
              {t("Back to Dashboard")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

