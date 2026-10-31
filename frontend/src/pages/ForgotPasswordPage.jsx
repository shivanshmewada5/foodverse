import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6 glass-card p-8 rounded-3xl border border-neutral-800 shadow-2xl">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto text-neutral-950 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-white tracking-tight">Reset your password</h2>
          <p className="mt-1 text-xs text-neutral-400">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Reset Link Dispatched</h4>
            <p className="text-xs text-neutral-300">
              We sent password reset instructions to <span className="text-emerald-400 font-semibold">{email}</span>. Check your inbox.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 text-xs font-semibold text-emerald-400 hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 transition-all text-sm shadow-lg shadow-emerald-500/20"
            >
              Send Recovery Link
            </button>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
