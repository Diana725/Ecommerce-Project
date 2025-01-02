<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Allow mass assignment of these fields, including file_path for profile photo
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'file_path',  // Add this to allow profile photo updates
        'email_verification_token',
        'is_verified',
    ];

    // Hide sensitive fields
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relationship with messages
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    // Relationship with delivery zones (farmer-specific)
    public function deliveryZones()
    {
        return $this->hasMany(FarmerDeliveryZone::class, 'farmer_id');
    }

    // Accessor for photo URL (optional but useful for clean code)
    public function getPhotoUrlAttribute()
    {
        // If the file_path exists, return the full URL, otherwise return a default image URL
        return $this->file_path ? url('storage/' . $this->file_path) : url('storage/app/public/images/default-avatar.jpeg');
    }
}
