const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

const usr = [protect, authorize('user', 'admin', 'superadmin')];

router.get('/profile',            ...usr, ctrl.getProfile);
router.get('/accounts',           ...usr, ctrl.getMyAccounts);
router.post('/verify-pin',        ...usr, ctrl.verifyPin);
router.get('/balance/:accountId', ...usr, ctrl.checkBalance);
router.post('/withdraw',          ...usr, ctrl.withdraw);
router.post('/deposit',           ...usr, ctrl.deposit);
router.post('/transfer',          ...usr, ctrl.transfer);
router.get('/transactions',       ...usr, ctrl.getTransactions);
router.post('/change-pin',        ...usr, ctrl.changePin);

module.exports = router;
