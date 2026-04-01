const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require("jsonwebtoken");

// bcrypt's promise API differs across versions; normalize using util.promisify.
const compareAsync = util.promisify(bcrypt.compare);
const genSaltAsync = util.promisify(bcrypt.genSalt);
const hashAsync = util.promisify(bcrypt.hash);

router.post('/login', async (req, res) => {
  const username = String(req.body?.username ?? '').trim();
  // Trim to avoid false negatives if the UI sends leading/trailing whitespace.
  const password = String(req.body?.password ?? '').trim();

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // 1. Find user by username ONLY
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const stored = String(user.password ?? "");
    const looksLikeBcryptHash = /^\$2[aby]\$/.test(stored);

    // Migration path: older seed/records may have stored plaintext password by mistake.
    // If so, accept a direct match once and immediately migrate to a bcrypt hash.
    if (!looksLikeBcryptHash) {
      if (stored && stored === password) {
        const salt = await genSaltAsync(10);
        user.password = await hashAsync(password, salt);
        await user.save();
      } else {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
    }

    // 2. Compare hashed password (native bcrypt first)
    let isMatch = false;
    try {
      isMatch = await compareAsync(password, user.password);
    } catch {
      // If the stored hash doesn't match bcrypt's expected format,
      // it will throw; we'll fall back to bcryptjs below.
      isMatch = false;
    }

    // 3. Backward compatibility: some users may have been created with bcryptjs.
    // If bcrypt fails to match, try bcryptjs compare.
    if (!isMatch) {
      try {
        // eslint-disable-next-line global-require
        const bcryptjs = require("bcryptjs");
        const compareJsAsync = util.promisify(bcryptjs.compare);
        isMatch = await compareJsAsync(password, user.password);

        // If bcryptjs matched, migrate the hash to native bcrypt for future logins.
        if (isMatch) {
          const salt = await genSaltAsync(10);
          user.password = await hashAsync(password, salt);
          await user.save();
        }
      } catch {
        isMatch = false;
      }
    }

    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // 3. Send safe response (no password)
    const token = jwt.sign(
      {
        _id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );
    
    res.json({
      _id: user._id,
      username: user.username,
      isAdmin: Boolean(user.isAdmin),
      token,
    });

  } catch (error) {
    return res.status(400).json({ message: error.message || 'Login failed' });
  }
});

router.post('/register', async (req, res) => {
  const username = String(req.body?.username ?? '').trim();
  const password = String(req.body?.password ?? '');
  const cpassword = String(req.body?.cpassword ?? '');
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (password !== cpassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  try {
    // Ensure we store the validated username (trimmed) and only the intended fields.
    const newUser = new User({ username, password, isAdmin: false });
    const salt = await genSaltAsync(10);
    newUser.password = await hashAsync(password, salt);
    await newUser.save();
    res.send('User registered successfully');
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    return res.status(400).json({ message: error.message || 'Registration failed' });
  }
});

module.exports = router;
