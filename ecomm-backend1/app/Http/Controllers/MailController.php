<?php

namespace App\Http\Controllers;

use App\Mail\BuyerMessageMail;
use App\Models\Product;
use App\Models\Buyer; // Assuming this model exists for buyers
use App\Models\User;   // Model for farmers (sellers)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function sendBuyerMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'product_id' => 'required|exists:products,id',
        ]);

        $buyer = Auth::guard('buyer')->user();

        
        $product = Product::findOrFail($request->product_id);
        $farmer = User::findOrFail($product->user_id); 

        Mail::to($farmer->email)->send(new BuyerMessageMail($request->message, $buyer, $product));

        return response()->json(['message' => 'Email sent to the farmer'], 200);
    }
}
