<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerMessage extends Model
{
    use HasFactory;

    // Table associated with the model
    protected $table = 'seller_messages';

    // Fields that are mass assignable
    protected $fillable = [
        'buyer_id',
        'seller_id',
        'product_id',
        'message',
        'created_at',
        'updated_at',
    ];

    // Relationships
    public function buyer()
    {
        return $this->belongsTo(Buyer::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
