<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FarmerDeliveryZone;
use App\Models\User;

class DeliveryFeeController extends Controller
{
    // Function to calculate delivery fee based on buyer and farmer locations
    public function calculate(Request $request)
    {
        // Validate request input
        $request->validate([
            'farmer_id' => 'required|exists:users,id',
            'buyer_lat' => 'required|numeric',
            'buyer_lon' => 'required|numeric',
        ]);

        // Get all delivery zones for the specified farmer
        $deliveryZones = FarmerDeliveryZone::where('farmer_id', $request->farmer_id)
            ->get(['zone_name', 'latitude', 'longitude', 'min_distance', 'max_distance', 'delivery_fee']);

        // If no delivery zones are found for this farmer
        if ($deliveryZones->isEmpty()) {
            return response()->json(['message' => 'Delivery zone not found for this farmer'], 404);
        }

        $closestZone = null;
        $smallestDistance = null;

        // Loop through each delivery zone to find the closest one based on the distance
        foreach ($deliveryZones as $zone) {
            // Calculate distance between buyer and farmer using the Haversine formula
            $distance = $this->calculateDistance($zone->latitude, $zone->longitude, $request->buyer_lat, $request->buyer_lon);

            // Check if the distance falls within the zone's min and max distance
            if ($distance <= $zone->min_distance && $distance <= $zone->max_distance) {
                // If it's the first valid zone or a closer zone is found, update the closest zone
                if ($smallestDistance === null || $distance < $smallestDistance) {
                    $smallestDistance = $distance;
                    $closestZone = $zone;
                }
            }
        }

        // If a matching zone is found, return the delivery fee
        if ($closestZone) {
            return response()->json([
                'zone_name' => $closestZone->zone_name,
                'delivery_fee' => $closestZone->delivery_fee,
                'calculated_distance' => $smallestDistance
            ]);
        }

        // If no matching zone is found
        return response()->json(['message' => 'Sorry, This Farmer Does Not Deliever Around Your Area, Pick a similar Product in the Products page and Try Again. Alternatively You Can Enter Another Delivery Location'], 404);
    }

    // Helper function to calculate distance using the Haversine formula
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Earth's radius in kilometers
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c; // Distance in kilometers
        return $distance;
    }
}
