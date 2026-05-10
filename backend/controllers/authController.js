const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

// Helper: generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

// NOTE: All DB interactions are left as TODOs. Coordinate with DB teammate
// before implementing queries to avoid clashes.

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
      state,
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

    // TODO: Database - check if email already exists
    // TODO: Database - insert user record with fields: firstName, lastName, email, hashedPassword, mobileNo, city, state, country, dob, language, preferredCurrency, profilePhoto
    // Coordinate with DB teammate before implementing the actual queries.

    // For now return a placeholder user object (replace with DB result later)
    const user = {
      id: 1,
      firstName,
      lastName,
      email,
      mobileNo: cleanedMobile,
      city: city || null,
      state: state || null,
      country: country || null,
      dob: dob || null,
      language: language || null,
      preferredCurrency: preferredCurrency || null,
      profilePhoto: profilePhoto || null,
      created_at: new Date(),
    };

    const token = generateToken(user.id);

    return res.status(201).json({ message: 'User registered (placeholder)', token, user });
  } catch (error) {
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

    // TODO: Database - fetch user by email
    // Example: const user = await db.query('SELECT * FROM users WHERE email=$1', [email])
    // For now, use placeholder user with hashed password to allow local testing of logic
    const placeholderHashed = await bcryptjs.hash(password, 10);
    const user = { id: 1, firstName: 'Test', lastName: 'User', email, password: placeholderHashed };

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    return res.json({ message: 'Login successful (placeholder)', token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (error) {
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

    // TODO: Database - fetch user by id and return full profile
    // Example: const result = await db.query('SELECT id, first_name, last_name, email, mobile_no, city, state, country, dob, language, preferred_currency, profile_photo FROM users WHERE id=$1', [userId])

    // Placeholder response
    const user = {
      id: userId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      mobileNo: null,
      city: null,
      state: null,
      country: null,
      dob: null,
      language: null,
      preferredCurrency: null,
      profilePhoto: null,
    };

    return res.json({ message: 'User data (placeholder)', user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get user: ' + error.message });
  }
};

module.exports = { register, login, getMe };
