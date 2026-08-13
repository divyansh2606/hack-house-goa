import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateFrame, generateIDCard } from '../utils/imageProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure generated directory exists
const generatedDir = path.join(__dirname, '..', 'generated');
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, HEIC, and WebP are allowed.'));
    }
  }
});

// Generate PFP Frame
router.post('/frame', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const id = uuidv4();
    const outputPath = path.join(generatedDir, `${id}.png`);

    await generateFrame(req.file.buffer, outputPath);

    const backendUrl = process.env.BACKEND_URL || `http://localhost:5000`;

    res.json({
      success: true,
      id,
      imageUrl: `${backendUrl}/generated/${id}.png`,
      shareUrl: `${backendUrl}/share/${id}`,
      downloadUrl: `${backendUrl}/generated/${id}.png`
    });
  } catch (error) {
    console.error('Frame generation error:', error);
    res.status(500).json({ error: 'Failed to generate frame' });
  }
});

// Generate ID Card
router.post('/idcard', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const { name, role, stack } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = uuidv4();
    const outputPath = path.join(generatedDir, `${id}.png`);

    await generateIDCard(req.file.buffer, outputPath, {
      name: name || 'Anonymous Builder',
      role: role || 'Builder',
      stack: stack || 'Full Stack'
    });

    const backendUrl = process.env.BACKEND_URL || `http://localhost:5000`;

    res.json({
      success: true,
      id,
      imageUrl: `${backendUrl}/generated/${id}.png`,
      shareUrl: `${backendUrl}/share/${id}`,
      downloadUrl: `${backendUrl}/generated/${id}.png`
    });
  } catch (error) {
    console.error('ID Card generation error:', error);
    res.status(500).json({ error: 'Failed to generate ID card' });
  }
});

export default router;