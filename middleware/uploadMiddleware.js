// const multer = require('multer');
// const path = require('path');

// // Storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // File filter (optional)
// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (ext === '.jpg' || ext === '.png' || ext === '.jpeg') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only images are allowed'), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-pics',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
