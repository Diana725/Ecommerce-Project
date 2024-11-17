<?php

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
        return $this->view('emails.farmer_verification')
            ->with([
                'verificationUrl' => url("/api/farmer/verify-email/{$this->token}")
            ])
            ->subject('Verify Your Farmer Account');
    }
}
