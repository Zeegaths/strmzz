# Vanilla JavaScript Example - Strimz SDK

This example demonstrates how to integrate Strimz payments into a vanilla JavaScript application without any framework.

## Features

- Pure JavaScript implementation (no frameworks)
- ES6 modules
- Client-side payment flow
- Success page with payment result parsing

## Setup

1. Update the public key in `index.html`:
```javascript
const strimz = new StrimzSDK({
  publicKey: 'STRZtest_your_public_key_here',
  environment: 'test'
})
```

2. Serve the files using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

## How It Works

### index.html
- Loads the Strimz SDK from CDN (or use npm bundle)
- Initializes the SDK with your public key
- Handles button clicks to create payment sessions
- Redirects to Strimz hosted checkout

### success.html
- Parses payment result from URL query parameters
- Displays payment details
- Shows success or error state

## Usage

The example shows two pricing plans:
- **Pro Plan**: One-time payment of $49.99
- **Premium Plan**: Monthly subscription of $29.99

Click any button to be redirected to the Strimz checkout page.

## Notes

- This example uses ES6 modules, so you need to serve it via HTTP (not file://)
- In production, replace `STRZtest_` key with your live `STRZlive_` key
- Update the success/cancel URLs to match your domain
