import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
// import { store } from '@/routes/register'; // Disabled - registration only through store creation
import { usePage } from '@inertiajs/react';

function Register() {
    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4">
                
                <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">

                    {/* LEFT */}
                    <div className="hidden lg:flex flex-col justify-between bg-[#0d1117] text-white p-10 relative">
                        
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
                                Mulai kelola bisnis Anda
                            </h1>
                            <p className="text-sm text-white/60 mb-6">
                                Buat akun dan mulai mengelola toko, menu, dan penjualan Anda
                            </p>

                            <div className="space-y-4 text-sm">
                                <div className="bg-white/5 p-3 rounded-lg">
                                    Sistem terintegrasi untuk semua toko
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    Pantau performa bisnis secara real-time
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    Kelola user & akses dengan mudah
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
                            Buat akun baru
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Isi data untuk membuat akun
                        </p>

                        <Form
                            method="post"
                            action="/register"
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* NAME */}
                                    <div>
                                        <Label>Nama</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            placeholder="Nama lengkap"
                                            required
                                            autoFocus
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="email@example.com"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* PASSWORD */}
                                    <div>
                                        <Label>Password</Label>
                                        <PasswordInput
                                            name="password"
                                            placeholder="Password"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* CONFIRM PASSWORD */}
                                    <div>
                                        <Label>Konfirmasi Password</Label>
                                        <PasswordInput
                                            name="password_confirmation"
                                            placeholder="Ulangi password"
                                            required
                                        />
                                        <InputError message={errors.password_confirmation} />
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
                                            'Buat Akun'
                                        )}
                                    </Button>

                                    {/* LOGIN LINK */}
                                    <p className="text-center text-sm">
                                        Sudah punya akun?{' '}
                                        <TextLink
                                            href={login()}
                                            className="text-orange-600 font-semibold"
                                        >
                                            Login
                                        </TextLink>
                                    </p>
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
Register.layout = () => null;

export default Register;