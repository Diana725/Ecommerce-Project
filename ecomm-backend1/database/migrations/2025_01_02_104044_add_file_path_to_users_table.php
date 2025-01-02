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
    Schema::table('users', function (Blueprint $table) {
        $table->string('file_path')->nullable(); // Add a nullable string column for the file path
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('file_path'); // Drop the column if the migration is rolled back
    });
}

};
