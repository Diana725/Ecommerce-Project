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
        
    ];
    

    // Relationship with the User model (Farmer)
    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }
    
    public function deliveryLocations()
    {
        return $this->hasMany(DeliveryLocation::class, 'zone_id');
    }
}

