<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = ['team_id', 'table_number', 'total_price', 'status'];

    protected $casts = [
        'total_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'status' => OrderStatus::class,
    ];

    /**
     * Get the team (store) this order belongs to.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the items in this order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
