<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('buyer_id')->nullable(); // Foreign key for buyer
            $table->string('buyer_type')->nullable(); // Type for buyer model
            $table->unsignedBigInteger('user_id')->nullable(); // Foreign key for user (farmer)
            $table->string('user_type')->nullable(); // Type for user model
            $table->unsignedBigInteger('product_id');
            $table->text('message');
            $table->timestamps();

            // Foreign keys (assuming buyers and users tables exist)
            $table->foreign('buyer_id')->references('id')->on('buyers')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('messages');
    }
}
