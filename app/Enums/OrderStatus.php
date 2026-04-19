<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pesanan Masuk',
            self::Processing => 'Menunggu',
            self::Completed => 'Selesai',
            self::Cancelled => 'Dibatalkan',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::Pending => '🔴',
            self::Processing => '🟡',
            self::Completed => '🟢',
            self::Cancelled => '⚫',
        };
    }

    public function badge(): string
    {
        return match ($this) {
            self::Pending => 'bg-red-100 text-red-800',
            self::Processing => 'bg-yellow-100 text-yellow-800',
            self::Completed => 'bg-green-100 text-green-800',
            self::Cancelled => 'bg-gray-100 text-gray-800',
        };
    }
}
