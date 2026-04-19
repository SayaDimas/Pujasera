import { Link, usePage } from '@inertiajs/react'

export default function MenuIndex() {
    const { menus, store } = usePage().props as any

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Menu - {store.name}
            </h1>

            {/* BUTTON TAMBAH */}
            <Link
                href={`/stores/${store.id}/menus/create`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
                + Tambah Menu
            </Link>

            <div className="mt-6">
                {menus.length === 0 ? (
                    <p className="text-gray-500 italic">
                        Belum ada menu
                    </p>
                ) : (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Nama</th>
                                    <th className="p-3 text-left">Harga</th>
                                    <th className="p-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.map((menu: any) => (
                                    <tr key={menu.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3">{menu.name}</td>
                                        <td className="p-3 font-semibold text-green-600">
                                            Rp {menu.price}
                                        </td>
                                        <td className="p-3 text-center space-x-2">
                                            <Link
                                                href={`/menus/${menu.id}`}
                                                method="delete"
                                                as="button"
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                                            >
                                                Hapus
                                            </Link>
                                             <Link
                                                href={`/menus/${menu.id}/edit`}
                                                method="get"
                                                as="button"
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow transition"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}