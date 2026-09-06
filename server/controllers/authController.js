import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'digiclear_institutional_jwt_secret_2026';

export const USERS = [
  {
    id: 'usr_admin',
    name: 'Dr. V. Rao (Dean of Academics)',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    department: null,
    avatar: 'A'
  },
  {
    id: 'usr_lib',
    name: 'Dr. R. Smith (Chief Librarian)',
    email: 'library@college.edu',
    password: 'dept123',
    role: 'department',
    department: 'library',
    avatar: 'L'
  },
  {
    id: 'usr_hostel',
    name: 'Mr. K. Sharma (Hostel Warden)',
    email: 'hostel@college.edu',
    password: 'dept123',
    role: 'department',
    department: 'hostel',
    avatar: 'H'
  },
  {
    id: 'usr_sports',
    name: 'Coach S. Mehta (Sports Director)',
    email: 'sports@college.edu',
    password: 'dept123',
    role: 'department',
    department: 'sports',
    avatar: 'S'
  },
  {
    id: 'usr_accounts',
    name: 'Bursar & Accounts Section',
    email: 'accounts@college.edu',
    password: 'dept123',
    role: 'department',
    department: 'accounts',
    avatar: 'A'
  },
  {
    id: 'usr_stu_1',
    name: 'Arjun Sharma',
    email: 'student1@college.edu',
    password: 'student123',
    role: 'student',
    studentId: 'STU001',
    rollNo: '22041A0589',
    collegeId: 'STU/2024/772',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech (Honours)',
    semester: 'Semester VIII',
    batch: '2022-2026',
    hallTicket: '22041A0589',
    avatar: 'A'
  },
  {
    id: 'usr_stu_2',
    name: 'Priya Patel',
    email: 'student2@college.edu',
    password: 'student123',
    role: 'student',
    studentId: 'STU002',
    rollNo: '22041A0590',
    collegeId: 'STU/2024/773',
    department: 'Electronics & Communication',
    degree: 'B.Tech',
    semester: 'Semester VIII',
    batch: '2022-2026',
    hallTicket: '22041A0590',
    avatar: 'P'
  }
];

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
    const user = USERS.find(u => u.email.toLowerCase() === normalizedEmail || (u.studentId && u.studentId.toLowerCase() === normalizedEmail));

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
    const { name, email, password, studentId, department } = req.body;

    if (!name || !email || !password || !studentId || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required registration fields'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentId = studentId.trim().toUpperCase();
    const existingUser = USERS.find(
      user => user.email.toLowerCase() === normalizedEmail || user.studentId?.toLowerCase() === normalizedStudentId.toLowerCase()
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
      role: 'student',
      studentId: normalizedStudentId,
      department: department.trim(),
      avatar: name.trim().charAt(0).toUpperCase()
    };

    USERS.push(user);

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

    const user = USERS.find(u => u.id === decoded.id);
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
