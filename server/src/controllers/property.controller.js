const Property = require('../models/Property');
const Unit = require('../models/Unit');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/v1/properties
const getProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find({ landlordId: req.user._id, isActive: true }).sort({ createdAt: -1 });

    // Attach unit counts
    const enriched = await Promise.all(
        properties.map(async (p) => {
            const [total, occupied] = await Promise.all([
                Unit.countDocuments({ propertyId: p._id }),
                Unit.countDocuments({ propertyId: p._id, status: 'occupied' }),
            ]);
            return { ...p.toObject(), unitCount: total, occupiedCount: occupied };
        })
    );

    res.json({ success: true, properties: enriched });
});

// @route   POST /api/v1/properties
const addProperty = asyncHandler(async (req, res) => {
    const { name, type, address, totalFloors } = req.body;
    const property = await Property.create({ landlordId: req.user._id, name, type, address, totalFloors });
    res.status(201).json({ success: true, property });
});

// @route   GET /api/v1/properties/:id
const getProperty = asyncHandler(async (req, res) => {
    const property = await Property.findOne({ _id: req.params.id, landlordId: req.user._id });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    const units = await Unit.find({ propertyId: property._id })
        .populate({ path: 'currentTenantId', populate: { path: 'userId', select: 'name phone email' } })
        .sort({ floorNumber: 1, unitNumber: 1 });

    res.json({ success: true, property, units });
});

// @route   PUT /api/v1/properties/:id
const updateProperty = asyncHandler(async (req, res) => {
    const property = await Property.findOneAndUpdate(
        { _id: req.params.id, landlordId: req.user._id },
        req.body,
        { new: true, runValidators: true }
    );
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });
    res.json({ success: true, property });
});

// @route   DELETE /api/v1/properties/:id
const deleteProperty = asyncHandler(async (req, res) => {
    const occupied = await Unit.countDocuments({ propertyId: req.params.id, status: 'occupied' });
    if (occupied > 0) {
        return res.status(400).json({ success: false, message: 'Cannot delete property with active tenants.' });
    }
    await Property.findOneAndUpdate({ _id: req.params.id, landlordId: req.user._id }, { isActive: false });
    res.json({ success: true, message: 'Property removed.' });
});

// @route   GET /api/v1/properties/:id/units
const getUnits = asyncHandler(async (req, res) => {
    const units = await Unit.find({ propertyId: req.params.id, landlordId: req.user._id })
        .populate({ path: 'currentTenantId', populate: { path: 'userId', select: 'name phone email' } })
        .sort({ floorNumber: 1, unitNumber: 1 });
    res.json({ success: true, units });
});

// @route   POST /api/v1/properties/:id/units
const addUnit = asyncHandler(async (req, res) => {
    const property = await Property.findOne({ _id: req.params.id, landlordId: req.user._id });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    const { floorNumber, unitNumber, unitConfig, rentAmount } = req.body;
    const unit = await Unit.create({
        propertyId: property._id,
        landlordId: req.user._id,
        floorNumber,
        unitNumber,
        unitConfig,
        rentAmount,
    });
    res.status(201).json({ success: true, unit });
});

module.exports = { getProperties, addProperty, getProperty, updateProperty, deleteProperty, getUnits, addUnit };
