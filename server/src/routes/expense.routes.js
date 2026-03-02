const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const protect = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const validate = require('../middleware/validate');
const { getExpenses, createExpense, deleteExpense } = require('../controllers/expense.controller');

// All routes require authentication and landlord role
router.use(protect);
router.use(requireRole('landlord', 'admin'));

router.route('/')
    .get(getExpenses)
    .post(
        [
            body('label').trim().notEmpty().withMessage('Label is required'),
            body('category')
                .isIn(['maintenance', 'utilities', 'insurance', 'staff', 'other'])
                .withMessage('Invalid category'),
            body('amount')
                .isFloat({ min: 0 })
                .withMessage('Amount must be a non-negative number'),
        ],
        validate,
        createExpense
    );

router.delete('/:id', deleteExpense);

module.exports = router;
