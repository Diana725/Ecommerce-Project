<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Import the HasApiTokens trait

class Buyer extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // Use the trait here

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_verified', // Add this if you want to allow mass assignment
        'email_verification_token', // Add this if you want to allow mass assignment
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function messages()
    {
        return $this->hasMany(Message::class, 'buyer_id'); // Define the foreign key as buyer_id
    }
}
