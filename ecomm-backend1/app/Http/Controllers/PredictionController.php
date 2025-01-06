<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'phone_number' => 'required|string',
            'county' => 'required|string',
            'is_enabled' => 'required|boolean',
        ]);

        // Create a new prediction entry with all necessary fields
        $prediction = Prediction::create([
            'phone_number' => $validatedData['phone_number'],
            'county' => $validatedData['county'],
            'is_enabled' => $validatedData['is_enabled'],
            'farmer_id' => auth()->id(), // Assuming the farmer is authenticated
        ]);

        return response()->json([
            'message' => 'Preferences saved successfully.',
            'prediction' => $prediction,
        ]);
    }

    public function toggleIsEnabled(Request $request)
{
    // Validate the incoming request
    $validatedData = $request->validate([
        'is_enabled' => 'required|boolean',
    ]);

    // Find the prediction record for the authenticated farmer
    $prediction = Prediction::where('farmer_id', auth()->id())->firstOrFail();

    // Update only the is_enabled field
    $prediction->update(['is_enabled' => $validatedData['is_enabled']]);

    return response()->json([
        'message' => 'Notification preference updated successfully.',
        'prediction' => $prediction,
    ]);
}

}
