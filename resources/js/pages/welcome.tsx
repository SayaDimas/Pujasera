import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage().props;

    const [activeTab, setActiveTab] = useState<'home' | 'orders'>('home');
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<Map<string, number>>(new Map());
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const stores = [
        { id: '1', name: 'Toko Ragunan', location: 'Jakarta Selatan' },
        { id: '2', name: 'Toko Senayan', location: 'Jakarta Pusat' },
    ];

    const menuItems = [
        { id: '1', name: 'Nasi Goreng', category: 'Nasi', price: 45000, storeId: '1' },
        { id: '2', name: 'Mie Goreng', category: 'Mie', price: 40000, storeId: '1' },
        { id: '3', name: 'Ayam Goreng', category: 'Protein', price: 50000, storeId: '2' },
    ];

    const filteredItems = selectedStore
        ? menuItems.filter(i => i.storeId === selectedStore)
        : menuItems;

    const categories = [...new Set(filteredItems.map(i => i.category))];

    const addToCart = (id: string) => {
        setCartItems(prev => new Map(prev).set(id, (prev.get(id) || 0) + 1));
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => {
            const newCart = new Map(prev);
            const qty = newCart.get(id) || 0;
            qty <= 1 ? newCart.delete(id) : newCart.set(id, qty - 1);
            return newCart;
        });
    };

    const cartTotal = Array.from(cartItems.entries()).reduce((sum, [id, qty]) => {
        const item = menuItems.find(m => m.id === id);
        return sum + (item?.price || 0) * qty;
    }, 0);

    return (
        <>
            <Head title="Pujasera" />

            <div className="min-h-screen bg-slate-100 flex">

                {/* DESKTOP SIDEBAR */}
                <aside className="hidden lg:block w-72 border-r bg-white p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Pilih Toko
                    </h2>

                    <div className="space-y-2">
                        <button
                            onClick={() => setSelectedStore(null)}
                            className={`w-full text-left px-4 py-2 rounded-md ${
                                selectedStore === null
                                    ? 'bg-slate-900 text-white'
                                    : 'hover:bg-slate-100'
                            }`}
                        >
                            Semua Toko
                        </button>

                        {stores.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setSelectedStore(s.id)}
                                className={`w-full text-left px-4 py-2 rounded-md ${
                                    selectedStore === s.id
                                        ? 'bg-slate-900 text-white'
                                        : 'hover:bg-slate-100'
                                }`}
                            >
                                <div>{s.name}</div>
                                <div className="text-xs text-slate-500">
                                    {s.location}
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* MOBILE SIDEBAR */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 flex">

                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-black/40"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Drawer */}
                        <div className="relative w-72 bg-white p-6 z-50 transform transition-transform duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold">Pilih Toko</h2>
                                <button onClick={() => setSidebarOpen(false)}>Tutup</button>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setSelectedStore(null);
                                        setSidebarOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 rounded-md hover:bg-slate-100"
                                >
                                    Semua Toko
                                </button>

                                {stores.map(store => (
                                    <button
                                        key={store.id}
                                        onClick={() => {
                                            setSelectedStore(store.id);
                                            setSidebarOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 rounded-md hover:bg-slate-100"
                                    >
                                        <div>{store.name}</div>
                                        <div className="text-xs text-slate-500">
                                            {store.location}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN */}
                <div className="flex-1 flex flex-col">

                    {/* NAVBAR */}
                    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">

                        <div className="flex items-center gap-3">
                            {/* HAMBURGER */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 border rounded-md"
                            >
                                Menu
                            </button>

                            <div className="font-semibold text-lg">
                                Pujasera
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('home')}
                                className={activeTab === 'home' ? 'font-semibold' : ''}
                            >
                                Menu
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={activeTab === 'orders' ? 'font-semibold' : ''}
                            >
                                Pesanan ({cartItems.size})
                            </button>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-6">

                        {activeTab === 'home' && (
                            <div className="space-y-10">

                                {categories.map(cat => (
                                    <div key={cat}>
                                        <h2 className="text-xl font-semibold mb-4">
                                            {cat}
                                        </h2>

                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {filteredItems
                                                .filter(i => i.category === cat)
                                                .map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-white border rounded-lg p-4 flex flex-col justify-between"
                                                    >
                                                        <div>
                                                            <h3 className="font-medium">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-sm text-slate-500">
                                                                Rp {item.price.toLocaleString()}
                                                            </p>
                                                        </div>

                                                        <div className="mt-4">
                                                            {cartItems.has(item.id) ? (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => removeFromCart(item.id)}
                                                                        className="flex-1 border rounded-md py-1"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <div className="flex-1 text-center">
                                                                        {cartItems.get(item.id)}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => addToCart(item.id)}
                                                                        className="flex-1 border rounded-md py-1"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => addToCart(item.id)}
                                                                    className="w-full bg-slate-900 text-white py-2 rounded-md"
                                                                >
                                                                    Tambah
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="max-w-3xl">

                                <h2 className="text-xl font-semibold mb-6">
                                    Pesanan
                                </h2>

                                {cartItems.size === 0 ? (
                                    <p className="text-slate-500">
                                        Belum ada pesanan
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {Array.from(cartItems.entries()).map(([id, qty]) => {
                                            const item = menuItems.find(m => m.id === id);
                                            if (!item) return null;

                                            return (
                                                <div
                                                    key={id}
                                                    className="flex justify-between border rounded-lg p-4"
                                                >
                                                    <div>
                                                        <p>{item.name}</p>
                                                        <p className="text-sm text-slate-500">
                                                            {qty} x Rp {item.price.toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="font-semibold">
                                                        Rp {(item.price * qty).toLocaleString()}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <div className="border-t pt-4 flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span>
                                                Rp {cartTotal.toLocaleString()}
                                            </span>
                                        </div>

                                        <button className="w-full bg-slate-900 text-white py-3 rounded-md">
                                            Checkout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}