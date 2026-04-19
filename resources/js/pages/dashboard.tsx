import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

type Props = {
    dashboardType: 'admin' | 'store' | 'default';
};

export default function Dashboard({ dashboardType }: Props) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Admin Dashboard
    if (dashboardType === 'admin') {
        return (
            <>
                <Head title="Admin Dashboard" />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
                    <div className="w-full">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-slate-900">
                                Dashboard Admin Pujasera
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Selamat datang, {user?.name}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Total Toko */}
                            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">
                                            Total Toko
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                            0
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-blue-100 p-3">
                                        <svg
                                            className="h-6 w-6 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Total Karyawan */}
                            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">
                                            Total Karyawan
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                            0
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-green-100 p-3">
                                        <svg
                                            className="h-6 w-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM15 20H9m6 0h6"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Pendapatan Total */}
                            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">
                                            Pendapatan Total
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                            Rp 0
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-yellow-100 p-3">
                                        <svg
                                            className="h-6 w-6 text-yellow-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Pending Approval */}
                            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">
                                            Pending Approval
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                            0
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-orange-100 p-3">
                                        <svg
                                            className="h-6 w-6 text-orange-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Store Employee Dashboard
    if (dashboardType === 'store') {
        return (
            <>
                <Head title="Store Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard Toko</h1>
                        <p className="mt-1 text-slate-600">Selamat datang, {user?.name}</p>
                    </div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </>
        );
    }

    // Default Dashboard
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-slate-600">Selamat datang, {user?.name}</p>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: any) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
