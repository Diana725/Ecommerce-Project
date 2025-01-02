<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Product;

class ProfileController extends Controller
{
    // Show the profile of the authenticated farmer
    public function showProfile(Request $request)
    {
        // Get the authenticated user
        $farmer = $request->user();

        // Load delivery zones and locations
        $deliveryZones = $farmer->deliveryZones()->with('deliveryLocations')->get();

        // Prepare profile data
        $profileData = [
            'name' => $farmer->name,
            'email' => $farmer->email,
            'phone' => $farmer->phone,
            'photo' => $farmer->file_path ? url('storage/' . $farmer->file_path) : url('storage/app/public/images/default-avatar.jpeg'), // Handle photo path
            'delivery_zones' => $deliveryZones, // Display delivery zones and locations
        ];

        return response()->json($profileData, 200);
    }

    // Update the farmer profile
    public function updateProfile(Request $request)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $request->user()->id,
            'phone' => 'required|string|max:15',
            'photo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        // Get the authenticated farmer (user)
        $farmer = $request->user();

        // Update the farmer's profile details in the `users` table
        $farmer->name = $request->input('name');
        $farmer->email = $request->input('email');
        $farmer->phone = $request->input('phone');

        // Handle photo upload if provided
        if ($request->hasFile('photo')) {
            // Delete the old photo if it exists
            if ($farmer->file_path) {
                Storage::delete('public/' . $farmer->file_path);
            }

            // Store the new photo in 'public/profile_photos'
            $path = $request->file('photo')->store('profile_photos', 'public');
            $farmer->file_path = $path; // Update file path in the users table
        }

        // Save the updated farmer information in the `users` table
        $farmer->save();

        return response()->json(['message' => 'Profile updated successfully'], 200);
    }
    
    public function showFarmerProfile($productId)
    {
        // Fetch the product by the provided ID
        $product = Product::find($productId);

        // Check if the product exists
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Fetch the farmer (user) associated with this product
        $farmer = User::find($product->user_id);

        // Check if the farmer exists
        if (!$farmer) {
            return response()->json(['message' => 'Farmer not found'], 404);
        }

        // Load delivery zones and locations related to the farmer
        $deliveryZones = $farmer->deliveryZones()->with('deliveryLocations')->get();

        // Prepare the profile data to return
        $profileData = [
            'name' => $farmer->name,
            'email' => $farmer->email,
            'phone' => $farmer->phone,
            'photo' => $farmer->file_path ? url('storage/' . $farmer->file_path) : url('storage/app/public/images/default-avatar.jpeg'), // Farmer's photo or default
            'delivery_zones' => $deliveryZones, // Delivery zones and locations
        ];

        return response()->json($profileData, 200);
    }
}
