import React from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, Plane, ShoppingBag, HeartPulse, 
  Zap, Home, Film, GraduationCap, Box,
  Gamepad, Coffee, Car, Dumbbell, Music, Tv,
  BookOpen, Briefcase, Camera, Gift
} from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

interface Category {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const getIcon = (iconName: string, size = 20) => {
  const icons: Record<string, any> = {
    Utensils: <Utensils size={size} />,
    Plane: <Plane size={size} />,
    ShoppingBag: <ShoppingBag size={size} />,
    HeartPulse: <HeartPulse size={size} />,
    Zap: <Zap size={size} />,
    Home: <Home size={size} />,
    Film: <Film size={size} />,
    GraduationCap: <GraduationCap size={size} />,
    Box: <Box size={size} />,
    Gamepad: <Gamepad size={size} />,
    Coffee: <Coffee size={size} />,
    Car: <Car size={size} />,
    Dumbbell: <Dumbbell size={size} />,
    Music: <Music size={size} />,
    Tv: <Tv size={size} />,
    BookOpen: <BookOpen size={size} />,
    Briefcase: <Briefcase size={size} />,
    Camera: <Camera size={size} />,
    Gift: <Gift size={size} />
  };
  return icons[iconName] || <Box size={size} />;
};

const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Food', icon: <Utensils size={20} />, color: '#10B981' },
  { name: 'Travel', icon: <Plane size={20} />, color: '#3B82F6' },
  { name: 'Shopping', icon: <ShoppingBag size={20} />, color: '#EC4899' },
  { name: 'Health', icon: <HeartPulse size={20} />, color: '#EF4444' },
  { name: 'Utilities', icon: <Zap size={20} />, color: '#F59E0B' },
  { name: 'Rent', icon: <Home size={20} />, color: '#6366F1' },
  { name: 'Entertainment', icon: <Film size={20} />, color: '#A855F7' },
  { name: 'Education', icon: <GraduationCap size={20} />, color: '#6B7280' },
  { name: 'Other', icon: <Box size={20} />, color: '#000000' }
];

interface CategoryRadialProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryRadial: React.FC<CategoryRadialProps> = ({ selectedCategory, onSelect }) => {
  const { budget } = useBudget();
  const radius = 120;
  const itemRadius = 40;

  // Merge default categories with custom categories from the budget
  const customCategories = budget?.budget_categories?.map(cat => ({
    name: cat.name,
    icon: getIcon(cat.icon),
    color: cat.color
  })) || [];

  // Deduplicate: Keep custom categories if they share a name with defaults
  const allCategories = [
    ...customCategories,
    ...DEFAULT_CATEGORIES.filter(def => !customCategories.some(cust => cust.name.toLowerCase() === def.name.toLowerCase()))
  ].slice(0, 10); // Keep it manageable (max 10)

  return (
    <div className="relative w-[300px] h-[300px] flex items-center justify-center">
      {/* Center Indicator */}
      <div className="absolute w-20 h-20 bg-white dark:bg-slate-900 rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-slate-100 dark:border-slate-800 z-10 transition-transform duration-500 hover:scale-110">
        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Select<br/>Category</span>
      </div>

      {/* Radial Items */}
      {allCategories.map((cat, index) => {
        const angle = (index * 360) / allCategories.length;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        const isSelected = selectedCategory === cat.name;

        return (
          <motion.button
            key={cat.name}
            type="button"
            onClick={() => onSelect(cat.name)}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{ scale: 1, x, y }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
              isSelected 
              ? 'ring-4 ring-brand-primary ring-opacity-30 shadow-2xl z-20' 
              : 'hover:z-10'
            }`}
            style={{ 
              width: itemRadius * 2, 
              height: itemRadius * 2,
              backgroundColor: isSelected ? cat.color : `${cat.color}15`,
              color: isSelected ? 'white' : cat.color,
              boxShadow: isSelected ? `0 10px 20px -5px ${cat.color}50` : 'none'
            }}
          >
            <div className={`transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
              {cat.icon}
            </div>
            <span className={`text-[8px] font-bold mt-1 tracking-tight ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
              {cat.name}
            </span>
          </motion.button>
        );
      })}

      {/* Animated SVG Path for connection */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-10">
        <circle cx="150" cy="150" r={radius} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-slate-400" />
      </svg>
    </div>
  );
};
