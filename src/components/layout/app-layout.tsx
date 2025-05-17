"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Home, LayoutTemplate, Settings, Bot } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/editor', label: 'Editor', icon: Home },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  // { href: '/settings', label: 'Settings', icon: Settings }, // Example for future
];

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            VersaPage
          </h1>
        </SidebarHeader>
        <Separator className="my-0 bg-sidebar-border group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-3/4" />
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label, className: "capitalize" }}
                    className="justify-start"
                  >
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <Separator className="my-0 bg-sidebar-border group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-3/4" />
        <SidebarFooter className="p-4">
          {/* Placeholder for user profile or theme toggle */}
           <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:text-sidebar-foreground">
              <Settings className="h-5 w-5" />
            </Button>
             <span className="text-sm group-data-[collapsible=icon]:hidden">App Settings</span>
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-end gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          {/* Add any header controls here, e.g., Save button, Publish button */}
        </header>
        <main className="flex-1 overflow-auto p-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
