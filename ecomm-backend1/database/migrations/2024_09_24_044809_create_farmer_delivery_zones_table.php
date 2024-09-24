<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('farmer_delivery_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('farmer_id');
            $table->string('zone_name');  // Example: "Local", "Within 50km"
            $table->decimal('min_distance', 8, 2);  // Minimum distance for zone (in km)
            $table->decimal('max_distance', 8, 2);  // Maximum distance for zone (in km)
            $table->decimal('delivery_fee', 10, 2); // Delivery fee for the zone
            $table->timestamps();
    
            // Foreign key relation with users table (farmers)
            $table->foreign('farmer_id')->references('id')->on('users')->onDelete('cascade');
        });
    }    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farmer_delivery_zones');
    }
};
