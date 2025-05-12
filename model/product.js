const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["available", "sold", "cancelled"],
    default: "available",
  },
  category: { type: String }, // Optional

  // Type-specific metadata
  metadata: {
    concertTicket: {
      eventName: { type: String },
      eventDate: { type: Date },
      seat: { type: String },
    },
    movieTicket: {
      movieName: { type: String },
      showtime: { type: Date },
    },
    gamingAccount: {
      game: { type: String },
      rank: { type: String },
      skins: [String],
      platform: { type: String },
    },
    socialMediaAccount: {
      platform: { type: String },
      followers: { type: Number },
    },
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
