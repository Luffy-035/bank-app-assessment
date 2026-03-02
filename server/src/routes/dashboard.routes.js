const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const { getStats, getCollectionBreakdown, getRecentActivity } = require('../controllers/dashboard.controller');

router.use(protect, requireRole('landlord', 'admin'));

router.get('/stats', getStats);
router.get('/collection', getCollectionBreakdown);
router.get('/activity', getRecentActivity);

module.exports = router;
