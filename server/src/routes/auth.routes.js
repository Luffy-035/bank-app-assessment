const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadSingle } = require('../middleware/upload');
const { register, login, getMe, updatePushToken, updateMe } = require('../controllers/auth.controller');
const { uploadSignature } = require('../controllers/upload.controller');

// Register — email optional (landlords send it, tenants don't)
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email')
            .optional({ checkFalsy: true })
            .isEmail()
            .withMessage('Valid email required'),
        body('phone').trim().notEmpty().withMessage('Phone is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').isIn(['landlord', 'tenant']).withMessage('Role must be landlord or tenant'),
        body('bankDetails.bankName').optional().isString().trim(),
        body('bankDetails.accountNumber').optional().isString().trim(),
        body('bankDetails.ifsc').optional().isString().trim(),
        body('signatureUrl').optional().isString().trim(),
    ],
    validate,
    register
);

// Login
router.post('/login', login);

// Upload signature image (protected — user must be logged in first to attach to their profile)
// Or used during onboarding right after registration before navigating
router.post('/upload-signature', protect, uploadSingle, uploadSignature);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.patch('/push-token', protect, updatePushToken);

module.exports = router;
