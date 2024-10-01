<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddReviewSubmittedToOrderPaymentsTable extends Migration
{
    public function up()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            $table->boolean('review_submitted')->default(false)->after('delivery_status'); 
            // You can change 'after' to a suitable column depending on your table structure
        });
    }

    public function down()
    {
        Schema::table('order_payments', function (Blueprint $table) {
            $table->dropColumn('review_submitted');
        });
    }
}
