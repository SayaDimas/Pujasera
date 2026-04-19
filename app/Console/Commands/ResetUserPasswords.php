<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

#[Signature('app:reset-user-passwords')]
#[Description('Reset all user passwords to "password"')]
class ResetUserPasswords extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $password = Hash::make('password');
        User::query()->update(['password' => $password]);
        
        $this->info('✓ Semua password user berhasil di-reset ke "password"');
        
        $users = User::all();
        $this->table(['ID', 'Name', 'Email', 'Role'], $users->map(fn($u) => [
            $u->id,
            $u->name,
            $u->email,
            $u->role->value,
        ])->toArray());
    }
}
