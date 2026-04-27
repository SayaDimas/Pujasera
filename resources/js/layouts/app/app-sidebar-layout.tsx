import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

interface AppSidebarLayoutProps extends AppLayoutProps {
    selectedStore?: number | null;
    onStoreChange?: (storeId: number | null) => void;
    onSearch?: (keyword: string) => void;
    teams?: any[];
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    selectedStore,
    onStoreChange,
    onSearch,
    teams = [],
}: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar 
                selectedStore={selectedStore}
                onStoreChange={onStoreChange}
                onSearch={onSearch}
                teams={teams}
            />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}