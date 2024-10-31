<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropDeliveryFeeFromFarmerDeliveryZonesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('farmer_delivery_zones', function (Blueprint $table) {
            $table->dropColumn('delivery_fee');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('farmer_delivery_zones', function (Blueprint $table) {
            $table->decimal('delivery_fee', 8, 2)->nullable(); // Adjust as necessary
        });
    }
}
