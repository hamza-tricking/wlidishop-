const mongoose = require('mongoose');

// Carts are synced from the storefront (guests by sessionId, members by user)
// so the dashboard can see what visitors are about to buy.
const cartSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, min: 1, default: 1 },
      },
    ],
    converted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
