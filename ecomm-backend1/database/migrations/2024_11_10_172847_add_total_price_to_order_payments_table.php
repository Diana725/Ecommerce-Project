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
            $table->decimal('total_price', 10, 2)->after('delivery_location_id'); // Adds total_price column after the delivery_fee column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            $table->dropColumn('total_price');
        });
    }
};
