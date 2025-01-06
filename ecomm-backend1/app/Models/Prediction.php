<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    use HasFactory;

    // Define the table if it's not the plural of the model name
    protected $table = 'predictions'; 

    // Define which fields can be mass-assigned
    protected $fillable = ['phone_number', 'county', 'farmer_id', 'is_enabled']; // Add 'is_enabled' here
}
