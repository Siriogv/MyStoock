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

export interface Stock {
    symbol: string;
    name: string;
    purchasePrice: number;
    currentPrice: number;
    quantity: number;
    market: string;
    capitalization: number;
}

const mockPortfolio: Stock[] = [
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

const calculateProfit = (stock: Stock) => {
    return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
};

export const HighestProfitStocks = () => {
    const [highestProfitStocks, setHighestProfitStocks] = useState<Stock[]>([]);

    useEffect(() => {
        // Sort the mock portfolio based on profit
        const sortedStocks = [...mockPortfolio].sort((a, b) => calculateProfit(b) - calculateProfit(a));
        setHighestProfitStocks(sortedStocks);
    }, []);

    return (
        <Table>
            <TableCaption>Stocks with the highest profit.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Capitalization</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {highestProfitStocks.map((stock) => (
                    <TableRow key={stock.symbol}>
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>{stock.quantity}</TableCell>
                        <TableCell>{stock.purchasePrice}</TableCell>
                        <TableCell>{stock.currentPrice}</TableCell>
                        <TableCell className="text-right">{calculateProfit(stock)}</TableCell>
                        <TableCell>{stock.market}</TableCell>
                        <TableCell>{stock.capitalization}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
