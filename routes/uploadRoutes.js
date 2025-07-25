// const express = require('express');
// const router = express.Router();
// const protect = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');
// const User = require('../models/userModel');

// router.post('/profile', protect, upload.single('image'), async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { profilePic: req.file.filename },
//       { new: true }
//     ).select('-password');

//     res.json({
//       message: 'Image uploaded successfully',
//       profilePic: req.file.filename,
//       user
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Upload failed' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');
const User = require('../models/userModel');

router.post('/upload-profile-pic', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'Image upload failed' });
    }

    const user = await User.findById(req.user.id);
    user.profilePic = req.file.path; // This is the Cloudinary URL
    await user.save();

    res.json({ message: 'Profile picture uploaded successfully', profilePic: user.profilePic });

  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
