const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const { getUsers, getUserById, updateUser, getAllMaintenance, updateComplaint, getSummary } = require('../controllers/admin.controller');

router.use(protect, requireRole('admin'));

router.get('/users', getUsers);
router.route('/users/:id').get(getUserById).patch(updateUser);
router.get('/maintenance', getAllMaintenance);
router.patch('/maintenance/:id', updateComplaint);
router.get('/summary', getSummary);

module.exports = router;
