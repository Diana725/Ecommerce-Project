<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'zone_id',
        'location_name',
        'delivery_fee',
    ];

    // Relationship with the FarmerDeliveryZone model
    public function zone()
    {
        return $this->belongsTo(FarmerDeliveryZone::class, 'zone_id');
    }
}
