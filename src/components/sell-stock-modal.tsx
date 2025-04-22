"use client";

import { useState, ChangeEvent } from "react";
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
  isOpen: boolean; // Modal visibility state
  onClose: () => void; // Function to close the modal
  stock: Stock | null; // Stock data to be sold
  setPortfolio: (portfolio: Stock[]) => void; // Function to update the portfolio
  portfolio: Stock[]; // Current portfolio
}

/**
 * SellStockModal component
 * Renders a modal for selling stocks.
 * Allows the user to input sell price, commission, and choose between fixed or percentage commission.
 * Calculates profit/loss and updates the portfolio accordingly.
 * @param {SellStockModalProps} props - The props for the SellStockModal component.
 */
export const SellStockModal = ({
  isOpen,
  onClose,
  stock,
  setPortfolio,
  portfolio,
}: SellStockModalProps) => {
  // State variables
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [commission, setCommission] = useState<number>(0);
  const [isFixedCommission, setIsFixedCommission] = useState(true);

  // Hooks
  const { toast } = useToast();
  const { t } = useI18n();

  // Function to handle changes in the sell price input
  const handleSellPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSellPrice(Number(e.target.value));
  };

  // Function to handle changes in the commission input
  const handleCommissionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommission(Number(e.target.value));
  };

  // Function to handle the sell action
  const handleSell = () => {
    // Validate if stock and sellPrice are set
    if (!stock || !sellPrice) {
      // Show error toast if validation fails
      toast({
        title: t("Error"),
        description: t("Please select a stock and enter a sell price."),
        variant: "destructive",
      });

      return;
    }

    // Calculate commission based on whether it's fixed or percentage
    const commissionAmount = isFixedCommission
      ? commission // If fixed, use the provided commission
      : (stock.purchasePrice + sellPrice) * (commission / 100); // If percentage, calculate based on stock price

    // Calculate gross profit/loss
    const grossProfitLoss = (sellPrice - stock.purchasePrice) * stock.quantity - commissionAmount;

    // Calculate tax (26% on profit, 0 if loss)
    const tax = profitLoss > 0 ? profitLoss * 0.26 : 0;

    // Calculate net profit/loss after tax
    const netProfit = grossProfitLoss - tax;

    // Update the portfolio by removing the sold stock
    const updatedPortfolio = portfolio.filter(
      (item) => item.symbol !== stock.symbol,
    );

    setPortfolio(updatedPortfolio);

    // Show success toast
    toast({
      title: t("Success"),
      description: `${t("Successfully sold")} ${stock.quantity} ${t("shares of")} ${stock.symbol} ${t("for")} ${formatCurrency(netProfit)}`,
    });

    // Close the modal
    onClose();
  };

  if (!stock) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("Sell")} {stock.name}
          </DialogTitle>
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
              onChange={handleSellPriceChange}
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
              onChange={handleCommissionChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isFixedCommission" className="text-right">
              {t("Fixed Commission")}
            </Label>
            <Select
             defaultValue={isFixedCommission.toString()}
              onValueChange={() => setIsFixedCommission(!isFixedCommission)}
            >
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
