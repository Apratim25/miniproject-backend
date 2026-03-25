const PYQ = require('../models/PYQ');
const User = require('../models/User');

// @desc Get dashboard stats
// @route GET /api/dashboard/stats
// @access Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPYQs = await PYQ.countDocuments();
    
    // Sum up downloads
    const pyqs = await PYQ.find({});
    const totalDownloads = pyqs.reduce((acc, pyq) => acc + pyq.downloads, 0);

    // Get recent 5
    const recentUploads = await PYQ.find({}).sort({ createdAt: -1 }).limit(5).populate('uploadedBy', 'name');

    res.json({
      totalUsers,
      totalPYQs,
      totalDownloads,
      recentUploads
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
