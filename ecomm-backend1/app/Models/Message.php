<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id', 'buyer_type', 'user_id', 'user_type', 'product_id', 'message'
    ];

    // Relationship to buyer
    public function buyer()
    {
        return $this->belongsTo(Buyer::class, 'buyer_id');
    }

    // Relationship to user (farmer)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship to product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
