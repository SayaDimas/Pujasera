<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:fix-user-emails')]
#[Description('Fix user email addresses')]
class FixUserEmails extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Fix Toko Ragunan email
        $user = User::find(2);
        if ($user) {
            $user->email = 'toko.ragunan@pujasera.com';
            $user->save();
            $this->info("✓ User ID 2: {$user->name} → {$user->email}");
        }

        // Show all users
        $this->info("\nSemua Users:");
        $users = User::all();
        $this->table(['ID', 'Name', 'Email', 'Role'], $users->map(fn($u) => [
            $u->id,
            $u->name,
            $u->email,
            $u->role->value,
        ])->toArray());
        
        $this->info("\n✓ Semua email sudah di-fix!
        
Test Login Credentials:
- Admin: admin@pujasera.com / password
- Toko Ragunan: toko.ragunan@pujasera.com / password
- Toko Senayan: toko.senayan@pujasera.com / password");
    }
}
