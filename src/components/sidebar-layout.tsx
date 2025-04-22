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
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast();

    return (
        <div className="flex h-screen">
            <Sidebar
                collapsible="icon"
                style={{
                    borderRight: "1px solid var(--border)",
                }}
            >
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/" passHref>
                                    <SidebarMenuButton href="#" isActive>
                                        <Icons.home className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
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
            <div className="flex-1 p-4">
                {children}
            </div>
        </div>
    );
};
