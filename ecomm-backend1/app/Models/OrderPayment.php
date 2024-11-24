<?php

// app/Models/OrderPayment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'farmer_id',
        'product_id',
        'payment_reference',
        'proof_of_payment',
        'status',
        'delivery_status',  // New field
        'review_submitted',
        'tracking_number',  // New field
        'delivery_service',  // New field
        'delivery_zone_id',
        'delivery_location_id',
        'total_price',
        'phone_number',
        'quantity',
    ];

    public function buyer()
    {
        return $this->belongsTo(Buyer::class, 'buyer_id');
    }

    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function review()
    {
        return $this->belongsTo(Review::class, 'review_id');
    }
    public function deliveryZone()
    {
        return $this->belongsTo(FarmerDeliveryZone::class, 'delivery_zone_id');
    }

    public function deliveryLocation()
    {
        return $this->belongsTo(DeliveryLocation::class, 'delivery_location_id');
    }
}
