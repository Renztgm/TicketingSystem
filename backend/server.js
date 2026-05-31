import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Ticketing System Backend is Live!');
});

app.get('/api/status', (req, res) => {
  res.json({ message: 'Ticketing Backend is running on port 5000!' });
});

app.post('/api/auth/register', async (req, res) => {
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