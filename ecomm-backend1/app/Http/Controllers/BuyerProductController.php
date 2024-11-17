<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class BuyerProductController extends Controller
{
    // Method to fetch products for buyers
    public function index()
    {
        // Fetch products from the Product table
        $products = Product::select('id','name', 'price', 'quantity', 'file_path', 'payment_method','stock_status','description')->get();

        // Return products as JSON response
        return response()->json($products);
    }
    public function buyerProduct($id)
    {
        // $user = Auth::user();

        $product = Product::where('id', $id)->first();

        if ($product) {
            return response()->json($product);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }
}
