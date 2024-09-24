<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Store a message from the farmer (seller) to the buyer (insert into buyer_messages table).
     */
    public function storeSellerMessage(Request $request)
    {
        // Get authenticated farmer (seller)
        $seller = Auth::guard('sanctum')->user();

        // Validate request data
        $request->validate([
            'message' => 'required|string',
            'buyer_id' => 'required|exists:buyers,id', // Ensure the buyer exists in buyers table
            'product_id' => 'required|exists:products,id',
        ]);

        // Insert the seller's message into the buyer_messages table
        DB::table('buyer_messages')->insert([
            'seller_id' => $seller->id,
            'buyer_id' => $request->buyer_id,
            'product_id' => $request->product_id,
            'message' => $request->message,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Message sent to buyer'], 201);
    }

    /**
     * Store a message from the buyer to the farmer (insert into seller_messages table).
     */
    public function storeBuyerMessage(Request $request)
    {
        // Get authenticated buyer
        $buyer = Auth::guard('buyer')->user();

        // Validate request data
        $request->validate([
            'message' => 'required|string',
            'seller_id' => 'required|exists:users,id', // Ensure the seller exists in users table
            'product_id' => 'required|exists:products,id',
        ]);

        // Insert the buyer's message into the seller_messages table
        DB::table('seller_messages')->insert([
            'buyer_id' => $buyer->id,
            'seller_id' => $request->seller_id,
            'product_id' => $request->product_id,
            'message' => $request->message,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Message sent to seller'], 201);
    }

    /**
     * Get all messages sent from the seller to the buyer (fetch from buyer_messages table).
     */
    public function getBuyerMessages($buyerId)
    {
        // Get authenticated buyer
        $buyer = Auth::guard('buyer')->user();

        // Check if the buyer is retrieving their own messages
        if ($buyer->id != $buyerId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Fetch all messages sent to the buyer from the seller
        $messages = DB::table('buyer_messages')
            ->where('buyer_id', $buyer->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Get all messages sent from the buyer to the seller (fetch from seller_messages table).
     */
    public function getSellerMessages($sellerId)
    {
        // Get authenticated seller
        $seller = Auth::guard('sanctum')->user();

        // Check if the seller is retrieving their own messages
        if ($seller->id != $sellerId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Fetch all messages sent to the seller from the buyer
        $messages = DB::table('seller_messages')
            ->where('seller_id', $seller->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }
}
