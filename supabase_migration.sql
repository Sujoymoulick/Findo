-- 1. Create Budgets Table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- Format: YYYY-MM
    total_budget NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, month)
);

-- 2. Create Budget Categories Table
CREATE TABLE budget_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    limit_amount NUMERIC NOT NULL DEFAULT 0,
    spent NUMERIC DEFAULT 0,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Budget Insights Table
CREATE TABLE budget_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    insights JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Budgets
CREATE POLICY "Users can view their own budgets" ON budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" ON budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON budgets
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Budget Categories
CREATE POLICY "Users can view their own budget categories" ON budget_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM budgets 
            WHERE budgets.id = budget_categories.budget_id 
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own budget categories" ON budget_categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM budgets 
            WHERE budgets.id = budget_categories.budget_id 
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own budget categories" ON budget_categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM budgets 
            WHERE budgets.id = budget_categories.budget_id 
            AND budgets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own budget categories" ON budget_categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM budgets 
            WHERE budgets.id = budget_categories.budget_id 
            AND budgets.user_id = auth.uid()
        )
    );

-- RLS Policies for Budget Insights
CREATE POLICY "Users can view their own budget insights" ON budget_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budget insights" ON budget_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);
