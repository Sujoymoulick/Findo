import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { generateBudgetInsights } from '../lib/openai';

dotenv.config();

const router = express.Router();
const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');

// Middleware to verify session token and get user
const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) throw error;
        
        // --- THE FIX: Create an AUTHENTICATED client for THIS request ---
        req.sb = createClient(
            process.env.VITE_SUPABASE_URL || '', 
            process.env.VITE_SUPABASE_ANON_KEY || '',
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        );
        
        req.user = user;
        next();
    } catch (err) {
        console.error('Context Auth error:', err);
        res.sendStatus(403);
    }
};

// GET /api/budget/:month → get budget + categories
router.get('/:month', authenticateToken, async (req: any, res: any) => {
    try {
        const { month } = req.params;
        const { data, error } = await req.sb
            .from('budget_plans')
            .select('*, budget_categories(*)')
            .eq('month', month)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        res.json(data || null);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/budget → create new monthly budget
router.post('/', authenticateToken, async (req: any, res: any) => {
    try {
        const { month, total_budget } = req.body;
        console.log('--- CREATE BUDGET (AUTH CONTEXT) ---');
        console.log('Month:', month, 'Budget:', total_budget);

        const { data, error } = await req.sb
            .from('budget_plans')
            .upsert({ month, total_budget }, { onConflict: 'user_id, month' })
            .select()
            .single();

        if (error) {
            console.error('SUPABASE UPSERT ERROR:', error);
            return res.status(400).json({ error: error.message, details: error });
        }
        
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/budget/category → add new category
router.post('/category', authenticateToken, async (req: any, res: any) => {
    try {
        const { budget_plan_id, name, limit_amount, icon, color } = req.body;
        const { data, error } = await req.sb
            .from('budget_categories')
            .insert([{ budget_plan_id, name, limit_amount, icon, color }])
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/budget/category/:id → update category limit
router.put('/category/:id', authenticateToken, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { limit_amount, spent } = req.body;
        const { data, error } = await req.sb
            .from('budget_categories')
            .update({ limit_amount, spent })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/budget/category/:id → delete category
router.delete('/category/:id', authenticateToken, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { error } = await req.sb
            .from('budget_categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/budget/:month/insights → generate AI insights
router.post('/:month/insights', authenticateToken, async (req: any, res: any) => {
    try {
        const { month } = req.params;
        const { budgetData } = req.body;

        const insights = await generateBudgetInsights(budgetData);

        // Try to persist to DB (non-blocking — don't fail if insert fails)
        try {
            await req.sb
                .from('budget_insights')
                .upsert({ 
                    month, 
                    summary: insights.summary,
                    alerts: insights.alerts,
                    suggestions: insights.suggestions,
                    next_month_budget: insights.nextMonthBudget,
                    savings_score: insights.savingsScore,
                    budget_plan_id: budgetData.id
                }, { onConflict: 'user_id, month' });
        } catch (_) { /* silently ignore persistence errors */ }

        // Always return the structured insight object directly
        res.json(insights);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
