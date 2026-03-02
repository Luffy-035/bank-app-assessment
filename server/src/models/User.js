const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema(
    {
        full: { type: String, default: '' },
        pincode: { type: String, default: '' },
        state: { type: String, default: '' },
        district: { type: String, default: '' },
    },
    { _id: false }
);

const bankDetailsSchema = new mongoose.Schema(
    {
        bankName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        ifsc: { type: String, default: '' },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: false,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    if (!v) return true;
                    return /^\S+@\S+\.\S+$/.test(v);
                },
                message: 'Please enter a valid email',
            },
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['landlord', 'tenant', 'admin'],
            required: [true, 'Role is required'],
        },
        profileImage: {
            type: String,
            default: null,
        },
        address: {
            type: addressSchema,
            default: () => ({}),
        },
        bankDetails: {
            type: bankDetailsSchema,
            default: () => ({}),
        },
        signatureUrl: {
            type: String,
            default: null,
        },
        pushToken: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// ── Hash password before saving ──────────────────────────────────────────────
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method: verify password ────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// ── toJSON: strip sensitive fields from responses ────────────────────────────
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
