// Shared sub-schema for text stored in the three site languages.
const mongoose = require('mongoose');

const localized = (required = false) =>
  new mongoose.Schema(
    {
      ar: { type: String, trim: true, default: '', required },
      en: { type: String, trim: true, default: '' },
      fr: { type: String, trim: true, default: '' },
    },
    { _id: false }
  );

module.exports = localized;
