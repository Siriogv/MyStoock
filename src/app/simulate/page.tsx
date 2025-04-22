"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {useI18n} from "@/hooks/use-i18n";

export default function SimulationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [commission, setCommission] = useState(0);
  const [isFixedCommission, setIsFixedCommission] = useState(true);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const {t} = useI18n();

  const goBackToDashboard = () => {
    router.push('/');
  };

  const handleCalculate = () => {
    // Implement simulation logic here
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("Simulation Page")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
            {t("Stock Symbol")}
          </label>
          <Input
            type="text"
            id="symbol"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder={t("Enter stock symbol")}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            {t("Quantity")}
          </label>
          <Input
            type="number"
            id="quantity"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder={t("Enter quantity")}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
            {t("Purchase Price")}
          </label>
          <Input
            type="number"
            id="purchasePrice"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            placeholder={t("Enter purchase price")}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
            {t("Sale Price")}
          </label>
          <Input
            type="number"
            id="salePrice"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            placeholder={t("Enter sale price")}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
            {t("Commission")}
          </label>
          <Input
            type="number"
            id="commission"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={commission}
            onChange={(e) => setCommission(Number(e.target.value))}
            placeholder={t("Enter commission amount")}
          />
          <div className="mt-2">
            <label className="inline-flex items-center">
              <Input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                checked={isFixedCommission}
                onChange={() => setIsFixedCommission(!isFixedCommission)}
              />
              <span className="ml-2 text-gray-700">{t("Fixed Commission")}</span>
            </label>
          </div>
        </div>
      </div>

      <Button onClick={handleCalculate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {t("Calculate")}
      </Button>

       <Button variant="secondary" onClick={goBackToDashboard}>{t("Back to Dashboard")}</Button>

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
    </div>
  );
}

