const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const prisma = require('../lib/prisma');

// Helper: generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

// Helper: remove sensitive fields from user object
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Register a new user
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobileNo,
      city,
      country,
      dob,
      language,
      preferredCurrency,
      profilePhoto,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !mobileNo || !password) {
      return res.status(400).json({ error: 'First name, last name, email, mobile number and password are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Mobile number check (10-15 digits, allow spaces/dashes)
    const cleanedMobile = String(mobileNo).replace(/\s|-/g, '');
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(cleanedMobile)) {
      return res.status(400).json({ error: 'Mobile number must be 10-15 digits' });
    }

    // DOB / age check (if provided)
    if (dob) {
      const birthDate = new Date(dob);
      if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date of birth' });
      }
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 13) {
        return res.status(400).json({ error: 'Must be at least 13 years old' });
      }
      if (age > 120) {
        return res.status(400).json({ error: 'Invalid age' });
      }
    }

    // Password strength check
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Check if email already exists in database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobileNo: cleanedMobile,
        city: city || null,
        country: country || null,
        dob: dob ? new Date(dob) : null,
        language: language || null,
        preferredCurrency: preferredCurrency || null,
        profilePhoto: profilePhoto || null,
      },
    });

    const token = generateToken(user.id);
    const userWithoutPassword = sanitizeUser(user);

    return res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Fetch user by email from database
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    const userWithoutPassword = sanitizeUser(user);

    return res.json({ 
      message: 'Login successful', 
      token, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

// Get current user info
const getMe = async (req, res) => {
  try {
    const userId = req.userId; // from middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userWithoutPassword = sanitizeUser(user);

    return res.json({ 
      message: 'User data retrieved', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to get user: ' + error.message });
  }
};

module.exports = { register, login, getMe };
