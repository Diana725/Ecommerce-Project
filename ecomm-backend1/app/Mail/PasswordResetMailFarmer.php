<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMailFarmer extends Mailable
{
    use SerializesModels;

    public $resetLink;

    public function __construct($email, $token)
    {
        // Directly use the URL instead of pulling from .env
        $frontendUrl = 'https://www.farmer.maizeai.me'; // Hardcoded frontend URL
        $this->resetLink = rtrim($frontendUrl, '/') . '/password/reset-form?token=' . $token . '&email=' . urlencode($email);
    }

    public function build()
    {
        return $this->subject('Password Reset Request')
                    ->view('emails.password_reset_farmer')
                    ->with(['resetLink' => $this->resetLink]);
    }
}
