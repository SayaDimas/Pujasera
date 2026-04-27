import { Head } from '@inertiajs/react';
import { ShoppingCart, DollarSign, TrendingUp, Calendar, ArrowUpRight, Package, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

type PerformanceData = {
    date: string;
    full_date: string;
    total_sales: number;
    total_orders: number;
};

type Props = {
    store: Store;
    orders: Order[];
    todayStats: {
        total_orders: number;
        total_sales: number;
    };
    performanceData: PerformanceData[];
    breadcrumbs: { title: string; href: string }[];
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                <p className="text-sm font-semibold text-slate-900 mb-1">{label}</p>
                <div className="space-y-1">
                    <p className="text-xs text-blue-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        Penjualan: Rp{payload[0].value?.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        Pesanan: {payload[0].payload.total_orders}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function StoreDashboard({ store, orders, todayStats, performanceData }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-100';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100';
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
            <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {store.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1 text-slate-500">
                                <Badge variant="outline" className="bg-white px-2 py-0.5 font-medium">
                                    #{store.store_number}
                                </Badge>
                                <span className="text-sm font-medium">•</span>
                                <span className="text-sm font-medium flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="overflow-hidden border-none shadow-sm bg-white ring-1 ring-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Pesanan</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-bold text-slate-900">{todayStats.total_orders}</h3>
                                            <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                                                <ArrowUpRight className="h-3 w-3 mr-0.5" /> Hari ini
                                            </span>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100">
                                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden border-none shadow-sm bg-white ring-1 ring-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Penjualan</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-bold text-slate-900">
                                                Rp{todayStats.total_sales.toLocaleString('id-ID')}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
                                        <DollarSign className="h-6 w-6 text-emerald-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden border-none shadow-sm bg-white ring-1 ring-slate-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Rata-rata Order</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-bold text-slate-900">
                                                {todayStats.total_orders > 0
                                                    ? `Rp${Math.round(todayStats.total_sales / todayStats.total_orders).toLocaleString('id-ID')}`
                                                    : 'Rp0'}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-purple-50 p-3 ring-1 ring-purple-100">
                                        <TrendingUp className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Chart */}
                    <Card className="border-none shadow-sm bg-white ring-1 ring-slate-200 overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Performance Toko</CardTitle>
                                    <CardDescription>Tren penjualan 7 hari terakhir</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-100">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                        Live Trends
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            tickFormatter={(value) => `Rp${value >= 1000000 ? (value / 1000000).toFixed(1) + 'jt' : value >= 1000 ? (value / 1000).toFixed(0) + 'rb' : value}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="total_sales"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorSales)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Section: Recent Orders & Top Items */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Orders List */}
                        <Card className="lg:col-span-2 border-none shadow-sm bg-white ring-1 ring-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                                <div>
                                    <CardTitle>Pesanan Terbaru</CardTitle>
                                    <CardDescription>Aktivitas pesanan hari ini</CardDescription>
                                </div>
                                <Badge variant="outline" className="font-normal text-slate-500">
                                    {orders.length} Pesanan
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                {orders && orders.length > 0 ? (
                                    <div className="divide-y divide-slate-50">
                                        {orders.map((order) => (
                                            <div key={order.id} className="p-6 transition-colors hover:bg-slate-50/50">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                                            <Package className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-slate-900">#{order.id}</span>
                                                                <span className="text-slate-300">•</span>
                                                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{order.created_at}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-500 mt-0.5">
                                                                {order.items.length} Menu dipesan
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-slate-900">
                                                            Rp{order.total_price.toLocaleString('id-ID')}
                                                        </p>
                                                        <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${getStatusColor(order.status)}`}>
                                                            {getStatusLabel(order.status)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Items Preview */}
                                                <div className="flex flex-wrap gap-2">
                                                    {order.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600"
                                                        >
                                                            <span className="font-medium">{item.food_name}</span>
                                                            <span className="text-slate-300">×</span>
                                                            <span className="font-bold text-slate-900">{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                            <ShoppingCart className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium">Tidak ada pesanan hari ini</p>
                                        <p className="text-xs text-slate-400 mt-1">Pesanan baru akan muncul di sini</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Summary / Top Customers or something else */}
                        <div className="space-y-8">
                            <Card className="border-none shadow-sm bg-white ring-1 ring-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-lg">Informasi Toko</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Status Toko</p>
                                            <p className="text-xs text-emerald-600 font-medium">Buka • Menerima Pesanan</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">ID Toko</span>
                                            <span className="font-medium text-slate-900">{store.id}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Nomor Registrasi</span>
                                            <span className="font-medium text-slate-900">{store.store_number}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="font-bold text-lg">Tips Penjualan</h4>
                                    <p className="text-blue-100 text-sm mt-2 leading-relaxed">
                                        Tingkatkan performa toko dengan memperbarui foto menu dan memberikan promo menarik di jam makan siang!
                                    </p>
                                    <button className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                                        Lihat Strategi
                                    </button>
                                </div>
                                <TrendingUp className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StoreDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard Toko', href: '/dashboard' },
    ],
};
      
