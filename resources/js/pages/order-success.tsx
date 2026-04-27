import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

interface Props {
    order_id: string;
}

export default function OrderSuccess({ order_id }: Props) {
    return (
        <>
            <Head title="Pesanan Berhasil" />

            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
                    <div className="text-6xl mb-4">✅</div>
                    
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Pesanan Berhasil Dibuat!
                    </h1>
                    
                    <p className="text-slate-600 mb-6">
                        Terima kasih telah memesan. Pesanan Anda sedang diproses.
                    </p>

                    <div className="bg-slate-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-slate-500 mb-1">Nomor Pesanan</p>
                        <p className="text-2xl font-bold text-slate-900">#{order_id}</p>
                    </div>

                    <p className="text-sm text-slate-600 mb-6">
                        Silakan tunggu pesanan Anda disiapkan. Kami akan memberitahu Anda ketika pesanan siap.
                    </p>

                    <Link
                        href="/"
                        className="inline-block bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                    >
                        Kembali ke Menu
                    </Link>
                </div>
            </div>
        </>
    );
}
