const ShippingRate = require('../models/ShippingRate');
const Settings = require('../models/Settings');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { publicUser, pick } = require('../utils/helpers');

/* ---------- Shipping ---------- */
exports.listShipping = async (req, res) => {
  const filter = req.query.all === '1' && req.user?.role === 'admin' ? {} : { active: true };
  res.json(await ShippingRate.find(filter).sort({ code: 1 }));
};

exports.updateShipping = async (req, res) => {
  const data = pick(req.body, ['name', 'homePrice', 'deskPrice', 'homeEnabled', 'deskEnabled', 'active']);
  const rate = await ShippingRate.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true });
  if (!rate) return res.status(404).json({ message: 'Wilaya not found' });
  res.json(rate);
};

exports.bulkShipping = async (req, res) => {
  const { homePrice, deskPrice } = req.body;
  const set = {};
  if (homePrice !== undefined && homePrice !== '') set.homePrice = Number(homePrice);
  if (deskPrice !== undefined && deskPrice !== '') set.deskPrice = Number(deskPrice);
  await ShippingRate.updateMany({}, { $set: set });
  res.json(await ShippingRate.find().sort({ code: 1 }));
};

/* ---------- Settings / site content ---------- */
exports.getSettings = async (req, res) => {
  res.json(await Settings.getMain());
};

exports.updateSettings = async (req, res) => {
  const data = pick(req.body, [
    'storeName',
    'logo',
    'favicon',
    'topbar',
    'heroTitle',
    'heroSubtitle',
    'footerAbout',
    'footerCopyright',
    'thankYou',
    'policies',
    'currency',
    'social',
    'primaryColor',
    'accentColor',
  ]);
  const settings = await Settings.findOneAndUpdate({ key: 'main' }, data, { returnDocument: 'after', upsert: true, runValidators: true });
  res.json(settings);
};

/* ---------- Carts ---------- */
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ sessionId: req.params.sessionId }).populate('items.product');
  res.json(cart || { sessionId: req.params.sessionId, items: [] });
};

exports.saveCart = async (req, res) => {
  const items = (Array.isArray(req.body.items) ? req.body.items : [])
    .filter((i) => /^[a-f\d]{24}$/i.test(String(i.product)))
    .slice(0, 50)
    .map((i) => ({ product: i.product, qty: Math.max(parseInt(i.qty, 10) || 1, 1) }));
  const update = { items, converted: false };
  if (req.user) update.user = req.user._id;
  const cart = await Cart.findOneAndUpdate({ sessionId: req.params.sessionId }, update, { returnDocument: 'after', upsert: true });
  res.json(cart);
};

exports.listCarts = async (req, res) => {
  const carts = await Cart.find({ 'items.0': { $exists: true } })
    .sort({ updatedAt: -1 })
    .limit(200)
    .populate('items.product', 'name price images slug')
    .populate('user', 'name email phone');
  res.json(carts);
};

exports.deleteCart = async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: 'Cart deleted' });
};

/* ---------- Users (admin) ---------- */
exports.listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  const counts = await Order.aggregate([{ $match: { user: { $ne: null } } }, { $group: { _id: '$user', n: { $sum: 1 } } }]);
  const byUser = new Map(counts.map((c) => [String(c._id), c.n]));
  res.json(users.map((u) => ({ ...publicUser(u), orders: byUser.get(String(u._id)) || 0 })));
};

exports.createUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  const user = await User.create({ name, email, password, phone, role: role === 'admin' ? 'admin' : 'customer' });
  res.status(201).json(publicUser(user));
};

exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const isSelf = String(user._id) === String(req.user._id);
  const { name, phone, role, active, password } = req.body;
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (!isSelf && role) user.role = role === 'admin' ? 'admin' : 'customer';
  if (!isSelf && active !== undefined) user.active = !!active;
  if (password) user.password = password;
  await user.save();
  res.json(publicUser(user));
};

exports.deleteUser = async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

/* ---------- Dashboard stats ---------- */
exports.stats = async (req, res) => {
  // Day buckets are computed in UTC to match $dateToString.
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - 13);

  const [products, categories, users, orders, byStatus, revenueAgg, daily, recent, openCarts, lowStock] =
    await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled', 'returned'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: { $sum: '$total' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(6),
      Cart.countDocuments({ 'items.0': { $exists: true }, converted: false }),
      Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 }).limit(6).select('name stock images slug'),
    ]);

  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    const hit = daily.find((x) => x._id === key);
    days.push({ date: key, orders: hit?.orders || 0, revenue: hit?.revenue || 0 });
  }

  res.json({
    products,
    categories,
    users,
    orders,
    openCarts,
    revenue: revenueAgg[0]?.total || 0,
    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.n])),
    days,
    recent,
    lowStock,
  });
};
