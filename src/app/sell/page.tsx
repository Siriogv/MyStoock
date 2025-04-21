"use client";

import { useState, useEffect } from 'react';
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

interface PortfolioStock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}

export default function SellPage() {
  const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [stockInfo, setStockInfo] = useState<Stock | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([
    { symbol: 'AAPL', name: 'Apple Inc.', price: '170.34', change: '+1.50', changePercent: '0.89%' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '430.25', change: '-0.50', changePercent: '-0.12%' },
    { symbol: 'GOOG', name: 'Alphabet Inc.', price: '150.70', change: '+0.25', changePercent: '0.17%' },
    { symbol: 'NVDA', name: 'Nvidia Corp.', price: '1000.00', change: '+10.00', changePercent: '+1.00%' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: '850.50', change: '+5.00', changePercent: '+0.59%' },
  ]);

  useEffect(() => {
    if (selectedStock) {
      setStockInfo({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        price: selectedStock.price,
        change: selectedStock.change,
        changePercent: selectedStock.changePercent,
      });
    }
  }, [selectedStock]);

  const handleSell = () => {
    if (stockInfo) {
      toast({
        title: "Success",
        description: `Successfully sold ${quantity} shares of ${stockInfo.symbol}`,
      });
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Stock information not found. Please select a stock first.",
      });
    }
  };

  const goBackToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sell Stock</h1>

      <div className="mb-4">
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Select Stock from Portfolio
        </label>
        <Select onValueChange={(value) => {
          const stock = portfolio.find(s => s.symbol === value);
          setSelectedStock(stock || null);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a stock to sell" />
          </SelectTrigger>
          <SelectContent>
            {portfolio.map((stock) => (
              <SelectItem key={stock.symbol} value={stock.symbol}>
                {stock.name} ({stock.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
