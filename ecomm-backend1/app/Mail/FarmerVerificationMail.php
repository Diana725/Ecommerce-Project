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
    // Your frontend login page URL
    $frontendLoginUrl = 'https://www.farmer.maizeai.me/login'; 

    // Append the token as a query parameter to the login page URL
    $verificationUrl = rtrim($frontendLoginUrl, '/') . "?token={$this->token}";

    return $this->view('emails.farmer_verification')
        ->with(['verificationUrl' => $verificationUrl]) // Pass the URL to the email template
        ->subject('Verify Your Farmer Account');
}

}

