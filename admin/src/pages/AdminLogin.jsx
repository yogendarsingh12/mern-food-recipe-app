import React, { useState } from 'react';
import { Crown, Lock, Mail, LogIn, Loader2, AlertCircle, ShieldCheck, ArrowRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { loginAdmin } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function AdminLogin({ onLoginSuccess }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter administrator email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginAdmin({ email: email.trim(), password: password.trim() });

      if (res?.data) {
        const { token, ...userData } = res.data;

        if (userData.role !== 'admin') {
          setErrorMsg('Access denied. This account does not have Administrator privileges.');
          return;
        }

        localStorage.setItem('recipe_admin_token', token);
        localStorage.setItem('recipe_admin_user', JSON.stringify(userData));
        onLoginSuccess(userData);
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setErrorMsg(
        err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] flex items-center justify-center p-4 selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-300">
      {/* Top Floating Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900/90 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 rounded-3xl sm:rounded-[36px] p-8 sm:p-10 shadow-xl dark:shadow-panel z-10 text-slate-900 dark:text-white transition-colors">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/40">
            <Crown className="w-8 h-8 text-zinc-950 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Vyanjan <span className="text-amber-500 dark:text-amber-400">{t('studio')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">
            {t('executiveControl')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-400 mb-1.5">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vyanjan.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-400">
                Password
              </label>
              {capsLockOn && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Caps Lock ON</span>
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-4 text-slate-400 dark:text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyDown}
                onKeyDown={handleKeyDown}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                required
              />

              {/* Top-Notch Password Show/Hide Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-amber-500" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('adminSignIn')}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 pt-4 border-t border-slate-200 dark:border-zinc-800 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>Role-Based Access Control (RBAC) &bull; Encrypted Portal</span>
        </div>
      </div>
    </div>
  );
}
