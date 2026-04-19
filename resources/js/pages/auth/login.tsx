import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

function Login({
    status = '',
    canResetPassword,
    canRegister,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Login" />

            {/* ROOT */}
            <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4">

                {/* CONTAINER */}
                <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">

                    {/* LEFT (HIDDEN ON MOBILE) */}
                    <div className="hidden lg:flex flex-col justify-between bg-[#0d1117] text-white p-10 relative">
                        
                        {/* Glow */}
                        <div className="absolute -top-16 -right-16 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"></div>

                        {/* BRAND */}
                        <div className="flex items-center gap-3 z-10">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                🍽️
                            </div>
                            <span className="text-lg font-semibold">Pujasera</span>
                        </div>

                        {/* CONTENT */}
                        <div className="z-10">
                            <h1 className="text-3xl font-bold leading-snug mb-3">
                                Kelola bisnis kuliner lebih cerdas
                            </h1>
                            <p className="text-sm text-white/60 mb-6">
                                Satu platform untuk semua toko dan laporan real-time
                            </p>

                            <div className="space-y-4 text-sm">
                                <div className="bg-white/5 p-3 rounded-lg">
                                    Kelola semua toko dalam satu dashboard
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    Monitor pendapatan secara real-time
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    Kelola menu & user dengan mudah
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-white/30 z-10">
                            © 2026 Pujasera
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">

                        <h2 className="text-2xl font-bold mb-1">
                            Selamat datang
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Masuk ke akun Anda
                        </p>

                        {status && (
                            <div className="mb-4 text-sm text-green-600">
                                ✓ {status}
                            </div>
                        )}

                        <Form
                            method="post"
                            action="/login"
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* EMAIL */}
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="nama@email.com"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* PASSWORD */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <Label>Password</Label>
                                            {canResetPassword && (
                                                <a href={request()} className="text-orange-600 text-xs">
                                                    Lupa?
                                                </a>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-2 text-sm text-gray-400"
                                            >
                                                👁️
                                            </button>
                                        </div>

                                        <InputError message={errors.password} />
                                    </div>

                                    {/* REMEMBER */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Checkbox name="remember" value="1" />
                                        <span>Ingat saya</span>
                                    </div>

                                    {/* BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-orange-600 hover:bg-orange-700"
                                    >
                                        {processing ? (
                                            <div className="flex gap-2 items-center justify-center">
                                                <Spinner />
                                                Loading...
                                            </div>
                                        ) : (
                                            'Masuk'
                                        )}
                                    </Button>

                                    {/* REGISTER */}
                                    {canRegister && (
                                        <p className="text-center text-sm">
                                            Belum punya akun?{' '}
                                            <a href="/register" className="text-orange-600 font-semibold">
                                                Daftar
                                            </a>
                                        </p>
                                    )}
                                </>
                            )}
                        </Form>
                    </div>

                </div>
            </div>
        </>
    );
}

// Disable default AuthLayout wrapper - use full width instead
Login.layout = () => null;

export default Login;