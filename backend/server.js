import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { parse } from 'json2csv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
// Create the rate limit rule
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { 
    error: 'Too many login attempts from this IP, please try again after 15 minutes.' 
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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

function generateTicketId() {
  // 1. Get the current date and format it as YYYYMMDD
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ''); 
  
  // 2. Generate a random 10-character hex string (5 bytes = 10 hex characters)
  const uniqueId = crypto.randomBytes(5).toString('hex').toUpperCase();
  
  // 3. Combine them together
  return `TKT-${formattedDate}-${uniqueId}`; 
}

// Example output: TKT-20260707-8F4B2A9C1E

app.get('/', (req, res) => {
    res.send('Ticketing System Backend is Live!');
});

app.get('/api/status', (req, res) => {
  res.json({ message: 'Ticketing Backend is running on port 5000!' });
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  
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

app.post('/api/admin/create-user', authenticateToken, async (req, res) => {
// app.post('/api/admin/create-user', async (req, res) => {
  try {
    if (req.auth.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden. Admin access is required.' });
     }

    // 1. Grab the data the frontend sent us
    const { name, email, password, role } = req.body;

    const allowedRoles = ['USER', 'AGENT', 'ADMIN'];
    const userRole = allowedRoles.includes(role) ? role : 'USER';

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
        role: userRole,
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

app.post('/api/tickets/create', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;
    const userId = req.auth.userId;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    // Generate the custom ID!
    const customTicketId = generateTicketId();
    
    // Create the ticket in the database
    const ticket = await prisma.ticket.create({
      data: {
        id: customTicketId,
        title,
        description,
        priority: priority || 'MEDIUM',
        category: category || 'GENERAL',
        userId: req.auth.userId,
      },
    });

    return res.status(201).json({
      message: 'Ticket created successfully.',
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        category: ticket.category,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.get('/api/tickets/history', authenticateToken, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        userId: req.auth.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        category: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({ tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.get('/api/tickets/:ticketId', authenticateToken, async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    const isOwner = ticket.userId === req.auth.userId;
    const canViewAnyTicket = ['ADMIN', 'AGENT'].includes(req.auth.role);

    if (!isOwner && !canViewAnyTicket) {
      return res.status(403).json({ error: 'You do not have permission to view this ticket.' });
    }

    return res.json({ ticket });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.get('/api/reports/export', authenticateToken, async (req, res) => {
  try {
    // 1. Role Authorization: Block standard users
    if (req.auth.role === 'USER') {
      return res.status(403).json({ error: 'Access denied. You do not have permission to export reports.' });
    }

    // 2. Fetch all tickets and include the creator's user data
    const tickets = await prisma.ticket.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Format the data for the CSV
    // The keys ('Ticket ID', 'Title') will automatically become the top header row
    const exportData = tickets.map(ticket => ({
      'Ticket ID': ticket.id,
      'Title': ticket.title,
      'Status': ticket.status,
      'Priority': ticket.priority,
      'Category': ticket.category,
      'Created By': ticket.user ? (ticket.user.name || ticket.user.email) : 'Unknown User',
      'Date Created': ticket.createdAt.toLocaleString() // Includes date and time
    }));

    // 4. Convert the array of objects into a CSV string
    const csv = parse(exportData);

    // 5. Set headers to tell the browser this is a downloadable CSV file
    res.header('Content-Type', 'text/csv');
    res.attachment('tickets_report.csv');
    
    // 6. Send the file!
    return res.send(csv);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate report.' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}

export default app;