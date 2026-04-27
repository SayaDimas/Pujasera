<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Team;
use App\Models\Menu;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class DashboardController extends Controller
{
    public function __invoke(Request $request): \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        $user = $request->user();

        return match ($user->role) {
            UserRole::ADMIN_PUJASERA => $this->adminDashboard($user),
            UserRole::KARYAWAN_TOKO => $this->redirectToStoreDashboard($user),
            default => Inertia::render('dashboard', [
                'dashboardType' => 'default',
            ]),
        };
    }

    /**
     * Redirect store employee to their store dashboard.
     */
    private function redirectToStoreDashboard($user): RedirectResponse
    {
        // Get the first store the employee is assigned to
        $store = $user->teams()->where('is_personal', false)->first();

        if ($store) {
            return redirect()->route('stores.dashboard', $store->id);
        }

        // Fallback if no store assigned (shouldn't happen)
        return redirect()->route('dashboard');
    }

     private function adminDashboard($user): \Inertia\Response
    {
        // Load data yang diperlukan untuk admin
        // $stats = [
        //     'total_stores' => Team::where('is_personal', false)->count(),
        //     'total_employees' => $this->getTotalEmployees(),
        //     'total_orders_today' => $this->getTodayOrders(),
        //     'recent_orders' => $this->getRecentOrders(),
        // ];
W
        // $recentStores = Team::where('is_personal', false)
        //     ->withCount('members')
        //     ->latest()
        //     ->take(5)
        //     ->get();

        return Inertia::render('admin/dashboard', [
            // 'dashboardType' => 'admin',
            // 'stats' => $stats,
            // 'recentStores' => $recentStores,
        ]);
    }

    /**
     * Welcome page for customers to browse and order menus.
     */
    public function welcome(Request $request)
    {
        $teams = Team::where('is_personal', false)->get();
        
        $menus = Menu::query()
            ->with('team:id,name')
            ->get()
            ->groupBy('category');

        return Inertia::render('welcome', [
            'teams' => $teams,
            'menusByCategory' => $menus,
        ]);
    }
}

