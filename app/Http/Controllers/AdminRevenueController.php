<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class AdminRevenueController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->query('period', 'monthly');
        
        $query = Order::query()
            ->where('status', OrderStatus::Completed)
            ->with('team');

        $now = Carbon::now();

        match ($period) {
            'daily' => $query->whereDate('created_at', $now->toDateString()),
            'weekly' => $query->whereBetween('created_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()]),
            'monthly' => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
            'yearly' => $query->whereYear('created_at', $now->year),
            default => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
        };

        $orders = $query->get();

        $totalRevenue = $orders->sum('total_price');
        $pujaseraRevenue = $totalRevenue * 0.10;
        $storesRevenue = $totalRevenue * 0.90;

        // Group by store
        $storeStats = $orders->groupBy('team_id')->map(function ($storeOrders, $teamId) {
            $team = $storeOrders->first()->team;
            $storeTotal = $storeOrders->sum('total_price');
            return [
                'team_id' => $teamId,
                'team_name' => $team ? $team->name : 'Unknown Store',
                'total_orders' => $storeOrders->count(),
                'total_revenue' => $storeTotal,
                'pujasera_cut' => $storeTotal * 0.10,
                'store_cut' => $storeTotal * 0.90,
            ];
        })->values()->sortByDesc('total_revenue');

        return Inertia::render('admin/revenues/index', [
            'period' => $period,
            'summary' => [
                'total_revenue' => $totalRevenue,
                'pujasera_revenue' => $pujaseraRevenue,
                'stores_revenue' => $storesRevenue,
            ],
            'store_stats' => $storeStats,
        ]);
    }
}
