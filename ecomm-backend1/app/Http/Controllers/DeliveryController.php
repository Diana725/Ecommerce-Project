<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    // Buyer views delivery status based on payment_id
    public function showBuyerDelivery($paymentId)
    {
        $buyerId = auth()->id(); // Get authenticated buyer's ID
        \Log::info("Buyer ID: $buyerId, Requested Delivery Payment ID: $paymentId"); // Log the IDs for debugging

        // Fetch the delivery using payment_id and buyer_id
        $delivery = Delivery::where('payment_id', $paymentId)
            ->where('buyer_id', $buyerId)
            ->firstOrFail(); // Use firstOrFail to handle not found case

        return response()->json($delivery);
    }

    // Farmer views delivery status based on payment_id
    public function showFarmerDelivery($paymentId)
    {
        $farmerId = auth()->id(); // Get authenticated farmer's ID

        // Fetch the delivery using payment_id and farmer_id
        $delivery = Delivery::where('payment_id', $paymentId)
            ->where('farmer_id', $farmerId)
            ->firstOrFail(); // Use firstOrFail to handle not found case

        return response()->json($delivery);
    }

    // Farmer releases the product for delivery based on payment_id
    public function releaseForDelivery($paymentId)
    {
        $farmerId = auth()->id(); // Get authenticated farmer's ID

        // Find the delivery based on payment_id and farmer_id
        $delivery = Delivery::where('payment_id', $paymentId)
            ->where('farmer_id', $farmerId)
            ->firstOrFail(); // Use firstOrFail to handle not found case

        $delivery->status = 'shipped';
        $delivery->delivery_service = request('delivery_service');
        $delivery->tracking_number = request('tracking_number');
        $delivery->save();

        return response()->json(['message' => 'Delivery released successfully']);
    }

    // Buyer confirms receipt of delivery based on payment_id
    public function confirmDelivery($paymentId)
    {
        $buyerId = auth()->id(); // Get authenticated buyer's ID

        // Find the delivery based on payment_id and buyer_id
        $delivery = Delivery::where('payment_id', $paymentId)
            ->where('buyer_id', $buyerId)
            ->firstOrFail(); // Use firstOrFail to handle not found case

        $delivery->status = 'delivered';
        $delivery->delivered_at = now();
        $delivery->save();

        return response()->json(['message' => 'Delivery confirmed successfully']);
    }

    public function createDelivery(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|exists:order_payments,id',
            'delivery_service' => 'required|string',
            'tracking_number' => 'required|string',
        ]);

        $delivery = new Delivery();
        $delivery->payment_id = $request->payment_id; // Link delivery to the payment
        $delivery->farmer_id = auth()->id(); // Get authenticated farmer's ID
        $delivery->status = 'pending'; // Set initial status
        $delivery->delivery_service = $request->delivery_service;
        $delivery->tracking_number = $request->tracking_number;
        $delivery->save();

        return response()->json(['message' => 'Delivery created successfully', 'delivery' => $delivery], 201);
    }
}
