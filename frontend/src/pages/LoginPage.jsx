import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, Zap, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border border-neutral-800 shadow-2xl">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto text-neutral-950 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-white tracking-tight">Sign in to FoodVerse</h2>
          <p className="mt-1 text-xs text-neutral-400">Access your multimodal food intelligence dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@foodverse.ai"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-neutral-950 text-neutral-500">Or skip credentials</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemo}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-semibold bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/30 text-emerald-300 transition-all text-sm flex items-center justify-center space-x-2 glow-emerald"
        >
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>One-Click Instant Demo Access</span>
        </button>

        <p className="text-center text-xs text-neutral-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
