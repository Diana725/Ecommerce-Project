<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_payment_id')
                  ->constrained('order_payments') // References 'id' on 'order_payments'
                  ->onDelete('cascade');
            
            // Foreign key for the buyer, referencing the buyer_id in order_payments table
            $table->foreignId('buyer_id') 
                  ->constrained('buyers') // This references the 'id' column in the 'buyers' table
                  ->onDelete('cascade');

            $table->text('review');
            $table->integer('rating')->between(1, 5); // Rating out of 5
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}
