const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const validate = require('../middleware/validate');
const { getRequests, getRequest, raiseRequest, updateStatus } = require('../controllers/maintenance.controller');

router.use(protect);

router.route('/')
    .get(getRequests)
    .post(requireRole('tenant'),
        [
            body('title').trim().notEmpty().withMessage('Title required'),
            body('description').trim().notEmpty().withMessage('Description required'),
            body('category').isIn(['plumbing', 'electrical', 'appliance', 'structural', 'other']).withMessage('Invalid category'),
        ],
        validate,
        raiseRequest
    );

router.get('/:id', getRequest);
router.patch('/:id/status', requireRole('landlord', 'admin'), updateStatus);

module.exports = router;
