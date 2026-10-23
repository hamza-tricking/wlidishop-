// Seeds categories, products, shipping rates and site content.
// usage: npm run seed            -> upserts catalog, keeps existing site content
//        npm run seed -- --force -> also resets the site content to the defaults
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ShippingRate = require('../models/ShippingRate');
const Settings = require('../models/Settings');
const { categories, products, settings } = require('./data');
const wilayas = require('./wilayas');

const UPLOADS = path.join(__dirname, '../../uploads');
const force = process.argv.includes('--force');

// Only reference images that actually exist in uploads/.
const file = (name) => (name && fs.existsSync(path.join(UPLOADS, name)) ? `/files/${name}` : '');

async function run() {
  await connectDB();

  const catIds = {};
  for (const c of categories) {
    const doc = await Category.findOneAndUpdate(
      { slug: c.slug },
      { ...c, image: file(c.image), active: true },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    catIds[c.slug] = doc._id;
  }
  console.log(`Categories: ${categories.length}`);

  for (const [i, p] of products.entries()) {
    await Product.findOneAndUpdate(
      { slug: p.slug },
      {
        ...p,
        category: catIds[p.category],
        images: p.images.map(file).filter(Boolean),
        featured: !!p.featured,
        active: true,
        order: i,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`Products: ${products.length}`);

  for (const [code, latin, ar, home, desk] of wilayas) {
    const exists = await ShippingRate.exists({ code });
    if (exists && !force) continue;
    await ShippingRate.findOneAndUpdate(
      { code },
      {
        code,
        name: { ar, en: latin, fr: latin },
        homePrice: home,
        deskPrice: desk,
        deskEnabled: desk > 0,
        homeEnabled: true,
        active: true,
      },
      { upsert: true }
    );
  }
  console.log(`Shipping rates: ${wilayas.length}`);

  const current = await Settings.findOne({ key: 'main' });
  if (!current || force) {
    await Settings.findOneAndUpdate({ key: 'main' }, { ...settings, logo: file(settings.logo) }, { upsert: true });
    console.log('Site content: written');
  } else {
    console.log('Site content: kept (use --force to reset)');
  }

  await mongoose.disconnect();
  console.log('Seed done');
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
