"use client";

import { useEffect, useState } from 'react';

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
        <div>
            <h2 className="text-lg font-semibold mb-2">Highest Profit Stocks</h2>
            <ul>
                {highestProfitStocks.map((stock, index) => (
                    <li key={index} className="mb-2">
                        {stock.name} ({stock.symbol}): Profit - ${calculateProfit(stock)}
                    </li>
                ))}
            </ul>
        </div>
    );
};
