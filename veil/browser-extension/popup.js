// Popup JavaScript for Veil Midnight Extension
document.addEventListener('DOMContentLoaded', function() {
  console.log('Veil Extension Popup Loaded');

  // DOM elements
  const connectBtn = document.getElementById('connect-btn');
  const voteBtn = document.getElementById('vote-btn');
  const connectionStatus = document.getElementById('connection-status');
  const voteCount = document.getElementById('vote-count');
  const networkInfo = document.getElementById('network-info');
  const contractInfo = document.getElementById('contract-info');
  const walletInfo = document.getElementById('wallet-info');

  // Initialize popup
  initializePopup();

  // Event listeners
  connectBtn.addEventListener('click', handleConnect);
  voteBtn.addEventListener('click', handleVote);

  async function initializePopup() {
    try {
      const response = await sendMessage({ type: 'GET_CONNECTION_STATUS' });
      
      if (response.success) {
        updateUI(response);
        
        // If connected, also fetch vote count
        if (response.isConnected) {
          await fetchVoteCount();
        }
      }
    } catch (error) {
      console.error('Failed to initialize popup:', error);
      showError('Failed to initialize extension');
    }
  }

  async function handleConnect() {
    setConnecting(true);
    
    try {
      const response = await sendMessage({ type: 'CONNECT_WALLET' });
      
      if (response.success) {
        updateConnectionStatus(true, response.walletAddress, response.network);
        await fetchVoteCount();
        showSuccess('Successfully connected to Midnight Network');
      } else {
        showError(response.error || 'Failed to connect wallet');
        setConnecting(false);
      }
    } catch (error) {
      console.error('Connection error:', error);
      showError('Connection failed');
      setConnecting(false);
    }
  }

  async function handleVote() {
    if (voteBtn.disabled) return;
    
    setVoting(true);
    
    try {
      const response = await sendMessage({ type: 'SUBMIT_VOTE' });
      
      if (response.success) {
        showSuccess('Vote submitted successfully!');
        // Refresh vote count after successful vote
        setTimeout(() => fetchVoteCount(), 1000);
      } else {
        showError(response.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Vote submission error:', error);
      showError('Vote submission failed');
    } finally {
      setVoting(false);
    }
  }

  async function fetchVoteCount() {
    try {
      const response = await sendMessage({ type: 'GET_VOTE_COUNT' });
      
      if (response.success) {
        voteCount.textContent = response.voteCount.toLocaleString();
      } else {
        voteCount.textContent = 'Error';
        console.error('Failed to fetch vote count:', response.error);
      }
    } catch (error) {
      console.error('Fetch vote count error:', error);
      voteCount.textContent = 'Error';
    }
  }

  function updateUI(status) {
    if (status.isConnected) {
      updateConnectionStatus(true, status.walletAddress, status.network);
    } else {
      updateConnectionStatus(false);
    }

    // Update contract info
    contractInfo.textContent = status.contractAddress || 'Not deployed';
  }

  function updateConnectionStatus(connected, walletAddress = null, network = null) {
    if (connected) {
      connectionStatus.textContent = 'Connected to Midnight Network';
      connectionStatus.className = 'status connected';
      connectBtn.textContent = 'Connected ✓';
      connectBtn.disabled = true;
      voteBtn.disabled = false;
      
      // Update info displays
      if (walletAddress) {
        walletInfo.textContent = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
      }
      if (network) {
        networkInfo.textContent = network.charAt(0).toUpperCase() + network.slice(1);
      }
    } else {
      connectionStatus.textContent = 'Disconnected from Midnight Network';
      connectionStatus.className = 'status disconnected';
      connectBtn.textContent = 'Connect to Midnight';
      connectBtn.disabled = false;
      voteBtn.disabled = true;
      
      // Reset info displays
      walletInfo.textContent = '--';
      networkInfo.textContent = '--';
      voteCount.textContent = '--';
    }
  }

  function setConnecting(connecting) {
    if (connecting) {
      connectionStatus.textContent = 'Connecting to Midnight Network...';
      connectionStatus.className = 'status connecting';
      connectBtn.innerHTML = '<div class="loading"></div> Connecting...';
      connectBtn.disabled = true;
    }
  }

  function setVoting(voting) {
    if (voting) {
      voteBtn.innerHTML = '<div class="loading"></div> Voting...';
      voteBtn.disabled = true;
    } else {
      voteBtn.innerHTML = 'Vote';
      voteBtn.disabled = false;
    }
  }

  function showSuccess(message) {
    showNotification(message, 'success');
  }

  function showError(message) {
    showNotification(message, 'error');
  }

  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      padding: 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 1000;
      ${type === 'success' 
        ? 'background: rgba(34, 197, 94, 0.9); color: white;' 
        : 'background: rgba(239, 68, 68, 0.9); color: white;'
      }
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Utility function to send messages to background script
  function sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, resolve);
    });
  }

  // Auto-refresh vote count every 30 seconds when connected
  setInterval(async () => {
    try {
      const status = await sendMessage({ type: 'GET_CONNECTION_STATUS' });
      if (status.success && status.isConnected) {
        fetchVoteCount();
      }
    } catch (error) {
      // Silent fail for auto-refresh
    }
  }, 30000);
});