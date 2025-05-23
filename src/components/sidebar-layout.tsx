
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
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from "react";
import SimulationDialog from "@/components/simulation-dialog";
import { SimulationSidebar } from "./simulation-sidebar";

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { t } = useI18n();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);

  const openSimulation = useCallback(() => setIsSimulationOpen(true), []);
  const closeSimulation = useCallback(() => setIsSimulationOpen(false), []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    setIsAuthenticated(!!isLoggedIn);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: t("Logged out!"),
      description: t("See you soon."),
    });
    router.push('/login');
  }, [t, toast, router]);


  return (
    <SidebarProvider defaultOpen={true}>
        <Sidebar
            collapsible="icon"
            style={{ borderRight: "1px solid var(--border)" }}
        >
        <SidebarContent>
            <SidebarTrigger />
            {isAuthenticated && (<>
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

                <SimulationSidebar openSimulation={openSimulation} />
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
            </>)}
        </SidebarContent>
            {isAuthenticated && (<SidebarFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                    <Icons.logOut className="mr-2 h-4 w-4" />
                    {t("Logout")}
                </Button>
            </SidebarFooter>)}
        </Sidebar>
        {children}
        <SimulationDialog isOpen={isSimulationOpen} onClose={closeSimulation}/>
    </SidebarProvider>
  );
};
