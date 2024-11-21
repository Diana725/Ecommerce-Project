<?php

namespace App\Mail;

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FarmerVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function build()
    {
        $frontendUrl = 'https://www.farmer.maizeai.me'; // Your frontend URL
        $verificationUrl = rtrim($frontendUrl, '/') . "/verify-email?token={$this->token}";

        return $this->view('emails.farmer_verification')
            ->with(['verificationUrl' => $verificationUrl])
            ->subject('Verify Your Farmer Account');
    }
}

