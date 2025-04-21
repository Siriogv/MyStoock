"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from 'next/navigation'; // Import useRouter
import { getStockInfo, Stock } from "@/services/finance";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BuyPage() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [stockInfo, setStockInfo] = useState<Stock | null>(null);
  const router = useRouter(); // Initialize useRouter
  const { toast } = useToast();
    const [market, setMarket] = useState('NASDAQ'); // Default market

  const handleSearch = async () => {
    const info = await getStockInfo(symbol, market);
    setStockInfo(info);

    if (!info) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to retrieve stock information. Please check the symbol and try again.",
      });
    }
  };

  const handleBuy = () => {
    // TODO: Implement buy logic here
    if (stockInfo) {
      // For now, just show a success message
      toast({
        title: "Success",
        description: `Successfully bought ${quantity} shares of ${stockInfo.symbol}`,
      });

      // Redirect to the dashboard after successful buy
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Stock information not found. Please search for a stock first.",
      });
    }
  };

  const goBackToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buy Stock</h1>
       <div className="flex items-center mb-4">
        <Input
          type="text"
          placeholder="Enter stock symbol or name"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="mr-2"
        />
         <Select value={market} onValueChange={setMarket}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NASDAQ">NASDAQ</SelectItem>
              <SelectItem value="NYSE">NYSE</SelectItem>
              <SelectItem value="BOM">BOM</SelectItem>
                <SelectItem value="MIL">MIL</SelectItem>
              {/* Add more markets as needed */}
            </SelectContent>
          </Select>
        <Button onClick={handleSearch} className="ml-2">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {stockInfo && (
        <div className="mb-4">
          <p>Name: {stockInfo.name}</p>
          <p>Price: {stockInfo.price}</p>
           <p>
              Change Percent:
              <span className={stockInfo.changePercent >= 0 ? 'success' : 'error'}>
                {stockInfo.changePercent}
              </span>
            </p>
        </div>
      )}

      {stockInfo && (
        <div className="flex items-center">
          <label htmlFor="quantity" className="mr-2">Quantity:</label>
          <Input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 mr-2"
          />
          <Button onClick={handleBuy}>Buy</Button>
        </div>
      )}
      <Button variant="secondary" onClick={goBackToDashboard}>Back to Dashboard</Button>
    </div>
  );
}
