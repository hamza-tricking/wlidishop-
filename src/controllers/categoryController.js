const Category = require('../models/Category');
const Product = require('../models/Product');
const { makeSlug, pick } = require('../utils/helpers');

const FIELDS = ['name', 'description', 'slug', 'image', 'order', 'active'];

exports.list = async (req, res) => {
  const filter = req.query.all === '1' && req.user?.role === 'admin' ? {} : { active: true };
  const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 }).populate('productsCount');
  res.json(categories);
};

exports.get = async (req, res) => {
  const { idOrSlug } = req.params;
  const query = /^[a-f\d]{24}$/i.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
  const category = await Category.findOne(query).populate('productsCount');
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

exports.create = async (req, res) => {
  const data = pick(req.body, FIELDS);
  data.slug = makeSlug(data.slug || data.name?.en || data.name?.fr || data.name?.ar);
  const category = await Category.create(data);
  res.status(201).json(category);
};

exports.update = async (req, res) => {
  const data = pick(req.body, FIELDS);
  if (data.slug) data.slug = makeSlug(data.slug);
  const category = await Category.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

exports.remove = async (req, res) => {
  const count = await Product.countDocuments({ category: req.params.id });
  if (count > 0) {
    return res.status(409).json({ message: `Category still has ${count} products. Move or delete them first.` });
  }
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
};
