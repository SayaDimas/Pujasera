<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public customers can create orders
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'team_id' => ['required', 'integer', 'exists:teams,id'],
            'table_number' => ['nullable', 'integer', 'min:1'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_id' => ['required', 'integer', 'exists:menus,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.name' => ['required', 'string', 'max:255'],
            'total_price' => ['required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'team_id.required' => 'Pilih toko terlebih dahulu',
            'team_id.exists' => 'Toko tidak ditemukan',
            'items.required' => 'Pesan harus memiliki minimal 1 item',
            'items.min' => 'Pesan harus memiliki minimal 1 item',
            'items.*.menu_id.required' => 'Menu ID diperlukan',
            'items.*.menu_id.exists' => 'Menu tidak ditemukan',
            'items.*.quantity.required' => 'Jumlah diperlukan',
            'items.*.quantity.min' => 'Jumlah minimal 1',
        ];
    }
}
