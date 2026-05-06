import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface StoreStat {
    team_id: number;
    team_name: string;
    total_orders: number;
    total_revenue: number;
    pujasera_cut: number;
    store_cut: number;
}

interface RevenuesProps {
    period: string;
    summary: {
        total_revenue: number;
        pujasera_revenue: number;
        stores_revenue: number;
    };
    store_stats: StoreStat[];
}

export default function AdminRevenues({ period, summary, store_stats }: RevenuesProps) {
    const formatRp = (value: number) => {
        return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = e.target.value;
        router.get('/admin/revenues', { period: newPeriod }, { preserveState: true });
    };

    return (
        <>
            <Head title="Monitor Pendapatan" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">
                                Monitor Pendapatan
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Ringkasan pendapatan Pujasera dan setiap toko
                            </p>
                        </div>
                        
                        {/* Filter */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="period" className="text-sm font-medium text-slate-700">
                                Periode:
                            </label>
                            <select
                                id="period"
                                value={period}
                                onChange={handlePeriodChange}
                                className="rounded-lg border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="daily">Harian (Hari Ini)</option>
                                <option value="weekly">Mingguan (Minggu Ini)</option>
                                <option value="monthly">Bulanan (Bulan Ini)</option>
                                <option value="yearly">Tahunan (Tahun Ini)</option>
                            </select>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {/* Total Revenue */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-600">Total Pendapatan (Kotor)</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{formatRp(summary.total_revenue)}</p>
                            <p className="mt-1 text-sm text-slate-500">100% dari seluruh transaksi toko</p>
                        </div>
                        
                        {/* Pujasera Revenue */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                            <p className="text-sm font-medium text-blue-800">Pendapatan Pujasera</p>
                            <p className="mt-2 text-3xl font-bold text-blue-900">{formatRp(summary.pujasera_revenue)}</p>
                            <p className="mt-1 text-sm text-blue-600">10% komisi dari seluruh transaksi</p>
                        </div>

                        {/* Stores Revenue */}
                        <div className="rounded-xl border border-green-100 bg-green-50 p-6 shadow-sm">
                            <p className="text-sm font-medium text-green-800">Pendapatan Semua Toko</p>
                            <p className="mt-2 text-3xl font-bold text-green-900">{formatRp(summary.stores_revenue)}</p>
                            <p className="mt-1 text-sm text-green-600">90% bagi hasil untuk toko</p>
                        </div>
                    </div>

                    {/* Table Data */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">Rincian Pendapatan per Toko</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="whitespace-nowrap px-6 py-4 font-medium">Nama Toko</th>
                                        <th className="whitespace-nowrap px-6 py-4 font-medium">Total Pesanan</th>
                                        <th className="whitespace-nowrap px-6 py-4 font-medium">Pendapatan Kotor</th>
                                        <th className="whitespace-nowrap px-6 py-4 font-medium text-blue-700">Potongan Pujasera (10%)</th>
                                        <th className="whitespace-nowrap px-6 py-4 font-medium text-green-700">Pendapatan Bersih (90%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {store_stats.length > 0 ? (
                                        store_stats.map((stat) => (
                                            <tr key={stat.team_id} className="hover:bg-slate-50">
                                                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                                                    {stat.team_name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {stat.total_orders} Pesanan
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                                                    {formatRp(stat.total_revenue)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-blue-700">
                                                    {formatRp(stat.pujasera_cut)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold text-green-700">
                                                    {formatRp(stat.store_cut)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                Belum ada data pendapatan untuk periode ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
