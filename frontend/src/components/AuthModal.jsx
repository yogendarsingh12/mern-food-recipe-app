import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  LogIn, 
  UserPlus, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ShieldAlert 
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { t } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg('');
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setCapsLockOn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate Password Strength for Registration
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-stone-200 dark:bg-zinc-800' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: t('weak'), color: 'bg-red-500', textColor: 'text-red-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: t('fair'), color: 'bg-amber-500', textColor: 'text-amber-500', width: 'w-2/4' };
    if (score === 3 || score === 4) return { score: 3, label: t('strong'), color: 'bg-blue-500', textColor: 'text-blue-500', width: 'w-3/4' };
    return { score: 4, label: t('superSecure'), color: 'bg-emerald-500', textColor: 'text-emerald-500', width: 'w-full' };
  };

  const strength = getPasswordStrength();

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

    if (!email || !password) {
      setErrorMsg('Please provide all required fields.');
      return;
    }

    if (isRegister && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (isRegister) {
        response = await registerUser({ name: name.trim(), email, password });
      } else {
        response = await loginUser({ email, password });
      }

      if (response && response.data) {
        const { token, ...userData } = response.data;
        localStorage.setItem('recipe_token', token);
        localStorage.setItem('recipe_user', JSON.stringify(userData));
        onAuthSuccess(userData, token);
        onClose();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl sm:rounded-[36px] shadow-2xl p-6 sm:p-9 border border-stone-200 dark:border-zinc-800 z-10 transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/25">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight font-display">
            {isRegister ? t('joinVyanjan') : t('welcomeToVyanjan')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 font-medium">
            {isRegister
              ? 'Create a free chef account to publish and manage recipes'
              : 'Sign in to your chef notebook and share your culinary creations'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-100 dark:bg-zinc-950 p-1.5 rounded-2xl mb-6 border border-stone-200/80 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isRegister
                ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {t('signIn')}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isRegister
                ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                : 'text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {t('createAccount')}
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 flex items-start gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5">
                {t('fullName')}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-stone-400 dark:text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Chef Gordon"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 font-medium"
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5">
              {t('emailAddress')}
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400 dark:text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300">
                {t('password')}
              </label>
              {capsLockOn && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>{t('capsLockOn')}</span>
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400 dark:text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyDown}
                onKeyDown={handleKeyDown}
                placeholder="•••••••• (Min 6 chars)"
                className="w-full pl-10 pr-12 py-3 rounded-2xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 font-medium"
                required
              />

              {/* Password Show/Hide Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-brand-600 dark:text-amber-400" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Live Password Strength Meter (On Registration) */}
            {isRegister && password && (
              <div className="mt-2 space-y-1.5 animate-fadeIn">
                <div className="h-1.5 w-full bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300 rounded-full`} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-stone-400 dark:text-zinc-500">{t('passwordStrength')}</span>
                  <span className={strength.textColor}>{strength.label}</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{t('createAccount')}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('signIn')}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 dark:text-zinc-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t('encryptedInfo')}</span>
        </div>
      </div>
    </div>
  );
}
