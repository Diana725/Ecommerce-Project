<?php

namespace App\Http\Controllers;

use App\Models\OrderPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    // Buyer-side: Submit payment proof
    public function submitPayment(Request $request)
    {
        $request->validate([
            'farmer_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id', // Validate product_id
            'payment_reference' => 'required|string',
            'proof_of_payment' => 'nullable|string',
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
            ]);

            return response()->json(['message' => 'Payment submitted successfully', 'payment_id' => $payment->id]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to submit payment', 'error' => $e->getMessage()], 500);
        }
    }

    // Buyer-side: Fetch payment history
    public function getPaymentHistory()
    {
        $buyerId = Auth::guard('buyer')->id();

        // Fetch payments along with related farmer and product details
        $payments = OrderPayment::with(['farmer', 'product']) // Include farmer and product
            ->where('buyer_id', $buyerId)
            ->get();

        // Transform the data to include product and farmer names
        // $payments = $payments->map(function ($payment) {
        //     return [
        //         'id' => $payment->id,
        //         'payment_reference' => $payment->payment_reference,
        //         'status' => $payment->status,
        //         'proof_of_payment' => $payment->proof_of_payment,
        //         'product' => [
        //             'name' => $payment->product->name, // Fetch product name
        //         ],
        //         'farmer' => [
        //             'name' => $payment->farmer->name, // Fetch farmer name
        //         ],
        //     ];
        // });

        return response()->json($payments);
    }

    // Farmer-side: Fetch all payments (including product names)
    public function getAllPayments()
    {
        $farmerId = Auth::guard('sanctum')->id();

        $payments = OrderPayment::with(['buyer', 'product']) // Include buyer and product
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

    // Buyer-side: Fetch payment status using payment_id
    public function getPaymentStatus($paymentId)
    {
        $buyerId = Auth::guard('buyer')->id();

        $payment = OrderPayment::with(['buyer', 'farmer', 'product']) // Include necessary relationships
            ->where('buyer_id', $buyerId)
            ->where('id', $paymentId)
            ->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Return a formatted response including product and farmer names
        return response()->json([
            'status' => $payment->status,
            'proof_of_payment' => $payment->proof_of_payment,
            'product_name' => $payment->product->name, // Assuming relationship is defined in the OrderPayment model
            'farmer_name' => $payment->farmer->name,   // Assuming relationship is defined in the OrderPayment model
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


}
