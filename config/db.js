const mongoose = require('mongoose');

const connectDB = () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  mongoose.connect(uri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.error("MongoDB Error:", err);
      process.exit(1);
    });
};

module.exports = connectDB;
