const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

const adm = [protect, authorize('admin', 'superadmin')];

router.get('/dashboard',                  ...adm, ctrl.getDashboard);
router.get('/users',                      ...adm, ctrl.getAllUsers);
router.post('/users',                     ...adm, ctrl.createUser);
router.patch('/users/:id/toggle',         ...adm, ctrl.toggleUserStatus);
router.get('/accounts',                   ...adm, ctrl.getAllAccounts);
router.post('/accounts',                  ...adm, ctrl.createAccount);
router.patch('/accounts/:id/toggle',      ...adm, ctrl.toggleAccountStatus);
router.patch('/accounts/:id/daily-limit', ...adm, ctrl.updateDailyLimit);
router.get('/transactions',               ...adm, ctrl.getAllTransactions);

module.exports = router;
