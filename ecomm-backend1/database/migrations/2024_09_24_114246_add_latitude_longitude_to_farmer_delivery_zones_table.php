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
        Schema::table('farmer_delivery_zones', function (Blueprint $table) {
            // Adding latitude and longitude columns
            $table->decimal('latitude', 10, 8)->nullable(); // Latitude (10 digits total, 8 after the decimal)
            $table->decimal('longitude', 11, 8)->nullable(); // Longitude (11 digits total, 8 after the decimal)
        });
    }    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmer_delivery_zones', function (Blueprint $table) {
            // Dropping the latitude and longitude columns if the migration is rolled back
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
