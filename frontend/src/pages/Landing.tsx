import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Search, Moon, Sun, ChevronDown, Shield, BarChart3, Zap, Brain, Mail, MapPin, Phone, Send, ArrowUpRight, Sparkles, Users, TrendingUp, Home, LogIn, Info } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GridHero } from '../components/ui/grid-hero-animated';
import { MorphingText } from '../components/ui/liquid-text';
import { TypingReveal } from '../components/ui/typing-reveal';
import { MenuItem, MenuContainer } from '../components/ui/fluid-menu';
import logoImage from '../../Assets/logo.png';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

// ... rest of the file ...

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'HOME', id: 'hero', icon: <Home size={24} strokeWidth={1.5} /> },
    { name: 'ABOUT', id: 'about', icon: <Info size={24} strokeWidth={1.5} /> },
    { name: 'CONTACT', id: 'contact', icon: <Mail size={24} strokeWidth={1.5} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 transition-all duration-500 backdrop-blur-md bg-white/60 dark:bg-black/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
              <img src={logoImage} alt="Logo" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-[0.3em] uppercase">FINDO</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => scrollToSection(link.id)}
                className="text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors tracking-[0.2em]"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={toggleTheme}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="text-[10px] font-black text-slate-900 dark:text-white px-8 py-3 rounded-full border border-slate-900/20 dark:border-white/20 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all tracking-[0.2em]">
              SIGN IN
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all mr-2"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="relative">
              <MenuContainer>
                <MenuItem 
                  icon={
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180">
                        <MenuIcon size={24} strokeWidth={1.5} className="text-slate-900 dark:text-white" />
                      </div>
                      <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0">
                        <X size={24} strokeWidth={1.5} className="text-slate-900 dark:text-white" />
                      </div>
                    </div>
                  } 
                />
                {navLinks.map((link) => (
                  <MenuItem 
                    key={link.id}
                    icon={React.cloneElement(link.icon as React.ReactElement, { className: "text-slate-900 dark:text-white" })} 
                    onClick={() => scrollToSection(link.id)}
                  />
                ))}
                <MenuItem 
                  icon={<LogIn size={24} strokeWidth={1.5} className="text-blue-500" />} 
                  onClick={() => navigate('/login')}
                />
              </MenuContainer>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Animated counter component
const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (hasAnimated) return;
        setHasAnimated(true);
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }}
      viewport={{ once: true }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, index }: { icon: any; title: string; description: string; index: number; key?: string }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="group relative p-8 rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 hover:border-blue-400/40 dark:hover:border-blue-400/30 transition-all duration-500 overflow-hidden"
  >
    {/* Gradient glow on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-indigo-500/10 transition-all duration-500 rounded-3xl" />
    
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-500">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function Landing() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const features = [
    { icon: Brain, title: 'Visionary AI Insights', description: 'Experience the next generation of financial planning with neural-powered analysis that predicts trends and optimizes your wealth strategy.' },
    { icon: Shield, title: 'Fortress-Level Security', description: 'Rest easy knowing your financial blueprint is protected by elite encryption and decentralized authentication protocols.' },
    { icon: Zap, title: 'Hyper-Fast Tracking', description: 'Eliminate manual entry. Our Gemini-integrated engine captures receipts and categorizes transactions with near-instant precision.' },
    { icon: BarChart3, title: 'Cinematic Analytics', description: 'Visualize your financial journey through immersive, high-fidelity dashboards that turn complex data into actionable clarity.' },
  ];

  const stats = [
    { value: 10000, suffix: '+', label: 'Active Users' },
    { value: 2, suffix: 'M+', label: 'Expenses Tracked' },
    { value: 99.9, suffix: '%', label: 'Uptime' },
    { value: 4.9, suffix: '/5', label: 'User Rating' },
  ];

  return (
    <div className="relative bg-white dark:bg-black overflow-x-hidden selection:bg-blue-500/30 font-outfit transition-colors duration-1000">
      <AnimatedBackground />

      {/* Animated Grid Canvas Background — hero only */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-40 dark:opacity-60">
        <GridHero />
      </div>

      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center space-y-8 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider uppercase"
          >
            <Sparkles size={14} />
            The Future of Personal Finance
          </motion.div>

          <div className="relative w-full max-w-4xl mx-auto py-12">
            <div className="relative z-10">
              <MorphingText 
                texts={["FINDO", "FUTURE", "FINANCE", "SMART", "SIMPLE"]} 
                className="text-slate-900 dark:text-white"
              />
              <TypingReveal
                text="Track every expense, monitor your financial health, discover spending patterns, and receive intelligent suggestions tailored to your lifestyle. FINDO turns complex money management into a simple and intuitive experience."
                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mt-8 max-w-3xl mx-auto leading-relaxed min-h-[6rem]"
                delay={1.5}
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="group inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black text-[10px] tracking-[0.3em] uppercase hover:scale-105 active:scale-95 transition-all shadow-2xl">
              GET STARTED
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <button 
              onClick={() => scrollToSection('about')} 
              className="inline-block text-slate-900 dark:text-white px-10 py-4 rounded-full font-black text-[10px] tracking-[0.3em] uppercase border border-slate-900/20 dark:border-white/20 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all"
            >
              LEARN MORE
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute bottom-12 flex flex-col items-center gap-4 text-slate-400 cursor-pointer"
          onClick={() => scrollToSection('about')}
        >
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Scroll to explore</span>
          <ChevronDown className="animate-bounce" size={20} />
        </motion.div>
      </section>

      {/* ===== ABOUT US SECTION ===== */}
      <section id="about" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-24"
          >
            <motion.span variants={fadeInUp} className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase block mb-4">
              ABOUT US
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-light text-slate-900 dark:text-white tracking-tight mb-6">
              Why Findo?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We believe financial empowerment should be as intuitive as a heartbeat. 
              Findo converges advanced neural networks with world-class design to redefine your relationship with wealth.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32"
          >
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} index={i} />
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-white/5 dark:via-white/[0.03] dark:to-white/5 border border-slate-700/50 dark:border-white/10 p-12 md:p-16 overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} variants={scaleIn} className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-white dark:text-white mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-32 grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInLeft} className="space-y-8">
              <span className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase">OUR MISSION</span>
              <h3 className="text-4xl sm:text-5xl font-light text-slate-900 dark:text-white tracking-tight leading-tight">
                Finance made <br />
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent font-bold">beautifully simple.</span>
              </h3>
              <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                We started Findo with a simple observation: managing personal finances shouldn't feel like a chore. 
                Our team of engineers and designers craft experiences that make every financial decision feel effortless.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider">
                  <Users size={16} /> 10K+ Users
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider">
                  <TrendingUp size={16} /> 98% Satisfaction
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInRight} className="relative">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20 dark:from-blue-500/10 dark:via-indigo-500/5 dark:to-purple-500/10 p-1">
                <div className="rounded-[1.25rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 space-y-6">
                  {/* Fake dashboard preview */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-slate-400 font-mono">findo.app/dashboard</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Monthly Budget</span>
                      <span className="text-sm font-black text-emerald-500">₹45,000</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '68%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                    <div className="text-xs text-slate-400">₹30,600 spent of ₹45,000</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {['Food', 'Travel', 'Shopping'].map((cat, i) => (
                      <motion.div
                        key={cat}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center"
                      >
                        <div className="text-lg font-black text-slate-800 dark:text-white">₹{[8200, 5400, 3100][i]}</div>
                        <div className="text-[10px] text-slate-400 font-bold tracking-wider mt-1">{cat}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Decorative floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 flex items-center justify-center"
              >
                <Sparkles className="text-white" size={28} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== CONTACT US SECTION ===== */}
      <section id="contact" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-24"
          >
            <motion.span variants={fadeInUp} className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase block mb-4">
              CONTACT US
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-light text-slate-900 dark:text-white tracking-tight mb-6">
              Get in Touch
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or just want to say hello? We'd love to hear from you.
              Our team typically responds within 24 hours.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="lg:col-span-2 space-y-8"
            >
              <motion.div variants={fadeInLeft} className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Let's connect</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Whether you're a user with feedback or a business looking to partner, we're all ears.
                </p>
              </motion.div>

              {[
                { icon: Mail, label: 'Email', value: 'hello@findo.app', href: 'mailto:hello@findo.app' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: MapPin, label: 'Office', value: 'Bangalore, India', href: '#' },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  variants={fadeInLeft}
                  href={item.href}
                  className="group flex items-start gap-5 p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">{item.label}</div>
                    <div className="text-base font-semibold text-slate-800 dark:text-white">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleContactSubmit} className="relative p-8 md:p-10 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 space-y-6 overflow-hidden">
                {/* Success overlay */}
                <AnimatePresence>
                  {formSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center rounded-3xl"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6"
                      >
                        <Sparkles className="w-10 h-10 text-emerald-500" />
                      </motion.div>
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">We'll get back to you within 24 hours.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition-all duration-300 font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase block">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition-all duration-300 font-medium"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition-all duration-300 font-medium resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow duration-300"
                >
                  <Send size={18} />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-slate-200/60 dark:border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Findo" className="w-8 h-8 object-contain" />
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-[0.2em]">FINDO</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-600 tracking-wider">
            © {new Date().getFullYear()} Findo. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            {['Privacy', 'Terms', 'Support'].map(link => (
              <a key={link} href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white tracking-[0.2em] uppercase transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Large Background "FINDO" Text */}
      <div className="fixed bottom-[-10%] left-[-5%] z-0 pointer-events-none select-none">
        <h2 className="text-[20rem] font-black text-slate-900/5 dark:text-white/5 tracking-tighter leading-none">
          FINDO
        </h2>
      </div>
    </div>
  );
}
