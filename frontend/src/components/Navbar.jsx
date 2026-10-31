import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Camera,
  Activity,
  ShieldCheck,
  Video,
  ChefHat,
  Calendar,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Zap
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Food Vision', path: '/food-recognition', icon: Camera },
    { name: 'Nutrition', path: '/nutrition', icon: Sparkles },
    { name: 'Freshness', path: '/freshness', icon: ShieldCheck },
    { name: 'Hygiene AI', path: '/hygiene', icon: Video },
    { name: 'Chef Assistant', path: '/cooking-assistant', icon: ChefHat },
    { name: 'Meal Planner', path: '/meal-planner', icon: Calendar },
  ];

  const handleDemoAccess = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-950/40 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
                FoodVerse
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-semibold text-emerald-400">
                Multimodal AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-200 bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.full_name?.split(' ')[0] || 'User'}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDemoAccess}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all glow-emerald"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>1-Click Demo</span>
                </button>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all shadow-md shadow-emerald-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            {!isAuthenticated && (
              <button
                onClick={handleDemoAccess}
                className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500 text-neutral-950"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-neutral-900 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-neutral-300"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Profile & Settings ({user?.full_name})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold rounded-lg bg-emerald-500 text-neutral-950"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
