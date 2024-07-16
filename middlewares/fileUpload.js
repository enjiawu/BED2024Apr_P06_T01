const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '../public/uploads/');

fs.mkdirSync(uploadDirectory, { recursive: true });

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory) // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // Generate a unique name for the uploaded file
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
