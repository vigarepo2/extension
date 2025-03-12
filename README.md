# Payment Gateway Detector Pro

A powerful Chrome extension that instantly detects payment gateways used on websites and displays them in a professional animated interface.

## Features

- **Instant Detection**: Automatically scans websites for 33+ different payment gateway systems
- **Professional UI**: Clean, modern design with smooth entrance/exit animations
- **Bottom Corner Display**: Non-intrusive overlay appears in the bottom-right corner of websites
- **Comprehensive Coverage**: Detects all major payment processors including PayPal, Stripe, Razorpay, and many more
- **User Control**: Toggle detection on/off with a simple switch
- **Automatic Saving**: Detected gateways are saved for later reference

## Installation

### From Source Code

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your browser toolbar

## Usage

- **Automatic Detection**: The extension automatically scans for payment gateways when you visit a website
- **Manual Scanning**: Click the extension icon and use the "Scan Current Page" button to manually check a site
- **View Results**: Detected gateways appear in a professional animated box in the bottom-right corner of the page
- **Enable/Disable**: Toggle the extension on/off using the switch in the popup

## How It Works

This extension scans website content for signatures of popular payment gateways. When it detects payment systems, it displays them in a sleek, animated overlay at the bottom of your screen. The overlay automatically disappears after 12 seconds or can be closed manually.

## Files Overview

- **manifest.json**: Contains extension metadata and permissions
- **popup.html/js**: Provides the user interface when clicking the extension icon
- **content.js/css**: Handles website scanning and overlay display

## Privacy

This extension:
- Does not collect or transmit any user data
- Only reads website content to detect payment gateways
- Requires minimal permissions (activeTab, storage)
- Stores detection results locally in your browser

## Supported Payment Gateways

The extension can detect 33+ payment systems including:
- PayPal
- Stripe
- Razorpay
- Braintree
- Square
- Shopify Payments
- Adyen
- Authorize.Net
- WorldPay
- Apple Pay
- Google Pay
- Klarna
- 2Checkout
- Cybersource
- SagePay
- Checkout.com
- Bolt
- Venmo
- Revolut
- Eway
- WooCommerce
- UPI
- PayFlow
- Payeezy
- Paddle
- Payoneer
- Recurly
- Paysafe
- WebMoney
- Payeer
- Skrill
- And more...

## License

Copyright © 2025. All rights reserved.
