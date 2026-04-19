<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = [
    'team_id',
    'name',
    'price',
    'category',
    'description',
];
}
