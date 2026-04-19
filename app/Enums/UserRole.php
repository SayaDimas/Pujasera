<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN_PUJASERA = 'admin_pujasera';
    case KARYAWAN_TOKO = 'karyawan_toko';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN_PUJASERA => 'Admin Pujasera',
            self::KARYAWAN_TOKO => 'Karyawan Toko',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::ADMIN_PUJASERA => 'Mengelola semua toko dan sistem',
            self::KARYAWAN_TOKO => 'Mengelola toko individual',
        };
    }

    public static function isAdmin(self $role): bool
    {
        return $role === self::ADMIN_PUJASERA;
    }

    public static function isStoreEmployee(self $role): bool
    {
        return $role === self::KARYAWAN_TOKO;
    }
}
