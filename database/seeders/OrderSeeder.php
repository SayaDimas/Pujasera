<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all teams (stores)
        $teams = Team::where('is_personal', false)->get();

        // Sample descriptions for items
        $descriptions = [
            'tidak pedas',
            'pedas sedikit',
            'pedas banget',
            'tanpa bawang',
            'tambah telur',
            'extra saus',
            'dikuah',
            'goreng renyah',
            'setengah matang',
            'matur kebo',
        ];

        foreach ($teams as $team) {
            // Get menus for this store
            $menus = Menu::where('team_id', $team->id)->get();

            if ($menus->isEmpty()) {
                continue; // Skip if store has no menus
            }

            // Create 5-10 orders for each store today
            $orderCount = rand(5, 10);
            $tableNumber = 1;

            for ($i = 0; $i < $orderCount; $i++) {
                $order = Order::create([
                    'team_id' => $team->id,
                    'table_number' => $tableNumber,
                    'status' => collect(['pending', 'processing', 'completed', 'completed'])->random(),
                    'total_price' => 0,
                ]);

                $tableNumber++;

                // Add 2-4 items per order
                $itemCount = rand(2, 4);
                $totalPrice = 0;

                for ($j = 0; $j < $itemCount; $j++) {
                    $menu = $menus->random();
                    $quantity = rand(1, 3);
                    $subtotal = $menu->price * $quantity;
                    $totalPrice += $subtotal;

                    // Randomly pick descriptions (can repeat or be empty)
                    $desc = rand(0, 1) ? $descriptions[array_rand($descriptions)] : null;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'food_name' => $menu->name,
                        'price' => $menu->price,
                        'quantity' => $quantity,
                        'description' => $desc,
                        'subtotal' => $subtotal,
                    ]);
                }

                // Update order total price
                $order->update(['total_price' => $totalPrice]);

                // Set created_at to today between 07:00 and 20:00
                $hour = rand(7, 20);
                $minute = rand(0, 59);
                $order->update([
                    'created_at' => Carbon::today()->setHour($hour)->setMinute($minute),
                ]);
            }
        }
    }
}
