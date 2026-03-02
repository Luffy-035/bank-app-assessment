const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const validate = require('../middleware/validate');
const { getTenants, getMyProfile, getTenant, addTenant, updateTenant, moveTenantOut } = require('../controllers/tenant.controller');

router.use(protect);

// Tenant self — must come before /:id
router.get('/me', requireRole('tenant'), getMyProfile);

// Landlord-only routes
router.route('/')
    .get(requireRole('landlord', 'admin'), getTenants)
    .post(requireRole('landlord'),
        [
            body('name').trim().notEmpty().withMessage('Name required'),
            body('phone').trim().notEmpty().withMessage('Phone required'),
            body('unitId').notEmpty().withMessage('Unit ID required'),
            body('rentAmount').isFloat({ min: 1 }).withMessage('Rent amount required'),
        ],
        validate,
        addTenant
    );

router.route('/:id')
    .get(requireRole('landlord', 'admin'), getTenant)
    .patch(requireRole('landlord'), updateTenant);

router.patch('/:id/moveout', requireRole('landlord'), moveTenantOut);

module.exports = router;
