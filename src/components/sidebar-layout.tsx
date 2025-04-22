"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useI18n } from "@/hooks/use-i18n";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { t } = useI18n();
  const router = useRouter();

  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  const openSimulation = () => setIsSimulationOpen(true);
  const closeSimulation = () => setIsSimulationOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        toast({
            title: t("Logged out!"),
            description: t("See you soon."),
        });
        router.push('/login');
    };

  return (
    
      <SidebarProvider
        defaultOpen={true}
      >
        <Sidebar
          collapsible="icon"
          style={{
            borderRight: "1px solid var(--border)",
          }}
        >
          <SidebarContent>
            <SidebarTrigger/>
            <SidebarGroup>
              <SidebarGroupLabel>{t("Dashboard")}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/" passHref>
                    <SidebarMenuButton href="#" isActive>
                      <Icons.home className="mr-2 h-4 w-4" />
                      <span>{t("Dashboard")}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/transaction-history" passHref>
                    <SidebarMenuButton href="/transaction-history">
                      <Icons.workflow className="mr-2 h-4 w-4" />
                      <span>{t("Transaction History")}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t("Trade")}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/buy" passHref>
                    <SidebarMenuButton href="/buy">
                      <Icons.building className="mr-2 h-4 w-4" />
                      <span>{t("Buy Stock")}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t("Simulation")}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                 <SidebarMenuButton onClick={openSimulation}>
                    <Icons.edit className="mr-2 h-4 w-4" />
                    <span>{t("Simulation")}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>{t("Settings")}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/settings" passHref>
                    <SidebarMenuButton href="/settings">
                      <Icons.settings className="mr-2 h-4 w-4" />
                      <span>{t("User Settings")}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <Icons.logOut className="mr-2 h-4 w-4" />
              {t("Logout")}
            </Button>
          </SidebarFooter>
        </Sidebar>
        
          {children}
        
        <SimulationDialog isOpen={isSimulationOpen} onClose={closeSimulation} />
      </SidebarProvider>
    
  );
};

interface SimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function SimulationDialog({ isOpen, onClose }: SimulationDialogProps) {
  const { t } = useI18n();
  const router = useRouter();
  const { toast } = useToast(); // Use the useToast hook

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

    toast({ // Use the toast function from the hook
      title: t("Simulation complete"),
      description: t("The simulation has been successfully calculated."),
    });

    // Redirect to the result page with parameters
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

