const Expense = require('../models/Expense');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all expenses for the logged-in landlord
// @route   GET /api/v1/expenses
const getExpenses = asyncHandler(async (req, res) => {
    const landlordId = req.user._id;

    // Optional filters
    const filter = { landlordId };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.month) {
        // month = YYYY-MM, match all expenses in that calendar month
        const [year, month] = req.query.month.split('-').map(Number);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ success: true, count: expenses.length, total, expenses });
});

// @desc    Create a new expense
// @route   POST /api/v1/expenses
const createExpense = asyncHandler(async (req, res) => {
    const { label, category, amount, incurredBy, date } = req.body;

    const expense = await Expense.create({
        landlordId: req.user._id,
        label,
        category,
        amount,
        incurredBy: incurredBy || '',
        date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({ success: true, expense });
});

// @desc    Delete an expense
// @route   DELETE /api/v1/expenses/:id
const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findOneAndDelete({
        _id: req.params.id,
        landlordId: req.user._id, // ensure landlord owns it
    });

    if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense not found.' });
    }

    res.json({ success: true, message: 'Expense deleted.' });
});

module.exports = { getExpenses, createExpense, deleteExpense };
