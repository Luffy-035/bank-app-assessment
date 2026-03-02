const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const { getUnit, updateUnit } = require('../controllers/unit.controller');

router.use(protect, requireRole('landlord', 'admin'));
router.route('/:id').get(getUnit).patch(updateUnit);

module.exports = router;
