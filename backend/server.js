import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Ticketing System Backend is Live!');
});

app.get('/api/status', (req, res) => {
  res.json({ message: 'Ticketing Backend is running on port 5000!' });
});

app.listen(PORT, () => {
  console.log(`Backend server is live on http://localhost:${PORT}`);
});