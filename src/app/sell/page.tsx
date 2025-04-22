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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  market: string;
  capitalization: number;
}

const mockPortfolio: PortfolioStock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', purchasePrice: 150, currentPrice: 170, quantity: 10, market: 'NASDAQ', capitalization: 1500 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', purchasePrice: 300, currentPrice: 430, quantity: 5, market: 'NASDAQ', capitalization: 1500 },
  { symbol: 'GOOG', name: 'Alphabet Inc.', purchasePrice: 100, currentPrice: 150, quantity: 8, market: 'NASDAQ', capitalization: 800 },
  { symbol: 'NVDA', name: 'Nvidia Corp.', purchasePrice: 500, currentPrice: 1000, quantity: 3, market: 'NASDAQ', capitalization: 1500 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', purchasePrice: 700, currentPrice: 850, quantity: 4, market: 'NASDAQ', capitalization: 2800 },
  { symbol: 'AMC', name: 'AMC Entertainment Holdings Inc', purchasePrice: 50, currentPrice: 25, quantity: 2, market: 'NYSE', capitalization: 100 },
  { symbol: 'BAC', name: 'Bank of America Corporation', purchasePrice: 30, currentPrice: 35, quantity: 6, market: 'NYSE', capitalization: 180 },
  { symbol: 'F', name: 'Ford Motor Company', purchasePrice: 12, currentPrice: 13, quantity: 10, market: 'NYSE', capitalization: 120 },
  { symbol: 'INTC', name: 'Intel Corporation', purchasePrice: 29, currentPrice: 30, quantity: 7, market: 'NASDAQ', capitalization: 203 },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc', purchasePrice: 160, currentPrice: 170, quantity: 3, market: 'NASDAQ', capitalization: 480 },
  { symbol: 'PFE', name: 'Pfizer Inc.', purchasePrice: 27, currentPrice: 28, quantity: 9, market: 'NYSE', capitalization: 243 },
  { symbol: 'DIS', name: 'The Walt Disney Company', purchasePrice: 100, currentPrice: 105, quantity: 4, market: 'NYSE', capitalization: 400 },
  { symbol: 'MS', name: 'Morgan Stanley', purchasePrice: 85, currentPrice: 90, quantity: 5, market: 'NYSE', capitalization: 425 },
  { symbol: 'COIN', name: 'Coinbase Global Inc', purchasePrice: 220, currentPrice: 230, quantity: 2, market: 'NASDAQ', capitalization: 440 },
  { symbol: 'GOOGL', name: 'Alphabet Inc Class A', purchasePrice: 150, currentPrice: 155, quantity: 3, market: 'NASDAQ', capitalization: 450 },
];

const calculateProfit = (stock: PortfolioStock) => {
  return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
};

const itemsPerPage = 5;

export default function SellPage() {
  const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [stockInfo, setStockInfo] = useState<Stock | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>(mockPortfolio);

  const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<keyof PortfolioStock>('profit');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterMarket, setFilterMarket] = useState<string>('All');

    const totalPages = Math.ceil(portfolio.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

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

    const sortedStocks = [...portfolio].sort((a, b) => {
        const profitA = calculateProfit(a);
        const profitB = calculateProfit(b);

        let comparison = 0;

        if (sortColumn === 'profit') {
            comparison = profitA - profitB;
        } else if (sortColumn === 'market') {
            comparison = a.market.localeCompare(b.market);
        } else if (sortColumn === 'capitalization') {
            comparison = a.capitalization - b.capitalization;
        } else if (sortColumn === 'quantity') {
            comparison = a.quantity - b.quantity;
        }
        else {
            comparison = (a[sortColumn] || '').toString().localeCompare((b[sortColumn] || '').toString());
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const filteredStocks = filterMarket === 'All'
        ? sortedStocks
        : sortedStocks.filter(stock => stock.market === filterMarket);

    const currentStocks = filteredStocks.slice(startIndex, endIndex);

    const handleSort = (column: keyof PortfolioStock) => {
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const goToPreviousPage = () => {
        setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage => Math.min(currentPage + 1, totalPages));
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
                        <TableHead onClick={() => handleSort('symbol')} className="cursor-pointer">
                            Symbol {sortColumn === 'symbol' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </TableHead>
                        <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                            Name {sortColumn === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </TableHead>
                        <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
                            Quantity {sortColumn === 'quantity' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </TableHead>
                        <TableHead onClick={() => handleSort('purchasePrice')} className="cursor-pointer">
                            Purchase Price {sortColumn === 'purchasePrice' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </TableHead>
                        <TableHead onClick={() => handleSort('currentPrice')} className="cursor-pointer">
                            Current Price {sortColumn === 'currentPrice' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </TableHead>
                        <TableHead className="text-right">Profit/Loss</TableHead>
                        <TableHead onClick={() => handleSort('market')} className="cursor-pointer">
                            Market {sortColumn === 'market' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </TableHead>
                        <TableHead onClick={() => handleSort('capitalization')} className="cursor-pointer">
                            Capitalization {sortColumn === 'capitalization' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentStocks.map((stock) => (
                        <TableRow
                            key={stock.symbol}
                            onClick={() => setSelectedStock(stock)}
                            className="cursor-pointer hover:bg-accent"
                        >
                            <TableCell className="font-medium">{stock.symbol}</TableCell>
                            <TableCell>{stock.name}</TableCell>
                            <TableCell>{stock.quantity}</TableCell>
                            <TableCell>{stock.purchasePrice}</TableCell>
                            <TableCell>{stock.currentPrice}</TableCell>
                            <TableCell className="text-right">
                                {(stock.currentPrice - stock.purchasePrice) * stock.quantity}
                            </TableCell>
                            <TableCell>{stock.market}</TableCell>
                            <TableCell>{stock.capitalization}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button variant="outline" onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </div>
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
