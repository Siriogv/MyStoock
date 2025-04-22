"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { NewsSection } from "@/components/news-section"; // Import the NewsSection component
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { calculateProfit } from "@/utils";
import { PortfolioStock } from "@/types";
import { SellStockModal } from "@/components/sell-stock-modal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { Icons } from "@/components/icons";
import { SidebarLayout } from "@/components/sidebar-layout";
import {getMockPortfolio} from "@/lib/db"; // Import database function

const DashboardPage: React.FC = () => {
    const { t } = useI18n();
    const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);

    useEffect(() => {
        const loadMockPortfolio = async () => {
            const data = await getMockPortfolio();
            setPortfolio(data as PortfolioStock[]);
        };

        loadMockPortfolio();
    }, []);

    const totalPurchaseValue = useMemo(() => {
        return portfolio.reduce((acc, stock) => acc + (stock.purchasePrice * stock.quantity), 0);
    }, [portfolio]);

    const currentTotalValue = useMemo(() => {
        return portfolio.reduce((acc, stock) => acc + (stock.currentPrice * stock.quantity), 0);
    }, [portfolio]);

    const totalProfitLoss = useMemo(() => {
        return currentTotalValue - totalPurchaseValue;
    }, [currentTotalValue, totalPurchaseValue]);

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const columns: ColumnDef<PortfolioStock>[] = useMemo(() => [
        {
            accessorKey: "symbol",
            header: ({ column }) => {
                return (
                    
                        {t("Symbol")} {column.getIsSorted()
                            ? column.getIsSorted() === 'asc'
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    
                );
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    
                        {t("Name")} {column.getIsSorted()
                            ? column.getIsSorted() === 'asc'
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    
                );
            },
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => {
                return (
                    
                        {t("Quantity")} {column.getIsSorted()
                            ? column.getIsSorted() === 'asc'
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    
                );
            },
        },
        {
            accessorKey: "purchasePrice",
            header: ({ column }) => {
                return (
                    
                        {t("Purchase Price")} {column.getIsSorted()
                            ? column.getIsSorted() === 'asc'
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    
                );
            },
        },
        {
            accessorKey: "currentPrice",
            header: ({ column }) => {
                return (
                    
                        {t("Current Price")} {column.getIsSorted()
                            ? column.getIsSorted() === 'asc'
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    
                );
            },
        },
        {
            accessorKey: "changePercent",
            header: ({ column }) => {
                return (
                    
                        {t("Daily %")} {column.getIsSorted()
                            ? column.getIsSorted() === 'asc'
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    
                );
            },
            cell: ({ row }) => (
                
                    {row.getValue("changePercent")}%
                
            ),
        },
        {
            accessorKey: "market",
            header: ({ column }) => {
                return (
                    
                        {t("Market")} {column.getIsSorted()
                            ? column.getIsSorted() === 'asc'
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    
                );
            },
        },
        {
            accessorKey: "capitalization",
            header: ({ column }) => {
                return (
                    
                        {t("Capitalization")} {column.getIsSorted()
                            ? column.getIsSorted() === 'asc'
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    
                );
            },
        },
    ], [t]);

    const table = useReactTable({
        data: portfolio,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            columnVisibility,
            columnFilters,
            sorting,
        },
    })
        const handleSellStock = (stock: PortfolioStock) => {
            setSelectedStock(stock);
            setIsSellModalOpen(true);
        };

        const handleCloseSellModal = () => {
            setIsSellModalOpen(false);
            setSelectedStock(null);
        };
    return (
        
            
                
                    {t("Dashboard")}
                
                
                    
                        {t("Total Purchase Value")}: ${totalPurchaseValue}
                        {t("Current Total Value")}: ${currentTotalValue}
                        {t("Total Profit/Loss")}: ${totalProfitLoss}
                    
                
                
                    
                        
                            
                                Symbol
                                Name
                                Quantity
                                Purchase Price
                                Current Price
                                Daily %
                                Market
                                Capitalization
                                Actions
                            
                            {table.getHeaderGroups().map((headerGroup) => (
                                
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            
                                        );
                                    })}
                                
                            ))}
                        
                        
                            {table.getRowModel().rows.map((row) => (
                                
                                    {row.getVisibleCells().map((cell) => (
                                        
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        
                                    ))}
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleSellStock(row.original)}>
                                            {t("Sell")}
                                        </Button>
                                    </TableCell>
                                
                            ))}
                        
                    
                    
                        
                            Previous
                        
                        
                            Next
                        
                    
                
                
                    
                
            
                {selectedStock && (
                    
                )}
        
    );
};

export default DashboardPage;
