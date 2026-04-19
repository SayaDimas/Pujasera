<?php

namespace Database\Seeders;

use App\Enums\TeamRole;
use App\Enums\UserRole;
use App\Models\Team;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin Pujasera
        User::firstOrCreate(
            ['email' => 'admin@pujasera.com'],
            [
                'name' => 'Admin Pujasera',
                'role' => UserRole::ADMIN_PUJASERA->value,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create stores/teams
        $storeRagunan = Team::firstOrCreate(
            ['name' => 'Toko Ragunan'],
            [
                'slug' => 'toko-ragunan',
                'store_number' => 'P001',
                'owner_email' => 'toko.ragunan@pujasera.com',
                'is_personal' => false,
            ]
        );

        $storeSenayan = Team::firstOrCreate(
            ['name' => 'Toko Senayan'],
            [
                'slug' => 'toko-senayan',
                'store_number' => 'P002',
                'owner_email' => 'toko.senayan@pujasera.com',
                'is_personal' => false,
            ]
        );

        // Store Employees - Ragunan
        $userRagunan = User::firstOrCreate(
            ['email' => 'toko.ragunan@pujasera.com'],
            [
                'name' => 'Pemilik Toko Ragunan',
                'role' => UserRole::KARYAWAN_TOKO->value,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        
        // Attach user to store and set as current team
        if (!$userRagunan->belongsToTeam($storeRagunan)) {
            $userRagunan->teams()->attach($storeRagunan, ['role' => TeamRole::Owner->value]);
        }
        $userRagunan->update(['current_team_id' => $storeRagunan->id]);

        // Store Employees - Senayan
        $userSenayan = User::firstOrCreate(
            ['email' => 'toko.senayan@pujasera.com'],
            [
                'name' => 'Pemilik Toko Senayan',
                'role' => UserRole::KARYAWAN_TOKO->value,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        
        // Attach user to store and set as current team
        if (!$userSenayan->belongsToTeam($storeSenayan)) {
            $userSenayan->teams()->attach($storeSenayan, ['role' => TeamRole::Owner->value]);
        }
        $userSenayan->update(['current_team_id' => $storeSenayan->id]);

        // Seed orders for testing
        $this->call(MenuSeeder::class);
        $this->call(OrderSeeder::class);
    }
}
