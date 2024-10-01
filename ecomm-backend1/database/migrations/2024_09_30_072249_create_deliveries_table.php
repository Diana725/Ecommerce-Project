<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeliveriesTable extends Migration
{
    public function up()
    {
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('farmer_id');
            $table->unsignedBigInteger('buyer_id');
            $table->enum('status', ['pending', 'shipped', 'delivered', 'canceled'])->default('pending');
            $table->string('delivery_service')->nullable();
            $table->string('tracking_number')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('farmer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('buyer_id')->references('id')->on('buyers')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('deliveries');
    }
}
