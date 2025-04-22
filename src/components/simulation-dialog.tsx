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
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


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

  const calculateSimulation = () => {
      let totalPurchaseCost = quantity * purchasePrice;
      let totalSaleRevenue = quantity * salePrice;
      let commissionAmount = isFixedCommission ? commission : (totalPurchaseCost + totalSaleRevenue) * (commission / 100);
      let profitLoss = totalSaleRevenue - totalPurchaseCost - commissionAmount;
      let tax = calculateTax && profitLoss > 0 ? profitLoss * 0.26 : 0;
      let netProfit = profitLoss - tax;

      return {
          totalPurchaseCost,
          totalSaleRevenue,
          commissionAmount,
          profitLoss,
          tax,
          netProfit,
      };
  };

  const handleCalculate = () => {
    const result = calculateSimulation();
    setSimulationResult(result);

    toast({
      title: t("Simulation complete"),
      description: t("The simulation has been successfully calculated."),
    });
  };

    const data = [
        { name: t("Purchase Cost"), value: simulationResult?.totalPurchaseCost || 0 },
        { name: t("Sale Revenue"), value: simulationResult?.totalSaleRevenue || 0 },
        { name: t("Commission"), value: simulationResult?.commissionAmount || 0 },
        { name: t("Profit/Loss"), value: simulationResult?.profitLoss || 0 },
        { name: t("Tax"), value: simulationResult?.tax || 0 },
        { name: t("Net Profit"), value: simulationResult?.netProfit || 0 },
    ];


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("Simulation Page")}</DialogTitle>
          <DialogDescription>
            {t("Simulate investment scenarios to evaluate potential profits and losses.")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            
              
                
                  
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
              
            
          
        </div>

           <Button onClick={handleCalculate}>{t("Calculate")}</Button>

          {simulationResult && (
              <Card className="shadow-lg border-primary">
                  <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-center">{t("Profit and Loss Analysis")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                          <AreaChart data={data}
                                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <XAxis dataKey="name" />
                              <YAxis tickFormatter={(value) => formatCurrency(value)}/>
                              <CartesianGrid strokeDasharray="3 3"/>
                              <Tooltip formatter={(value) => formatCurrency(value)}/>
                              <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#profitGradient)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          )}
        
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={onClose}>
                {t("Cancel")}
              </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}

export default SimulationDialog;
