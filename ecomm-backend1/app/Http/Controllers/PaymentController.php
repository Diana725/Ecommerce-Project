<?php

namespace App\Http\Controllers;

use App\Models\OrderPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    // Buyer-side: Submit payment proof
    // Buyer-side: Submit payment proof with delivery info
    public function submitPayment(Request $request)
    {
        $request->validate([
            'farmer_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id', // Validate product_id
            'payment_reference' => 'required|string',
            'proof_of_payment' => 'nullable|string|size:10', // Ensure proof of payment is exactly 10 characters
            'delivery_zone_id' => 'required|exists:farmer_delivery_zones,id', // Validate delivery zone
            'total_price' => 'required|numeric', 
            'delivery_location_id' => 'required|exists:delivery_locations,id', // Validate delivery location
        ], [
            'proof_of_payment.size' => 'The proof of payment must be exactly 10 characters.', // Custom error message
        ]);
    
        $buyerId = Auth::guard('buyer')->id();
    
        try {
            $payment = OrderPayment::create([
                'buyer_id' => $buyerId,
                'farmer_id' => $request->farmer_id,
                'product_id' => $request->product_id,
                'payment_reference' => $request->payment_reference,
                'proof_of_payment' => $request->proof_of_payment,
                'status' => 'Payment Pending',
                'delivery_zone_id' => $request->delivery_zone_id, // Save delivery zone ID
                'delivery_location_id' => $request->delivery_location_id, // Save delivery location ID
                'total_price' => $request->total_price, 
            ]);
    
            return response()->json(['message' => 'Payment submitted successfully', 'payment_id' => $payment->id]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to submit payment', 'error' => $e->getMessage()], 500);
        }
    }
    


    // Buyer-side: Fetch payment history
    // Buyer-side: Fetch payment history with delivery info
public function getPaymentHistory()
{
    $buyerId = Auth::guard('buyer')->id();

    // Fetch payments along with related farmer, product, delivery zone, and delivery location details
    $payments = OrderPayment::with(['farmer', 'product', 'deliveryZone', 'deliveryLocation'])
        ->where('buyer_id', $buyerId)
        ->get();

    return response()->json($payments);
}


    // Farmer-side: Fetch all payments (including product names)
   // Farmer-side: Fetch all payments with delivery info
public function getAllPayments()
{
    $farmerId = Auth::guard('sanctum')->id();

    // Fetch payments along with related buyer, product, delivery zone, and delivery location details
    $payments = OrderPayment::with(['buyer', 'product', 'deliveryZone', 'deliveryLocation'])
        ->where('farmer_id', $farmerId)
        ->get();

    return response()->json($payments);
}


    // Farmer-side: Confirm payment
    public function confirmPayment(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|exists:order_payments,id',
        ]);

        $payment = OrderPayment::find($request->payment_id);

        if ($payment->farmer_id !== Auth::guard('sanctum')->id()) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $payment->status = 'Payment Confirmed';
        $payment->save();

        return response()->json(['message' => 'Payment confirmed successfully']);
    }

    // Buyer-side: Fetch payment status including delivery info
    public function getPaymentStatus($paymentId)
    {
        $buyerId = Auth::guard('buyer')->id();
    
        // Fetch payment along with buyer, farmer, product, delivery zone, and delivery location
        $payment = OrderPayment::with(['buyer', 'farmer', 'product', 'deliveryZone', 'deliveryLocation'])
            ->where('buyer_id', $buyerId)
            ->where('id', $paymentId)
            ->first();
    
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }
    
        return response()->json([
            'status' => $payment->status,
            'total_price' => $payment->total_price,
            'proof_of_payment' => $payment->proof_of_payment,
            'product_name' => $payment->product->name,
            'farmer_name' => $payment->farmer->name,
            'delivery_zone_name' => $payment->deliveryZone ? $payment->deliveryZone->zone_name : null, // Check for existence
            'delivery_location_name' => $payment->deliveryLocation ? $payment->deliveryLocation->location_name : null, // Check for existence
        ]);
    }
    

    public function checkNewPayments()
    {
        // Get the authenticated farmer (assuming you're using Sanctum or any guard for authentication)
        $farmerId = Auth::id();

        // Query the OrderPayment model for unconfirmed payments for this farmer
        // Assuming 'status' column indicates payment confirmation (e.g., 'pending' or 'confirmed')
        $newPaymentsCount = OrderPayment::where('farmer_id', $farmerId)
                                ->where('status', 'pending')  // Assuming 'pending' means new/unconfirmed
                                ->count();

        // If there are new/unconfirmed payments, return hasNewPayments as true
        return response()->json([
            'hasNewPayments' => $newPaymentsCount > 0
        ]);
    }


    //New Controller Functions

    public function updateDeliveryStatusToShipped(Request $request, $id)
    {
        $farmer = auth()->guard('sanctum')->user();
    
        $orderPayment = OrderPayment::where('farmer_id', $farmer->id)->find($id);
    
        if ($orderPayment) {
            $orderPayment->delivery_status = 'Shipped';
            $orderPayment->tracking_number = $request->input('tracking_number');
            $orderPayment->delivery_service = $request->input('delivery_service');
            $orderPayment->save();
    
            return response()->json(['message' => 'Delivery status updated to Shipped!']);
        }
    
        return response()->json(['message' => 'Order not found or you do not have permission to update this order'], 404);
    }
    


public function updateDeliveryStatusToDelivered($id)
{
    // Ensure only authenticated buyers can perform this action
    $buyer = auth()->guard('buyer')->user();

    $orderPayment = OrderPayment::where('buyer_id', $buyer->id)->find($id);

    if ($orderPayment && $orderPayment->delivery_status === 'Shipped') {
        $orderPayment->delivery_status = 'Delivered';
        $orderPayment->save();

        return response()->json(['message' => 'Delivery status updated to Delivered!']);
    }

    return response()->json(['message' => 'Order not found or it has not been shipped yet'], 404);
}

public function submitReview(Request $request)
{
    $request->validate([
        'order_payment_id' => 'required|exists:order_payments,id',
    ]);

    // Get the authenticated buyer
    $buyerId = Auth::guard('buyer')->id();

    // Find the corresponding payment (ensure consistency with validated field name)
    $payment = OrderPayment::where('id', $request->order_payment_id)
        ->where('buyer_id', $buyerId) // Ensure the buyer owns this payment
        ->first();

    if (!$payment) {
        return response()->json(['message' => 'Payment not found or you do not have permission to submit a review.'], 404);
    }

    // Update the review_submitted column to true
    $payment->review_submitted = true; // Mark it as submitted
    $payment->save();

    // Debugging: Check if the field is updated correctly
    return response()->json([
        'message' => 'Review submitted successfully.',
        'review_submitted' => $payment->review_submitted,  // Return the updated field
        'payment' => $payment
    ]);
}

}
