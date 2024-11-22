<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use SerializesModels;

    public $resetLink;

    // Pass the reset link to the view
    public function __construct($email, $token)
    {
        // Modify the reset link to include both email and token
        // Make sure FRONTEND_URL is set in .env, or use a full URL like 'http://localhost:3000'
        $frontendUrl = 'https://www.buyer.maizeai.me';
        $this->resetLink = rtrim(env($frontendUrl), '/') . '/password/reset-form?token=' . $token . '&email=' . urlencode($email);
    }

    public function build()
    {
        // Return the email view
        return $this->subject('Password Reset Request')
                    ->view('emails.password_reset')  // Define your Blade view
                    ->with(['resetLink' => $this->resetLink]);
    }
}
