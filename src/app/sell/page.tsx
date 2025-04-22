"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { PortfolioStock } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import { useEffect } from 'react';
import { useI18n } from "@/hooks/use-i18n";

interface SellPageProps {
    portfolio: PortfolioStock[];
    onSell: (updatedPortfolio: PortfolioStock[]) => void;
}

export default function SellPage({portfolio, onSell}: SellPageProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [salePrice, setSalePrice] = useState<number | null>(null);
    const [commissionType, setCommissionType] = useState("fixed");
    const [commissionValue, setCommissionValue] = useState("5");
    const [taxRate, setTaxRate] = useState("26");
    const [quantityToSell, setQuantityToSell] = useState(1);
    const { t } = useI18n();
    const itemsPerPage = 5; // Define itemsPerPage
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<keyof PortfolioStock>('symbol');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSell = () => {
        if (!selectedStock || !salePrice) {
            toast({
                variant: "destructive",
                title: t("Error"),
                description: t("Please select a stock and enter a sale price."),
            });
            return;
        }

        if (quantityToSell <= 0 || quantityToSell > selectedStock.quantity) {
            toast({
                variant: "destructive",
                title: t("Error"),
                description: t(`Invalid quantity to sell. Please enter a quantity between 1 and ${selectedStock.quantity}.`),
            });
            return;
        }

        // Calcola la commissione
        let commissionAmount = 0;
        if (commissionType === "fixed") {
            commissionAmount = parseFloat(commissionValue);
        } else {
            commissionAmount = (salePrice * quantityToSell) * (parseFloat(commissionValue) / 100);
        }

        // Calcola il profitto/perdita
        const profitPerShare = salePrice - selectedStock.purchasePrice;
        const totalProfit = profitPerShare * quantityToSell;

        // Calcola la tassazione (esempio con aliquota del 26%)
        const taxAmount = totalProfit > 0 ? totalProfit * (parseFloat(taxRate) / 100) : 0;
        const netProfit = totalProfit - commissionAmount - taxAmount;

        // Aggiorna il portafoglio
        const updatedPortfolio = portfolio.map(stock => {
            if (stock.symbol === selectedStock.symbol) {
                return {
                    ...stock,
                    quantity: stock.quantity - quantityToSell,
                };
            }
            return stock;
        }).filter(stock => stock.quantity > 0);

        onSell(updatedPortfolio);

        toast({
            title: t("Sale complete"),
            description: t(`Successfully sold ${quantityToSell} shares of ${selectedStock.symbol}. Net Profit: ${netProfit.toFixed(2)}`),
        });
        router.push('/');
    };

    const goBackToDashboard = () => {
        router.push('/');
    };

      // Pagination logic
    const totalPages = portfolio ? Math.ceil(portfolio.length / itemsPerPage) : 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Sorting function
     const sortedStocks = portfolio
        ? [...portfolio].sort((a, b) => {
            const aValue = a[sortColumn] || '';
            const bValue = b[sortColumn] || '';

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            return 0;
        })
        : [];

    const currentStocks = sortedStocks ? sortedStocks.slice(startIndex, endIndex) : [];

        const goToPreviousPage = () => {
        setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage => Math.min(currentPage + 1, totalPages));
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{t("Sell Stock")}</h1>

            {portfolio && (
                <PortfolioTable
                    portfolio={currentStocks}
                    setSelectedStock={setSelectedStock}
                    setIsDialogOpen={setIsDialogOpen}
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    setSortColumn={setSortColumn}
                    setSortOrder={setSortOrder}
                    goToPreviousPage={goToPreviousPage}
                    goToNextPage={goToNextPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            )}

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button disabled={!selectedStock}>{t("Sell Stock")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("Confirm Sale")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("Are you sure you want to sell")} {selectedStock?.name}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="salePrice" className="text-right">
                                {t("Sale Price")}
                            </Label>
                            <Input
                                type="number"
                                id="salePrice"
                                value={salePrice || ''}
                                onChange={(e) => setSalePrice(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantityToSell" className="text-right">
                                {t("Quantity to Sell")}
                            </Label>
                            <Input
                                type="number"
                                id="quantityToSell"
                                value={quantityToSell}
                                onChange={(e) => setQuantityToSell(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="commissionType" className="text-right">
                                {t("Commission Type")}
                            </Label>
                            <Select onValueChange={setCommissionType} defaultValue={commissionType} className="col-span-3">
                                <SelectTrigger>
                                    <SelectValue placeholder={t("Select Commission Type")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">{t("Fixed")}</SelectItem>
                                    <SelectItem value="percentage">{t("Percentage")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="commissionValue" className="text-right">
                                {t("Commission Value")}
                            </Label>
                            <Input
                                type="number"
                                id="commissionValue"
                                value={commissionValue}
                                onChange={(e) => setCommissionValue(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taxRate" className="text-right">
                                {t("Tax Rate (%)")}
                            </Label>
                            <Input
                                type="number"
                                id="taxRate"
                                value={taxRate}
                                onChange={(e) => setTaxRate(Number(e.target.value))}
                                className="col-span-3"
                                defaultValue="26"
                            />
                        </div>
                    </div>
                    
                        
                            {t("Cancel")}
                        
                        
                            
                                {t("Confirm")}
                            
                        
                    
                </AlertDialogContent>
            </AlertDialog>

            
                
                    {t("Back to Dashboard")}
                
            
        </div>
    );
}

interface PortfolioTableProps {
    portfolio: PortfolioStock[];
    setSelectedStock: (stock: PortfolioStock | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    sortColumn: keyof PortfolioStock;
    sortOrder: 'asc' | 'desc';
    setSortColumn: (column: keyof PortfolioStock) => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    goToPreviousPage: () => void;
    goToNextPage: () => void;
    currentPage: number;
    totalPages: number;
}

const PortfolioTable = ({ portfolio, setSelectedStock, setIsDialogOpen, sortColumn, sortOrder, setSortColumn, setSortOrder, goToPreviousPage, goToNextPage, currentPage, totalPages }: PortfolioTableProps) => {
    const { t } = useI18n();

    const handleSort = (column: keyof PortfolioStock) => {
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    return (
        
            
                
                    
                         {(t("Symbol"))} {sortColumn === 'symbol' && (sortOrder === 'asc' ? '▲' : '▼')}
                    
                    
                         {(t("Name"))} {sortColumn === 'name' && (sortOrder === 'asc' ? '▲' : '▼'))}
                    
                    
                         {(t("Quantity"))} {sortColumn === 'quantity' && (sortOrder === 'asc' ? '▲' : '▼'))}
                    
                    
                         {(t("Purchase Price"))} {sortColumn === 'purchasePrice' && (sortOrder === 'asc' ? '▲' : '▼'))}
                    
                    
                         {(t("Current Price"))} {sortColumn === 'currentPrice' && (sortOrder === 'asc' ? '▲' : '▼'))}
                    
                    
                        {t("Profit/Loss")}
                    
                    
                         {(t("Market"))} {sortColumn === 'market' && (sortOrder === 'asc' ? '▲' : '▼'))}
                    
                    
                         {(t("Capitalization"))} {sortColumn === 'capitalization' && (sortOrder === 'asc' ? '▲' : '▼'))}
                    
                
            
            
                {Array.isArray(portfolio) && portfolio.map((stock) => (
                    
                        
                            {stock.symbol}
                        
                        
                            {stock.name}
                        
                        
                            {stock.quantity}
                        
                        
                            {stock.purchasePrice}
                        
                        
                            {stock.currentPrice}
                        
                        
                            {(stock.currentPrice - stock.purchasePrice) * stock.quantity}
                        
                        
                            {stock.market}
                        
                        
                            {stock.capitalization}
                        
                    
                ))}
             
              

               
                    
                
                
                    Page {currentPage} of {totalPages}
                
                
                    
                
            
        
    );
};

interface AlertDialogFooterProps {
    children: React.ReactNode;
}

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children }) => (
    
        {children}
    
);

AlertDialogFooter.displayName = "AlertDialogFooter";

