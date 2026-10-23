const mongoose = require('mongoose');
const localized = require('./localized');

const productSchema = new mongoose.Schema(
  {
    name: { type: localized(true), required: true },
    description: { type: localized(), default: () => ({}) },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    featured: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ 'name.ar': 'text', 'name.en': 'text', 'name.fr': 'text' });

module.exports = mongoose.model('Product', productSchema);
