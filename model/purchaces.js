const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "refunded", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "crypto"],
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ["pending", "delivered"],
    default: "pending",
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
