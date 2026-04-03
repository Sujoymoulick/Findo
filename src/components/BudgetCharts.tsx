import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';

interface BudgetChartsProps {
  categories: any[];
  expenses: any[];
}

export const BudgetCharts: React.FC<BudgetChartsProps> = ({ categories, expenses }) => {
  // 1. Pie Chart Data (Category Distribution)
  const pieData = categories.map(cat => ({
    name: cat.name,
    value: cat.limit_amount,
    color: cat.color
  }));

  // 2. Bar Chart Data (Budgeted vs Actual)
  const barData = categories.map(cat => ({
    name: cat.name,
    budgeted: cat.limit_amount,
    actual: cat.spent
  }));

  // 3. Line Chart Data (Daily Spending Trend)
  // Group expenses by date and sum amounts
  const dailyData: Record<string, number> = {};
  expenses.forEach(exp => {
    const date = exp.date.split('T')[0];
    dailyData[date] = (dailyData[date] || 0) + exp.amount;
  });

  const lineData = Object.keys(dailyData)
    .sort()
    .map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      amount: dailyData[date]
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-black" style={{ color: entry.color || entry.fill }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[450px] relative overflow-hidden group">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 ml-2">Budget Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="text-center">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">Allocated</p>
             </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[450px] relative overflow-hidden group">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 ml-2">Budgeted vs Actual</h3>
          <div className="h-80 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budgeted" fill="#3B82F6" radius={[10, 10, 0, 0]} barSize={24} name="Budgeted" />
                <Bar dataKey="actual" fill="#EF4444" radius={[10, 10, 0, 0]} barSize={24} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart / Area Chart (Daily Spending) */}
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[450px] relative overflow-hidden group">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 ml-2">Daily Spending Trend</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
                name="Daily Spend"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
