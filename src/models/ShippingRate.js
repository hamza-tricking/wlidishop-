const mongoose = require('mongoose');
const localized = require('./localized');

const shippingRateSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: localized(true), required: true },
    homePrice: { type: Number, default: 0, min: 0 },
    deskPrice: { type: Number, default: 0, min: 0 },
    homeEnabled: { type: Boolean, default: true },
    deskEnabled: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShippingRate', shippingRateSchema);
