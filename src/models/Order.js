const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    number: { type: Number, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      wilayaCode: { type: String, required: true },
      wilaya: { type: String, required: true },
      commune: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
    },
    deliveryType: { type: String, enum: ['home', 'desk'], default: 'home' },
    subtotal: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    note: { type: String, default: '' },
    lang: { type: String, default: 'ar' },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function () {
  if (this.number) return;
  const last = await this.constructor.findOne({}, { number: 1 }).sort({ number: -1 }).lean();
  this.number = (last?.number || 1000) + 1;
});

module.exports = mongoose.model('Order', orderSchema);
