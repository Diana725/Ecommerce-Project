<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // Display the buyer's cart items
    public function index()
    {
        $buyerId = Auth::guard('buyer')->id(); // Get the authenticated buyer ID
        $cartItems = Cart::where('user_id', $buyerId)->with('product')->get(); // Fetch cart items with product details

        return response()->json($cartItems);
    }

    // Add a product to the cart
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $buyerId = Auth::guard('buyer')->id(); // Get the authenticated buyer ID
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1); // Default quantity is 1 if not provided

        // Check if the cart item already exists
        $cartItem = Cart::where('user_id', $buyerId)
                        ->where('product_id', $productId)
                        ->first();

        if ($cartItem) {
            // Update the quantity if it already exists
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            // Create a new cart item
            Cart::create([
                'user_id' => $buyerId,
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        }

        return response()->json(['message' => 'Product added to cart successfully']);
    }

    // Remove a product from the cart
    public function removeFromCart($productId)
    {
        $buyerId = Auth::guard('buyer')->id(); // Get the authenticated buyer ID

        $cartItem = Cart::where('user_id', $buyerId)
                        ->where('product_id', $productId)
                        ->first();

        if ($cartItem) {
            $cartItem->delete();
            return response()->json(['message' => 'Product removed from cart successfully']);
        }

        return response()->json(['message' => 'Product not found in cart'], 404);
    }

    // Update the quantity of a product in the cart
    public function updateCart(Request $request, $productId)
    {
        $buyerId = Auth::guard('buyer')->id(); // Get the authenticated buyer ID
        $quantity = $request->input('quantity');

        $cartItem = Cart::where('user_id', $buyerId)
                        ->where('product_id', $productId)
                        ->first();

        if ($cartItem) {
            $cartItem->quantity = $quantity;
            $cartItem->save();
            return response()->json(['message' => 'Cart updated successfully']);
        }

        return response()->json(['message' => 'Product not found in cart'], 404);
    }
}
