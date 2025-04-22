"use client";

import { useEffect, useState } from 'react';
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

export interface Stock {
    symbol: string;
    name: string;
    purchasePrice: number;
    currentPrice: number;
    quantity: number;
    market: string;
    capitalization: number;
    changePercent:number;
}

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

export const HighestProfitStocks = () => {
    const [highestProfitStocks, setHighestProfitStocks] = useState<Stock[]>([]);
    const { t } = useI18n();

    useEffect(() => {
        // Sort the mock portfolio based on profit
        const sortedStocks = [...mockPortfolio].sort((a, b) => calculateProfit(b) - calculateProfit(a));
        setHighestProfitStocks(sortedStocks);
    }, []);

    return (
        <Table className="mt-4">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px] text-xs">Symbol</TableHead>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Quantity</TableHead>
                    <TableHead className="text-xs">Purchase Price</TableHead>
                    <TableHead className="text-xs">Current Price</TableHead>
                    <TableHead className="text-xs">Market Value</TableHead>
                     <TableHead className="text-xs">Daily %</TableHead>
                    <TableHead className="text-right text-xs">Profit</TableHead>
                    <TableHead className="text-xs">Market</TableHead>
                    <TableHead className="text-xs">Capitalization</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {highestProfitStocks.map((stock) => (
                    <TableRow key={stock.symbol}>
                        <TableCell className="font-medium text-xs">{stock.symbol}</TableCell>
                        <TableCell className="text-xs">{stock.name}</TableCell>
                        <TableCell className="text-xs">{stock.quantity}</TableCell>
                        <TableCell className="text-xs">{stock.purchasePrice}</TableCell>
                        <TableCell className="text-xs">{stock.currentPrice}</TableCell>
                         <TableCell className="text-xs">{stock.currentPrice * stock.quantity}</TableCell>
                          <TableCell className="text-xs">{stock.changePercent}%</TableCell>
                        <TableCell className="text-right text-xs">{calculateProfit(stock)}</TableCell>
                        <TableCell className="text-xs">{stock.market}</TableCell>
                        <TableCell className="text-xs">{stock.capitalization}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
