php
$users = \App\Models\User::query()->select('id', 'name', 'email', 'role')->get();
$users->each(fn($user) => dump($user->toArray()));
