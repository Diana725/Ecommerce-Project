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
}
