const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Auth user & get token
// @route POST /api/auth/login
const authUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    // Use bcrypt.compare() to validate password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Register a new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  console.log("REQ BODY:", req.body);

  // Ensure it receives: name, email, password
  const { name, email, password, role } = req.body;
  
  // Validate inputs properly
  if (!name || !email || !password) {
    console.error("Registration failed: Missing fields");
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.error("Registration failed: User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password using bcryptjs before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user' 
    });

    if (user) {
      // On success return token and user object
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } else {
      console.error("Registration failed: Invalid user data received");
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // Log exact error in console if registration fails
    console.error("Registration Backend Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authUser, registerUser };
