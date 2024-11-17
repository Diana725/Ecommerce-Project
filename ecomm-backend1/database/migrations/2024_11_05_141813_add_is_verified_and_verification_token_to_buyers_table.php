<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsVerifiedAndVerificationTokenToBuyersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('buyers', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false); // Add the is_verified column
            $table->string('email_verification_token')->nullable(); // Add the email_verification_token column
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('buyers', function (Blueprint $table) {
            $table->dropColumn('is_verified'); // Remove the is_verified column
            $table->dropColumn('email_verification_token'); // Remove the email_verification_token column
        });
    }
}
