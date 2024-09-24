<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BuyerProductController;
use App\Http\Controllers\BuyerController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ChatController; 
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DeliveryZoneController;
use App\Http\Controllers\DeliveryFeeController;

// Routes that don't need authentication
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('buyer/products', [BuyerProductController::class, 'index']);
Route::get('buyer/products/{id}', [BuyerProductController::class, 'buyerProduct']);
Route::post('/buyerRegistration', [BuyerController::class, 'buyerRegistration']);
Route::post('/buyerLogin', [BuyerController::class, 'buyerLogin']);
Route::get('list', [ProductController::class, 'list']);
Route::get('/buyerSearch', [BuyerController::class, 'searchProducts']);
Route::post('/farmer/sendMessage', [ChatController::class, 'farmerSendMessage']);
    Route::get('/farmer/getMessages/{recipientId}', [ChatController::class, 'farmerGetMessages']);
    Route::get('/buyer/getMessages/{recipientId}', [ChatController::class, 'buyerGetMessages']);



    //new routes
    // Route::post('/seller/sendMessage', [MessageController::class, 'storeSellerMessage']);
    // Route::get('/seller/getMessages/{sellerId}', [MessageController::class, 'getSellerMessages']);
    // Route::post('/buyer/sendMessage', [MessageController::class, 'storeBuyerMessage']);
    // Route::get('/buyer/getMessages/{buyerId}', [MessageController::class, 'getBuyerMessages']);
   


// Protected routes for authenticated farmers (users)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('addProduct', [ProductController::class, 'addProduct']);
    Route::delete('delete/{id}', [ProductController::class, 'delete']);
    Route::get('product/{id}', [ProductController::class, 'getProduct']);
    Route::post('update/{id}', [ProductController::class, 'update']);
    Route::get('search/{key}', [ProductController::class, 'search']);

    // Chat routes for authenticated farmers
    Route::post('/seller/messages', [MessageController::class, 'storeSellerMessage']);

    // Get messages sent to seller from the buyer
    Route::get('/seller/messages/{sellerId}', [MessageController::class, 'getSellerMessages']);

    //order payment routes
    Route::get('/farmer/payments', [PaymentController::class, 'getAllPayments']);
    Route::post('/farmer/payment/confirm', [PaymentController::class, 'confirmPayment']);
    Route::get('/farmer/check-new-payments', [PaymentController::class, 'checkNewPayments']);

    //delivery routes
    Route::post('/farmer/delivery-zones', [DeliveryZoneController::class, 'store']);
    Route::get('/farmer/delivery-zones', [DeliveryZoneController::class, 'index']);
});

// Protected routes for authenticated buyers
Route::middleware(['auth:buyer'])->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::delete('/cart/remove/{productId}', [CartController::class, 'removeFromCart']);
    Route::put('/cart/update/{productId}', [CartController::class, 'updateCart']);

    // Chat routes for authenticated buyers
    Route::post('/buyer/messages', [MessageController::class, 'storeBuyerMessage']);

    // Get messages sent to buyer from the seller
    Route::get('/buyer/messages/{buyerId}', [MessageController::class, 'getBuyerMessages']);
    Route::post('/send-buyer-message', [MailController::class, 'sendBuyerMessage']);


   // order payment routes
   Route::post('/buyer/payment', [PaymentController::class, 'submitPayment']);
    Route::get('/buyer/payment/history', [PaymentController::class, 'getPaymentHistory']);
    Route::get('/buyer/payment/status/{paymentId}', [PaymentController::class, 'getPaymentStatus']);

    //delivery route
    Route::post('/buyer/calculate-delivery-fee', [DeliveryFeeController::class, 'calculate']);
});
