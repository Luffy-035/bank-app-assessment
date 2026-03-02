const Unit = require('../models/Unit');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/v1/units/:id
const getUnit = asyncHandler(async (req, res) => {
    const unit = await Unit.findOne({ _id: req.params.id, landlordId: req.user._id })
        .populate({ path: 'currentTenantId', populate: { path: 'userId', select: 'name phone email' } })
        .populate('propertyId', 'name address');
    if (!unit) return res.status(404).json({ success: false, message: 'Unit not found.' });
    res.json({ success: true, unit });
});

// @route   PATCH /api/v1/units/:id
const updateUnit = asyncHandler(async (req, res) => {
    const { unitConfig, rentAmount, unitNumber } = req.body;
    const unit = await Unit.findOneAndUpdate(
        { _id: req.params.id, landlordId: req.user._id },
        { unitConfig, rentAmount, unitNumber },
        { new: true, runValidators: true }
    );
    if (!unit) return res.status(404).json({ success: false, message: 'Unit not found.' });
    res.json({ success: true, unit });
});

module.exports = { getUnit, updateUnit };
