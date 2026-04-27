<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Team;
use App\Http\Requests\StoreOrderRequest;
use Illuminate\Http\Request;
use Inertia\Inertia; 

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
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        // Create the order
        $order = Order::create([
            'team_id' => $validated['team_id'],
            'table_number' => $validated['table_number'] ?? null,
            'total_price' => $validated['total_price'],
            'status' => 'pending',
        ]);

        // Create order items
        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'food_name' => $item['name'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'description' => null,
                'subtotal' => $item['price'] * $item['quantity'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat',
            'order_id' => $order->id,
        ], 201);
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
