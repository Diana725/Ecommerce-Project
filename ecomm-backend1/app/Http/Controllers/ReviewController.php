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

        $review = Review::create([
            'order_payment_id' => $request->order_payment_id,
            'buyer_id' => auth()->user()->id, // Get the buyer_id from authenticated user
            'review' => $request->review,
            'rating' => $request->rating,
        ]);

        return response()->json($review, 201);
    }
   
   
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'order_payment_id' => 'required|exists:order_payments,id',
    //         'review' => 'required|string|max:1000',
    //         'rating' => 'required|integer|between:1,5',
    //     ]);

    //     // Check if the review has already been submitted for this payment
    //     $orderPayment = OrderPayment::find($request->order_payment_id);
        
    //     if ($orderPayment->review_submitted) {
    //         return response()->json(['error' => 'Review already submitted for this order'], 400);
    //     }

    //     // Create the review
    //     Review::create([
    //         'order_payment_id' => $request->order_payment_id,
    //         'buyer_id' => auth()->id(),
    //         'review' => $request->review,
    //         'rating' => $request->rating,
    //     ]);

    //     // Mark the review as submitted in the order_payments table
    //     $orderPayment->review_submitted = true;
    //     $orderPayment->save();

    //     return response()->json(['message' => 'Review submitted successfully'], 201);
    // }

    public function getByProductId($productId)
{
    $reviews = Review::where('product_id', $productId)->get();
    return response()->json($reviews);
}

    // public function index($orderPaymentId)
    // {
    //     $reviews = Review::where('order_payment_id', $orderPaymentId)
    //         ->with('buyer', 'product')
    //         ->get();

    //     return response()->json($reviews);
    // }
}
