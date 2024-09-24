<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use App\Models\Buyer;
use App\Events\ChatMessage;

class ChatController extends Controller
{
    public function buyerSendMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'recipient_id' => 'required|integer',
            'product_id' => 'required|integer',
        ]);

        try {
            $sender = auth()->guard('buyer')->user(); 
            $receiver = User::findOrFail($validated['recipient_id']); 

            $message = Message::create([
                'buyer_id' => $sender->id,
                'buyer_type' => Buyer::class,
                'user_id' => $receiver->id,
                'user_type' => User::class,
                'product_id' => $validated['product_id'],
                'message' => $validated['message'],
            ]);

            broadcast(new ChatMessage($message))->toOthers();

            return response()->json($message, 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error sending message.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function farmerSendMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'recipient_id' => 'required|integer',
            'product_id' => 'required|integer',
        ]);

        try {
            $sender = auth()->guard('sanctum')->user(); 
            $receiver = Buyer::findOrFail($validated['recipient_id']); 

            $message = Message::create([
                'buyer_id' => $receiver->id,
                'buyer_type' => Buyer::class,
                'user_id' => $sender->id,
                'user_type' => User::class,
                'product_id' => $validated['product_id'],
                'message' => $validated['message'],
            ]);

            broadcast(new ChatMessage($message))->toOthers();

            return response()->json($message, 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error sending message.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function buyerGetMessages($recipientId)
    {
        try {

            $user = auth()->guard('buyer')->user(); 

            $messages = Message::where(function ($query) use ($recipientId) {
                $query->where('buyer_id', auth()->id())
                      ->where('user_id', $recipientId);
            })->orWhere(function ($query) use ($recipientId) {
                $query->where('user_id', $recipientId)
                      ->where('buyer_id', auth()->id());
            })->get();

            return response()->json($messages, 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error fetching messages.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function farmerGetMessages($recipientId)
    {
        try {
            $user = auth()->guard('sanctum')->user(); 

            $messages = Message::where(function ($query) use ($recipientId) {
                $query->where('user_id', auth()->id())
                      ->where('buyer_id', $recipientId);
            })->orWhere(function ($query) use ($recipientId) {
                $query->where('buyer_id', $recipientId)
                      ->where('user_id', auth()->id());
            })->get();

            return response()->json($messages, 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error fetching messages.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
