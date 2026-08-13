import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import generateRoutes from './routes/generate.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve generated images statically
app.use('/generated', express.static(path.join(__dirname, 'generated')));

// OG Image route for share previews
app.get('/og/:id', (req, res) => {
  const { id } = req.params;
  const imagePath = path.join(__dirname, 'generated', `${id}.png`);
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('Image not found');
    }
  });
});

// OG meta page for Twitter card preview
app.get('/share/:id', (req, res) => {
  const { id } = req.params;
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  const imageUrl = `${backendUrl}/generated/${id}.png`;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>HH Goa 2026 - My Builder Card</title>
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="I'm going to HH Goa 2026! 🏖️">
      <meta name="twitter:description" content="Just got my Builder ID for Headout Hackathon Goa 2026! Get yours too!">
      <meta name="twitter:image" content="${imageUrl}">
      <meta property="og:title" content="HH Goa 2026 - My Builder Card">
      <meta property="og:description" content="Just got my Builder ID for Headout Hackathon Goa 2026!">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:type" content="website">
      <meta http-equiv="refresh" content="0;url=${frontendUrl}">
    </head>
    <body>
      <p>Redirecting...</p>
    </body>
    </html>
  `);
});

app.use('/api/generate', generateRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'HH Goa 2026 Backend Running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});