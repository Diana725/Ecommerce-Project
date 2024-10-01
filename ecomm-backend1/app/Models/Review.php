<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = ['order_payment_id', 'buyer_id', 'review', 'rating'];

    public function orderPayment()
    {
        return $this->belongsTo(OrderPayment::class);
    }

    public function buyer()
    {
        return $this->belongsTo(Buyer::class);
    }

    public function product()
    {
        return $this->hasOneThrough(Product::class, OrderPayment::class, 'id', 'id', 'order_payment_id', 'product_id');
    }
}
