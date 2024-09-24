<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel; // Import PrivateChannel
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        // Use both buyer and user IDs to create a more specific private channel
        return new PrivateChannel('chat.' . $this->message->buyer_id . '.' . $this->message->user_id);
    }

    public function broadcastAs()
    {
        return 'message.sent'; // Define the event name
    }
}
