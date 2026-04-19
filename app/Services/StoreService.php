<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StoreService
{
    /**
     * Create a new store with owner user
     */
    public function createStore(array $data): Team
    {
        return DB::transaction(function () use ($data) {
            // Create store
            $store = Team::create([
                'store_number' => $data['store_number'],
                'name' => $data['name'],
                'owner_email' => $data['owner_email'],
            ]);

            // Create store owner user
            $user = User::create([
                'name' => $data['owner_name'],
                'email' => $data['owner_email'],
                'password' => Hash::make('password'), // Default password
                'role' => UserRole::KARYAWAN_TOKO,
            ]);

            // Add user as team member (owner)
            $store->members()->attach($user, ['role' => 'owner']);

            // Set user's current team
            $user->update(['current_team_id' => $store->id]);

            return $store;
        });
    }

    /**
     * Update store with owner user
     */
    public function updateStore(Team $store, array $data): Team
    {
        return DB::transaction(function () use ($store, $data) {
            // Get current owner
            $owner = $store->members()
                ->wherePivot('role', 'owner')
                ->first();

            if (!$owner) {
                throw new \Exception('Store tidak memiliki owner');
            }

            // Update store
            $store->update([
                'store_number' => $data['store_number'],
                'name' => $data['name'],
                'owner_email' => $data['owner_email'],
            ]);

            // Update owner user
            $owner->update([
                'name' => $data['owner_name'],
                'email' => $data['owner_email'],
            ]);

            return $store;
        });
    }
}

