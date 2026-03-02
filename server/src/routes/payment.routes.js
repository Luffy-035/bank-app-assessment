const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const validate = require('../middleware/validate');
const { getPayments, getDues, getPaymentsByTenant, recordPayment, updatePayment, exportPayments } = require('../controllers/payment.controller');

router.use(protect);

router.get('/dues', requireRole('landlord', 'admin'), getDues);
router.get('/export', requireRole('landlord', 'admin'), exportPayments);
router.get('/tenant/:tenantId', getPaymentsByTenant);

router.route('/')
    .get(requireRole('landlord', 'admin'), getPayments)
    .post(requireRole('landlord'),
        [
            body('tenantId').notEmpty().withMessage('Tenant ID required'),
            body('month').matches(/^\d{4}-\d{2}$/).withMessage('Month must be YYYY-MM'),
            body('amountPaid').isFloat({ min: 0 }).withMessage('Amount must be a number'),
            body('paymentMode').isIn(['cash', 'upi', 'bank_transfer', 'cheque', 'other']).withMessage('Invalid payment mode'),
        ],
        validate,
        recordPayment
    );

router.patch('/:id', requireRole('landlord'), updatePayment);

module.exports = router;
