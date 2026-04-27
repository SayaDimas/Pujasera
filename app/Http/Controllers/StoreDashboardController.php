<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class StoreDashboardController extends Controller
{
    /**
     * Show the store dashboard.
     */
    public function __invoke(Request $request, Team $store)
    {
        // Check authorization - user must be member of this store
        if (!auth()->user()?->teams()->where('team_id', $store->id)->exists()) {
            abort(403, 'Unauthorized to access this store dashboard');
        }

        // Get today's orders
        $today = Carbon::today();
        $orders = $store->orders()
            ->whereDate('created_at', $today)
            ->with('items')
            ->latest('created_at')
            ->limit(20)
            ->get();

        // Calculate today's statistics
        $todayStats = $store->orders()
            ->whereDate('created_at', $today)
            ->selectRaw('COUNT(*) as total_orders, SUM(total_price) as total_sales')
            ->first();

        // Performance data for the last 7 days
        $performanceRaw = $store->orders()
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->where('status', 'completed')
            ->selectRaw('DATE(created_at) as date, SUM(total_price) as total_sales, COUNT(*) as total_orders')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $performanceData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $performanceData[] = [
                'date' => now()->subDays($i)->translatedFormat('d M'),
                'full_date' => $date,
                'total_sales' => (float) ($performanceRaw[$date]->total_sales ?? 0),
                'total_orders' => (int) ($performanceRaw[$date]->total_orders ?? 0),
            ];
        }

        return Inertia::render('store-dashboard/index', [
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'store_number' => $store->store_number,
            ],
            'orders' => $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'created_at' => $order->created_at->format('H:i'),
                    'status' => $order->status->value,
                    'total_price' => (float) $order->total_price,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'food_name' => $item->food_name,
                            'quantity' => $item->quantity,
                            'price' => (float) $item->price,
                            'subtotal' => (float) $item->subtotal,
                        ];
                    })->toArray(),
                ];
            })->toArray(),
            'todayStats' => [
                'total_orders' => (int) ($todayStats->total_orders ?? 0),
                'total_sales' => (float) ($todayStats->total_sales ?? 0),
            ],
            'performanceData' => $performanceData,
        ]);
    }
}
