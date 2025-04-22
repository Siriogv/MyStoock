"use client";

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
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/use-i18n";
import { useRouter } from 'next/navigation';
import { Checkbox } from "@/components/ui/checkbox";

interface SimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function SimulationDialog({ isOpen, onClose }: SimulationDialogProps) {
  const { t } = useI18n();
  const router = useRouter();
  const { toast } = useToast();

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [commission, setCommission] = useState(0);
  const [isFixedCommission, setIsFixedCommission] = useState(true);
  const [calculateTax, setCalculateTax] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleCalculate = () => {
    let totalPurchaseCost = quantity * purchasePrice;
    let totalSaleRevenue = quantity * salePrice;
    let commissionAmount = isFixedCommission ? commission : (totalPurchaseCost + totalSaleRevenue) * (commission / 100);
    let profitLoss = totalSaleRevenue - totalPurchaseCost - commissionAmount;
    let tax = calculateTax && profitLoss > 0 ? profitLoss * 0.26 : 0;
    let netProfit = profitLoss - tax;

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

    router.push(`/simulate/result?totalPurchaseCost=${totalPurchaseCost}&totalSaleRevenue=${totalSaleRevenue}&commissionAmount=${commissionAmount}&profitLoss=${profitLoss}&tax=${tax}&netProfit=${netProfit}`);
    onClose();
  };

  return (
    
      
        
          
            {t("Simulation Page")}
          
          
            
              {t("Simulate investment scenarios to evaluate potential profits and losses.")}
            
          
        
        
          
            
              
                
                  
                    {t("Stock Symbol")}
                  
                  
                    
                      type="text"
                      id="symbol"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                    
                  
                
                
                  
                    {t("Quantity")}
                  
                  
                    
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    
                  
                
              
            
            
              
                
                  
                    {t("Purchase Price")}
                  
                  
                    
                      type="number"
                      id="purchasePrice"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    
                  
                
                
                  
                    {t("Sale Price")}
                  
                  
                    
                      type="number"
                      id="salePrice"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                    
                  
                
              
            
            
              
                {t("Commission")}
                
                  
                    type="number"
                    id="commission"
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                  
                
              
            
          
          
            
              
                Fixed Commission
              
            
          
          
            
              
                Calculate Tax (26%)
              
            
          
        
        
          
            {t("Calculate")}
          
        
  

        {simulationResult && (
          
            
              {t("Simulation Result")}
            
            
              {t("Total Purchase Cost")}: {simulationResult.totalPurchaseCost}
            
            
              {t("Total Sale Revenue")}: {simulationResult.totalSaleRevenue}
            
            
              {t("Commission Amount")}: {simulationResult.commissionAmount}
            
            
              {t("Profit/Loss")}: {simulationResult.profitLoss}
            
            
              {t("Tax (26%)")}: {simulationResult.tax}
            
            
              {t("Net Profit")}: {simulationResult.netProfit}
            
          
        )}
      
    
  );
}

export default SimulationDialog;
