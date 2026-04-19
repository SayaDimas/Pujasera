import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Store, Users, TrendingUp, Settings, ShoppingCart, Plus } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth?.user;
    const currentTeam = page.props.currentTeam;
    const dashboardUrl = currentTeam
        ? dashboard()
        : '/dashboard';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...(user?.role === 'admin_pujasera'
            ? [
                  {
                      title: 'Kelola Toko',
                      href: '/stores',
                      icon: Store,
                  },
                  {
                      title: 'Monitor Pendapatan',
                      href: '#',
                      icon: TrendingUp,
                  },
                  {
                      title: 'Pengaturan Sistem',
                      href: '#',
                      icon: Settings,
                  },
              ]
            : []),
        ...(user?.role === 'karyawan_toko'
            ? [
                  {
                      title: 'Pesanan',
                      href: currentTeam ? `/stores/${currentTeam.id}/orders` : '#',
                      icon: ShoppingCart,
                  },
                  {
                      title: 'Tambah Menu',
                      href: currentTeam ? `/stores/${currentTeam.id}/menus` : '#',
                      icon: Plus,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
