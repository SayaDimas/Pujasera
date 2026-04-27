import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo, useCallback } from 'react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, X } from 'lucide-react';

// Interface definitions (sama seperti sebelumnya)
interface Menu {
    id: number;
    name: string;
    price: number;
    category: string;
    description?: string;
    team_id: number;
    team?: {
        id: number;
        name: string;
    };
}

interface Team {
    id: number;
    name: string;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    store: string;
    team_id: number;
    qty: number;
    note: string;
}

type PaymentMethod = 'cash' | 'qris' | null;

export default function Welcome() {
    const { teams, menusByCategory } = usePage().props as {
        teams: Team[];
        menusByCategory: Record<string, Menu[]>;
    };

    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [tableNumber, setTableNumber] = useState('');
    const [payMethod, setPayMethod] = useState<PaymentMethod>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showCart, setShowCart] = useState(false);

    // Popup state
    const [popupMenu, setPopupMenu] = useState<Menu | null>(null);
    const [popupQty, setPopupQty] = useState(1);
    const [popupNote, setPopupNote] = useState('');

    const allMenus = useMemo(() => Object.values(menusByCategory).flat(), [menusByCategory]);

    // Filter menus by store and search keyword
    const filteredMenus = useMemo(() => {
        let menus = selectedStore === null 
            ? allMenus 
            : allMenus.filter(m => m.team_id === selectedStore);
        
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase();
            menus = menus.filter(menu => 
                menu.name.toLowerCase().includes(keyword) ||
                (menu.description && menu.description.toLowerCase().includes(keyword)) ||
                (menu.team?.name && menu.team.name.toLowerCase().includes(keyword))
            );
        }
        
        return menus;
    }, [selectedStore, allMenus, searchKeyword]);

    const groupedMenus = useMemo(() => {
        const grouped: Record<string, Menu[]> = {};
        filteredMenus.forEach(menu => {
            if (!grouped[menu.category]) grouped[menu.category] = [];
            grouped[menu.category].push(menu);
        });
        return grouped;
    }, [filteredMenus]);

    const categories = Object.keys(groupedMenus).sort();

    const cartCount = cart.reduce((a, c) => a + c.qty, 0);
    const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const teamsInCart = useMemo(() => new Set(cart.map(c => c.team_id)), [cart]);
    const multiStore = teamsInCart.size > 1;

    const openPopup = useCallback((menu: Menu) => {
        setPopupMenu(menu);
        setPopupQty(1);
        setPopupNote('');
    }, []);

    const closePopup = useCallback(() => {
        setPopupMenu(null);
    }, []);

    const handleAddToCart = useCallback(() => {
        if (!popupMenu) return;
        setCart(prev => {
            const existing = prev.find(c => c.id === popupMenu.id);
            if (existing) {
                return prev.map(c =>
                    c.id === popupMenu.id
                        ? {
                              ...c,
                              qty: c.qty + popupQty,
                              note: c.note
                                  ? popupNote
                                      ? c.note + ', ' + popupNote
                                      : c.note
                                  : popupNote,
                          }
                        : c
                );
            }
            return [
                ...prev,
                {
                    id: popupMenu.id,
                    name: popupMenu.name,
                    price: popupMenu.price,
                    store: popupMenu.team?.name ?? '',
                    team_id: popupMenu.team_id,
                    qty: popupQty,
                    note: popupNote,
                },
            ];
        });
        closePopup();
    }, [popupMenu, popupQty, popupNote, closePopup]);

    const removeFromCart = useCallback((id: number) => {
        setCart(prev => prev.filter(c => c.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number, newQty: number) => {
        if (newQty <= 0) {
            removeFromCart(id);
        } else {
            setCart(prev => prev.map(c => 
                c.id === id ? { ...c, qty: newQty } : c
            ));
        }
    }, [removeFromCart]);

    const handleCheckout = async () => {
        if (!payMethod || cart.length === 0 || multiStore) return;

        try {
            setCheckoutError('');
            setIsCheckingOut(true);

            const token =
                document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

            const response = await fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    team_id: cart[0].team_id,
                    table_number: tableNumber ? parseInt(tableNumber) : null,
                    payment_method: payMethod,
                    total_price: cartTotal,
                    items: cart.map(c => ({
                        menu_id: c.id,
                        name: c.name,
                        price: c.price,
                        quantity: c.qty,
                        note: c.note,
                    })),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setCheckoutError(data.message ?? 'Terjadi kesalahan saat membuat pesanan');
                return;
            }

            const data = await response.json();

            setCart([]);
            setTableNumber('');
            setPayMethod(null);
            setShowCart(false);
            setSuccessMessage(
                `Pesanan #${data.order_id} berhasil! Pembayaran via ${
                    payMethod === 'cash' ? 'Cash' : 'QRIS'
                } dikonfirmasi.`
            );
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch {
            setCheckoutError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleStoreFilter = (storeId: number | null) => {
        setSelectedStore(storeId);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
    };

    const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

    return (
        <AppSidebarLayout
            selectedStore={selectedStore}
            onStoreChange={handleStoreFilter}
            onSearch={handleSearch}
            teams={teams}
            breadcrumbs={[{ title: 'Menu', href: '/' }]}
        >
            <Head title="Pujasera - Menu Toko" />

            <div className="flex flex-col h-full">
                {/* Mobile Header with Cart Button - Hanya tampil di mobile */}
                <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-stone-200 px-4 py-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-bold text-amber-700">Menu Toko</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowCart(!showCart)}
                            className="relative"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-900 text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </div>
                    
                    {/* Mobile Search */}
                    <div className="mt-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                            <Input
                                type="text"
                                placeholder="Cari menu..."
                                value={searchKeyword}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-9 pr-8"
                            />
                            {searchKeyword && (
                                <button
                                    onClick={() => handleSearch('')}
                                    className="absolute right-3 top-2.5"
                                >
                                    <X className="h-4 w-4 text-stone-400" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Store Filter - Hanya tampil di mobile */}
                <div className="lg:hidden px-4 py-3 overflow-x-auto border-b border-stone-200">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStoreFilter(null)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                selectedStore === null
                                    ? 'bg-amber-400 text-amber-900'
                                    : 'bg-white border border-stone-200 text-stone-600'
                            }`}
                        >
                            Semua Toko
                        </button>
                        {teams.map(store => (
                            <button
                                key={store.id}
                                onClick={() => handleStoreFilter(store.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                    selectedStore === store.id
                                        ? 'bg-amber-400 text-amber-900'
                                        : 'bg-white border border-stone-200 text-stone-600'
                                }`}
                            >
                                {store.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content - dengan padding right untuk desktop agar tidak ketimpa cart */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:pr-[28rem]">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm mb-6">
                            {successMessage}
                        </div>
                    )}

                    {/* Search Results Info - Desktop */}
                    {searchKeyword && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4 text-sm text-amber-800">
                            Menampilkan hasil untuk: "{searchKeyword}"
                            {filteredMenus.length === 0 && " - Tidak ada menu ditemukan"}
                        </div>
                    )}

                    {/* Main Content - Menu Grid */}
                    <div className="max-w-7xl mx-auto space-y-8">
                        {categories.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-stone-400">
                                    {searchKeyword 
                                        ? `Tidak ada menu dengan kata "${searchKeyword}"` 
                                        : 'Belum ada menu tersedia'}
                                </p>
                            </div>
                        ) : (
                            categories.map(category => (
                                <div key={category}>
                                    <h2 className="text-lg font-semibold text-stone-800 mb-4 pb-2 border-b border-stone-200">
                                        {category}
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {groupedMenus[category].map(item => {
                                            const inCart = cart.find(c => c.id === item.id);
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => openPopup(item)}
                                                    className="bg-white border border-stone-200 rounded-xl overflow-hidden text-left hover:shadow-lg hover:border-amber-300 transition-all group relative"
                                                >
                                                    <div className="aspect-video bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center relative">
                                                        {inCart && (
                                                            <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-medium rounded-full px-2 py-1">
                                                                {inCart.qty}
                                                            </span>
                                                        )}
                                                        <span className="text-4xl">🍽️</span>
                                                    </div>
                                                    <div className="p-4">
                                                        {item.team && selectedStore === null && (
                                                            <p className="text-xs text-stone-400 mb-1">
                                                                {item.team.name}
                                                            </p>
                                                        )}
                                                        <h3 className="text-sm font-medium text-stone-900 mb-1">
                                                            {item.name}
                                                        </h3>
                                                        {item.description && (
                                                            <p className="text-xs text-stone-500 mb-2 line-clamp-2">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        <p className="text-base font-semibold text-amber-700">
                                                            {fmt(item.price)}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Desktop Cart Sidebar - Fixed di kanan */}
                <div className="hidden lg:block fixed right-0 top-0 h-full w-96 bg-white border-l border-stone-200 shadow-lg overflow-y-auto z-20">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2">
                            Keranjang
                            {cartCount > 0 && (
                                <span className="ml-2 text-sm text-stone-500">
                                    ({cartCount} item)
                                </span>
                            )}
                        </h2>
                        {renderCartContent()}
                    </div>
                </div>

                {/* Mobile Cart Drawer */}
                {showCart && (
                    <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowCart(false)}>
                        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl" onClick={e => e.stopPropagation()}>
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h2 className="text-lg font-semibold">Keranjang</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                                        Tutup
                                    </Button>
                                </div>
                                <div className="flex-1 overflow-auto p-4">
                                    {renderCartContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Popup Menu */}
            {popupMenu && renderPopup()}
        </AppSidebarLayout>
    );

    function renderCartContent() {
        if (cart.length === 0) {
            return (
                <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm text-stone-500">Keranjang kosong</p>
                    <p className="text-xs text-stone-400 mt-1">Pilih menu untuk mulai memesan</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {cart.map(item => (
                    <div key={item.id} className="bg-stone-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h3 className="font-medium text-sm">{item.name}</h3>
                                <p className="text-xs text-stone-500">{item.store}</p>
                                {item.note && (
                                    <p className="text-xs text-stone-400 italic mt-1 line-clamp-2">
                                        {item.note}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-xs text-red-500 hover:text-red-700 ml-2"
                            >
                                Hapus
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                                    className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center hover:bg-stone-200"
                                >
                                    -
                                </button>
                                <span className="text-sm w-8 text-center">{item.qty}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                                    className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center hover:bg-stone-200"
                                >
                                    +
                                </button>
                            </div>
                            <p className="font-medium text-amber-700">{fmt(item.price * item.qty)}</p>
                        </div>
                    </div>
                ))}

                <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-lg font-bold text-amber-700">{fmt(cartTotal)}</span>
                    </div>

                    {multiStore && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2 rounded-lg">
                            ⚠️ Keranjang berisi menu dari beberapa toko. Harap pilih satu toko saja.
                        </div>
                    )}

                    {checkoutError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded-lg">
                            {checkoutError}
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-medium text-stone-600 mb-1 block">
                            Metode Pembayaran
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['cash', 'qris'] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setPayMethod(m)}
                                    className={`py-2 rounded-lg text-sm border transition-colors ${
                                        payMethod === m
                                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium'
                                            : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300'
                                    }`}
                                >
                                    {m === 'cash' ? 'Cash' : 'QRIS'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-stone-600 mb-1 block">
                            Nomor Meja (opsional)
                        </label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Contoh: 5"
                            value={tableNumber}
                            onChange={e => setTableNumber(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                        />
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut || !payMethod || multiStore || cart.length === 0}
                        className="w-full py-3 rounded-lg text-sm font-medium bg-amber-400 text-amber-900 hover:bg-amber-500 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isCheckingOut ? 'Memproses...' : 'Konfirmasi Pesanan'}
                    </button>
                </div>
            </div>
        );
    }

    function renderPopup() {
        if (!popupMenu) return null;
        
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                onClick={e => e.target === e.currentTarget && closePopup()}
            >
                <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-stone-900">{popupMenu.name}</h3>
                                <p className="text-sm text-stone-500">{popupMenu.team?.name}</p>
                                {popupMenu.description && (
                                    <p className="text-sm text-stone-600 mt-2">{popupMenu.description}</p>
                                )}
                            </div>
                            <button onClick={closePopup} className="text-stone-400 hover:text-stone-600">
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-stone-700 mb-2 block">
                                    Jumlah
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPopupQty(q => Math.max(1, q - 1))}
                                        className="w-8 h-8 rounded-lg border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                                    >
                                        −
                                    </button>
                                    <span className="text-lg font-medium w-12 text-center">{popupQty}</span>
                                    <button
                                        onClick={() => setPopupQty(q => q + 1)}
                                        className="w-8 h-8 rounded-lg border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-stone-600">
                                        = {fmt(popupMenu.price * popupQty)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-stone-700 mb-2 block">
                                    Catatan (opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={popupNote}
                                    onChange={e => setPopupNote(e.target.value)}
                                    placeholder="Contoh: tidak pedas, tanpa bawang..."
                                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                                />
                            </div>

                            {cart.find(c => c.id === popupMenu.id) && (
                                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-2 rounded-lg">
                                    Sudah ada {cart.find(c => c.id === popupMenu.id)!.qty} porsi di keranjang
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full mt-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold rounded-xl transition-colors"
                        >
                            Tambahkan ke Keranjang · {fmt(popupMenu.price * popupQty)}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}