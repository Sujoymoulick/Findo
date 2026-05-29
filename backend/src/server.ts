import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cloudinary from './cloudinary.config.js';
import budgetRoutes from './routes/budget.js';

dotenv.config();

// Initialize Supabase Admin (or just for verification)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();

// --- Global Middleware ---
app.use(cors());
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

// Cloudinary Receipt Upload with Gemini AI Structured OCR Extraction
app.post('/api/upload/receipt', authenticateToken, upload.single('receipt'), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // 1. Size Check (500KB limit)
    const MAX_SIZE = 500 * 1024; // 500KB
    let uploadOptions: any = { folder: 'findo/receipts' };
    
    if (req.file.size > MAX_SIZE) {
      // Apply Cloudinary compression for larger files
      uploadOptions.quality = 'auto';
      uploadOptions.fetch_format = 'auto';
      uploadOptions.width = 1200; // Resize to reasonable limit
      uploadOptions.crop = 'limit';
    }

    // 2. Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'findo/receipts', uploadOptions);

    // 3. Trigger Gemini AI OCR for structured extraction
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const ai = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: 'Extract receipt details into JSON. Fields: amount (number), currency (string, default INR), merchant (string), date (YYYY-MM-DD), category (Food, Travel, Shopping, Health, Utilities, Other), items (array of {name, price}), confidence (high, medium, low).' }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const aiData = JSON.parse(response.response.text() || '{}');

    // 4. Save to Database (receipts table)
    const { data: savedReceipt, error: dbError } = await supabase
      .from('receipts')
      .insert({
        user_id: req.user.id,
        image_url: result.secure_url,
        public_id: result.public_id,
        status: 'completed',
        amount: aiData.amount,
        currency: aiData.currency || 'INR',
        merchant: aiData.merchant,
        date: aiData.date,
        category: aiData.category,
        items: aiData.items || [],
        confidence: aiData.confidence,
        ocr_text: response.response.text().substring(0, 1000)
      })
      .select()
      .single();

    if (dbError) throw dbError;

    res.json(savedReceipt);
  } catch (err: any) {
    console.error('Receipt Processing Error:', err);
    res.status(500).json({ 
      error: 'Receipt processing failed',
      details: err.message
    });
  }
});

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

app.post('/api/upload/delete', authenticateToken, async (req: any, res: any) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ error: 'No public_id provided' });

    const result = await cloudinary.uploader.destroy(public_id);
    res.json(result);
  } catch (err: any) {
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

    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            amount: { type: SchemaType.NUMBER },
            currency: { type: SchemaType.STRING },
            merchant: { type: SchemaType.STRING },
            date: { type: SchemaType.STRING },
            category: { type: SchemaType.STRING },
            items: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            paymentMethod: { type: SchemaType.STRING },
            transactionId: { type: SchemaType.STRING },
            confidence: { type: SchemaType.STRING },
            note: { type: SchemaType.STRING }
          },
          required: ['amount', 'currency', 'merchant', 'date', 'category', 'items', 'paymentMethod', 'confidence']
        }
      }
    });

    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType } },
      'Extract receipt details into a JSON object.'
    ]);

    const extractedData = JSON.parse(result.response.text() || '{}');
    const receiptImage = `data:${mimeType};base64,${base64Image}`;

    res.json({ ...extractedData, receiptImage });
  } catch (err: any) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: `Scan Failed: ${err.message}` });
  }
});

app.post('/api/ai/insights', authenticateToken, async (req: any, res: any) => {
  try {
    const { expenses, budget } = req.body;
    if (!process.env.VITE_GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI features are not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a financial AI. Analyze these expenses and budget for an Indian user.
Return ONLY a valid JSON object (no markdown, no explanation) with exactly these fields:
- topOverspentCategory: string
- peakSpendingDay: string
- projectedTotal: number
- savingsTips: array of 2 strings
- disciplineRating: one of "Poor", "Fair", "Good", "Excellent"

Expenses: ${JSON.stringify(expenses)}
Budget: ${JSON.stringify(budget)}`;

    const response = await model.generateContent(prompt);
    const text = response.response.text() || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    res.json(parsed);
  } catch (err) {
    console.error('Insights error:', err);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
