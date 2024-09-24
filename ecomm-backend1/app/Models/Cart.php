<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    // Define the table name if it's different from the pluralized form of the model name
    protected $table = 'carts';

    // Specify which columns are mass assignable
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    // Define the relationship to the User model
    public function buyer()
    {
        return $this->belongsTo(Buyer::class);
    }

    // Define the relationship to the Product model
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
