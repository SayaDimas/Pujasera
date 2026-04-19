import { Head } from '@inertiajs/react';
import { ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

type OrderItem = {
    id: number;
    food_name: string;
    quantity: number;
    price: number;
    subtotal: number;
};

type Order = {
    id: number;
    created_at: string;
    status: 'pending' | 'completed' | 'cancelled';
    total_price: number;
    items: OrderItem[];
};

type Store = {
    id: number;
    name: string;
    store_number: string;
};

type Props = {
    store: Store;
    orders: Order[];
    todayStats: {
        total_orders: number;
        total_sales: number;
    };
};

export default function StoreDashboard({ store, orders, todayStats }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Selesai';
            case 'pending':
                return 'Menunggu';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    return (
        <>
            <Head title={`${store.name} - Dashboard Toko`} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900">
                            {store.name}
                        </h1>
                        <p className="mt-1 text-slate-600">
                            Nomor Toko: {store.store_number}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        {/* Total Orders Card */}
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Total Pesanan Hari Ini
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {todayStats.total_orders}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-blue-100 p-3">
                                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Total Sales Card */}
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Total Penjualan Hari Ini
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        Rp{todayStats.total_sales.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-green-100 p-3">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        {/* Average Order Card */}
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Rata-rata Pesanan
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {todayStats.total_orders > 0
                                            ? `Rp${Math.round(todayStats.total_sales / todayStats.total_orders).toLocaleString('id-ID')}`
                                            : 'Rp0'}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-purple-100 p-3">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Pesanan Hari Ini
                            </h2>
                        </div>

                        {orders && orders.length > 0 ? (
                            <div className="divide-y divide-slate-200">
                                {orders.map((order) => (
                                    <div key={order.id} className="px-6 py-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    Pesanan #{order.id}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {order.created_at}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(order.status)}
                                                </span>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    Rp{order.total_price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="ml-0 bg-slate-50 rounded p-3">
                                            <div className="space-y-2">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex justify-between text-sm"
                                                    >
                                                        <div>
                                                            <span className="text-slate-700">
                                                                {item.food_name}
                                                            </span>
                                                            <span className="mx-2 text-slate-500">
                                                                x{item.quantity}
                                                            </span>
                                                        </div>
                                                        <span className="text-slate-900 font-medium">
                                                            Rp{item.subtotal.toLocaleString(
                                                                'id-ID'
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <p className="text-slate-600">
                                    Tidak ada pesanan hari ini
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
