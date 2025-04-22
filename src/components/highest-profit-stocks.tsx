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

interface Stock {
    symbol: string;
    name: string;
    purchasePrice: number;
    currentPrice: number;
    quantity: number;
}

const mockPortfolio: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', purchasePrice: 150, currentPrice: 170, quantity: 10 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', purchasePrice: 300, currentPrice: 430, quantity: 5 },
    { symbol: 'GOOG', name: 'Alphabet Inc.', purchasePrice: 100, currentPrice: 150, quantity: 8 },
    { symbol: 'NVDA', name: 'Nvidia Corp.', purchasePrice: 500, currentPrice: 1000, quantity: 3 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', purchasePrice: 700, currentPrice: 850, quantity: 4 },
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
