<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BuyerMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public $messageContent;
    public $buyer;
    public $product;

    public function __construct($message, $buyer, $product)
    {
        $this->messageContent = $message;
        $this->buyer = $buyer;
        $this->product = $product;
    }

    public function build()
    {
        return $this->view('emails.buyer_message')
                    ->with([
                        'message' => $this->messageContent,
                        'buyer' => $this->buyer,
                        'product' => $this->product,
                    ]);
    }
}
