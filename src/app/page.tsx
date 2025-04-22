"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NewsSection } from "@/components/news-section"; // Import the NewsSection component
import {Stock} from "@/components/highest-profit-stocks";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

const mockPortfolio: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', purchasePrice: 150, currentPrice: 170, quantity: 10, market: 'NASDAQ', capitalization: 1500 , changePercent: 2},
  { symbol: 'MSFT', name: 'Microsoft Corp.', purchasePrice: 300, currentPrice: 430, quantity: 5, market: 'NASDAQ', capitalization: 1500 , changePercent: -4},
  { symbol: 'GOOG', name: 'Alphabet Inc.', purchasePrice: 100, currentPrice: 150, quantity: 8, market: 'NASDAQ', capitalization: 800 , changePercent: 6},
  { symbol: 'NVDA', name: 'Nvidia Corp.', purchasePrice: 500, currentPrice: 1000, quantity: 3, market: 'NASDAQ', capitalization: 1500 , changePercent: 0},
  { symbol: 'TSLA', name: 'Tesla, Inc.', purchasePrice: 700, currentPrice: 850, quantity: 4, market: 'NASDAQ', capitalization: 2800 , changePercent: 8},
];

const calculateProfit = (stock: Stock) => {
  return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
};

const itemsPerPage = 5;

const TableComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Stock>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterMarket, setFilterMarket] = useState<string>('All');

  const totalPages = Math.ceil(mockPortfolio.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortedStocks = [...mockPortfolio].sort((a, b) => {
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

  const handleSort = (column: keyof Stock) => {
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
    <div>
      

      <Table>
        <TableHeader className="mb-4">
          <TableRow>
            <TableHead onClick={() => handleSort('symbol')} className="cursor-pointer p-4">
              Symbol {sortColumn === 'symbol' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer p-4">
              Name {sortColumn === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer p-4">
              Quantity {sortColumn === 'quantity' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('purchasePrice')} className="cursor-pointer p-4">
              Purchase Price {sortColumn === 'purchasePrice' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('currentPrice')} className="cursor-pointer p-4">
              Current Price {sortColumn === 'currentPrice' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHead>
             <TableHead className="p-4" >
              Market Value
            </TableHead>
             <TableHead className="p-4" >
              Daily %
            </TableHead>
            <TableHead onClick={() => handleSort('profit')} className="cursor-pointer p-4">
              Profit {sortColumn === 'profit' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('market')} className="cursor-pointer p-4">
              Market {sortColumn === 'market' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead onClick={() => handleSort('capitalization')} className="cursor-pointer p-4">
              Capitalization {sortColumn === 'capitalization' && (sortOrder === 'asc' ? '▲' : '▼')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentStocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell>{stock.quantity}</TableCell>
              <TableCell>{stock.purchasePrice}</TableCell>
              <TableCell>{stock.currentPrice}</TableCell>
              <TableCell>{stock.currentPrice * stock.quantity}</TableCell>
               <TableCell>{stock.changePercent}</TableCell>
              <TableCell>{calculateProfit(stock)}</TableCell>
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
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function Home() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

    // Calculate total purchase value
    const totalPurchaseValue = mockPortfolio.reduce((acc, stock) => {
      return acc + (stock.purchasePrice * stock.quantity);
    }, 0);

    // Calculate current total value
    const currentTotalValue = mockPortfolio.reduce((acc, stock) => {
      return acc + (stock.currentPrice * stock.quantity);
    }, 0);

    // Calculate total profit/loss
    const totalProfitLoss = currentTotalValue - totalPurchaseValue;

  return (
    
        <div className="p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your investment portfolio overview.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Total Purchase Value</h2>
              <p className="text-2xl">{formatCurrency(totalPurchaseValue)}</p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Current Total Value</h2>
              <p className="text-2xl">{formatCurrency(currentTotalValue)}</p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Total Profit/Loss</h2>
              <p className={`text-2xl ${totalProfitLoss >= 0 ? 'success' : 'error'}`}>{formatCurrency(totalProfitLoss)}</p>
            </div>
          </div>

          <TableComponent/>
          <NewsSection />
        </div>
    
  );
}

