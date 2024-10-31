<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('farmer_delivery_zones', function (Blueprint $table) {
            $table->dropColumn(['min_distance', 'max_distance']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farmer_delivery_zones', function (Blueprint $table) {
            $table->decimal('min_distance', 8, 2)->nullable();
            $table->decimal('max_distance', 8, 2)->nullable();
        });
    }
};
