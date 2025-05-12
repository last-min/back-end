const Wallet = require('../model/wallet');
const User = require('../model/user');

// Get wallet balance and basic info
exports.getWalletInfo = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const wallet = await Wallet.findOrCreateWallet(userId);
    console.log('Wallet fetched for user:', userId, wallet);

    const transactions = wallet.transactions.map(tx => ({
      ...tx.toObject(),
      createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        lastUpdated: wallet.lastUpdated instanceof Date ? wallet.lastUpdated.toISOString() : wallet.lastUpdated,
        transactions
      }
    });
  } catch (error) {
    console.error('getWalletInfo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet info: ' + error.message
    });
  }
};

// Add funds to wallet
exports.addFunds = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wallet = await Wallet.findOrCreateWallet(userId);
    await wallet.addFunds(amount, description);
    console.log('Funds added successfully for user:', userId, 'New balance:', wallet.balance);

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        transaction: wallet.transactions[wallet.transactions.length - 1]
      }
    });
  } catch (error) {
    console.error('addFunds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add funds: ' + error.message
    });
  }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const limit = parseInt(req.query.limit) || 10;
    const transactions = await Wallet.getTransactionHistory(userId, limit);

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('getTransactionHistory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history: ' + error.message
    });
  }
};

// Internal deduct funds helper
exports.deductFunds = async (userId, amount, description, purchaseId) => {
  const wallet = await Wallet.findOrCreateWallet(userId);
  return wallet.deductFunds(amount, description, purchaseId);
};

// Express-compatible deductFunds endpoint
exports.deductFundsExpress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { amount, description, purchaseId } = req.body;
    
    console.log('Attempting to deduct funds:', { userId, amount, description, purchaseId });

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User authentication required' 
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    const wallet = await Wallet.findOrCreateWallet(userId);
    
    if (!wallet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wallet not found' 
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient funds' 
      });
    }

    await exports.deductFunds(userId, amount, description, purchaseId);
    console.log('Funds deducted successfully for user:', userId, 'Amount:', amount);
    
    // Fetch the updated wallet to get the accurate balance
    const updatedWallet = await Wallet.findOne({ userId });
    
    res.status(200).json({ 
      success: true, 
      message: 'Funds deducted successfully',
      data: {
        newBalance: updatedWallet.balance,
        deductedAmount: amount
      }
    });
  } catch (error) {
    console.error('Error deducting funds:', error);
    
    // Determine the appropriate error status
    let status = 500;
    if (error.message.includes('Insufficient funds')) {
      status = 400;
    } else if (error.message.includes('not found')) {
      status = 404;
    } else if (error.message.includes('authentication')) {
      status = 401;
    }
    
    res.status(status).json({ 
      success: false, 
      message: error.message || 'Failed to deduct funds'
    });
  }
};