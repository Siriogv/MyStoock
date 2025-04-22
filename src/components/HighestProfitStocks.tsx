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
import {SellStockModal} from "@/components/sell-stock-modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
}

const HighestProfitStocks = ({ portfolio, onSellStock }: HighestProfitStocksProps) => {
    const [highestProfitStocks, setHighestProfitStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useI18n();
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    useEffect(() => {
        setIsLoading(true);
        // Sort the mock portfolio based on profit
        setTimeout(() => {
          setHighestProfitStocks(mockPortfolio);
          setIsLoading(false);
        }, 1000);

    }, []);

    const handleSellStock = (stock: Stock) => {
        setSelectedStock(stock);
        setIsSellModalOpen(true);
        onSellStock(stock);
    };

    const handleCloseSellModal = () => {
        setIsSellModalOpen(false);
        setSelectedStock(null);
    };

    return (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{t("Stocks in Portfolio")}</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Symbol")}</TableHead>
                  <TableHead>{t("Name")}</TableHead>
                  <TableHead>{t("Quantity")}</TableHead>
                  <TableHead>{t("Purchase Price")}</TableHead>
                  <TableHead>{t("Current Price")}</TableHead>
                  <TableHead>{t("Daily %")}</TableHead>
                  <TableHead>{t("Profit")}</TableHead>
                  <TableHead>{t("Market")}</TableHead>
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
