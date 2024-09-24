<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class FarmerDeliveryZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'zone_name',
        'min_distance',
        'max_distance',
        'delivery_fee',
        'latitude',
        'longitude',
    ];
    

    // Relationship with the User model (Farmer)
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }
}

