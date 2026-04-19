<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get stores
        $storeRagunan = Team::where('name', 'Toko Ragunan')->first();
        $storeSenayan = Team::where('name', 'Toko Senayan')->first();

        // Menu for Toko Ragunan
        if ($storeRagunan) {
            Menu::create([
                'team_id' => $storeRagunan->id,
                'name' => 'Nasi Kuning',
                'price' => 25000,
                'category' => 'Makanan Utama',
                'description' => 'Nasi kuning wangi dengan bumbu khas',
            ]);

            Menu::create([
                'team_id' => $storeRagunan->id,
                'name' => 'Soto Ayam',
                'price' => 20000,
                'category' => 'Makanan Utama',
                'description' => 'Soto ayam tradisional dengan kuah gurih',
            ]);

            Menu::create([
                'team_id' => $storeRagunan->id,
                'name' => 'Gado-Gado',
                'price' => 18000,
                'category' => 'Makanan Utama',
                'description' => 'Gado-gado segar dengan saus kacang',
            ]);

            Menu::create([
                'team_id' => $storeRagunan->id,
                'name' => 'Lumpia Goreng',
                'price' => 15000,
                'category' => 'Makanan Ringan',
                'description' => 'Lumpia goreng renyah isi daging dan sayuran',
            ]);

            Menu::create([
                'team_id' => $storeRagunan->id,
                'name' => 'Perkedel',
                'price' => 10000,
                'category' => 'Makanan Ringan',
                'description' => 'Perkedel kentang goreng bertaburan parmesan',
            ]);

            Menu::create([
                'team_id' => $storeRagunan->id,
                'name' => 'Es Teh Manis',
                'price' => 8000,
                'category' => 'Minuman',
                'description' => 'Es teh manis segar yang menyegarkan',
            ]);

            Menu::create([
                'team_id' => $storeRagunan->id,
                'name' => 'Bakso Beef',
                'price' => 22000,
                'category' => 'Makanan Utama',
                'description' => 'Bakso daging sapi dalam kuah kaldu',
            ]);

            Menu::create([
                'team_id' => $storeRagunan->id,
                'name' => 'Martabak',
                'price' => 30000,
                'category' => 'Dessert',
                'description' => 'Martabak manis dengan berbagai pilihan topping',
            ]);
        }

        // Menu for Toko Senayan
        if ($storeSenayan) {
            Menu::create([
                'team_id' => $storeSenayan->id,
                'name' => 'Jus Mangga',
                'price' => 18000,
                'category' => 'Minuman Segar',
                'description' => 'Jus mangga murni tanpa gula tambahan',
            ]);

            Menu::create([
                'team_id' => $storeSenayan->id,
                'name' => 'Jus Jeruk',
                'price' => 15000,
                'category' => 'Minuman Segar',
                'description' => 'Jus jeruk fresh dengan rasa asam manis',
            ]);

            Menu::create([
                'team_id' => $storeSenayan->id,
                'name' => 'Jus Pir',
                'price' => 16000,
                'category' => 'Minuman Segar',
                'description' => 'Jus pir manis dan segar',
            ]);

            Menu::create([
                'team_id' => $storeSenayan->id,
                'name' => 'Smoothie Strawberry',
                'price' => 20000,
                'category' => 'Minuman Segar',
                'description' => 'Smoothie strawberry dengan yogurt',
            ]);

            Menu::create([
                'team_id' => $storeSenayan->id,
                'name' => 'Smoothie Pisang',
                'price' => 18000,
                'category' => 'Minuman Segar',
                'description' => 'Smoothie pisang lembut dan creamy',
            ]);

            Menu::create([
                'team_id' => $storeSenayan->id,
                'name' => 'Es Campur',
                'price' => 12000,
                'category' => 'Minuman Es',
                'description' => 'Es campur dengan berbagai toping',
            ]);

            Menu::create([
                'team_id' => $storeSenayan->id,
                'name' => 'Es Dawet',
                'price' => 10000,
                'category' => 'Minuman Es',
                'description' => 'Es dawet tradisional Indonesia',
            ]);

            Menu::create([
                'team_id' => $storeSenayan->id,
                'name' => 'Es Cendol',
                'price' => 12000,
                'category' => 'Minuman Es',
                'description' => 'Es cendol dengan santan dan gula merah',
            ]);
        }
    }
}
