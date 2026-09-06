import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'digiclear_institutional_jwt_secret_2026';

export const USERS = [];

const findUser = async (normalizedEmail) => {
  if (mongoose.connection.readyState === 1) {
    return User.findOne({
      $or: [{ email: normalizedEmail }, { studentId: normalizedEmail.toUpperCase() }]
    }).lean();
  }

  return USERS.find((candidate) => (
    candidate.email.toLowerCase() === normalizedEmail ||
    candidate.studentId?.toLowerCase() === normalizedEmail
  ));
};

const findUserById = async (id) => {
  if (mongoose.connection.readyState === 1) {
    return User.findOne({ id }).lean();
  }

  return USERS.find((candidate) => candidate.id === id);
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both institutional email and password'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUser(normalizedEmail);

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Check email and password.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.department || null,
        studentId: user.studentId || null,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, studentId, department, role = 'student' } = req.body;
    const allowedRoles = ['student', 'department', 'admin'];
    const departmentRoles = ['library', 'hostel', 'sports', 'accounts'];

    if (!name || !email || !password || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required registration fields'
      });
    }

    if (role === 'student' && !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required for student registration'
      });
    }

    if (role === 'department' && !departmentRoles.includes(department)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid department desk'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentId = studentId?.trim().toUpperCase();
    const existingUser = await findUser(normalizedEmail) || USERS.find(
      user => user.email.toLowerCase() === normalizedEmail || (normalizedStudentId && user.studentId?.toLowerCase() === normalizedStudentId.toLowerCase())
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account already exists with that email or student ID'
      });
    }

    const user = {
      id: `usr_stu_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      studentId: role === 'student' ? normalizedStudentId : undefined,
      department: role === 'department' ? department : null,
      avatar: name.trim().charAt(0).toUpperCase()
    };

    if (mongoose.connection.readyState === 1) {
      await User.create(user);
    } else {
      USERS.push(user);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authentication token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password: _, ...safeUser } = user;
    res.status(200).json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Session expired or invalid token'
    });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export default { login, signup, getMe, logout };
