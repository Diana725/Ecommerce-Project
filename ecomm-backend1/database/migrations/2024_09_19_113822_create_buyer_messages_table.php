<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuyerMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('buyer_messages', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID (Primary Key)
            $table->unsignedBigInteger('buyer_id'); // ID of the buyer
            $table->unsignedBigInteger('seller_id'); // ID of the seller
            $table->unsignedBigInteger('product_id'); // ID of the product
            $table->text('message'); // Content of the message
            $table->timestamps(); // created_at and updated_at timestamps

            // Indexes
            $table->index('buyer_id');
            $table->index('seller_id');
            $table->index('product_id');

            // Foreign Keys
            $table->foreign('buyer_id')->references('id')->on('buyers')->onDelete('cascade');
            $table->foreign('seller_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('buyer_messages');
    }
}
