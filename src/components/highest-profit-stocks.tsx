"use client";

import { useEffect, useState, useMemo } from 'react';
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

    const renderTableCell = (content: string | number, isHeader: boolean = false) => {
        if (isLoading) {
          return (
              <TableCell>
                  <Skeleton className="h-4 w-24" />
              </TableCell>
          );
        }
        return isHeader ? (
            <TableHead>{content}</TableHead>
        ): (
            <TableCell>{content}</TableCell>
        )
    };

    const renderHeader = (labelKey: string, column: keyof Stock, isProfitHeader = false) => {
      if (isLoading && isProfitHeader) {
        return <Skeleton className="h-4 w-24" />
      }
        return (           
            {t(labelKey)} {sortColumn === column && (sortOrder === 'asc' ? '▲' : '▼')}
            
        );
    };

    return (
        
            
                
                    
                        
                            
                                
                                    {renderHeader("Symbol", "symbol")}
                                
                            
                            
                                
                                    {renderHeader("Name", "name")}
                                
                            
                            
                                
                                    {renderHeader("Quantity", "quantity")}
                                
                            
                            
                                
                                    {renderHeader("Purchase Price", "purchasePrice")}
                                
                            
                            
                                
                                    {renderHeader("Current Price", "currentPrice")}
                                
                            
                             
                                
                                    {renderHeader("Daily %", "changePercent")}
                                
                            
                            
                                
                                    {renderHeader("Profit", "profit",true)}
                                
                            
                            
                                
                                    {renderHeader("Market", "market")}
                                
                            
                            
                                Actions
                            
                        
                    </TableHeader>
                { isLoading && (
                   <TableRow>
                        <TableCell colSpan={10}>
                            <Skeleton className="h-4 w-[100%]" />
                        </TableCell>
                    </TableRow>
                )}
                {
                  highestProfitStocks.length === 0 && !isLoading && (
                      <TableRow>
                          <TableCell colSpan={10} className="text-center">
                              {t("No data available")}
                          </TableCell>
                      </TableRow>
                  )
                }
                <TableBody>
                  {highestProfitStocks.map((stock) => (
                      <TableRow key={stock.symbol}>
                        {renderTableCell(stock.symbol)}
                        {renderTableCell(stock.name)}
                        {renderTableCell(stock.quantity)}
                        {renderTableCell(stock.purchasePrice)}
                        {renderTableCell(stock.currentPrice)}
                        {renderTableCell(stock.changePercent + "%")}
                        {renderTableCell(calculateProfit(stock))}
                        {renderTableCell(stock.market)}

                      </TableRow>
                  ))}
                </TableBody>
                </Table>
            
        
    );
};

export { HighestProfitStocks, calculateProfit, mockPortfolio };
"
