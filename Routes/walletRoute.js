const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const walletController = require('../Controllers/walletController'); // Note lowercase 'c'

// Enable authentication middleware
router.use(isAuthenticated);

// Get wallet info and balance
router.get('/info', walletController.getWalletInfo);

// Add funds to wallet
router.post('/add-funds', walletController.addFunds);

// Get transaction history
router.get('/transactions', walletController.getTransactionHistory);

// Deduct funds from wallet
router.post('/deduct-funds', walletController.deductFundsExpress);

module.exports = router;