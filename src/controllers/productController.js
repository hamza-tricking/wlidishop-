const Product = require('../models/Product');
const Category = require('../models/Category');
const { makeSlug, pick } = require('../utils/helpers');

const FIELDS = [
  'name',
  'description',
  'slug',
  'sku',
  'price',
  'oldPrice',
  'images',
  'category',
  'stock',
  'rating',
  'featured',
  'freeShipping',
  'active',
  'order',
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.list = async (req, res) => {
  const { category, q, featured, sort = 'order', all } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 24, 1), 100);

  const filter = {};
  if (!(all === '1' && req.user?.role === 'admin')) filter.active = true;
  if (featured === '1') filter.featured = true;
  if (category) {
    const cat = /^[a-f\d]{24}$/i.test(category)
      ? { _id: category }
      : await Category.findOne({ slug: category }).lean();
    filter.category = cat?._id || null;
  }
  if (q) {
    const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
    filter.$or = [{ 'name.ar': rx }, { 'name.en': rx }, { 'name.fr': rx }, { sku: rx }];
  }

  const sorts = {
    order: { order: 1, createdAt: -1 },
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
  };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sorts[sort] || sorts.order)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug'),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
};

exports.get = async (req, res) => {
  const { idOrSlug } = req.params;
  const query = /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
  const product = await Product.findOne(query).populate('category', 'name slug');
  if (!product || (!product.active && req.user?.role !== 'admin')) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const related = await Product.find({ category: product.category?._id, _id: { $ne: product._id }, active: true })
    .limit(8)
    .populate('category', 'name slug');
  res.json({ product, related });
};

exports.create = async (req, res) => {
  const data = pick(req.body, FIELDS);
  let slug = makeSlug(data.slug || data.name?.en || data.name?.fr || data.name?.ar);
  if (await Product.exists({ slug })) slug = `${slug}-${Date.now().toString(36)}`;
  data.slug = slug;
  const product = await Product.create(data);
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (data.slug) data.slug = makeSlug(data.slug);
  const product = await Product.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.remove = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};
