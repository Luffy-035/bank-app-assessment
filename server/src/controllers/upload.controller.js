const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// @desc    Upload digital signature image to Cloudinary
// @route   POST /api/v1/auth/upload-signature
// @access  Private
const uploadSignature = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Check Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(503).json({ success: false, message: 'Signature upload is not yet configured. Please contact support.' });
    }

    const uploadStream = (buffer) =>
        new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'blew/signatures',
                    resource_type: 'image',
                    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                    transformation: [{ width: 800, height: 400, crop: 'limit' }],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });

    const result = await uploadStream(req.file.buffer);

    res.status(200).json({
        success: true,
        signatureUrl: result.secure_url,
    });
});

module.exports = { uploadSignature };
