<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'email_verification_token',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function messages()
{
    return $this->hasMany(Message::class);
}
public function deliveryZones()
{
    return $this->hasMany(FarmerDeliveryZone::class, 'farmer_id');
}
}
