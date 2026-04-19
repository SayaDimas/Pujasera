<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class DashboardController extends Controller
{
    public function __invoke(Request $request): \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        $user = $request->user();

        return match ($user->role) {
            UserRole::ADMIN_PUJASERA => Inertia::render('dashboard', [
                'dashboardType' => 'admin',
            ]),
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
}

