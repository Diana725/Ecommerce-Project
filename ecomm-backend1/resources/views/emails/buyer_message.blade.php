<!DOCTYPE html>
<html>
<head>
    <title>New Message from Buyer</title>
</head>
<body>
    <h1>New Message about {{ $product->name }}</h1>
    <p><strong>From:</strong> {{ $buyer->name }} ({{ $buyer->email }})</p>
    <p><strong>Message:</strong></p>
    <p>{{ $message }}</p>
</body>
</html>
