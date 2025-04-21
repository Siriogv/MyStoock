"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
      title: "Simulation complete",
      description: "The simulation has been successfully calculated.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simulation Page</h1>

      <div className="mb-4">
        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
          Stock Symbol
        </label>
        <Input
          type="text"
          id="symbol"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter stock symbol"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <Input
          type="number"
          id="quantity"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Enter quantity"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
          Purchase Price
        </label>
        <Input
          type="number"
          id="purchasePrice"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(Number(e.target.value))}
          placeholder="Enter purchase price"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
          Sale Price
        </label>
        <Input
          type="number"
          id="salePrice"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={salePrice}
          onChange={(e) => setSalePrice(Number(e.target.value))}
          placeholder="Enter sale price"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
          Commission
        </label>
        <Input
          type="number"
          id="commission"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={commission}
          onChange={(e) => setCommission(Number(e.target.value))}
          placeholder="Enter commission amount"
        />
        <div className="mt-2">
          <label className="inline-flex items-center">
            <Input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              checked={isFixedCommission}
              onChange={() => setIsFixedCommission(!isFixedCommission)}
            />
            <span className="ml-2 text-gray-700">Fixed Commission</span>
          </label>
        </div>
      </div>

      <Button onClick={handleCalculate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Calculate
      </Button>

       <Button variant="secondary" onClick={goBackToDashboard}>Back to Dashboard</Button>

      {simulationResult && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Simulation Result</h2>
          <p>Total Purchase Cost: {simulationResult.totalPurchaseCost}</p>
          <p>Total Sale Revenue: {simulationResult.totalSaleRevenue}</p>
          <p>Commission Amount: {simulationResult.commissionAmount}</p>
          <p>Profit/Loss: {simulationResult.profitLoss}</p>
          <p>Tax (26%): {simulationResult.tax}</p>
          <p>Net Profit: {simulationResult.netProfit}</p>
        </div>
      )}
    </div>
  );
}

