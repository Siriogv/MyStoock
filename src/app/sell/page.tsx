"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {getStockInfo, Stock} from "@/services/finance";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SellPage() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [stockInfo, setStockInfo] = useState<Stock | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [market, setMarket] = useState('NASDAQ'); // Default market

  const handleSearch = async () => {
    // TODO: Implement search from portfolio logic here
    // For now, use a mock portfolio
    const mockPortfolio = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: '170.34', change: '+1.50', changePercent: '0.89%' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: '430.25', change: '-0.50', changePercent: '-0.12%' },
      { symbol: 'GOOG', name: 'Alphabet Inc.', price: '150.70', change: '+0.25', changePercent: '0.17%' },
        { symbol: 'NVDA', name: 'Nvidia Corp.', price: '1000.00', change: '+10.00', changePercent: '+1.00%' },
      // Add more stocks to the mock portfolio as needed
    ];

    const foundStock = mockPortfolio.find(stock => stock.symbol.toUpperCase() === symbol.toUpperCase());

    if (foundStock) {
      setStockInfo(foundStock);
        toast({
          title: "Success",
          description: `Stock ${foundStock.symbol} found in your portfolio.`,
        });
    } else {
      setStockInfo(null);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Stock not found in your portfolio. Please check the symbol.",
      });
    }
  };

  const handleSell = () => {
    // TODO: Implement sell logic here
    if (stockInfo) {
          // For now, just show a success message
          toast({
            title: "Success",
            description: `Successfully sold ${quantity} shares of ${stockInfo.symbol}`,
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
      <h1 className="text-2xl font-bold mb-4">Sell Stock</h1>
       <div className="flex items-center mb-4">
        <Input
          type="text"
          placeholder="Enter stock symbol or name from your portfolio"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="mr-2"
        />
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
          <Button onClick={handleSell}>Sell</Button>
        </div>
      )}

       <Button variant="secondary" onClick={goBackToDashboard}>Back to Dashboard</Button>
    </div>
  );
}
