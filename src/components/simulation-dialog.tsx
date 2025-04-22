 'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function SimulationDialog({ isOpen, onClose }: SimulationDialogProps) {
  const { t } = useI18n();
  const router = useRouter();

    // State variables for form inputs and simulation result
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);
    const [commission, setCommission] = useState(0);
    const [isFixedCommission, setIsFixedCommission] = useState(true);
    const [calculateTax, setCalculateTax] = useState(false);
    const [simulationResult, setSimulationResult] = useState<any>(null);

    // Function to calculate the simulation results based on user input
  const calculateSimulation = () => {
    try {
        // Validate input values
        if (quantity <= 0 || purchasePrice < 0 || salePrice < 0 || commission < 0) {
            throw new Error(t("Invalid input values. Quantity must be greater than 0 and prices/commission cannot be negative."));
        }

        // Calculate total purchase cost
        let totalPurchaseCost = quantity * purchasePrice;

        // Calculate total sale revenue
        let totalSaleRevenue = quantity * salePrice;

        // Calculate commission amount based on whether it's fixed or percentage
        let commissionAmount = isFixedCommission
            ? commission
            : (totalPurchaseCost + totalSaleRevenue) * (commission / 100);

        // Calculate profit/loss before tax
        let profitLoss = totalSaleRevenue - totalPurchaseCost - commissionAmount;

        // Calculate tax if enabled and profit is positive
        let tax = calculateTax && profitLoss > 0 ? profitLoss * 0.26 : 0;

        // Calculate net profit after tax
        let netProfit = profitLoss - tax;

        // Return the calculated values
        return {
            totalPurchaseCost,
            totalSaleRevenue,
            commissionAmount,
            profitLoss,
            tax,
            netProfit,
        };
    } catch (error) {
        // Handle errors during calculation
        console.error("Error during simulation calculation:", error);
        throw error;
    }
};

  // Handle the calculate button click
  const handleCalculate = () => {
    try {
        // Call the simulation calculation function
        const result = calculateSimulation();
        // Set the simulation result to update the UI
        setSimulationResult(result);
    } catch (error) {
        // Handle any errors that occurred during the calculation
        console.error("Error during simulation:", error);
        setSimulationResult(null);
        // Optionally, display an error message to the user here
        // toast({ title: t("Error"), description: error.message, variant: "destructive" });
    }
  };

  const data = [
    {
      name: t("Purchase Cost"),
      value: simulationResult?.totalPurchaseCost || 0,
    },
    { name: t("Sale Revenue"), value: simulationResult?.totalSaleRevenue || 0 },
    { name: t("Commission"), value: simulationResult?.commissionAmount || 0 },
    { name: t("Profit/Loss"), value: simulationResult?.profitLoss || 0 },
    { name: t("Tax"), value: simulationResult?.tax || 0 },
    { name: t("Net Profit"), value: simulationResult?.netProfit || 0 },
  ];

  return ( // Dialog component to encapsulate the simulation modal
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("Simulation Page")}</DialogTitle>
          <DialogDescription>
            {t(
              "Simulate investment scenarios to evaluate potential profits and losses.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <div className="mb-4">
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <Label htmlFor="symbol" className="text-right">
                  {t("Stock Symbol")}
                </Label>
                {/* Input field for stock symbol */}
                {/* Input field for stock symbol */}
                {/* Input field for stock symbol */}
                {/* Input field for stock symbol */}
                <Input
                  type="text"
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <Label htmlFor="quantity" className="text-right">
                  {t("Quantity")}
                </Label>
                {/* Input field for stock quantity */}
                {/* Input field for stock quantity */}
                <Input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <Label htmlFor="purchasePrice" className="text-right">
                  {t("Purchase Price")}
                </Label>
                 {/* Input field for purchase price */}
                  {/* Input field for purchase price */}
                <Input
                  type="number"
                  id="purchasePrice"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <Label htmlFor="salePrice" className="text-right">
                  {t("Sale Price")}
                </Label>
                {/* Input field for sale price */}
                {/* Input field for sale price */}
                <Input
                  type="number"
                  id="salePrice"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-4 items-center gap-4 mb-2">
                <Label htmlFor="commission" className="text-right">
                  {t("Commission")}
                </Label>
                  {/* Input field for commission */}
                  {/* Input field for commission */}
                <Input
                  type="number"
                  id="commission"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                id="fixedCommission"
                checked={isFixedCommission}
                onCheckedChange={() => setIsFixedCommission(!isFixedCommission)}
              />
              <Label htmlFor="fixedCommission">{t("Fixed Commission")}</Label>
            </div>
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                id="calculateTax"
                checked={calculateTax}
                onCheckedChange={() => setCalculateTax(!calculateTax)}
              />
              <Label htmlFor="calculateTax">{t("Calculate Tax (26%)")}</Label>
            </div>
          </div>
        </div>
         {/* Button to trigger the calculation */}
        <Button onClick={handleCalculate}>{t("Calculate")}</Button>
         {simulationResult && (// Conditionally render the result card if simulationResult exists
          <Card className="shadow-lg border-primary">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-center">
                {t("Profit and Loss Analysis")}
              </CardTitle>
            </CardHeader>
            <CardContent>
             {/* AreaChart component to visualize the simulation data */}
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="profitGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#profitGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

         {/* Button to close the dialog */}
        <Button variant="outline" onClick={onClose}>
          {t("Cancel")}
        </Button>

      </DialogContent>
    </Dialog>
  );
}

export default SimulationDialog;
