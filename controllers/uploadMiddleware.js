const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// set up multer
const storage = new CloudinaryStorage({
    cloudinary,
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${crypto.randomUUID()}${path.extname(file.originalname)}`);
    },
    params: {
        folder: 'news_asset'
    }
})

const cloudUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1048576 // 1 Mb
    }
});

const cloudUploadMiddleware = (req, res, next) => {
    const upload = cloudUpload.single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            let message = err.message;
            switch (err.code) {
                case 'LIMIT_FILE_SIZE':
                    message = message.concat(". We only allow files of size < 1 Mb.");
                    break;
                default:
                    break;
            }
            res.json({ errorMessage: message });
            return;
        }
        else if (err) {
            // An unknown error occurred when uploading.
            res.json({ errorMessage: err.message });
            return;
        }
        // Everything went fine. 
        next();
    })
}

module.exports = cloudUploadMiddleware;