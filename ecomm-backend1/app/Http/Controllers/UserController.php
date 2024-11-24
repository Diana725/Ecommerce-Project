<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Mail\FarmerVerificationMail;
use App\Mail\PasswordResetMailFarmer;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    // Login function 
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|string',
        'password' => 'required|string',
    ]);

    // Manually authenticate the user
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    // Check if email is verified
    if (!$user->is_verified) {
        return response()->json([
            'message' => 'Please verify your email before logging in.'
        ], 403);
    }

    // Create a Sanctum token
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
}

public function verifyEmail($token)
{
    // Find the user by the verification token
    $user = User::where('email_verification_token', $token)->first();

    if (!$user) {
        return response()->json(['message' => 'Invalid verification token.'], 404);
    }

    // Verify the user's email
    $user->is_verified = true;
    $user->email_verification_token = null; // Clear the token
    $user->save();

    // Return a success response
    return response()->json(['message' => 'Email verified successfully! You can now log in.']);
}
public function resendFarmerVerificationEmail(Request $request)
{
    // Validate the email
    $request->validate([
        'email' => 'required|email',
    ]);

    // Find the farmer by email
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'No account found with this email'], 404);
    }

    // Check if the farmer is already verified
    if ($user->is_verified) {
        return response()->json(['message' => 'Email is already verified'], 400);
    }

    // Generate a new verification token
    $user->email_verification_token = Str::random(40); // Generate a random token
    $user->save();

    // Send the verification email
    Mail::to($user->email)->send(new FarmerVerificationMail($user->email_verification_token));

    return response()->json(['message' => 'Verification email resent successfully. Please check your inbox.']);
}

public function resendFarmerPasswordResetToken(Request $request)
{
    // Validate the email
    $request->validate([
        'email' => 'required|email',
    ]);

    // Find the farmer (user) by email
    $farmer = User::where('email', $request->email)->first();

    if (!$farmer) {
        return response()->json(['message' => 'No account found with this email'], 404);
    }

    // Generate a new password reset token
    $token = Str::random(60); // Generate a secure token

    // Store the token in your password_resets table
    \DB::table('password_resets')->updateOrInsert(
        ['email' => $farmer->email], // Match by email
        [
            'email' => $farmer->email,
            'token' => bcrypt($token), // Store the token hashed
            'created_at' => now(),
        ]
    );

    // Send the reset email
    Mail::to($farmer->email)->send(new PasswordResetMailFarmer($farmer->email, $token));

    return response()->json(['message' => 'Password reset email resent successfully. Please check your inbox.']);
}

    // Registration function
    public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:30',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:5',
        'phone' => 'required|string|max:15',
    ]);

    if (User::where('email', $request->email)->exists()) {
        return response()->json([
            'message' => 'User already registered'
        ], 400);
    }

    // Create the user with a verification token
    $verificationToken = Str::random(64);
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'phone' => $request->phone,
        'email_verification_token' => $verificationToken,
        'is_verified' => 0, // Not verified initially
    ]);

    // Send the verification email
    \Mail::to($user->email)->send(new FarmerVerificationMail($verificationToken));

    return response()->json([
        'message' => 'Registration successful! Please check your email to verify your account.',
        'user' => $user,
    ]);
}
public function sendPasswordResetLinkFarmer(Request $request)
{
    // Validate the email
    $request->validate([
        'email' => 'required|string|email|max:255|exists:users,email',
    ]);

    // Retrieve the buyer based on the email
    $user = User::where('email', $request->email)->first();

    // Generate the password reset token using the Password facade
    $token = Password::broker()->createToken($user);

    // Send the password reset email with email and token
    Mail::to($user->email)->send(new PasswordResetMailFarmer($user->email, $token));

    return response()->json(['message' => 'Password reset link has been sent to your email.']);
}
public function resetPasswordFarmer(Request $request)
{
    // Validate the inputs with the same rules as registration
    $request->validate([
        'token' => 'required|string',
        'email' => 'required|string|email|max:255|exists:users,email', // Ensure email exists in the DB
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
    $response = Password::broker('users')->reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            // Update the buyer's password
            $user->password = Hash::make($password);
            $user->save();

            // Revoke existing tokens to log out the user from previous sessions
            $user->tokens()->delete();
        }
    );

    // Check if the password reset was successful
    if ($response == Password::PASSWORD_RESET) {
        // Authenticate the buyer with the new password
        $user = User::where('email', $request->email)->first();

        // Create a new token after successful password reset and login
        $token = $user->createToken('auth_token')->plainTextToken;

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
