"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { NewsSection } from "@/components/news-section"; // Import the NewsSection component
import {Stock, HighestProfitStocks} from "@/components/highest-profit-stocks";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { useI18n } from "@/hooks/use-i18n";

const mockPortfolio = [
  { symbol: 'AAPL', name: 'Apple Inc.', purchasePrice: 150, currentPrice: 170, quantity: 10, market: 'NASDAQ', capitalization: 1500 , changePercent: 2},
  { symbol: 'MSFT', name: 'Microsoft Corp.', purchasePrice: 300, currentPrice: 430, quantity: 5, market: 'NASDAQ', capitalization: 1500 , changePercent: -4},
  { symbol: 'GOOG', name: 'Alphabet Inc.', purchasePrice: 100, currentPrice: 150, quantity: 8, market: 'NASDAQ', capitalization: 800 , changePercent: 6},
  { symbol: 'NVDA', name: 'Nvidia Corp.', purchasePrice: 500, currentPrice: 1000, quantity: 3, market: 'NASDAQ', capitalization: 1500 , changePercent: 0},
  { symbol: 'TSLA', name: 'Tesla, Inc.', purchasePrice: 700, currentPrice: 850, quantity: 4, market: 'NASDAQ', capitalization: 2800 , changePercent: 8},
];

const calculateProfit = (stock: any) => {
  return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function Home() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const {t} = useI18n();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

    // Calculate total purchase value
    const totalPurchaseValue = portfolio.reduce((acc, stock) => {
      return acc + (stock.purchasePrice * stock.quantity);
    }, 0);

    // Calculate current total value
    const currentTotalValue = portfolio.reduce((acc, stock) => {
      return acc + (stock.currentPrice * stock.quantity);
    }, 0);

    // Calculate total profit/loss
    const totalProfitLoss = currentTotalValue - totalPurchaseValue;

  const handleSellStock = (stock: Stock) => {
    setSelectedStock(stock);
    setIsSellModalOpen(true);
  };

  const handleCloseSellModal = () => {
    setIsSellModalOpen(false);
    setSelectedStock(null);
  };

  return (
    
        <div className="p-4">
          <h1 className="text-2xl font-bold">{t("Dashboard")}</h1>
          <p className="text-muted-foreground">
              {t("Welcome to your investment portfolio overview.")}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{t("Total Purchase Value")}</h2>
              <p className="text-2xl">{formatCurrency(totalPurchaseValue)}</p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{t("Current Total Value")}</h2>
              <p className="text-2xl">{formatCurrency(currentTotalValue)}</p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{t("Total Profit/Loss")}</h2>
              <p className={`text-2xl ${totalProfitLoss >= 0 ? 'success' : 'error'}`}>{formatCurrency(totalProfitLoss)}</p>
            </div>
          </div>

          <HighestProfitStocks onSellStock={handleSellStock} portfolio={portfolio} />

          <SellStockModal
            isOpen={isSellModalOpen}
            onClose={handleCloseSellModal}
            stock={selectedStock}
            setPortfolio={setPortfolio}
            portfolio={portfolio}
          />
          
          <NewsSection />
        </div>
    
  );
}

interface SellStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  setPortfolio: (portfolio: Stock[]) => void;
  portfolio: Stock[];
}

const SellStockModal = ({ isOpen, onClose, stock, setPortfolio, portfolio }: SellStockModalProps) => {
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [commission, setCommission] = useState<number>(0);
  const [isFixedCommission, setIsFixedCommission] = useState(true);
  const { toast } = useToast();
    const {t} = useI18n();

  const handleSell = () => {
    if (!stock || !sellPrice) {
      toast({
        title: t("Error"),
        description: t("Please select a stock and enter a sell price."),
        variant: "destructive",
      });
      return;
    }

    // Calculate commission amount
    let commissionAmount = isFixedCommission ? commission : (stock.purchasePrice + sellPrice) * (commission / 100);
    // Calculate profit loss
    let profitLoss = (sellPrice - stock.purchasePrice) * stock.quantity - commissionAmount;
      const tax = profitLoss > 0 ? profitLoss * 0.26 : 0;
      const netProfit = profitLoss - tax;

    // Update the portfolio by removing the sold stock
    const updatedPortfolio = portfolio.filter(item => item.symbol !== stock.symbol);
    setPortfolio(updatedPortfolio);

    toast({
      title: t("Success"),
      description: t("Successfully sold") + ` ${stock.quantity} ` + t("shares of") + ` ${stock.symbol} ` + t("for") + ` ${formatCurrency(netProfit)}`,
    });
    onClose();
  };

  if (!stock) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Sell")} {stock.name}</DialogTitle>
          <DialogDescription>
              {t("Are you sure you want to sell your shares of")} {stock.symbol}?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sellPrice" className="text-right">
              {t("Sell Price")}
            </Label>
            <Input
              type="number"
              id="sellPrice"
              placeholder={t("Enter sell price")}
              className="col-span-3"
              onChange={(e) => setSellPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="commission" className="text-right">
              {t("Commission")}
            </Label>
            <Input
              type="number"
              id="commission"
              placeholder={t("Enter commission amount")}
              className="col-span-3"
              onChange={(e) => setCommission(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isFixedCommission" className="text-right">
              {t("Fixed Commission")}
            </Label>
            <Select onValueChange={() => setIsFixedCommission(!isFixedCommission)} >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t("Fixed or Percentage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">{t("Fixed")}</SelectItem>
                <SelectItem value="false">{t("Percentage")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button type="button" onClick={handleSell}>
            {t("Sell")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

