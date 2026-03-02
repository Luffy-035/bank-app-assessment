const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const validate = require('../middleware/validate');
const {
    getProperties, addProperty, getProperty,
    updateProperty, deleteProperty, getUnits, addUnit,
} = require('../controllers/property.controller');

router.use(protect, requireRole('landlord', 'admin'));

router.route('/').get(getProperties).post(
    [
        body('name').trim().notEmpty().withMessage('Property name required'),
        body('type').isIn(['building', 'floor', 'pg']).withMessage('Type must be building, floor, or pg'),
        body('address').trim().notEmpty().withMessage('Address required'),
    ],
    validate,
    addProperty
);

router.route('/:id').get(getProperty).put(updateProperty).delete(deleteProperty);
router.route('/:id/units').get(getUnits).post(
    [
        body('floorNumber').isInt({ min: 0 }).withMessage('Floor number required'),
        body('unitNumber').trim().notEmpty().withMessage('Unit number required'),
        body('rentAmount').isFloat({ min: 0 }).withMessage('Rent amount required'),
    ],
    validate,
    addUnit
);

module.exports = router;
