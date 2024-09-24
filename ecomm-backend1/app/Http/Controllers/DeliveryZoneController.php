<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FarmerDeliveryZone;
use Illuminate\Support\Facades\Auth;

class DeliveryZoneController extends Controller
{
    // List all delivery zones for the authenticated farmer
    public function index(Request $request)
    {
        $farmer = $request->user(); // Get authenticated farmer
        return $farmer->deliveryZones; // Return the farmer's delivery zones
    }

    // Store a new delivery zone for the farmer
    public function store(Request $request)
    {
        // Validate input data including latitude and longitude
        $request->validate([
            'zone_name' => 'required|string|max:255',
            'min_distance' => 'required|numeric',
            'max_distance' => 'required|numeric',
            'delivery_fee' => 'required|numeric',
            'latitude' => 'required|numeric',  // Validate latitude
            'longitude' => 'required|numeric', // Validate longitude
        ]);

        // Get the authenticated farmer (user)
        $farmer = $request->user();

        // Create the delivery zone and store the instance in a variable
        $zone = FarmerDeliveryZone::create([
            'farmer_id' => $farmer->id,
            'zone_name' => $request->zone_name,
            'min_distance' => $request->min_distance,
            'max_distance' => $request->max_distance,
            'delivery_fee' => $request->delivery_fee,
            'latitude' => $request->latitude,  // Save latitude
            'longitude' => $request->longitude, // Save longitude
        ]);

        // Return the newly created delivery zone as JSON
        return response()->json($zone, 201);
    }
}
