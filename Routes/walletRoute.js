const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

const {
  getWalletInfo,
  addFunds,
  getTransactionHistory
} = require('../controllers/walletController');

// Enable authentication middleware
router.use(isAuthenticated);

// Get wallet info and balance
router.get('/info', getWalletInfo);

// Add funds to wallet
router.post('/add-funds', addFunds);

// Get transaction history
router.get('/transactions', getTransactionHistory);

// Deduct funds from wallet (for purchases)
router.post('/deduct-funds', async (req, res) => {
  console.log('Received data:', req.body); // Debug log
  try {
    const { amount, description, purchaseId } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    await require('../Controllers/walletController').deductFundsExpress(req, res);
  } catch (error) {
    console.error('Error in deduct-funds route:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to deduct funds'
    });
  }
});

module.exports = router;