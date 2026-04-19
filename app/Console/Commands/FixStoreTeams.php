<?php

namespace App\Console\Commands;

use App\Models\Team;
use App\Models\User;
use App\Enums\TeamRole;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:fix-store-teams')]
#[Description('Fix store team associations for toko.ragunan and toko.senayan')]
class FixStoreTeams extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("\n=== FIXING STORE TEAMS ===\n");

        // Fix Toko Ragunan
        $this->fixStoreUser('toko.ragunan@pujasera.com', 'Toko Ragunan', 'RAGUNAN-001');
        
        // Fix Toko Senayan
        $this->fixStoreUser('toko.senayan@pujasera.com', 'Toko Senayan', 'SENAYAN-001');

        $this->info("\n✓ Semua store teams sudah di-fix!\n");
        
        // Show result
        $this->call('app:check-user-teams');
    }

    private function fixStoreUser($email, $storeName, $storeNumber)
    {
        $user = User::where('email', $email)->first();
        if (!$user) {
            $this->warn("❌ User {$email} tidak ditemukan!");
            return;
        }

        // Check if user already has a store (non-personal team)
        $storeTeam = $user->teams()->where('is_personal', false)->first();
        
        if ($storeTeam) {
            $this->info("✓ {$email} sudah punya store: {$storeTeam->name}");
            return;
        }

        // Try to find existing store with this name
        $team = Team::where('name', $storeName)->where('is_personal', false)->first();
        
        if (!$team) {
            // Create new store
            $team = Team::create([
                'name' => $storeName,
                'store_number' => $storeNumber,
                'owner_email' => $email,
                'is_personal' => false,
            ]);
            $this->info("✓ Membuat toko baru: {$storeName} (ID: {$team->id})");
        } else {
            $this->info("✓ Menggunakan toko existing: {$storeName} (ID: {$team->id})");
        }

        // Attach user to team as owner
        if (!$user->teams()->where('team_id', $team->id)->exists()) {
            $user->teams()->attach($team->id, ['role' => TeamRole::Owner->value]);
            $this->info("   └─ User {$email} ditambahkan ke team {$team->name}");
        }

        // Set as current team
        $user->current_team_id = $team->id;
        $user->save();
        $this->info("   └─ Set current_team_id ke {$team->id}");
    }
}
