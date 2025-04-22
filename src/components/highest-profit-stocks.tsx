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
    const { t } = useI18n();
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    useEffect(() => {
        // Sort the mock portfolio based on profit
        const sortedStocks = [...portfolio].sort((a, b) => calculateProfit(b) - calculateProfit(a));
        setHighestProfitStocks(sortedStocks);
    }, [portfolio]);

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

    const renderHeader = (labelKey: string, column: keyof Stock) => {
        return (
            
                {t(labelKey)} {sortColumn === column && (sortOrder === 'asc' ? '▲' : '▼')}
            
        );
    };

    return (
        
            
                
                    
                        
                            
                                
                                    {t("Symbol")}
                                    {sortColumn === 'symbol' && (sortOrder === 'asc' ? '▲' : '▼')}
                                
                            
                            
                                
                                    {t("Name")}
                                    {sortColumn === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                                
                            
                            
                                
                                    {t("Quantity")}
                                    {sortColumn === 'quantity' && (sortOrder === 'asc' ? '▲' : '▼')}
                                
                            
                            
                                
                                    {t("Purchase Price")}
                                    {sortColumn === 'purchasePrice' && (sortOrder === 'asc' ? '▲' : '▼')}
                                
                            
                            
                                
                                    {t("Current Price")}
                                    {sortColumn === 'currentPrice' && (sortOrder === 'asc' ? '▲' : '▼')}
                                
                            
                             
                                
                                    {t("Daily %")}
                                    {sortColumn === 'changePercent' && (sortOrder === 'asc' ? '▲' : '▼')}
                                
                            
                            
                                
                                    {t("Profit")}
                                    {sortColumn === 'profit' && (sortOrder === 'asc' ? '▲' : '▼')}
                                
                            
                            
                                
                                    {t("Market")}
                                    {sortColumn === 'market' && (sortOrder === 'asc' ? '▲' : '▼')}
                                
                            
                            
                                Actions
                            
                        
                    
                
                
                    {highestProfitStocks.map((stock) => (
                        
                            
                                {stock.symbol}
                            
                            
                                {stock.name}
                            
                            
                                {stock.quantity}
                            
                            
                                {stock.purchasePrice}
                            
                            
                                {stock.currentPrice}
                            
                             
                                {stock.changePercent}%
                            
                            
                                {calculateProfit(stock)}
                            
                            
                                
                            
                        
                    ))}
                
            
        
    );
};

export { HighestProfitStocks, calculateProfit, mockPortfolio };
"
