const express = require('express');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const auth = require('../controllers/authController');
const categories = require('../controllers/categoryController');
const products = require('../controllers/productController');
const orders = require('../controllers/orderController');
const misc = require('../controllers/miscController');
const { handleUpload } = require('../controllers/uploadController');

const router = express.Router();
const admin = [protect, adminOnly];

router.get('/health', (req, res) => res.json({ ok: true, service: 'wlidishop', time: new Date().toISOString() }));

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', protect, auth.me);
router.put('/auth/me', protect, auth.updateMe);

// Categories
router.get('/categories', optionalAuth, categories.list);
router.get('/categories/:idOrSlug', categories.get);
router.post('/categories', admin, categories.create);
router.put('/categories/:id', admin, categories.update);
router.delete('/categories/:id', admin, categories.remove);

// Products
router.get('/products', optionalAuth, products.list);
router.get('/products/:idOrSlug', optionalAuth, products.get);
router.post('/products', admin, products.create);
router.put('/products/:id', admin, products.update);
router.delete('/products/:id', admin, products.remove);

// Orders
router.post('/orders', optionalAuth, orders.create);
router.get('/orders/mine', protect, orders.mine);
router.get('/orders', admin, orders.list);
router.get('/orders/:id', admin, orders.get);
router.put('/orders/:id', admin, orders.update);
router.delete('/orders/:id', admin, orders.remove);

// Shipping rates
router.get('/shipping', optionalAuth, misc.listShipping);
router.put('/shipping/bulk', admin, misc.bulkShipping);
router.put('/shipping/:id', admin, misc.updateShipping);

// Site content
router.get('/settings', misc.getSettings);
router.put('/settings', admin, misc.updateSettings);

// Carts
router.get('/carts', admin, misc.listCarts);
router.delete('/carts/:id', admin, misc.deleteCart);
router.get('/cart/:sessionId', misc.getCart);
router.put('/cart/:sessionId', optionalAuth, misc.saveCart);

// Users
router.get('/users', admin, misc.listUsers);
router.post('/users', admin, misc.createUser);
router.put('/users/:id', admin, misc.updateUser);
router.delete('/users/:id', admin, misc.deleteUser);

// Dashboard
router.get('/stats', admin, misc.stats);

// Uploads (Multer)
router.post('/upload', admin, upload.single('file'), handleUpload);
router.post('/uploads', admin, upload.array('files', 10), handleUpload);

module.exports = router;
