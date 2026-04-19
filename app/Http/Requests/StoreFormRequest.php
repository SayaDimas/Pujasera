<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->role?->value === 'admin_pujasera';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Get the route parameter - could be Team model or string from URL
        $routeParam = $this->route('store');
        
        // Safely extract ID
        $storeId = null;
        if ($routeParam instanceof \App\Models\Team) {
            $storeId = $routeParam->id;
        } elseif (is_numeric($routeParam)) {
            $storeId = (int) $routeParam;
        }

        $rules = [
            'store_number' => [
                'required',
                'string',
                $storeId ? "unique:teams,store_number,{$storeId}" : 'unique:teams,store_number',
                'max:20',
            ],
            'name' => ['required', 'string', 'max:255'],
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_email' => [
                'required',
                'email:rfc,dns',
            ],
        ];

        // For email, we need to check if editing
        if ($storeId) {
            // Get the store owner's current email
            $store = \App\Models\Team::find($storeId);
            $owner = $store?->members()
                ->wherePivot('role', 'owner')
                ->first();

            // Allow current email or unique email
            $rules['owner_email'][] = "unique:users,email,{$owner?->id}";
        } else {
            // For creation, email must be unique
            $rules['owner_email'][] = 'unique:users,email';
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'store_number.required' => 'Nomor toko harus diisi',
            'store_number.unique' => 'Nomor toko sudah ada',
            'name.required' => 'Nama toko harus diisi',
            'owner_name.required' => 'Nama user toko harus diisi',
            'owner_email.required' => 'Email user toko harus diisi',
            'owner_email.email' => 'Email tidak valid',
            'owner_email.unique' => 'Email sudah terdaftar',
        ];
    }
}

