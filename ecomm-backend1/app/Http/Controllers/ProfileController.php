<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfileController extends Controller
{
    // Show the profile of the authenticated farmer
    public function showProfile(Request $request)
    {
        // Get the authenticated user
        $farmer = $request->user(); // Auth::user() if token-based auth is being used

        // Load delivery zones and locations
        $deliveryZones = $farmer->deliveryZones()->with('deliveryLocations')->get();

        // Prepare profile data
        $profileData = [
            'name' => $farmer->name,
            'email' => $farmer->email,
            'phone' => $farmer->phone,
            'photo' => $farmer->file_path ? url('storage/' . $farmer->file_path) : url('path_to_default_avatar/default-avatar.png'), // Handle photo
            'delivery_zones' => $deliveryZones // Display delivery zones and locations
        ];

        return response()->json($profileData, 200);
    }

    // Update the farmer profile
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $request->user()->id, // Check for unique email except for the current user
            'phone' => 'required|string|max:15',
            'photo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048', // Handle photo upload (optional)
        ]);

        // Get the authenticated farmer
        $farmer = $request->user();

        // Update farmer's profile details
        $farmer->name = $request->input('name');
        $farmer->email = $request->input('email');
        $farmer->phone = $request->input('phone');

        // Handle photo upload if provided
        if ($request->hasFile('photo')) {
            // Delete the old photo if it exists
            if ($farmer->file_path) {
                Storage::delete('public/' . $farmer->file_path);
            }

            // Store the new photo
            $path = $request->file('photo')->store('profile_photos', 'public');
            $farmer->file_path = $path;
        }

        // Save the updated farmer information
        $farmer->save();

        return response()->json(['message' => 'Profile updated successfully'], 200);
    }
}

