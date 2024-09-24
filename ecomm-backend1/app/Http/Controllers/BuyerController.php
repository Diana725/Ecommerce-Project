<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Buyer;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class BuyerController extends Controller
{
    // Buyer Registration function
    public function buyerRegistration(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:buyers', // Ensure unique email in buyers table
            'password' => 'required|string|min:5',
        ]);

        if (Buyer::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'User already registered'
            ], 400);
        }

        $buyer = Buyer::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create a token for the newly registered buyer using the 'buyer' guard
        $token = $buyer->createToken('auth_token', ['buyer'])->plainTextToken;

        return response()->json([
            'user' => $buyer,
            'token' => $token,
        ]);
    }

    // Buyer Login function
    public function buyerLogin(Request $request)
{
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    // Manually authenticate the buyer
    $buyer = Buyer::where('email', $request->email)->first();

    if (!$buyer || !Hash::check($request->password, $buyer->password)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    // Create a Sanctum token
    $token = $buyer->createToken('auth_token')->plainTextToken;

    return response()->json([
        'buyer' => $buyer,
        'token' => $token,
    ]);
}
    public function searchProducts(Request $request)
    {
        $query = $request->input('query');
        
        if (!$query) {
            return response()->json([
                'message' => 'Search query is required'
            ], 400);
        }
        $products = Product::where('name', 'like', "%$query%")->get();

        return response()->json([
            'products' => $products
        ]);
    }
}
