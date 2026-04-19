<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia; 
use App\Models\Team;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Team $store)
    {
        // Get all orders with items for today, eager load items to prevent N+1
        // Order by created_at ascending to show earliest orders first
        $orders = Order::where('team_id', $store->id)
            ->whereDate('created_at', now())
            ->with('items')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('orders/index', [
            'store' => $store,
            'orders' => $orders,
            'today' => now()->format('Y-m-d'),
        ]);
    }

    /**
     * 
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the status of an order.
     */
    public function updateStatus(Request $request, Team $store, Order $order)
    {
        // Pastikan order milik store yang benar
        if ($order->team_id !== $store->id) {
            abort(403, 'Unauthorized to update this order');
        }

        // Validasi status
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        // Update status
        $order->update([
            'status' => $validated['status']
        ]);

        return back()->with('success', 'Status pesanan berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
