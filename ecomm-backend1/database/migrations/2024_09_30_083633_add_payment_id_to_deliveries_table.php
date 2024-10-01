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
    Schema::table('deliveries', function (Blueprint $table) {
        $table->unsignedBigInteger('payment_id')->after('id')->nullable(); // Add payment_id column

        // Add foreign key constraint if necessary
        $table->foreign('payment_id')->references('id')->on('order_payments')->onDelete('cascade');
    });
}

public function down()
{
    Schema::table('deliveries', function (Blueprint $table) {
        $table->dropForeign(['payment_id']); // Drop foreign key constraint
        $table->dropColumn('payment_id'); // Remove payment_id column
    });
}
};
