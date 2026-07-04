import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}

function authenticateToken(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token.' });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

app.get('/', (req, res) => {
    res.send('Ticketing System Backend is Live!');
});

app.get('/api/status', (req, res) => {
  res.json({ message: 'Ticketing Backend is running on port 5000!' });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const [totalUsers, usersByRole, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        select: { role: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    const roleCounts = usersByRole.reduce(
      (counts, user) => {
        counts[user.role] += 1;
        return counts;
      },
      { USER: 0, AGENT: 0, ADMIN: 0 }
    );

    return res.json({
      summary: {
        totalUsers,
        roleCounts,
      },
      recentUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.post('/api/admin/create-user', async (req, res) => {
  try {
    // 1. Grab the data the frontend sent us
    const { name, email, password } = req.body;

    // 2. Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // 3. Hash the password (scramble it 10 times)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save the new user to PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        // Role defaults to "CUSTOMER" based on our schema.prisma
      }
    });

    // 5. Send a success message back (but NEVER send the password back!)
    res.status(201).json({ 
        message: "User registered successfully!", 
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is live on http://localhost:${PORT}`);
});