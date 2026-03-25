const express = require('express');
const router = express.Router();
const { getPYQs, uploadPYQ, getPYQById } = require('../controllers/pyqController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getPYQs);
router.route('/upload').post(protect, admin, upload.single('document'), uploadPYQ);
router.route('/:id').get(getPYQById);

module.exports = router;
