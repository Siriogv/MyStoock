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

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { t } = useI18n();

  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  const openSimulation = () => setIsSimulationOpen(true);
  const closeSimulation = () => setIsSimulationOpen(false);

  return (
    <div className="flex h-screen">
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
              onClick={() =>
                toast({
                  title: t("Logged out!"),
                  description: t("See you soon."),
                })
              }
            >
              <Icons.logOut className="mr-2 h-4 w-4" />
              {t("Logout")}
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-4">
          {children}
        </div>
        <SimulationDialog isOpen={isSimulationOpen} onClose={closeSimulation} />
      </SidebarProvider>
    </div>
  );
};

interface SimulationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function SimulationDialog({ isOpen, onClose }: SimulationDialogProps) {
  const { t } = useI18n();

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [commission, setCommission] = useState(0);
  const [isFixedCommission, setIsFixedCommission] = useState(true);
  const [simulationResult, setSimulationResult] = useState<any>(null);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Simulation Page")}</DialogTitle>
          <DialogDescription>
            {t("Simulate investment scenarios to evaluate potential profits and losses.")}
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
  );
}