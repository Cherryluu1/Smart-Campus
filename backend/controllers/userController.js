const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const publicUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profile: user.profile,
  createdAt: user.createdAt,
});

const normEmail = (e) => String(e || '').trim().toLowerCase();

// POST /api/users/login
exports.login = async (req, res) => {
  const email = normEmail(req.body.email);
  const { password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(String(password)))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ token: signToken(user._id), user: publicUser(user) });
};

// POST /api/users/register  (public self-signup -> STUDENT accounts only)
// Faculty/admin accounts are created by an admin via POST /api/users.
exports.register = async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = normEmail(req.body.email);
  const { password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must contain at least 6 characters' });
  }
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Link to an existing Student record with the same email, if there is one
  const student = await Student.findOne({ email });

  const user = await User.create({
    name,
    email,
    password: String(password),
    role: 'student',
    profile: student ? student._id : undefined,
  });

  if (student && !student.user) {
    student.user = user._id;
    await student.save();
  }

  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
};

// GET /api/users/me  and  /api/users/profile
exports.me = (req, res) => res.json(publicUser(req.user));

// ----- admin only -----
exports.createUser = async (req, res) => {
  const email = normEmail(req.body.email);
  if (!req.body.name || !email || !req.body.password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const user = await User.create({ ...req.body, email });
  res.status(201).json(publicUser(user));
};

exports.getUsers = async (req, res) => res.json(await User.find().select('-password'));

exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (req.body.email) req.body.email = normEmail(req.body.email);
  if (!req.body.password) delete req.body.password; // don't blank the password
  Object.assign(user, req.body);
  await user.save();
  res.json(publicUser(user));
};

exports.deleteUser = async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
