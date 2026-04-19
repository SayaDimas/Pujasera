import { Head, router } from '@inertiajs/react';
import { ChevronRight, ChevronLeft, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

type FormErrors = {
    store_number?: string[];
    name?: string[];
    owner_name?: string[];
    owner_email?: string[];
};

export default function StoresCreate() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState({
        store_number: '',
        name: '',
        owner_name: '',
        owner_email: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (step === 1) {
            // Validate step 1
            const stepErrors: FormErrors = {};
            if (!formData.store_number.trim()) {
                stepErrors.store_number = ['Nomor toko harus diisi'];
            }
            if (!formData.name.trim()) {
                stepErrors.name = ['Nama toko harus diisi'];
            }

            if (Object.keys(stepErrors).length > 0) {
                setErrors(stepErrors);
                return;
            }

            setStep(2);
            return;
        }

        // Final submit
        setLoading(true);

        router.post('/stores', formData, {
            onError: (pageErrors: any) => {
                setErrors(pageErrors);
                setLoading(false);
            },
        });
    };

    return (
        <>
            <Head title="Tambah Toko" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-2xl">
                    {/* Back Button */}
                    <Link
                        href="/stores"
                        className="mb-8 inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Kembali ke Daftar Toko
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900">
                            Tambah Toko Baru
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Step {step} dari 2
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8 w-full bg-slate-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                        {/* Step 1: Store Info */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-2">
                                        Nomor Toko
                                    </label>
                                    <input
                                        type="text"
                                        name="store_number"
                                        value={formData.store_number}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: TOKO-001"
                                        className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                                            errors.store_number
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                                        }`}
                                    />
                                    {errors.store_number && (
                                        <p className="mt-1 text-sm text-red-600">{errors.store_number[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-2">
                                        Nama Toko
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Toko Ragunan"
                                        className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                                            errors.name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Owner Info */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-6">
                                    <p className="text-sm text-blue-800">
                                        <strong>Toko:</strong> {formData.name} ({formData.store_number})<br />
                                        <strong>Password default:</strong> password
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-2">
                                        Nama User Toko
                                    </label>
                                    <input
                                        type="text"
                                        name="owner_name"
                                        value={formData.owner_name}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Budi Santoso"
                                        className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                                            errors.owner_name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                                        }`}
                                    />
                                    {errors.owner_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.owner_name[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-2">
                                        Email User Toko
                                    </label>
                                    <input
                                        type="email"
                                        name="owner_email"
                                        value={formData.owner_email}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: budi@toko.com"
                                        className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                                            errors.owner_email
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                                        }`}
                                    />
                                    {errors.owner_email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.owner_email[0]}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 pt-8">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="inline-flex items-center rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </button>
                            )}
                            {step === 1 && (
                                <Link
                                    href="/stores"
                                    className="inline-flex items-center rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </Link>
                            )}
                            {step === 1 && (
                                <button
                                    type="submit"
                                    className="ml-auto inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                >
                                    Lanjut
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </button>
                            )}
                            {step === 2 && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-auto inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            Buat Toko
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

StoresCreate.layout = (props: any) => ({
    breadcrumbs: [
        {
            title: 'Kelola Toko',
            href: '/stores',
        },
        {
            title: 'Tambah Baru',
            href: '#',
        },
    ],
});
