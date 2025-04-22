"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@/components/ui/table"
import {useI18n} from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button"; 
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

const sortStocksByProfit = (stocks: Stock[]): Stock[] => {
    return [...stocks].sort((a, b) => calculateProfit(b) - calculateProfit(a));
  };


interface HighestProfitStocksProps {
    portfolio: Stock[];
    onSellStock: (stock: Stock) => void;
}

const HighestProfitStocks = ({ portfolio, onSellStock }: HighestProfitStocksProps) => {
    const [sortedStocks, setSortedStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useI18n();

    useEffect(() => {
        setIsLoading(true);
        setError(null);        
        const timeoutId = setTimeout(() => {
            try {
                const stocks = sortStocksByProfit(portfolio);
                setSortedStocks(stocks);
            } catch (err) {
                setError("Error loading data");
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [portfolio]);

    return (
        <Card className="overflow-x-auto shadow">
            <CardHeader>
                <CardTitle>{t("Stocks in Portfolio")}</CardTitle>
            </CardHeader>

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
                {isLoading ? (
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                    {Array.from({ length: 9 }).map((__, cellIndex) => (
                        <TableCell key={cellIndex}>
                            <Skeleton className="h-4 w-20" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    ) : error ? (
        <TableBody>
            <TableRow>
                <TableCell colSpan={9} className="text-center text-red-500">{error}</TableCell>
            </TableRow>
        </TableBody>
    ) : (
        <TableBody>
            {sortedStocks.length > 0 ? (
                sortedStocks.map((stock) => (
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
                            <Button variant="outline" size="sm" onClick={() => onSellStock(stock)}>
                                {t("Sell")}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))
             ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">{t("No stocks found")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
            </Table>
        </Card>
    );
};

export { HighestProfitStocks, calculateProfit };
