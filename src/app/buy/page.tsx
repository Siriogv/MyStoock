"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Stock } from "@/services/finance";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { SidebarLayout } from "@/components/sidebar-layout";

interface BuyPageProps {
  onBuySuccess?: () => void;
}
export default function BuyPage({ onBuySuccess }: BuyPageProps) {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [stockInfo, setStockInfo] = useState<Stock | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [market, setMarket] = useState('NASDAQ');
  const { t } = useI18n();

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/finance/stock-info?symbol=${symbol}&market=${market}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const info = await response.json();
      setStockInfo(info);

      if (!info) {
        toast({
          variant: "destructive",
          title: t("Error"),
          description: t("Failed to retrieve stock information. Please check the symbol and try again."),
        });
      }
    } catch (error: any) {
      console.error("Error fetching stock info:", error);
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error.message || t("Failed to retrieve stock information."),
      });
      setStockInfo(null);
    }
  };

  const handleBuy = () => {
    if (stockInfo) {
      toast({
        title: t("Success"),
        description: t("Successfully bought") + ` ${quantity} ` + t("shares of") + ` ${stockInfo.symbol}`,
      });
      onBuySuccess?.();
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Stock information not found. Please search for a stock first."),
      });
    }
  };

  const goBackToDashboard = () => {
    router.push('/');
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("Buy Stock")}</h1>
        <StockSearchInput
          symbol={symbol}
          setSymbol={setSymbol}
          market={market}
          setMarket={setMarket}
          handleSearch={handleSearch}
          t={t}
        />

        {stockInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <StockInfoDisplay stockInfo={stockInfo} />
            <QuantityInput
              quantity={quantity}
              setQuantity={setQuantity}
              handleBuy={handleBuy}
              t={t}
            />
          </div>
        )}

        <Button variant="secondary" onClick={goBackToDashboard}>{t("Back to Dashboard")}</Button>
      </div>
    </SidebarLayout>
  );
}

interface StockSearchInputProps {
  symbol: string;
  setSymbol: (symbol: string) => void;
  market: string;
  setMarket: (market: string) => void;
  handleSearch: () => Promise<void>;
  t: (key: string) => string;
}

function StockSearchInput({ symbol, setSymbol, market, setMarket, handleSearch, t }: StockSearchInputProps) {
  return (
    <div className="flex flex-wrap items-center mb-4">
      <Input
        type="text"
        placeholder={t("Enter stock symbol or name")}
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="mr-2 mb-2 md:mb-0"
      />
      <Select value={market} onValueChange={setMarket} className="mr-2 mb-2 md:mb-0">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("Select Market")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NASDAQ">NASDAQ</SelectItem>
          <SelectItem value="NYSE">NYSE</SelectItem>
          <SelectItem value="BOM">BOM</SelectItem>
          <SelectItem value="MIL">MIL</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} className="ml-2">
        <Search className="mr-2 h-4 w-4" />
        {t("Search")}
      </Button>
    </div>
  );
}

interface StockInfoDisplayProps {
  stockInfo: Stock;
}

function StockInfoDisplay({ stockInfo }: StockInfoDisplayProps) {
  return (
    <div className="w-full">
      <p>{t("Name")}: {stockInfo.name}</p>
      <p>{t("Price")}: {stockInfo.price}</p>
      <p>
        {t("Change Percent")}:
        <span className={stockInfo.changePercent >= 0 ? 'success' : 'error'}>
          {stockInfo.changePercent}
        </span>
      </p>
    </div>
  );
}

interface QuantityInputProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleBuy: () => void;
  t: (key: string) => string;
}

function QuantityInput({ quantity, setQuantity, handleBuy, t }: QuantityInputProps) {
  return (
    <div className="w-full">
      <label htmlFor="quantity" className="mr-2 block">{t("Quantity")}:</label>
      <Input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-24 mr-2"
      />
      <Button onClick={handleBuy}>{t("Buy")}</Button>
    </div>
  );
}

