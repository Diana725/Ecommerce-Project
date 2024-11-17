<!-- resources/views/email-verified.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}"> <!-- Include your CSS here -->
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card mt-5">
                    <div class="card-header text-center">
                        <h2>Email Verified</h2>
                    </div>
                    <div class="card-body text-center">
                        <p>Your email has been verified successfully! You can now <a href="{{ url('http://localhost:3000/login') }}">log in</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
