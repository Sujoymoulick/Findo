import express from 'express';
import multer from 'multer';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cloudinary from './cloudinary.config';

dotenv.config();

import budgetRoutes from './src/routes/budget';

// Initialize Supabase Admin (or just for verification)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();

// --- Global Middleware ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- Route Registration ---
app.use('/api/budget', budgetRoutes);


const PORT = Number(process.env.PORT) || 3000;

// Auth Middleware (Supabase)
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw error || new Error('User not found');
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.sendStatus(403);
  }
};

// --- API Routes ---

// Scan Receipt
const upload = multer({ storage: multer.memoryStorage() });

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string, options: any = {}): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Cloudinary Receipt Upload with OCR and Tagging
app.post('/api/upload/receipt', authenticateToken, upload.single('receipt'), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const result = await uploadToCloudinary(req.file.buffer, 'findo/receipts', {
      ocr: 'adv_ocr',
      categorization: 'google_tagging',
      auto_tagging: 0.6
    });

    // Extract OCR data if available
    const ocrData = result.info?.ocr?.adv_ocr?.data?.[0]?.textAnnotations?.[0]?.description || '';
    const tags = result.tags || [];

    res.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      ocr_text: ocrData,
      tags: tags
    });
  } catch (err: any) {
    console.error('Cloudinary upload error details:', {
      message: err.message,
      http_code: err.http_code,
      name: err.name,
      error_info: err.error?.message || err.message
    });
    res.status(err.http_code || 500).json({ 
      error: 'Cloudinary Error: ' + (err.message || 'Failed to scan receipt'),
      details: err.error?.message
    });
  }
});

// Cloudinary Avatar Upload with Transformations
app.post('/api/upload/avatar', authenticateToken, upload.single('avatar'), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const result = await uploadToCloudinary(req.file.buffer, 'findo/avatars', {
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face' }
      ]
    });

    res.json({
      secure_url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Delete from Cloudinary
app.post('/api/upload/delete', authenticateToken, async (req: any, res: any) => {
  try {
    const { public_id } = req.body;
    console.log('Attempting to delete image with public_id:', public_id);
    
    if (!public_id) {
      console.warn('Deletion failed: No public_id provided in request body');
      return res.status(400).json({ error: 'No public_id provided' });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Cloudinary destroy result:', result);
    
    if (result.result === 'not found') {
        console.warn(`Cloudinary deletion: Image with public_id ${public_id} not found.`);
    }

    res.json(result);
  } catch (err: any) {
    console.error('Delete error details:', {
      message: err.message,
      public_id: req.body.public_id,
      error_info: err.error?.message || err.message
    });
    res.status(500).json({ 
      error: 'Failed to delete image',
      details: err.message 
    });
  }
});
app.post('/api/expenses/scan', authenticateToken, upload.single('receipt'), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    if (!process.env.VITE_GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI features are not configured.' });
    }

    const ai = new GoogleGenAI({ 
      apiKey: process.env.VITE_GEMINI_API_KEY,
      httpOptions: { apiVersion: 'v1' }
    });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: 'Extract receipt details into a JSON object. Fields: amount (number), currency (string), merchant (string), date (YYYY-MM-DD), category (enum: Food, Travel, Shopping, Health, Utilities, Rent, Entertainment, Education, Other), items (array of strings), paymentMethod (enum: UPI, Cash, Card, NetBanking), transactionId (string), confidence (enum: high, medium, low), note (string).' }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            merchant: { type: Type.STRING },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
            paymentMethod: { type: Type.STRING },
            transactionId: { type: Type.STRING },
            confidence: { type: Type.STRING },
            note: { type: Type.STRING }
          },
          required: ['amount', 'currency', 'merchant', 'date', 'category', 'items', 'paymentMethod', 'confidence']
        }
      }
    });

    const extractedData = JSON.parse(response.text || '{}');
    const receiptImage = `data:${mimeType};base64,${base64Image}`;

    res.json({ ...extractedData, receiptImage });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: 'Failed to scan receipt' });
  }
});

// AI Insights
app.post('/api/ai/insights', authenticateToken, async (req: any, res: any) => {
  try {
    const { expenses, budget } = req.body;
    
    if (!process.env.VITE_GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI features are not configured.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

    const prompt = `You are a financial AI. Analyze these expenses and budget for an Indian user.
Return ONLY a valid JSON object (no markdown, no explanation) with exactly these fields:
- topOverspentCategory: string (category name with highest spending)
- peakSpendingDay: string (day of week with most spending, e.g. "Monday")
- projectedTotal: number (estimated month-end total based on current pace)
- savingsTips: array of exactly 2 short saving tips as strings
- disciplineRating: one of "Poor", "Fair", "Good", "Excellent"

Expenses: ${JSON.stringify(expenses)}
Budget: ${JSON.stringify(budget)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    res.json(parsed);
  } catch (err) {
    console.error('Insights error:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});


// --- Vite Middleware (Development Only) ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
