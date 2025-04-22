"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PortfolioStock, Stock } from "@/types";
import { calculateProfit, formatCurrency } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

interface SellStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  setPortfolio: (portfolio: Stock[]) => void;
  portfolio: Stock[];
}

export const SellStockModal = ({ isOpen, onClose, stock, setPortfolio, portfolio }: SellStockModalProps) => {
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

