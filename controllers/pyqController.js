const PYQ = require('../models/PYQ');

// @desc Fetch all PYQs
// @route GET /api/pyq
// @access Public
const getPYQs = async (req, res) => {
  try {
    const { branch, semester, subject, year } = req.query;
    
    let query = {};
    if (branch) query.branch = branch;
    if (semester) query.semester = Number(semester);
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (year) query.year = Number(year);

    const pyqs = await PYQ.find(query).populate('uploadedBy', 'name email');
    res.json(pyqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Upload a PYQ
// @route POST /api/pyq/upload
// @access Private/Admin
const uploadPYQ = async (req, res) => {
  try {
    const { title, subject, branch, semester, year } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;

    const pyq = new PYQ({
      title,
      subject,
      branch,
      semester: Number(semester),
      year: Number(year),
      fileUrl,
      fileSize,
      uploadedBy: req.user._id
    });

    const createdPYQ = await pyq.save();
    res.status(201).json(createdPYQ);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get PYQ by ID and increment downloads
// @route GET /api/pyq/:id
// @access Public
const getPYQById = async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);

    if (pyq) {
      pyq.downloads += 1;
      await pyq.save();
      res.json(pyq);
    } else {
      res.status(404).json({ message: 'PYQ not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPYQs, uploadPYQ, getPYQById };
