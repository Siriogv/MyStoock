"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { PortfolioStock } from "@/types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const itemsPerPage = 5;

interface SellPageProps {
    portfolio: PortfolioStock[];
    onSell: (updatedPortfolio: PortfolioStock[]) => void;
}

export default function SellPage({portfolio, onSell}: SellPageProps) {
    const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { toast } = useToast();
    const router = useRouter();
    //const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]); // Assuming mockPortfolio is initialized elsewhere
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<keyof PortfolioStock>('profit');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    /*useEffect(() => {
        const storedPortfolio = localStorage.getItem('portfolio');
        if (storedPortfolio) {
            setPortfolio(JSON.parse(storedPortfolio));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }, [portfolio]);*/

    const totalPages = Math.ceil(portfolio.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handleSell = () => {
        if (selectedStock) {
            // Basic selling logic (selling from the mock portfolio)
            const sellingStockIndex = portfolio.findIndex(stock => stock.symbol === selectedStock.symbol);
            if (sellingStockIndex !== -1) {
                if (portfolio[sellingStockIndex].quantity >= quantity) {
                    const updatedPortfolio = [...portfolio];
                    updatedPortfolio[sellingStockIndex] = {
                        ...updatedPortfolio[sellingStockIndex],
                        quantity: updatedPortfolio[sellingStockIndex].quantity - quantity,
                    };
                    const filteredPortfolio = updatedPortfolio.filter(stock => stock.quantity > 0);
                    //setPortfolio(updatedPortfolio.filter(stock => stock.quantity > 0));
                    onSell(filteredPortfolio);

                    toast({
                        title: "Success",
                        description: `Successfully sold ${quantity} shares of ${selectedStock.symbol}`,
                    });
                    router.push('/');
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: `Not enough shares to sell. Available: ${portfolio[sellingStockIndex].quantity}`,
                    });
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Stock not found in portfolio.",
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No stock selected for selling.",
            });
        }
    };

    const goBackToDashboard = () => {
        router.push('/');
    };

    const sortedStocks = [...portfolio].sort((a, b) => {
        // Implement your sorting logic here based on the sortColumn and sortOrder
        const aValue = a[sortColumn] || '';
        const bValue = b[sortColumn] || '';

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
    });

    const currentStocks = sortedStocks.slice(startIndex, endIndex);

    const handleSort = (column: keyof PortfolioStock) => {
        setSortColumn(column);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const goToPreviousPage = () => {
        setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(currentPage => Math.min(currentPage + 1, totalPages));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sell Stock</h1>

            <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Select Stock from Portfolio
                </label>

                <Table>
                    <TableCaption>Select a stock to sell from your portfolio.</TableCaption>
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
                        {currentStocks.map((stock) => (
                            <TableRow
                                key={stock.symbol}
                                onClick={() => setSelectedStock(stock)}
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
                <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" onClick={goToPreviousPage} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" onClick={goToNextPage} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            </div>

            {selectedStock && (
                <div className="mb-4">
                    <p>Name: {selectedStock.name}</p>
                    <p>Price: {selectedStock.currentPrice}</p>
                </div>
            )}

            {selectedStock && (
                <div className="flex items-center">
                    <label htmlFor="quantity" className="mr-2">Quantity:</label>
                    <Input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-24 mr-2"
                    />
                    <Button onClick={handleSell}>Sell</Button>
                </div>
            )}

            <Button variant="secondary" onClick={goBackToDashboard}>Back to Dashboard</Button>
        </div>
    );
}
