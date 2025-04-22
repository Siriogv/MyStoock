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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
}

export default function SellPage() {
  const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [stockInfo, setStockInfo] = useState<Stock | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([
    { symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, purchasePrice: 150, currentPrice: 170 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 5, purchasePrice: 300, currentPrice: 430 },
    { symbol: 'GOOG', name: 'Alphabet Inc.', quantity: 8, purchasePrice: 100, currentPrice: 150 },
    { symbol: 'NVDA', name: 'Nvidia Corp.', quantity: 3, purchasePrice: 500, currentPrice: 1000 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', quantity: 4, purchasePrice: 700, currentPrice: 850 },
  ]);

  useEffect(() => {
    if (selectedStock) {
      setStockInfo({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        price: selectedStock.currentPrice.toString(),
        change: (selectedStock.currentPrice - selectedStock.purchasePrice).toString(),
        changePercent: (((selectedStock.currentPrice - selectedStock.purchasePrice) / selectedStock.purchasePrice) * 100).toFixed(2) + '%',
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

         <Table>
            <TableCaption>Select a stock to sell from your portfolio.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name (Symbol)</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.map((stock) => (
                <TableRow
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className="cursor-pointer hover:bg-accent"
                >
                  <TableCell className="font-medium">
                    {stock.name} ({stock.symbol})
                  </TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>{stock.purchasePrice}</TableCell>
                  <TableCell>{stock.currentPrice}</TableCell>
                  <TableCell className="text-right">
                    {(stock.currentPrice - stock.purchasePrice) * stock.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
