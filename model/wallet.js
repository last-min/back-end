const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  transactions: [{
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    relatedPurchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp before saving
walletSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Instance methods
walletSchema.methods.addFunds = async function(amount, description = 'Deposit') {
  if (amount <= 0) throw new Error('Amount must be positive');
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Use findOneAndUpdate for atomic operation
    const updatedWallet = await this.constructor.findOneAndUpdate(
      { _id: this._id },
      {
        $inc: { balance: amount },
        $push: {
          transactions: {
            type: 'credit',
            amount: amount,
            description: description,
            createdAt: new Date()
          }
        },
        $set: { lastUpdated: new Date() }
      },
      { new: true, session }
    );

    await session.commitTransaction();
    Object.assign(this, updatedWallet.toObject());
    return this;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

walletSchema.methods.deductFunds = async function(amount, description = 'Withdrawal', purchaseId = null) {
  if (amount <= 0) throw new Error('Amount must be positive');
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Use findOneAndUpdate with conditions for atomic operation
    const updatedWallet = await this.constructor.findOneAndUpdate(
      { 
        _id: this._id,
        balance: { $gte: amount } // Ensure sufficient balance
      },
      {
        $inc: { balance: -amount },
        $push: {
          transactions: {
            type: 'debit',
            amount: amount,
            description: description,
            relatedPurchase: purchaseId,
            createdAt: new Date()
          }
        },
        $set: { lastUpdated: new Date() }
      },
      { new: true, session }
    );

    if (!updatedWallet) {
      throw new Error('Insufficient funds or wallet not found');
    }

    await session.commitTransaction();
    Object.assign(this, updatedWallet.toObject());
    return this;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Static methods
walletSchema.statics.findOrCreateWallet = async function(userId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    let wallet = await this.findOne({ userId: userId }).session(session);
    
    if (!wallet) {
      wallet = new this({
        userId: userId,
        balance: 0
      });
      await wallet.save({ session });
    }
    
    await session.commitTransaction();
    return wallet;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

walletSchema.statics.getTransactionHistory = async function(userId, limit = 10) {
  const wallet = await this.findOne({ userId: userId })
    .populate({
      path: 'transactions.relatedPurchase',
      select: 'productId amount status'
    });
  
  if (!wallet) throw new Error('Wallet not found');
  
  return wallet.transactions
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;