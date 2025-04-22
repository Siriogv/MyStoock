"use client";

import { useState, useEffect } from 'react';
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
import { HighestProfitStocks } from "@/components/highest-profit-stocks";

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

    const handleSell = () => {
        if (!selectedStock || !salePrice) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a stock and enter a sale price.",
            });
            return;
        }

        if (quantityToSell <= 0 || quantityToSell > selectedStock.quantity) {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Invalid quantity to sell. Please enter a quantity between 1 and ${selectedStock.quantity}.`,
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
            title: "Sale complete",
            description: `Successfully sold ${quantityToSell} shares of ${selectedStock.symbol}. Net Profit: ${netProfit.toFixed(2)}`,
        });
        router.push('/');
    };

    const goBackToDashboard = () => {
        router.push('/');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sell Stock</h1>

            {portfolio && (
                <PortfolioTable
                    portfolio={portfolio}
                    setSelectedStock={setSelectedStock}
                    setIsDialogOpen={setIsDialogOpen}
                />
            )}

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button disabled={!selectedStock}>Sell Stock</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Sale</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to sell {selectedStock?.name}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="salePrice" className="text-right">
                                Sale Price
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
                                Quantity to Sell
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
                                Commission Type
                            </Label>
                            <Select onValueChange={setCommissionType} defaultValue={commissionType} className="col-span-3">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Commission Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="commissionValue" className="text-right">
                                Commission Value
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
                                Tax Rate (%)
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
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSell}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Button variant="secondary" onClick={goBackToDashboard}>
                Back to Dashboard
            </Button>
        </div>
    );
}

interface PortfolioTableProps {
    portfolio: PortfolioStock[];
    setSelectedStock: (stock: PortfolioStock | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
}

const PortfolioTable = ({ portfolio, setSelectedStock, setIsDialogOpen }: PortfolioTableProps) => {
    const [sortColumn, setSortColumn] = useState<keyof PortfolioStock>('symbol');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Check if portfolio is an array before attempting to iterate
    const sortedStocks = Array.isArray(portfolio)
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

    const handleSort = (column: keyof PortfolioStock) => {
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => handleSort('symbol')} className="cursor-pointer">
                        Symbol {sortColumn === 'symbol' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                        Name {sortColumn === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
                        Quantity {sortColumn === 'quantity' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('purchasePrice')} className="cursor-pointer">
                        Purchase Price {sortColumn === 'purchasePrice' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('currentPrice')} className="cursor-pointer">
                        Current Price {sortColumn === 'currentPrice' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </TableHead>
                    <TableHead className="text-right">Profit/Loss</TableHead>
                    <TableHead onClick={() => handleSort('market')} className="cursor-pointer">
                        Market {sortColumn === 'market' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('capitalization')} className="cursor-pointer">
                        Capitalization {sortColumn === 'capitalization' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedStocks.map((stock) => (
                    <TableRow
                        key={stock.symbol}
                        onClick={() => {
                            setSelectedStock(stock);
                            setIsDialogOpen(true);
                        }}
                        className="cursor-pointer hover:bg-accent"
                    >
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>{stock.quantity}</TableCell>
                        <TableCell>{stock.purchasePrice}</TableCell>
                        <TableCell>{stock.currentPrice}</TableCell>
                        <TableCell className="text-right">
                            {(stock.currentPrice - stock.purchasePrice) * stock.quantity}
                        </TableCell>
                        <TableCell>{stock.market}</TableCell>
                        <TableCell>{stock.capitalization}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

interface AlertDialogFooterProps {
    children: React.ReactNode;
}

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children }) => (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        {children}
    </div>
);

AlertDialogFooter.displayName = "AlertDialogFooter";
