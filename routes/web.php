<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\StoreDashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\MenuController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => false, // Registration only through store creation
])->name('home');

// Unified Dashboard - All roles access /dashboard
// Backend determines what to display based on role
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

// Admin Stores Management
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('stores', StoreController::class)->only(['index', 'create', 'store', 'edit', 'update']);
});

// Store Dashboard (for store employees)
Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('stores/{store}')->middleware('ensure_team_membership')->group(function () {

        Route::get('/dashboard', StoreDashboardController::class)
            ->name('stores.dashboard');

        Route::get('/orders', [OrderController::class, 'index'])
            ->name('stores.orders');

        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])
            ->name('orders.update-status');

        Route::get('/menus', [MenuController::class, 'index'])
        ->name('stores.menus');

        Route::get('/menus/create', [MenuController::class, 'create'])
            ->name('stores.menus.create');

        Route::post('/menus', [MenuController::class, 'store'])
            ->name('stores.menus.store');

        Route::delete('/menus/{menu}', [MenuController::class, 'destroy'])
            ->name('stores.menus.destroy');
        


    });

});

require __DIR__.'/settings.php';
