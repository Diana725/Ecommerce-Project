<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    public function store(Request $request)
    {
        // Ensure the farmer is authenticated
        $farmer = $request->user();
        if (!$farmer) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Validate the incoming request data
        $validatedData = $request->validate([
            'phone_number' => 'required|string',
            'county' => 'required|string',
        ]);

        // Create a new prediction entry
        $prediction = Prediction::create([
            'phone_number' => $validatedData['phone_number'],
            'county' => $validatedData['county'],
            'is_enabled' => true, // Default to enabled
            'farmer_id' => $farmer->id,
        ]);

        return response()->json([
            'message' => 'Preferences saved successfully.',
            'prediction' => $prediction,
        ]);
    }

    public function toggleIsEnabled(Request $request)
    {
        // Ensure the farmer is authenticated
        $farmer = $request->user();
        if (!$farmer) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Validate the incoming request
        $validatedData = $request->validate([
            'is_enabled' => 'required|boolean',
        ]);

        // Find the prediction record for the authenticated farmer
        $prediction = Prediction::where('farmer_id', $farmer->id)->firstOrFail();

        // Update only the is_enabled field
        $prediction->update(['is_enabled' => $validatedData['is_enabled']]);

        return response()->json([
            'message' => 'Notification preference updated successfully.',
            'prediction' => $prediction,
        ]);
    }
    public function getEnabledPreferences()
    {
        $enabledPreferences = Prediction::where('is_enabled', 1)->get(['phone_number', 'county']);

        return response()->json([
            'message' => 'Enabled preferences retrieved successfully.',
            'data' => $enabledPreferences
        ]);
    }
}
