"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarLayout } from "@/components/sidebar-layout";
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
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SimulationResultPage() {
  const searchParams = useSearchParams();
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    const result = {
      totalPurchaseCost: Number(searchParams.get("totalPurchaseCost")),
      totalSaleRevenue: Number(searchParams.get("totalSaleRevenue")),
      commissionAmount: Number(searchParams.get("commissionAmount")),
      profitLoss: Number(searchParams.get("profitLoss")),
      tax: Number(searchParams.get("tax")),
      netProfit: Number(searchParams.get("netProfit")),
    };
    setSimulationResult(result);
  }, [searchParams]);

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

  const goBackToDashboard = () => {
    router.push("/");
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-5 text-center">
          {t("Simulation Result")}
        </h1>

        {simulationResult ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-primary">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-center">
                  {t("Profit and Loss Analysis")}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
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

            <Card className="shadow-lg border-secondary">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-center">
                  {t("Detailed Breakdown")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-lg">
                <p className="mb-2">
                  {t("Total Purchase Cost")}:{" "}
                  {formatCurrency(simulationResult.totalPurchaseCost)}
                </p>
                <p className="mb-2">
                  {t("Total Sale Revenue")}:{" "}
                  {formatCurrency(simulationResult.totalSaleRevenue)}
                </p>
                <p className="mb-2">
                  {t("Commission Amount")}:{" "}
                  {formatCurrency(simulationResult.commissionAmount)}
                </p>
                <p className="mb-2">
                  {t("Profit/Loss")}:{" "}
                  {formatCurrency(simulationResult.profitLoss)}
                </p>
                <p className="mb-2">
                  {t("Tax (26%)")}: {formatCurrency(simulationResult.tax)}
                </p>
                <p className="mb-2">
                  {t("Net Profit")}:{" "}
                  {formatCurrency(simulationResult.netProfit)}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-lg text-muted-foreground">
            {t("No simulation result found.")}
          </p>
        )}
        <div className="flex justify-center mt-6">
          <Button
            variant="secondary"
            className="px-8 py-3"
            onClick={goBackToDashboard}
          >
            {t("Back to Dashboard")}
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
}
