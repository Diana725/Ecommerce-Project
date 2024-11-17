<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Buyer;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Mail\VerifyEmail;
use App\Mail\PasswordResetMail;
use Illuminate\Support\Facades\Password;


class BuyerController extends Controller
{
    // Buyer Registration function with email verification
    public function buyerRegistration(Request $request)
{
    // Add custom password validation rule using regex
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:buyers',
        'password' => [
            'required',
            'string',
            'min:8', // Minimum 8 characters
            'regex:/[a-z]/', // Must contain at least one lowercase letter
            'regex:/[A-Z]/', // Must contain at least one uppercase letter
            'regex:/[0-9]/', // Must contain at least one digit
            'regex:/[@$!%*#?&]/' // Must contain a special character
        ],
    ], [
        // Custom error messages
        'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    ]);

    // Check if the email already exists
    if (Buyer::where('email', $request->email)->exists()) {
        return response()->json([
            'message' => 'User already registered'
        ], 400);
    }

    $verificationToken = Str::random(60); // Generate email verification token

    $buyer = Buyer::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'email_verification_token' => $verificationToken,
        'is_verified' => false, // Initially not verified
    ]);

    // Send verification email
    Mail::to($buyer->email)->send(new VerifyEmail($verificationToken));

    return response()->json([
        'message' => 'Registration successful! Please check your email to verify your account.',
    ]);
}

// Email verification function
public function verifyEmail($token)
{
    $buyer = Buyer::where('email_verification_token', $token)->first();

    if (!$buyer) {
        return response()->json(['message' => 'Invalid verification token'], 404);
    }

    // Mark the buyer as verified
    $buyer->is_verified = true;
    $buyer->email_verification_token = null;
    $buyer->save();

    return  redirect('http://localhost:3000/login')->with('message', 'Email verified successfully! You can now log in.');
}


    // Buyer Login function with verification check
    public function buyerLogin(Request $request)
{
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    // Manually authenticate the buyer
    $buyer = Buyer::where('email', $request->email)->first();

    if (!$buyer || !Hash::check($request->password, $buyer->password)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    // Check if email is verified
    if ($buyer->is_verified != 1) {  // Ensure that you're checking for the correct value
        return response()->json([
            'message' => 'Please verify your email before logging in.'
        ], 403);
    }

    // Create a Sanctum token
    $token = $buyer->createToken('auth_token')->plainTextToken;

    return response()->json([
        'buyer' => $buyer,
        'token' => $token,
    ]);
}


    // Search products
    public function searchProducts(Request $request)
    {
        $query = $request->input('query');
        
        if (!$query) {
            return response()->json([
                'message' => 'Search query is required'
            ], 400);
        }

        $products = Product::where('name', 'like', "%$query%")->get();

        return response()->json([
            'products' => $products
        ]);
    }
    public function sendPasswordResetLink(Request $request)
{
    // Validate the email
    $request->validate([
        'email' => 'required|string|email|max:255|exists:buyers,email',
    ]);

    // Retrieve the buyer based on the email
    $buyer = Buyer::where('email', $request->email)->first();

    // Generate the password reset token using the Password facade
    $token = Password::broker()->createToken($buyer);

    // Send the password reset email with email and token
    Mail::to($buyer->email)->send(new PasswordResetMail($buyer->email, $token));

    return response()->json(['message' => 'Password reset link has been sent to your email.']);
}
public function resetPassword(Request $request)
{
    // Validate the inputs with the same rules as registration
    $request->validate([
        'token' => 'required|string',
        'email' => 'required|string|email|max:255|exists:buyers,email', // Ensure email exists in the DB
        'password' => [
            'required',
            'string',
            'min:8', // Minimum length of 8 characters
            'confirmed', // Ensure password_confirmation matches password
            'regex:/[a-z]/', // Ensure at least one lowercase letter
            'regex:/[A-Z]/', // Ensure at least one uppercase letter
            'regex:/[0-9]/', // Ensure at least one number
            'regex:/[@$!%*#?&]/', // Ensure at least one special character
        ],
    ]);

    // Attempt to reset the password using the provided token, email, and password
    $response = Password::broker('buyers')->reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($buyer, $password) {
            // Update the buyer's password
            $buyer->password = Hash::make($password);
            $buyer->save();

            // Revoke existing tokens to log out the user from previous sessions
            $buyer->tokens()->delete();
        }
    );

    // Check if the password reset was successful
    if ($response == Password::PASSWORD_RESET) {
        // Authenticate the buyer with the new password
        $buyer = Buyer::where('email', $request->email)->first();

        // Create a new token after successful password reset and login
        $token = $buyer->createToken('auth_token')->plainTextToken;

        // Return a success message and the new token
        return response()->json([
            'message' => 'Password has been reset successfully. Rerouting to login...',
            'token' => $token, // Send the new token to the frontend for future authentication
        ], 200);
    } else {
        // If the reset fails, return an error response
        return response()->json(['message' => 'The reset token is invalid or expired.'], 400);
    }
}

}
