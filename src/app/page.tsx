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
import { useRouter } from 'next/navigation';

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

const HighestProfitStocks = ({ portfolio, onSellStock, sortColumn, setSortColumn, sortOrder,
 }: HighestProfitStocksProps) => {
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

    const renderHeader = (labelKey: string, column: keyof Stock) => {
        return (
          
            {t(labelKey)}{" "}
            {sortColumn === column && (sortOrder === "asc" ? "▲" : "▼")}
          
        );
    };

    const renderTableCell = (content: string | number) => {
        return isLoading ? (
            
                <Skeleton className="h-4 w-24" />
            
        ) : (
            
                {content}
            
        );
    };

    return (
        
          
            {t("Stocks in Portfolio")}
          
          
            
              
                
                  {renderHeader("Symbol", "symbol")}
                
                
                  {renderHeader("Name", "name")}
                
                
                  {renderHeader("Quantity", "quantity")}
                
                
                  {renderHeader("Purchase Price", "purchasePrice")}
                
                
                  {renderHeader("Current Price", "currentPrice")}
                
                
                  {renderHeader("Daily %", "changePercent")}
                
                
                  {renderHeader("Profit", "profit" as keyof Stock)}
                
                
                  {renderHeader("Market", "market")}
                
                
                  {t("Actions")}
                
              
            
            
              {highestProfitStocks.map((stock) => (
                
                  
                    {stock.symbol}
                  
                  
                    {stock.name}
                  
                  
                    {stock.quantity}
                  
                  
                    {stock.purchasePrice}
                  
                  
                    {stock.currentPrice}
                  
                  
                    {stock.changePercent}%
                  
                  
                    {calculateProfit(stock)}
                  
                  
                    {stock.market}
                  
                  
                    {t("Sell")}
                  
                
              ))}
            
          
        
      );
};

export { HighestProfitStocks, calculateProfit, mockPortfolio };

"])</content>
 </change>
  <change>
    <file>src/app/layout.tsx</file>
    <description>Add use client, fix i18next and check authentication and redirect to login page.</description>
   <content><![CDATA['use client';

import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from "@/components/ui/toaster";
import React, { useEffect, useState } from "react";
import {SidebarLayout} from "@/components/sidebar-layout";
import {I18nextProvider} from "react-i18next";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from 'next/navigation';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

// Removing metadata export from here as it's a client component
// export const metadata: Metadata = {
//   title: 'Stoock',
//   description: 'Generated by Firebase Studio',
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const {i18n, isInitialized} = useI18n();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Example authentication state

    useEffect(() => {
      // Simulate authentication check (replace with your actual auth logic)
      const checkAuth = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        setIsAuthenticated(!!isLoggedIn);
      };
  
      checkAuth();
      // For simplicity, we're not setting up a real-time listener for auth changes here
      // Implement a more robust solution for production apps
    }, []);
  
    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, router]);
    return (
        <html lang={i18n?.language || 'en'}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isAuthenticated ? (
            
                    {children}
                    <Toaster/>
            
        ) : null}

        </body>
        </html>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    const {i18n} = useI18n();
    return (
        <I18nextProvider i18n={i18n}>
            <SidebarLayout>
                {children}
            </SidebarLayout>
        </I18nextProvider>
    )
}

