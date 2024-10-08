<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id(); // Creates an 'id' column as the primary key
            $table->unsignedBigInteger('user_id'); // Creates a 'user_id' column
            $table->unsignedBigInteger('product_id'); // Creates a 'product_id' column
            $table->integer('quantity')->default(1); // Creates a 'quantity' column with default value 1
            $table->timestamps(); // Creates 'created_at' and 'updated_at' columns

            // Add foreign key constraints
            $table->foreign('user_id')->references('id')->on('buyers')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('carts');
    }
}
