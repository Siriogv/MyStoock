"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { NewsSection } from "@/components/news-section";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCoreRowModel, getPaginationRowModel
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PortfolioStock } from "@/types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import {cn} from "@/lib/utils";
import {getMockPortfolio} from "@/lib/db";
import { SellStockModal } from '@/components/sell-stock-modal';

const DashboardPage: React.FC = () => {    
    const { t } = useI18n();
    const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                setPortfolio(await getMockPortfolio());
            } catch (err) {
                setError("Failed to load portfolio data");
            } finally {
                setIsLoading(false);
            }
        })();
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
            header: ({ column }) => <TableHeaderCell column={column} title={t("Symbol")}/>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <TableHeaderCell column={column} title={t("Name")}/>,
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => <TableHeaderCell column={column} title={t("Quantity")}/>,
        },
        {
            accessorKey: "purchasePrice",
            header: ({ column }) => <TableHeaderCell column={column} title={t("Purchase Price")}/>,
        },
        {
            accessorKey: "currentPrice",
            header: ({ column }) => <TableHeaderCell column={column} title={t("Current Price")}/>,
        },
        {
            accessorKey: "changePercent",
            header: ({ column }) => <TableHeaderCell column={column} title={t("Daily %")}/> ,
            cell: ({ row }) => (
                    `${row.getValue("changePercent")}%`
            ),
        },
        {
            accessorKey: "market",
            header: ({ column }) => <TableHeaderCell column={column} title={t("Market")}/>,
        },
        {
            accessorKey: "capitalization",
            header: ({ column }) => <TableHeaderCell column={column} title={t("Capitalization")}/>,
        },
    ], [t]);

      const table = useReactTable({
        data: portfolio,
        columns,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        state: {
            columnVisibility,
            columnFilters,
            sorting,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(), getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
      })

        const handleSellStock = (stock: PortfolioStock) => {
            setSelectedStock(stock);
            setIsSellModalOpen(true);
        };

        const handleCloseSellModal = () => {
            setIsSellModalOpen(false);
            setSelectedStock(null);
        };

        if (isLoading) {
            return <div className="flex justify-center items-center h-screen">Loading...</div>;
        }

        if (error) {
            return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
        }
    return (
        <>
            
                
                    {t("Dashboard")}
                
                
                    
                        {t("Total Purchase Value")}: ${totalPurchaseValue}
                        {t("Current Total Value")}: ${currentTotalValue}
                        {t("Total Profit/Loss")}: ${totalProfitLoss}
                    
                
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            ))} 
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleSellStock(row.original)}>
                                            {t("Sell")}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {selectedStock && (
                    <SellStockModal isOpen={isSellModalOpen} onClose={handleCloseSellModal} stock={selectedStock} />
                )}
            </>
    );
};


function TableHeaderCell({ column, title }: { column: any; title: string }) {
    return (
        <div className={cn(column.getCanSort() ? "cursor-pointer" : "")} onClick={column.getToggleSortingHandler()}>
            {title} {column.getIsSorted() && (column.getIsSorted() === 'asc' ? '🔽' : '🔼')}
        </div>
    );
}


export default DashboardPage;
