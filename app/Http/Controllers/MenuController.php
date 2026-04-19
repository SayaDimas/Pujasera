<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Menu;
use App\Models\Team;

class MenuController extends Controller
{
    // 📌 LIST MENU
    public function index(Team $store)
    {
        $menus = Menu::where('team_id', $store->id)->latest()->get();

        return Inertia::render('menus/index', [
            'store' => $store,
            'menus' => $menus,
        ]);
    }

    // 📌 FORM CREATE
    public function create(Team $store)
    {
        return Inertia::render('menus/create', [
            'store' => $store,
        ]);
    }

    // 📌 SIMPAN MENU
    public function store(Request $request, Team $store)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
        ]);

        Menu::create([
            'team_id' => $store->id,
            'name' => $validated['name'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? null,
            'category' => $validated['category'],
        ]);

        return redirect()
            ->route('stores.menus', $store->id)
            ->with('success', 'Menu berhasil ditambahkan');
    }

    // 📌 DELETE MENU
    public function destroy(Team $store, Menu $menu)
    {
        // Pastikan menu milik store ini
        if ($menu->team_id !== $store->id) {
            abort(403);
        }

        $menu->delete();

        return redirect()
            ->back()
            ->with('success', 'Menu berhasil dihapus');
    }
}