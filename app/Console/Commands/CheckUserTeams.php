<?php

namespace App\Console\Commands;

use App\Models\Team;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:check-user-teams')]
#[Description('Check user team associations')]
class CheckUserTeams extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("\n=== TEAMS (STORES) ===");
        $teams = Team::all();
        if ($teams->isEmpty()) {
            $this->warn("❌ Tidak ada teams di database!");
        } else {
            $this->table(['ID', 'Name', 'Store Number', 'Slug'], $teams->map(fn($t) => [
                $t->id,
                $t->name,
                $t->store_number,
                $t->slug,
            ])->toArray());
        }

        $this->info("\n=== USER TEAMS ASSOCIATION ===");
        $users = User::with('teams')->get();
        foreach ($users as $user) {
            $teamCount = $user->teams()->count();
            $this->info("👤 {$user->name} ({$user->email}) - {$teamCount} teams");
            if ($teamCount > 0) {
                foreach ($user->teams as $team) {
                    $this->info("   └─ {$team->name} (ID: {$team->id})");
                }
            } else {
                $this->warn("   └─ ❌ Tidak ada team!");
            }
        }

        $this->info("\n=== FIXING ===");
        $this->warn("Lihat output di atas untuk diagnosa masalah.");
        
        // Try to check if Toko Ragunan and Toko Senayan exist
        $tokoRagunan = Team::where('name', 'ilike', '%ragunan%')->first();
        $tokoSenayan = Team::where('name', 'ilike', '%senayan%')->first();
        
        $ragunanUser = User::where('email', 'toko.ragunan@pujasera.com')->first();
        $senayaUser = User::where('email', 'toko.senayan@pujasera.com')->first();
        
        $this->table(['Toko', 'Status'], [
            ['Toko Ragunan', $tokoRagunan ? "✓ Ada (ID: {$tokoRagunan->id})" : "❌ Tidak ada"],
            ['Toko Senayan', $tokoSenayan ? "✓ Ada (ID: {$tokoSenayan->id})" : "❌ Tidak ada"],
            ['User Ragunan', $ragunanUser ? "✓ Ada (ID: {$ragunanUser->id})" : "❌ Tidak ada"],
            ['User Senayan', $senayaUser ? "✓ Ada (ID: {$senayaUser->id})" : "❌ Tidak ada"],
        ]);
    }
}
