import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, Store, TrendingUp, Settings, ShoppingCart, Plus, 
    Home, ShoppingBag, History, Search, Filter, X, LogIn
} from 'lucide-react';
import { useState } from 'react';
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
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { NavItem } from '@/types';

interface Team {
    id: number;
    name: string;
}

interface AppSidebarProps {
    selectedStore?: number | null;
    onStoreChange?: (storeId: number | null) => void;
    onSearch?: (keyword: string) => void;
    teams?: Team[];
}

export function AppSidebar({ 
    selectedStore, 
    onStoreChange, 
    onSearch,
    teams = [] 
}: AppSidebarProps) {
    const page = usePage();
    const user = page.props.auth?.user;
    const currentTeam = page.props.currentTeam;
    const [searchKeyword, setSearchKeyword] = useState('');

    const isLoggedIn = !!user;

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        if (onSearch) {
            onSearch(keyword);
        }
    };

    const handleStoreFilter = (storeId: number | null) => {
        if (onStoreChange) {
            onStoreChange(storeId);
        }
    };

    // Navigation items for customer (not logged in)
    const customerNavItems: NavItem[] = [
        {
            title: 'Menu',
            href: '/',
            icon: Home,
        },
        {
            title: 'Keranjang Saya',
            href: '/cart',
            icon: ShoppingBag,
        },
        {
            title: 'Riwayat Pesanan',
            href: '/my-orders',
            icon: History,
        },
    ];

    // Navigation items for admin/staff (logged in)
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
                      href: '/admin/revenues',
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

    // Customer sidebar with filters
    if (!isLoggedIn) {
        return (
            <Sidebar collapsible="icon" variant="sidebar">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    {/* Search Section */}
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            <Search className="h-4 w-4 mr-2" />
                            Cari Menu
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div className="px-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-stone-400" />
                                    <Input
                                        type="text"
                                        placeholder="Nama menu..."
                                        value={searchKeyword}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-8 pr-8 h-9 text-sm"
                                    />
                                    {searchKeyword && (
                                        <button
                                            onClick={() => handleSearch('')}
                                            className="absolute right-2 top-2.5"
                                        >
                                            <X className="h-4 w-4 text-stone-400 hover:text-stone-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Filter by Store */}
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            <Filter className="h-4 w-4 mr-2" />
                            Filter Toko
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <div className="space-y-1 px-2">
                                <button
                                    onClick={() => handleStoreFilter(null)}
                                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                                        selectedStore === null
                                            ? 'bg-amber-100 text-amber-900 font-medium'
                                            : 'text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    Semua Toko
                                </button>
                                {teams.map((store) => (
                                    <button
                                        key={store.id}
                                        onClick={() => handleStoreFilter(store.id)}
                                        className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                                            selectedStore === store.id
                                                ? 'bg-amber-100 text-amber-900 font-medium'
                                                : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{store.name}</span>
                                            {selectedStore === store.id && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        );
    }

    // Admin/Staff sidebar
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