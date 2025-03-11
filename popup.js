document.addEventListener('DOMContentLoaded', function() {
  const toggleExtension = document.getElementById('toggleExtension');
  const scanButton = document.getElementById('scanButton');
  const gatewayList = document.getElementById('gatewayList');
  
  // Load saved settings
  chrome.storage.local.get({isEnabled: true, detectedGateways: []}, function(data) {
    toggleExtension.checked = data.isEnabled;
    
    if (data.detectedGateways && data.detectedGateways.length > 0) {
      displayGateways(data.detectedGateways);
    }
  });
  
  // Toggle extension
  toggleExtension.addEventListener('change', function() {
    const isEnabled = toggleExtension.checked;
    chrome.storage.local.set({isEnabled: isEnabled});
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleExtension',
          isEnabled: isEnabled
        });
      }
    });
  });
  
  // Scan button
  scanButton.addEventListener('click', function() {
    scanButton.textContent = 'Scanning...';
    scanButton.disabled = true;
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'scanPage'}, function(response) {
          scanButton.textContent = 'Scan Current Page';
          scanButton.disabled = false;
          
          if (response && response.gateways) {
            displayGateways(response.gateways);
            chrome.storage.local.set({detectedGateways: response.gateways});
          }
        });
      } else {
        scanButton.textContent = 'Scan Current Page';
        scanButton.disabled = false;
      }
    });
  });
  
  // Get current detections when popup opens
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'getDetections'}, function(response) {
        if (chrome.runtime.lastError) {
          // Content script not ready
          return;
        }
        
        if (response && response.gateways) {
          displayGateways(response.gateways);
        }
      });
    }
  });
  
  // Function to display gateways
  function displayGateways(gateways) {
    if (!gateways || gateways.length === 0) {
      gatewayList.innerHTML = '<div class="empty-message">No gateways detected on this page.</div>';
      return;
    }
    
    let html = '';
    gateways.forEach((gateway) => {
      html += `
        <div class="gateway-item">
          ${gateway}
        </div>
      `;
    });
    
    gatewayList.innerHTML = html;
  }
});
