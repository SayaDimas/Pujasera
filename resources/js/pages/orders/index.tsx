import { usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import { Clock, CheckCircle, XCircle, Package, Store as StoreIcon, Calendar, Users, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

const getStatusConfig = (status: Order['status']) => {
    const config = {
        pending: {
            label: 'Menunggu',
            icon: Clock,
            color: 'bg-amber-100 text-amber-700 border-amber-200',
            gradient: 'from-amber-500 to-orange-500'
        },
        processing: {
            label: 'Diproses',
            icon: Package,
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            gradient: 'from-blue-500 to-indigo-500'
        },
        completed: {
            label: 'Selesai',
            icon: CheckCircle,
            color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            gradient: 'from-emerald-500 to-teal-500'
        },
        cancelled: {
            label: 'Dibatalkan',
            icon: XCircle,
            color: 'bg-red-100 text-red-700 border-red-200',
            gradient: 'from-red-500 to-rose-500'
        }
    }
    return config[status]
}

const OrderCard = ({ 
    order, 
    onStatusChange, 
    processing,
    showActions = false,
    showCompleteButton = false 
}: { 
    order: Order
    onStatusChange: (id: number, status: string) => void
    processing: number | null
    showActions?: boolean
    showCompleteButton?: boolean
}) => {
    const statusConfig = getStatusConfig(order.status)
    const StatusIcon = statusConfig.icon
    const totalItems = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-stone-200">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl">
                            {order.table_number}
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                Meja {order.table_number}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-0.5">
                                <Clock className="h-3 w-3" />
                                {new Date(order.created_at).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge className={`${statusConfig.color} border font-medium`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Order Items */}
                    <div className="bg-stone-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-stone-600">Pesanan:</span>
                            <span className="text-xs text-stone-500">{totalItems} item</span>
                        </div>
                        <div className="space-y-1.5">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-stone-700">
                                        {item.quantity}x {item.food_name}
                                    </span>
                                    <span className="text-stone-500 font-medium">
                                        {formatCurrency(item.subtotal)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                        <span className="font-semibold text-stone-700">Total</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            {formatCurrency(order.total_price)}
                        </span>
                    </div>

                    {/* Actions */}
                    {(showActions || showCompleteButton) && (
                        <div className="flex gap-2 pt-2">
                            {showActions && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() => onStatusChange(order.id, 'processing')}
                                        disabled={processing === order.id}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                                    >
                                        <Package className="h-4 w-4 mr-1" />
                                        Proses
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onStatusChange(order.id, 'cancelled')}
                                        disabled={processing === order.id}
                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Batal
                                    </Button>
                                </>
                            )}
                            {showCompleteButton && (
                                <Button
                                    size="sm"
                                    onClick={() => onStatusChange(order.id, 'completed')}
                                    disabled={processing === order.id}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Selesai
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const OrderSection = ({ 
    title, 
    icon: Icon, 
    orders, 
    gradient,
    showActions = false,
    showCompleteButton = false,
    onStatusChange,
    processing,
}: { 
    title: string
    icon: any
    orders: Order[]
    gradient: string
    showActions?: boolean
    showCompleteButton?: boolean
    onStatusChange: (id: number, status: string) => void
    processing: number | null
}) => {
    if (orders.length === 0) {
        return (
            <Card className="border-dashed border-2 border-stone-200">
                <CardContent className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-stone-100 rounded-full">
                            <Icon className="h-6 w-6 text-stone-400" />
                        </div>
                        <p className="text-stone-500">Tidak ada pesanan</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient}`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-stone-800">{title}</h2>
                <Badge variant="secondary" className="ml-2">
                    {orders.length}
                </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={onStatusChange}
                        processing={processing}
                        showActions={showActions}
                        showCompleteButton={showCompleteButton}
                    />
                ))}
            </div>
        </div>
    )
}

export default function Orders() {
    const { orders, store, today } = usePage().props as Props
    const [processing, setProcessing] = useState<number | null>(null)
    const [activeTab, setActiveTab] = useState<string>('pending')

    const todayFormatted = new Date(today).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const pending = orders.filter(o => o.status === 'pending')
    const processingOrders = orders.filter(o => o.status === 'processing')
    const completed = orders.filter(o => o.status === 'completed')
    const cancelled = orders.filter(o => o.status === 'cancelled')

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

    const summaryCards = [
        {
            title: 'Total Pesanan',
            value: orders.length,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50'
        },
        {
            title: 'Menunggu',
            value: pending.length,
            icon: Clock,
            gradient: 'from-amber-500 to-orange-500',
            bgGradient: 'from-amber-50 to-orange-50'
        },
        {
            title: 'Diproses',
            value: processingOrders.length,
            icon: Package,
            gradient: 'from-indigo-500 to-purple-500',
            bgGradient: 'from-indigo-50 to-purple-50'
        },
        {
            title: 'Selesai',
            value: completed.length,
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-teal-500',
            bgGradient: 'from-emerald-50 to-teal-50'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                Manajemen Pesanan
                            </h1>
                            <div className="flex items-center gap-2 mt-2 text-stone-500">
                                <StoreIcon className="h-4 w-4" />
                                <span className="font-medium">{store.name}</span>
                                <span className="text-stone-300">•</span>
                                <Calendar className="h-4 w-4" />
                                <span>{todayFormatted}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {summaryCards.map((card, index) => (
                        <Card key={index} className={`bg-gradient-to-r ${card.bgGradient} border-0 shadow-sm`}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-stone-600 mb-1">{card.title}</p>
                                        <p className="text-3xl font-bold text-stone-800">{card.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient}`}>
                                        <card.icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs for different order statuses */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white shadow-sm border border-stone-200 p-1">
                        <TabsTrigger value="pending" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
                            <Clock className="h-4 w-4 mr-2" />
                            Menunggu
                            {pending.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-amber-200 text-amber-800">
                                    {pending.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="processing" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                            <Package className="h-4 w-4 mr-2" />
                            Diproses
                            {processingOrders.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-blue-200 text-blue-800">
                                    {processingOrders.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selesai
                            {completed.length > 0 && (
                                <Badge variant="secondary" className="ml-2 bg-emerald-200 text-emerald-800">
                                    {completed.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-6">
                        <OrderSection
                            title="Pesanan Menunggu"
                            icon={Clock}
                            orders={pending}
                            gradient="from-amber-500 to-orange-500"
                            showActions
                            onStatusChange={handleUpdateStatus}
                            processing={processing}
                        />
                    </TabsContent>

                    <TabsContent value="processing" className="space-y-6">
                        <OrderSection
                            title="Pesanan Diproses"
                            icon={Package}
                            orders={processingOrders}
                            gradient="from-blue-500 to-indigo-500"
                            showCompleteButton
                            onStatusChange={handleUpdateStatus}
                            processing={processing}
                        />
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-6">
                        <OrderSection
                            title="Riwayat Pesanan Selesai"
                            icon={CheckCircle}
                            orders={completed}
                            gradient="from-emerald-500 to-teal-500"
                            onStatusChange={handleUpdateStatus}
                            processing={processing}
                        />
                    </TabsContent>
                </Tabs>

                {/* Show cancelled orders in a separate section */}
                {cancelled.length > 0 && (
                    <div className="mt-8">
                        <details className="group">
                            <summary className="flex items-center gap-2 cursor-pointer text-stone-500 hover:text-stone-700 transition-colors">
                                <XCircle className="h-4 w-4" />
                                <span className="font-medium">Pesanan Dibatalkan ({cancelled.length})</span>
                                <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {cancelled.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            onStatusChange={handleUpdateStatus}
                                            processing={processing}
                                        />
                                    ))}
                                </div>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    )
}