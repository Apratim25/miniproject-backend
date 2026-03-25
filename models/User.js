const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PYQ' }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PYQ' }]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
