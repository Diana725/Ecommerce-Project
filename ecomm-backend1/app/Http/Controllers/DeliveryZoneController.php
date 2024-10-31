<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FarmerDeliveryZone;
use App\Models\DeliveryLocation;
use Illuminate\Support\Facades\Auth;

class DeliveryZoneController extends Controller
{
    // List all delivery zones for the authenticated farmer
    public function index(Request $request)
    {
        $farmer = $request->user();
        return $farmer->deliveryZones;
    }

    // Store a new delivery zone for the authenticated farmer
    public function storeZone(Request $request)
    {
        $request->validate([
            'zone_name' => 'required|string|max:255',
            // 'delivery_fee' => 'required|numeric',
        ]);

        $farmer = $request->user();

        $zone = FarmerDeliveryZone::create([
            'farmer_id' => $farmer->id,
            'zone_name' => $request->zone_name,
            // 'delivery_fee' => $request->delivery_fee,
        ]);

        return response()->json($zone, 201);
    }

    // Store a new delivery location within a specified delivery zone
    public function storeLocation(Request $request, $zoneId)
    {
        // Log the request data for debugging
        \Log::info('Request data:', $request->all());
    
        $request->validate([
            'location_name' => 'required|string|max:255',
            'delivery_fee' => 'required|numeric',
        ]);
    
        // Create a new delivery location with the zone_id
        $location = DeliveryLocation::create([
            'location_name' => $request->input('location_name'),
            'delivery_fee' => $request->input('delivery_fee'),
            'farmer_id' => $request->user()->id, // Use authenticated user's ID
            'zone_id' => $zoneId, // Use the zone ID from the route parameter
        ]);
    
        return response()->json($location, 201);
    }

    // List all delivery locations within a specified delivery zone
    public function showLocations($zoneId)
    {
        $deliveryZone = FarmerDeliveryZone::with('deliveryLocations')->findOrFail($zoneId);
        return response()->json($deliveryZone->deliveryLocations, 200);
    }
    public function removeLocation($zoneId, $locationId)
{
    $zone = FarmerDeliveryZone::find($zoneId);
    
    if (!$zone) {
        return response()->json(['message' => 'Zone not found'], 404);
    }

    $location = $zone->deliveryLocations()->find($locationId);
    
    if (!$location) {
        return response()->json(['message' => 'Location not found'], 404);
    }

    // Delete the location
    $location->delete();

    return response()->json(['message' => 'Location deleted successfully'], 200);
}
public function getDeliveryZones($farmer_id)
{
    $deliveryZones = DeliveryZone::where('farmer_id', $farmer_id)->get();

    if ($deliveryZones->isEmpty()) {
        return response()->json(['message' => 'No delivery zones found'], 404);
    }

    return response()->json($deliveryZones);
}

public function getFarmerDeliveryZones($farmerId)
{
    $deliveryZones = FarmerDeliveryZone::where('farmer_id', $farmerId)->with('deliveryLocations')->get();

    if ($deliveryZones->isEmpty()) {
        return response()->json(['message' => 'No delivery zones found for this farmer'], 404);
    }

    return response()->json($deliveryZones, 200);
}

public function getDeliveryLocationsByZone($zoneId)
{
    $deliveryZone = FarmerDeliveryZone::with('deliveryLocations')->find($zoneId);

    if (!$deliveryZone) {
        return response()->json(['message' => 'Delivery zone not found'], 404);
    }

    return response()->json($deliveryZone->deliveryLocations, 200);
}

}
