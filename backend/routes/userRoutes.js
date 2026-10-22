const router = require('express').Router();
const c = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// public
router.post('/login', c.login);
router.post('/register', c.register);

// any logged-in user
router.get('/me', protect, c.me);
router.get('/profile', protect, c.me);

// admin only below
router.use(protect, authorize('admin'));
router.route('/').get(c.getUsers).post(c.createUser);
router.route('/:id').put(c.updateUser).delete(c.deleteUser);

module.exports = router;
