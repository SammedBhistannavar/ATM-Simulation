const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/superadmin.controller');
const { protect, authorize } = require('../middleware/auth');

const sa = [protect, authorize('superadmin')];

router.get('/dashboard',          ...sa, ctrl.getDashboard);
router.get('/admins',             ...sa, ctrl.getAllAdmins);
router.post('/admins',            ...sa, ctrl.createAdmin);
router.patch('/admins/:id/toggle',...sa, ctrl.toggleAdminStatus);
router.delete('/admins/:id',      ...sa, ctrl.deleteAdmin);
router.get('/users',              ...sa, ctrl.getAllUsers);
router.get('/accounts',           ...sa, ctrl.getAllAccounts);
router.get('/transactions',       ...sa, ctrl.getAllTransactions);

module.exports = router;
