import { useForm, usePage } from '@inertiajs/react'

export default function CreateMenu() {
    const { store } = usePage().props as any

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        category: '',
        description: '',
    })

    const submit = (e: any) => {
        e.preventDefault()
        post(`/stores/${store.id}/menus`)
    }

    return (
        <div className="p-6 max-w-xl">
            <h1 className="text-2xl font-bold mb-6">
                Tambah Menu - {store.name}
            </h1>

            <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block mb-1 font-medium">
                        Nama Menu
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.name && (
                        <div className="text-red-500 text-sm">
                            {errors.name}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Harga
                    </label>
                    <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.price && (
                        <div className="text-red-500 text-sm">
                            {errors.price}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">
                        Deskripsi
                    </label>

                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={4}
                        placeholder="Contoh: Mie Aceh pedas dengan topping daging..."
                    />

                    {errors.description && (
                        <div className="text-red-500 text-sm">
                            {errors.description}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium">
                        Kategori
                    </label>

                    <select
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className="border rounded w-full p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">-- Pilih Kategori --</option>
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Snack">Snack</option>
                    </select>

                    {errors.category && (
                        <div className="text-red-500 text-sm">
                            {errors.category}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow transition"
                >
                    Simpan Menu
                </button>
            </form>
        </div>
    )
}