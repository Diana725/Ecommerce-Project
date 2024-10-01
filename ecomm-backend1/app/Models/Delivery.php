<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'farmer_id',
        'buyer_id',
        'payment_id',
        'status',
        'delivery_service',
        'tracking_number',
        'delivered_at',
    ];

    // Define relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function farmer()
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    public function buyer()
    {
        return $this->belongsTo(Buyer::class, 'buyer_id');
    }
    public function orderPayment()
    {
        return $this->belongsTo(OrderPayment::class, 'payment_id');
    }
}

