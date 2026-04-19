<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFormRequest;
use App\Models\Team;
use App\Services\StoreService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class StoreController extends Controller
{
    public function __construct(private StoreService $storeService)
    {
    }

    public function index(Request $request)
    {
        $pagination = Team::orderBy('name')->paginate(12);

        return Inertia::render('stores/index', [
            'stores' => [
                'data' => $pagination->items(),
                'meta' => [
                    'total' => $pagination->total(),
                    'per_page' => $pagination->perPage(),
                    'current_page' => $pagination->currentPage(),
                    'last_page' => $pagination->lastPage(),
                ],
                'links' => $pagination->linkCollection(),
            ],
        ]);
    }

    public function store(StoreFormRequest $request): RedirectResponse
    {
        $store = $this->storeService->createStore($request->validated());

        return redirect()->route('stores.index')->with('success', "Toko '{$store->name}' berhasil dibuat");
    }

    public function edit(Team $store)
    {
        // Get store owner
        $owner = $store->members()
            ->wherePivot('role', 'owner')
            ->first();

        return Inertia::render('stores/edit', [
            'store' => [
                'id' => $store->id,
                'store_number' => $store->store_number,
                'name' => $store->name,
                'owner_name' => $owner?->name ?? '',
                'owner_email' => $owner?->email ?? '',
            ],
        ]);
    }

    public function update(StoreFormRequest $request, Team $store): RedirectResponse
    {
        $this->storeService->updateStore($store, $request->validated());

        return redirect()->route('stores.index')->with('success', "Toko '{$store->name}' berhasil diperbarui");
    }

    public function create()
    {
        return Inertia::render('stores/create');
    }
}
