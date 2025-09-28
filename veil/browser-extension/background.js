// Background service worker for the Veil Midnight extension
console.log('Veil Extension Background Script Loaded');

// Extension installation/update handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  
  // Set default storage values
  chrome.storage.local.set({
    isConnected: false,
    networkType: 'testnet',
    walletAddress: null,
    contractAddress: null
  });
});

// Message handler for popup and content script communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  switch (message.type) {
    case 'CONNECT_WALLET':
      handleWalletConnection(sendResponse);
      return true; // Keep message channel open for async response

    case 'GET_VOTE_COUNT':
      handleGetVoteCount(sendResponse);
      return true;

    case 'SUBMIT_VOTE':
      handleSubmitVote(sendResponse);
      return true;

    case 'GET_CONNECTION_STATUS':
      handleGetConnectionStatus(sendResponse);
      return true;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

async function handleWalletConnection(sendResponse) {
  try {
    // In a real implementation, this would connect to Midnight wallet
    // For now, we'll simulate the connection
    const connectionResult = await simulateWalletConnection();
    
    await chrome.storage.local.set({
      isConnected: connectionResult.success,
      walletAddress: connectionResult.walletAddress,
      networkType: 'testnet'
    });

    sendResponse({
      success: connectionResult.success,
      walletAddress: connectionResult.walletAddress,
      network: 'testnet'
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleGetVoteCount(sendResponse) {
  try {
    const storage = await chrome.storage.local.get(['isConnected']);
    
    if (!storage.isConnected) {
      sendResponse({ success: false, error: 'Wallet not connected' });
      return;
    }

    // Simulate getting vote count from contract
    const voteCount = await simulateGetVoteCount();
    
    sendResponse({
      success: true,
      voteCount: voteCount
    });
  } catch (error) {
    console.error('Get vote count error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleSubmitVote(sendResponse) {
  try {
    const storage = await chrome.storage.local.get(['isConnected']);
    
    if (!storage.isConnected) {
      sendResponse({ success: false, error: 'Wallet not connected' });
      return;
    }

    // Simulate submitting vote to contract
    const result = await simulateSubmitVote();
    
    sendResponse({
      success: result.success,
      transactionHash: result.transactionHash
    });
  } catch (error) {
    console.error('Submit vote error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleGetConnectionStatus(sendResponse) {
  try {
    const storage = await chrome.storage.local.get([
      'isConnected', 
      'walletAddress', 
      'networkType',
      'contractAddress'
    ]);
    
    sendResponse({
      success: true,
      isConnected: storage.isConnected || false,
      walletAddress: storage.walletAddress,
      network: storage.networkType || 'testnet',
      contractAddress: storage.contractAddress
    });
  } catch (error) {
    console.error('Get connection status error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Simulation functions - replace these with actual Midnight integration
async function simulateWalletConnection() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        walletAddress: '0x' + Math.random().toString(16).substr(2, 40)
      });
    }, 1500);
  });
}

async function simulateGetVoteCount() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random vote count between 0-1000
      resolve(Math.floor(Math.random() * 1000));
    }, 800);
  });
}

async function simulateSubmitVote() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
      });
    }, 2000);
  });
}

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if this is a localhost development page
    if (tab.url.includes('localhost') || tab.url.includes('127.0.0.1')) {
      console.log('Detected local development page, injecting Midnight provider');
      
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['injected.js']
      }).catch(err => {
        console.log('Could not inject script:', err);
      });
    }
  }
});