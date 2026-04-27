const express = require('express');
const router = express.Router();
const { register, login, getMe, changePassword,forgotPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
