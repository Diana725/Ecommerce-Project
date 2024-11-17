<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'order_payment_id' => 'required|exists:order_payments,id',
        'review' => 'required|string|max:1000',
        'rating' => 'required|integer|between:1,5',
    ]);

    // Get the product_id from the order_payment
    $orderPayment = \App\Models\OrderPayment::find($request->order_payment_id);
    $product_id = $orderPayment->product_id; // Assuming product_id is in the order_payment table

    $review = Review::create([
        'order_payment_id' => $request->order_payment_id,
        'buyer_id' => auth()->user()->id,
        'product_id' => $product_id, // Include product_id here
        'review' => $request->review,
        'rating' => $request->rating,
    ]);

    $orderPayment->update(['review_submitted' => true]);

    return response()->json($review, 201);
}

   

public function getByProductId($productId)
{
    // Eager load the buyer relationship to include buyer's name
    $reviews = Review::where('product_id', $productId)
        ->with('buyer:id,name') // Assuming 'id' and 'name' are the fields in the 'buyers' table
        ->get();

    return response()->json($reviews);
}


}
