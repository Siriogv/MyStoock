"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { NewsSection } from "@/components/news-section"; // Import the NewsSection component
import {HighestProfitStocks, Stock} from "@/components/highest-profit-stocks";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Home() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        style={{
          borderRight: "1px solid var(--border)",
        }}
      >
        <SidebarHeader>
          <div className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Stoock</h1>
          </div>
        </SidebarHeader>
        <SidebarRail>
          {/*<SidebarTrigger asChild>*/}
          {/*  <Button variant="ghost" size="icon" aria-label="Collapse sidebar">*/}
          {/*    <Icons.chevronLeft className="h-4 w-4" />
          {/*  </Button>*/}
          {/*</SidebarTrigger>*/}
        </SidebarRail>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/" passHref>
                  <SidebarMenuButton href="#" isActive>
                    <Icons.home className="mr-2 h-4 w-4" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/transaction-history" passHref>
                  <SidebarMenuButton href="/transaction-history">
                    <Icons.workflow className="mr-2 h-4 w-4" />
                    <span>Transaction History</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Trade</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/buy" passHref>
                  <SidebarMenuButton href="/buy">
                    <Icons.building className="mr-2 h-4 w-4" />
                    <span>Buy Stock</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/sell" passHref>
                  <SidebarMenuButton href="/sell">
                    <Icons.coins className="mr-2 h-4 w-4" />
                    <span>Sell Stock</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Simulation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/simulate" passHref>
                  <SidebarMenuButton href="/simulate">
                    <Icons.edit className="mr-2 h-4 w-4" />
                    <span>Simulation Page</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/settings" passHref>
                  <SidebarMenuButton href="/settings">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    <span>User Settings</span>
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
                title: "Logged out!",
                description: "See you soon.",
              })
            }
          >
            <Icons.logOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to your investment portfolio overview.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Total Purchase Value</h2>
              <p className="text-2xl">$100,000</p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Current Total Value</h2>
              <p className="text-2xl">$110,000</p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Total Profit/Loss</h2>
              <p className="text-2xl success">+$10,000</p>
            </div>
          </div>

          <HighestProfitStocks/>
          <NewsSection />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
