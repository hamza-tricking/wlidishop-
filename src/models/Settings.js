const mongoose = require('mongoose');
const localized = require('./localized');

// Single document holding the editable storefront content.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    storeName: { type: localized(), default: () => ({}) },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    topbar: { type: localized(), default: () => ({}) },
    heroTitle: { type: localized(), default: () => ({}) },
    heroSubtitle: { type: localized(), default: () => ({}) },
    footerAbout: { type: localized(), default: () => ({}) },
    footerCopyright: { type: localized(), default: () => ({}) },
    thankYou: { type: localized(), default: () => ({}) },
    policies: { type: localized(), default: () => ({}) },
    currency: { type: localized(), default: () => ({ ar: 'دج', en: 'DA', fr: 'DA' }) },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      youtube: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    primaryColor: { type: String, default: '#a06a40' },
    accentColor: { type: String, default: '#f9cb85' },
  },
  { timestamps: true }
);

settingsSchema.statics.getMain = async function () {
  let doc = await this.findOne({ key: 'main' });
  if (!doc) doc = await this.create({ key: 'main' });
  return doc;
};

module.exports = mongoose.model('Settings', settingsSchema);
