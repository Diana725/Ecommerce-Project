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
    Schema::table('order_payments', function (Blueprint $table) {
        // Add delivery_zone_id and delivery_location_id columns
        $table->unsignedBigInteger('delivery_zone_id')->nullable();
        $table->unsignedBigInteger('delivery_location_id')->nullable();

        // Add foreign key constraints
        $table->foreign('delivery_zone_id')->references('id')->on('farmer_delivery_zones');
        $table->foreign('delivery_location_id')->references('id')->on('delivery_locations');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::table('order_payments', function (Blueprint $table) {
        // Drop foreign key constraints first
        $table->dropForeign(['delivery_zone_id']);
        $table->dropForeign(['delivery_location_id']);

        // Then drop the columns
        $table->dropColumn('delivery_zone_id');
        $table->dropColumn('delivery_location_id');
    });
}

};
