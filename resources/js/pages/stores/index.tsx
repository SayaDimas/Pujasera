import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Edit2 } from 'lucide-react';

type Store = {
    id: number;
    name: string;
    slug: string;
    personal_team: boolean;
    created_at: string;
};

type Props = {
    stores: {
        data: Store[];
        links: any;
        meta: any;
    };
};

export default function StoresIndex({ stores }: Props) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <>
            <Head title="Kelola Toko" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
                <div className="w-full">
                    {/* Header with Add Button */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">
                                Kelola Toko
                            </h1>
                            <p className="mt-2 text-slate-600">
                                Manage semua toko Pujasera Anda
                            </p>
                        </div>
                        <Link
                            href="/stores/create"
                            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Tambah Toko
                        </Link>
                    </div>

                    {/* Stores Grid */}
                    {stores?.data && stores.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {stores.data.map((store) => (
                                <div
                                    key={store.id}
                                    className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                {store.name}
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Slug: {store.slug}
                                            </p>
                                        </div>
                                        {store.personal_team && (
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                                Personal
                                            </span>
                                        )}
                                    </div>

                                    <p className="mb-4 text-sm text-slate-600">
                                        Dibuat: {new Date(store.created_at).toLocaleDateString('id-ID')}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/stores/${store.id}/edit`}
                                            className="flex-1 inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                                        >
                                            <Edit2 className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Tidak ada toko
                            </h3>
                            <p className="mt-2 text-slate-600">
                                Mulai dengan membuat toko baru
                            </p>
                            <Link
                                href="/stores/create"
                                className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Toko Pertama
                            </Link>
                        </div>
                    )}

                    {/* Pagination Info */}
                    {stores?.meta?.total > 0 && (
                        <div className="mt-8 text-center text-sm text-slate-600">
                            Menampilkan {stores.data.length} dari {stores.meta.total} toko
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

StoresIndex.layout = (props: any) => ({
    breadcrumbs: [
        {
            title: 'Kelola Toko',
            href: '/stores',
        },
    ],
});
