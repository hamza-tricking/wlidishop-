const Order = require('../models/Order');
const Product = require('../models/Product');
const ShippingRate = require('../models/ShippingRate');
const Cart = require('../models/Cart');

// Prices and shipping are always recomputed from the database, never trusted from the client.
exports.create = async (req, res) => {
  const { items, customer, deliveryType = 'home', sessionId, note, lang } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order has no items' });
  }
  if (!customer?.name || !customer?.phone || !customer?.wilayaCode) {
    return res.status(400).json({ message: 'Name, phone and wilaya are required' });
  }
  if (!/^0[5-7]\d{8}$/.test(String(customer.phone).replace(/\s/g, ''))) {
    return res.status(400).json({ message: 'Invalid phone number' });
  }

  const rate = await ShippingRate.findOne({ code: customer.wilayaCode, active: true });
  if (!rate) return res.status(400).json({ message: 'Delivery not available for this wilaya' });

  const ids = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids }, active: true });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const orderItems = [];
  for (const item of items) {
    const p = byId.get(String(item.product));
    if (!p) return res.status(400).json({ message: 'A product in the order is no longer available' });
    const qty = Math.max(parseInt(item.qty, 10) || 1, 1);
    orderItems.push({
      product: p._id,
      name: p.name?.[lang] || p.name?.ar,
      image: p.images?.[0] || '',
      price: p.price,
      qty,
    });
  }

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const allFree = orderItems.every((i) => byId.get(String(i.product))?.freeShipping);
  const type = deliveryType === 'desk' && rate.deskEnabled ? 'desk' : 'home';
  const shippingPrice = allFree ? 0 : type === 'desk' ? rate.deskPrice : rate.homePrice;

  const order = await Order.create({
    user: req.user?._id,
    items: orderItems,
    customer: {
      name: customer.name,
      phone: String(customer.phone).replace(/\s/g, ''),
      wilayaCode: rate.code,
      wilaya: rate.name?.ar,
      commune: customer.commune || '',
      address: customer.address || '',
    },
    deliveryType: type,
    subtotal,
    shippingPrice,
    total: subtotal + shippingPrice,
    note: note || '',
    lang: lang || 'ar',
  });

  await Promise.all(
    orderItems.map((i) => Product.updateOne({ _id: i.product, stock: { $gte: i.qty } }, { $inc: { stock: -i.qty } }))
  );
  if (sessionId) await Cart.updateOne({ sessionId }, { converted: true, items: [] });

  res.status(201).json(order);
};

exports.list = async (req, res) => {
  const { status, q } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const filter = {};
  if (status) filter.status = status;
  if (q) {
    const rx = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ 'customer.name': rx }, { 'customer.phone': rx }, { 'customer.wilaya': rx }];
    if (/^\d+$/.test(q)) filter.$or.push({ number: Number(q) });
  }
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
};

exports.mine = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.get = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.update = async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (status) order.status = status;
  if (note !== undefined) order.note = note;
  await order.save();
  res.json(order);
};

exports.remove = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Order deleted' });
};
