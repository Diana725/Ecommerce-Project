<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Message;

Broadcast::channel('chat.{productId}', function ($user, $productId) {
    // Optionally, check if the user is related to the product
    // For example, ensure the user is the seller or a buyer interested in the product
    // This example assumes any authenticated user can access the channel
    return auth()->check();
});
