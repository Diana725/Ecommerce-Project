<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePredictionsTable extends Migration
{
    public function up()
    {
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number');
            $table->string('county');
            $table->foreignId('farmer_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_enabled')->default(1); // New column for enabling/disabling messages
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('predictions');
    }
}
