<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
</head>
<body>
    <h2>Hello,</h2>
    <p>Thank you for registering with MaizeAI! Please click the link below to verify your email address:</p>
    <a href="{{ url('https://www.buyer.maizeai.me/verify-email?token=' . $token) }}">Verify Email</a>
</body>
</html>
