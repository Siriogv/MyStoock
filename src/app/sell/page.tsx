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
  quantity: number;
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
    { symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, price: '170.34', change: '+1.50', changePercent: '0.89%' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 5, price: '430.25', change: '-0.50', changePercent: '-0.12%' },
    { symbol: 'GOOG', name: 'Alphabet Inc.', quantity: 8, price: '150.70', change: '+0.25', changePercent: '0.17%' },
    { symbol: 'NVDA', name: 'Nvidia Corp.', quantity: 3, price: '1000.00', change: '+10.00', changePercent: '+1.00%' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', quantity: 4, price: '850.50', change: '+5.00', changePercent: '+0.59%' },
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
        
        {portfolio.map((stock) => (
          <div key={stock.symbol} className="mb-2 p-2 border rounded flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="link" onClick={() => setSelectedStock(stock)}>
                {stock.name} ({stock.symbol})
              </Button>
              <p className="text-sm">Price: {stock.price}</p>
              <p className="text-sm">Change: {stock.change} ({stock.changePercent})</p>
              <p className="text-sm">Quantity: {stock.quantity}</p>
            </div>
            
          </div>
        ))}
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

