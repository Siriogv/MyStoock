"use client";

import {useEffect, useState, useMemo, useCallback} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
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
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {PortfolioStock} from "@/types";
import {SellStockModal} from "@/components/sell-stock-modal";
import {Skeleton} from "@/components/ui/skeleton";
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
import {calculateProfit, formatCurrency} from "@/lib/utils";
import {NewsSection} from "@/components/news-section";
import {Stock} from "@/types";

const mockPortfolio: Stock[] = [
    {symbol: 'AAPL', name: 'Apple Inc.', purchasePrice: 150, currentPrice: 170, quantity: 10, market: 'NASDAQ', capitalization: 1500, changePercent: 2},
    {symbol: 'MSFT', name: 'Microsoft Corp.', purchasePrice: 300, currentPrice: 430, quantity: 5, market: 'NASDAQ', capitalization: 1500, changePercent: -4},
    {symbol: 'GOOG', name: 'Alphabet Inc.', purchasePrice: 100, currentPrice: 150, quantity: 8, market: 'NASDAQ', capitalization: 800, changePercent: 6},
    {symbol: 'NVDA', name: 'Nvidia Corp.', purchasePrice: 500, currentPrice: 1000, quantity: 3, market: 'NASDAQ', capitalization: 1500, changePercent: 0},
    {symbol: 'TSLA', name: 'Tesla, Inc.', purchasePrice: 700, currentPrice: 850, quantity: 4, market: 'NASDAQ', capitalization: 2800, changePercent: 8},
];

interface HighestProfitStocksProps {
    portfolio: Stock[];
    onSellStock: (stock: Stock) => void;
    sortColumn: keyof Stock;
    sortOrder: 'asc' | 'desc';
    setSortColumn: (column: keyof Stock) => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
}

const HighestProfitStocks = ({portfolio, onSellStock, sortColumn, setSortColumn, setSortOrder, sortOrder}: HighestProfitStocksProps) => {
    const [highestProfitStocks, setHighestProfitStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {t} = useI18n();
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

    const renderHeader = (labelKey: string, column: keyof Stock) => {
        return (
            
                {t(labelKey)}{" "}
                {sortColumn === column && (sortOrder === "asc" ? "▲" : "▼")}
            
        );
    };

    const renderTableCell = (content: string | number) => {
        return isLoading ? (
            
                <Skeleton className="h-4 w-24"/>
            
        ) : (
            
                {content}
            
        );
    };

    const totalPurchaseValue = useMemo(() => {
        return portfolio.reduce((acc, stock) => acc + (stock.purchasePrice * stock.quantity), 0);
    }, [portfolio]);

    const currentTotalValue = useMemo(() => {
        return portfolio.reduce((acc, stock) => acc + (stock.currentPrice * stock.quantity), 0);
    }, [portfolio]);

    const totalProfitLoss = useMemo(() => {
        return portfolio.reduce((acc, stock) => acc + calculateProfit(stock), 0);
    }, [portfolio]);


    return (
        
            <CardHeader>
                <CardTitle>{t("Dashboard")}</CardTitle>
                <CardDescription>
                    <p>{t("Total Purchase Value")}: {formatCurrency(totalPurchaseValue)}</p>
                    <p>{t("Current Total Value")}: {formatCurrency(currentTotalValue)}</p>
                    <p>{t("Total Profit/Loss")}: {formatCurrency(totalProfitLoss)}</p>
                </CardDescription>
            </CardHeader>
            
                
                    
                        
                            {t("Portfolio Stocks")}
                        
                    
                    
                        
                            
                                {renderHeader("Symbol", "symbol")}
                            
                            
                                {renderHeader("Name", "name")}
                            
                            
                                {renderHeader("Quantity", "quantity")}
                            
                            
                                {renderHeader("Purchase Price", "purchasePrice")}
                            
                            
                                {renderHeader("Current Price", "currentPrice")}
                            
                            
                                {renderHeader("Daily %", "changePercent")}
                            
                            
                                {renderHeader("Profit", "profit" as keyof Stock)}
                            
                            
                                Actions
                            
                        
                    
                    
                        {highestProfitStocks.map((stock) => (
                            
                                
                                    {stock.symbol}
                                
                                
                                    {stock.name}
                                
                                
                                    {stock.quantity}
                                
                                
                                    {stock.purchasePrice}
                                
                                
                                    {stock.currentPrice}
                                
                                
                                    {stock.changePercent}%
                                
                                
                                    {calculateProfit(stock)}
                                
                                
                                    <Button variant="outline" size="sm" onClick={() => handleSellStock(stock)}>
                                        {t("Sell")}
                                    </Button>
                                
                            
                        ))}
                    
                
            
        

    );
};

export {HighestProfitStocks, calculateProfit, mockPortfolio};

