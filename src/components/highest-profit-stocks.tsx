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

    useEffect(() => {
        setIsLoading(true);
        // Sort the mock portfolio based on profit
        setTimeout(() => {
          setHighestProfitStocks(portfolio);
          setIsLoading(false);
        }, 1000);

    }, [portfolio]);

    return (
        <Card className="overflow-x-auto shadow">
            
                
                    {t("Stocks in Portfolio")}
                
            
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left">{t("Symbol")}</TableHead>
                        <TableHead className="text-left">{t("Name")}</TableHead>
                        <TableHead className="text-left">{t("Quantity")}</TableHead>
                        <TableHead className="text-left">{t("Purchase Price")}</TableHead>
                        <TableHead className="text-left">{t("Current Price")}</TableHead>
                        <TableHead className="text-left">{t("Daily %")}</TableHead>
                        <TableHead className="text-left">{t("Profit")}</TableHead>
                        <TableHead className="text-left">{t("Market")}</TableHead>
                        <TableHead className="text-left">{t("Actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {highestProfitStocks.map((stock) => (
                        
                            
                                {stock.symbol}
                            
                            
                                {stock.name}
                            
                            
                                {stock.quantity}
                            
                            
                                {stock.purchasePrice}
                            
                            
                                {stock.currentPrice}
                            
                            
                                {stock.changePercent}%
                            
                            
                                {calculateProfit(stock)}
                            
                            
                                {stock.market}
                            
                            
                                <Button variant="outline" size="sm" onClick={() => onSellStock(stock)}>
                                    {t("Sell")}
                                </Button>
                            
                        
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export { HighestProfitStocks, calculateProfit };
