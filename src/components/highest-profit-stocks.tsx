"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useI18n} from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {PortfolioStock} from "@/types";
import { SellStockModal } from "@/components/sell-stock-modal";
import { Skeleton } from "@/components/ui/skeleton";

export interface Stock {
    symbol: string;
    name: string;
    purchasePrice: number;
    currentPrice: number;
    quantity: number;
    market: string;
    capitalization: number;
    changePercent:number;
};

const mockPortfolio: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', purchasePrice: 150, currentPrice: 170, quantity: 10, market: 'NASDAQ', capitalization: 1500, changePercent: 2 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', purchasePrice: 300, currentPrice: 430, quantity: 5, market: 'NASDAQ', capitalization: 1500, changePercent: -4 },
    { symbol: 'GOOG', name: 'Alphabet Inc.', purchasePrice: 100, currentPrice: 150, quantity: 8, market: 'NASDAQ', capitalization: 800, changePercent: 6 },
    { symbol: 'NVDA', name: 'Nvidia Corp.', purchasePrice: 500, currentPrice: 1000, quantity: 3, market: 'NASDAQ', capitalization: 1500, changePercent: 0 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', purchasePrice: 700, currentPrice: 850, quantity: 4, market: 'NASDAQ', capitalization: 2800, changePercent: 8 },
];

const calculateProfit = (stock: Stock) => {
    return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
};

interface HighestProfitStocksProps {
    portfolio: Stock[];
    onSellStock: (stock: Stock) => void;
    sortColumn: keyof Stock;
    sortOrder: 'asc' | 'desc';
    setSortColumn: (column: keyof Stock) => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
}

const HighestProfitStocks = ({ portfolio, onSellStock, sortColumn, sortOrder, setSortColumn, setSortOrder }: HighestProfitStocksProps) => {
    const [highestProfitStocks, setHighestProfitStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useI18n();
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    const sortedStocks = useMemo(() => {
        return [...portfolio].sort((a, b) => {
            const profitA = calculateProfit(a);
            const profitB = calculateProfit(b);
            return sortOrder === 'asc' ? profitA - profitB : profitB - profitA;
        });
    }, [portfolio, sortOrder]);

    useEffect(() => {
        setIsLoading(true);
        // Sort the mock portfolio based on profit
        setTimeout(() => {
          setHighestProfitStocks(sortedStocks);
          setIsLoading(false);
        }, 1000);

    }, [sortedStocks]);

    const handleSellStock = (stock: Stock) => {
        setSelectedStock(stock);
        setIsSellModalOpen(true);
        onSellStock(stock);
    };

    const handleCloseSellModal = () => {
        setIsSellModalOpen(false);
        setSelectedStock(null);
    };

    const handleSort = (column: keyof Stock) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const renderHeader = (labelKey: string, column: keyof Stock) => (
        <>
          {t(labelKey)}{" "}
          {sortColumn === column && (sortOrder === "asc" ? "▲" : "▼")}
        </>
      );
    };

    const renderTableCell = (content: string | number) => {
        return isLoading ? (
            <TableCell>
                <Skeleton className="h-4 w-24" />
            </TableCell>
        ) : (
            <TableCell>{content}</TableCell>
        );
    };

    return (
        <Card>
          <CardHeader>
            <CardTitle>{t("Highest Profit Stocks")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("symbol")}>{renderHeader("Symbol", "symbol")}</TableHead>
                  <TableHead onClick={() => handleSort("name")}>{renderHeader("Name", "name")}</TableHead>
                  <TableHead onClick={() => handleSort("quantity")}>{renderHeader("Quantity", "quantity")}</TableHead>
                  <TableHead onClick={() => handleSort("purchasePrice")}>{renderHeader("Purchase Price", "purchasePrice")}</TableHead>
                  <TableHead onClick={() => handleSort("currentPrice")}>{renderHeader("Current Price", "currentPrice")}</TableHead>
                  <TableHead onClick={() => handleSort("changePercent")}>{renderHeader("Daily %", "changePercent")}</TableHead>
                  <TableHead onClick={() => handleSort("profit" as keyof Stock)}>{renderHeader("Profit", "profit" as keyof Stock)}</TableHead>
                  <TableHead onClick={() => handleSort("market")}>{renderHeader("Market", "market")}</TableHead>
                  <TableHead>{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highestProfitStocks.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell>{stock.symbol}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>{stock.purchasePrice}</TableCell>
                    <TableCell>{stock.currentPrice}</TableCell>
                    <TableCell>{stock.changePercent}%</TableCell>
                    <TableCell>{calculateProfit(stock)}</TableCell>
                    <TableCell>{stock.market}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleSellStock(stock)}>
                        {t("Sell")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
};

export { HighestProfitStocks, calculateProfit, mockPortfolio };
"
```