"use client";

import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { Stock } from "@/types";
import { calculateProfit } from "@/utils";

interface HighestProfitStocksProps {
  portfolio: Stock[];
  onSellStock: (stock: Stock) => void;
  sortColumn: keyof Stock;
  sortOrder: "asc" | "desc";
  setSortColumn: (column: keyof Stock) => void;
  setSortOrder: (order: "asc" | "desc") => void;
}

const HighestProfitStocks = ({
  portfolio,
  onSellStock,
  sortColumn,
  setSortColumn,
  sortOrder,
}: HighestProfitStocksProps) => {
  const [highestProfitStocks, setHighestProfitStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();

  // Sorting logic
  const sortedStocks = useMemo(() => {
    return [...portfolio].sort((a, b) => {
      const profitA = calculateProfit(a);
      const profitB = calculateProfit(b);
      return sortOrder === "asc" ? profitA - profitB : profitB - profitA;
    });
  }, [portfolio, sortOrder]);

  useEffect(() => {
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setHighestProfitStocks(sortedStocks);
      setIsLoading(false);
    }, 500);
  }, [sortedStocks]);

  const handleSort = (column: keyof Stock) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">{t("Stocks in Portfolio")}</h2>
      <div className="mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["symbol", "name", "quantity", "purchasePrice", "currentPrice", "changePercent", "market"].map((key) => (
                <th
                  key={key}
                  className="cursor-pointer border-b p-2"
                  onClick={() => handleSort(key as keyof Stock)}
                >
                  {t(key)} {sortColumn === key && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              ))}
              <th className="border-b p-2">{t("Profit")}</th>
              <th className="border-b p-2">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {highestProfitStocks.map((stock) => (
              <tr key={stock.symbol}>
                <td className="border-t p-2">{stock.symbol}</td>
                <td className="border-t p-2">{stock.name}</td>
                <td className="border-t p-2">{stock.quantity}</td>
                <td className="border-t p-2">{stock.purchasePrice}</td>
                <td className="border-t p-2">{stock.currentPrice}</td>
                <td className="border-t p-2">{stock.changePercent}%</td>
                <td className="border-t p-2">{calculateProfit(stock)}</td>
                <td className="border-t p-2">
                  <Button onClick={() => onSellStock(stock)}>{t("Sell")}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <Skeleton className="h-4 w-full" />}
      </div>
    </div>
  );
};

export { HighestProfitStocks };