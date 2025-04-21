"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const router = useRouter();

  const [currency, setCurrency] = useState("EUR");
  const [market, setMarket] = useState("NYSE");
  const [theme, setTheme] = useState("light");
  const [commissionType, setCommissionType] = useState("fixed");
  const [commissionValue, setCommissionValue] = useState("5");

  const goBackToDashboard = () => {
    router.push('/');
  };

  const handleSaveSettings = () => {
    // TODO: Implement save settings logic here
    alert("Settings Saved!");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>

      <div className="mb-4">
        <Label htmlFor="currency">Currency</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="currency">
            <SelectValue placeholder="Select Currency" />
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
            <SelectValue placeholder="Select Market" />
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
            <SelectValue placeholder="Select Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
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
