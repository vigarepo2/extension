// Payment gateway patterns to detect
const PAYMENT_GATEWAYS = [
  { name: 'PayPal', patterns: ['paypal.com', 'paypal', 'xoom'] },
  { name: 'Stripe', patterns: ['stripe.com', 'stripe.js', 'checkout.stripe'] },
  { name: 'Razorpay', patterns: ['razorpay', 'checkout.razorpay'] },
  { name: 'Square', patterns: ['squareup', 'square.js', 'squarepayments'] },
  { name: 'Braintree', patterns: ['braintree', 'braintree-web'] },
  { name: 'Shopify Payments', patterns: ['shopify', 'shop_pay', 'checkout.shopify'] },
  { name: 'Adyen', patterns: ['adyen', 'checkoutshopper'] },
  { name: 'Authorize.Net', patterns: ['authorize.net', 'acceptjs'] },
  { name: 'PayU', patterns: ['payu', 'payumoney', 'payubiz'] },
  { name: 'WorldPay', patterns: ['worldpay', 'worldpayjs'] },
  { name: 'Paytm', patterns: ['paytm', 'merchantpgpui'] },
  { name: 'Apple Pay', patterns: ['applepay', 'apple-pay', 'apple.com/apple-pay'] },
  { name: 'Google Pay', patterns: ['googlepay', 'pay.google.com', 'gpay'] },
  { name: 'Klarna', patterns: ['klarna', 'klarnapayments'] },
  { name: '2Checkout', patterns: ['2checkout', '2co.com'] },
  { name: 'Cybersource', patterns: ['cybersource', 'flex.cybersource'] },
  { name: 'SagePay', patterns: ['sagepay', 'opayo'] },
  { name: 'Checkout.com', patterns: ['checkout.com', 'checkoutapi'] },
  { name: 'Bolt', patterns: ['bolt', 'bolt.com', 'bolt-checkout'] },
  { name: 'Venmo', patterns: ['venmo'] },
  { name: 'Revolut', patterns: ['revolut'] },
  { name: 'Eway', patterns: ['eway', 'ewaypayments'] },
  { name: 'WooCommerce', patterns: ['woocommerce', 'wc-gateway'] },
  { name: 'UPI', patterns: ['upi', 'upipayment'] },
  { name: 'PayFlow', patterns: ['payflow', 'payflowpro'] },
  { name: 'Payeezy', patterns: ['payeezy'] },
  { name: 'Paddle', patterns: ['paddle', 'paddle.js', 'paddle.com'] },
  { name: 'Payoneer', patterns: ['payoneer'] },
  { name: 'Recurly', patterns: ['recurly'] },
  { name: 'Paysafe', patterns: ['paysafe', 'paysafecard'] },
  { name: 'WebMoney', patterns: ['webmoney', 'wmtransfer'] },
  { name: 'Payeer', patterns: ['payeer'] },
  { name: 'Skrill', patterns: ['skrill'] }
];

// Global variables
let isEnabled = true;
let detectedGateways = [];
let overlayElement = null;

// Initialize extension
function initialize() {
  // Load settings
  chrome.storage.local.get({isEnabled: true}, function(data) {
    isEnabled = data.isEnabled;
    
    // Auto detect on page load
    if (isEnabled) {
      detectPaymentGateways();
    }
  });
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'scanPage') {
      detectPaymentGateways();
      sendResponse({gateways: detectedGateways});
    } 
    else if (message.action === 'getDetections') {
      sendResponse({gateways: detectedGateways});
    }
    else if (message.action === 'toggleExtension') {
      isEnabled = message.isEnabled;
      
      if (!isEnabled && overlayElement) {
        removeOverlay();
      } else if (isEnabled) {
        detectPaymentGateways();
      }
      
      sendResponse({success: true});
    }
    
    return true; // Keep the message channel open for async response
  });
}

// Detect payment gateways
function detectPaymentGateways() {
  if (!isEnabled) return [];
  
  const pageContent = document.documentElement.innerHTML.toLowerCase();
  const foundGateways = [];
  
  PAYMENT_GATEWAYS.forEach(gateway => {
    const isFound = gateway.patterns.some(pattern => 
      pageContent.includes(pattern.toLowerCase())
    );
    
    if (isFound && !foundGateways.includes(gateway.name)) {
      foundGateways.push(gateway.name);
    }
  });
  
  detectedGateways = foundGateways;
  
  if (detectedGateways.length > 0) {
    showOverlay(detectedGateways);
    chrome.storage.local.set({detectedGateways: detectedGateways});
  }
  
  return detectedGateways;
}

// Show overlay with detected gateways
function showOverlay(gateways) {
  if (overlayElement) {
    removeOverlay();
  }
  
  // Create overlay element
  overlayElement = document.createElement('div');
  overlayElement.className = 'pgd-overlay pgd-animate-in';
  
  // Create gateway items HTML
  const gatewaysHtml = gateways.map((gateway, index) => `
    <div class="pgd-gateway-item" style="animation-delay: ${index * 50}ms">
      <div class="pgd-gateway-name">${gateway}</div>
    </div>
  `).join('');
  
  // Set overlay HTML
  overlayElement.innerHTML = `
    <div class="pgd-header">
      <div class="pgd-title">Payment Gateways Detected</div>
      <button class="pgd-close">&times;</button>
    </div>
    <div class="pgd-content">
      ${gatewaysHtml}
    </div>
  `;
  
  // Add to page
  document.body.appendChild(overlayElement);
  
  // Add close button event
  overlayElement.querySelector('.pgd-close').addEventListener('click', removeOverlay);
  
  // Auto hide after 10 seconds
  setTimeout(() => {
    if (overlayElement) {
      removeOverlay();
    }
  }, 10000);
}

// Remove overlay
function removeOverlay() {
  if (!overlayElement) return;
  
  overlayElement.className = overlayElement.className.replace('pgd-animate-in', 'pgd-animate-out');
  
  setTimeout(() => {
    if (overlayElement && overlayElement.parentNode) {
      overlayElement.parentNode.removeChild(overlayElement);
      overlayElement = null;
    }
  }, 300);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
