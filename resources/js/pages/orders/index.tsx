import { usePage, router } from '@inertiajs/react'
import { useState } from 'react'


interface OrderItem {
    id: number
    food_name: string
    quantity: number
    price: string
    subtotal: string
    description: string | null
}

interface Order {
    id: number
    table_number: number
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
    total_price: string
    created_at: string
    items: OrderItem[]
}

interface Props {
    orders: Order[]
    store: {
        id: number
        name: string
        slug: string
    }
    today: string
}

const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(num)
}



const OrderTable = ({
    title,
    orders,
    showActions = false,
    showCompleteButton = false,
    store
}: {
    title: string
    orders: Order[]
    showActions?: boolean
    showCompleteButton?: boolean
    store: Props['store']
}) => {
    const [processing, setProcessing] = useState<number | null>(null)

    const handleUpdateStatus = (orderId: number, newStatus: string) => {
        setProcessing(orderId)
        router.put(
            `/stores/${store.id}/orders/${orderId}/status`,
            { status: newStatus },
            {
                onFinish: () => setProcessing(null),
            }
        )
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-blue-100 text-sm">{orders.length} pesanan</p>
            </div>

            {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    Tidak ada pesanan
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="max-h-80 overflow-y-auto">
                        <table className="w-full table-fixed">
                            <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold w-24">
                                        Meja
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold w-24">
                                        Menu
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold w-24">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold w-32">
                                        Total
                                    </th>
                                    {(showActions || showCompleteButton) && (
                                        <th className="px-6 py-3 text-left text-sm font-semibold w-40">
                                            Aksi
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-xl text-blue-600">
                                                {order.table_number}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {order.items?.length > 0 ? (
                                                order.items.map((item) => (
                                                    <div key={item.id} className="text-sm">
                                                        • {item.food_name} ({item.quantity}x)
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            {order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0} item
                                        </td>

                                        <td className="px-6 py-4 font-semibold">
                                            {formatCurrency(order.total_price)}
                                        </td>

                                        {(showActions || showCompleteButton) && (
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {showActions && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, 'processing')}
                                                                disabled={processing === order.id}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                            >
                                                                Proses
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                                                disabled={processing === order.id}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                            >
                                                                Batal
                                                            </button>
                                                        </>
                                                    )}

                                                    {showCompleteButton && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                            disabled={processing === order.id}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                                        >
                                                            Selesai
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Orders() {
    const { orders, store, today } = usePage().props as Props

    const todayFormatted = new Date(today).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const pending = orders.filter(o => o.status === 'pending')
    const processing = orders.filter(o => o.status === 'processing')
    const completed = orders.filter(o => o.status === 'completed')

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">
                    Pesanan - {store.name}
                </h1>
                <p className="text-gray-600 mb-6">
                    {todayFormatted} • {orders.length} pesanan
                </p>

                <div className="space-y-6">
                    <OrderTable
                        title="🔴 Pesanan Masuk"
                        orders={pending}
                        showActions
                        store={store}
                    />

                    <OrderTable
                        title="🟡 Diproses"
                        orders={processing}
                        showCompleteButton
                        store={store}
                    />

                    <OrderTable
                        title="🟢 Selesai"
                        orders={completed}
                        store={store}
                    />
                </div>
            </div>
        </div>
    )
}