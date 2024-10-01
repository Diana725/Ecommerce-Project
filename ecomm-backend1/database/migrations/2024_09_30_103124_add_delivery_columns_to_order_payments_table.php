<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeliveryColumnsToOrderPaymentsTable extends Migration
{
    public function up()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            // Adding new delivery-related columns
            $table->enum('delivery_status', ['Pending', 'Shipped', 'Delivered', 'Canceled'])->default('Pending')->after('status');
            $table->string('tracking_number')->nullable()->after('delivery_status');
            $table->string('delivery_service')->nullable()->after('tracking_number');
        });
    }

    public function down()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            // Dropping the new columns in case of rollback
            $table->dropColumn('delivery_status');
            $table->dropColumn('tracking_number');
            $table->dropColumn('delivery_service');
        });
    }
}
