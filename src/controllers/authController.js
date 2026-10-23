const User = require('../models/User');
const { signToken, publicUser } = require('../utils/helpers');

exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (await User.findOne({ email: String(email).toLowerCase() })) {
    return res.status(409).json({ message: 'Email already registered' });
  }
  const user = await User.create({ name, email, password, phone });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if (!user.active) return res.status(403).json({ message: 'Account disabled' });
  res.json({ token: signToken(user), user: publicUser(user) });
};

exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

// Profile update; changing email or password requires the current password.
exports.updateMe = async (req, res) => {
  const { name, phone, email, newPassword, currentPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const changingEmail = email && email.toLowerCase() !== user.email;
  if (changingEmail || newPassword) {
    if (!currentPassword || !(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
  }
  if (changingEmail) {
    const taken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
    if (taken) return res.status(409).json({ message: 'Email already in use' });
    user.email = email;
  }
  if (newPassword) {
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    user.password = newPassword;
  }
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  await user.save();
  res.json({ user: publicUser(user), token: signToken(user) });
};
