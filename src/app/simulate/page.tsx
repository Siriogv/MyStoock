"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/use-i18n";
import { SidebarLayout } from "@/components/sidebar-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function SimulationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [commission, setCommission] = useState(0);
  const [isFixedCommission, setIsFixedCommission] = useState(true);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const goBackToDashboard = () => {
    router.push('/');
  };

  const handleCalculate = () => {
    let totalPurchaseCost = quantity * purchasePrice;
    let totalSaleRevenue = quantity * salePrice;
    let commissionAmount = isFixedCommission ? commission : (totalPurchaseCost + totalSaleRevenue) * (commission / 100);
    let profitLoss = totalSaleRevenue - totalPurchaseCost - commissionAmount;
    const tax = profitLoss > 0 ? profitLoss * 0.26 : 0;
    const netProfit = profitLoss - tax;

    setSimulationResult({
      totalPurchaseCost,
      totalSaleRevenue,
      commissionAmount,
      profitLoss,
      tax,
      netProfit,
    });

    toast({
      title: t("Simulation complete"),
      description: t("The simulation has been successfully calculated."),
    });
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("Simulation Page")}</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{t("Open Simulation")}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("Simulation Parameters")}</DialogTitle>
              <DialogDescription>
                {t("Enter the parameters for your simulation.")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">{t("Stock Symbol")}</Label>
                  <Input
                    type="text"
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">{t("Quantity")}</Label>
                  <Input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchasePrice">{t("Purchase Price")}</Label>
                  <Input
                    type="number"
                    id="purchasePrice"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="salePrice">{t("Sale Price")}</Label>
                  <Input
                    type="number"
                    id="salePrice"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="commission">{t("Commission")}</Label>
                <Input
                  type="number"
                  id="commission"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fixedCommission"
                  checked={isFixedCommission}
                  onCheckedChange={() => setIsFixedCommission(!isFixedCommission)}
                />
                <Label htmlFor="fixedCommission">{t("Fixed Commission")}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCalculate}>{t("Calculate")}</Button>
            </DialogFooter>

            {simulationResult && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">{t("Simulation Result")}</h2>
                <p>{t("Total Purchase Cost")}: {simulationResult.totalPurchaseCost}</p>
                <p>{t("Total Sale Revenue")}: {simulationResult.totalSaleRevenue}</p>
                <p>{t("Commission Amount")}: {simulationResult.commissionAmount}</p>
                <p>{t("Profit/Loss")}: {simulationResult.profitLoss}</p>
                <p>{t("Tax (26%)")}: {simulationResult.tax}</p>
                <p>{t("Net Profit")}: {simulationResult.netProfit}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Button variant="secondary" onClick={goBackToDashboard}>{t("Back to Dashboard")}</Button>
      </div>
    </SidebarLayout>
  );
}
