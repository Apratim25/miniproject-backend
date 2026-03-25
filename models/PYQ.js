const mongoose = require('mongoose');

const pyqSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: Number, required: true },
    year: { type: Number, required: true },
    fileUrl: { type: String, required: true }, // Local path or cloud URL
    fileSize: { type: String },
    downloads: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const PYQ = mongoose.model('PYQ', pyqSchema);
module.exports = PYQ;
