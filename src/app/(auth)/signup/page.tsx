'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui';
import { Mail, User, Eye, EyeOff, ArrowRight, Gift, Wallet, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const pwStrength = password.length >= 12 ? 'strong' : password.length >= 8 ? 'medium' : password.length > 0 ? 'weak' : '';
  const pwStrengthColor = pwStrength === 'strong' ? 'bg-[var(--positive)]' : pwStrength === 'medium' ? 'bg-[var(--brand)]' : 'bg-[var(--negative)]';
  const pwBars = [1, 2, 3, 4].map(i => password.length >= i * 3);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreed) { setError('Please agree to the Terms of Service'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setIsLoading(true);
    try {
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, referralCode: referralCode || undefined }),
      });
      const data = await registerRes.json();
      if (!registerRes.ok || !data.success) {
        setError(data.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }
      const signInRes = await signIn('credentials', { redirect: false, email, password });
      if (signInRes?.error) {
        router.push('/login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[var(--brand)] rounded-lg flex items-center justify-center">
            <span className="text-[var(--brand-fg)] font-black text-sm">CC</span>
          </div>
          <span className="text-base font-extrabold text-[var(--ink-1)]">
            Cric<span className="text-[var(--brand)]">Chain</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--ink-1)] mb-1">Create your account</h1>
        <p className="text-sm text-[var(--ink-3)]">Start predicting and earning today</p>
      </div>

      {/* Bonus banner */}
      <div className="flex items-center gap-3 p-3 bg-[var(--brand-subtle)] border border-[var(--brand)]/20 rounded-lg mb-6">
        <Gift className="w-4 h-4 text-[var(--brand)] flex-shrink-0" />
        <p className="text-sm text-[var(--brand)] font-medium">
          <strong>100% deposit match</strong> + 500 $CRIC on signup
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 p-3 bg-[var(--negative-subtle)] border border-[var(--negative)]/20 rounded-lg mb-5 text-sm text-[var(--negative)]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--ink-2)] uppercase tracking-wider mb-1.5">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-3)]" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cricket_predictor"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--ink-2)] uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-3)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--ink-2)] uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="w-full px-3 pr-10 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)] hover:text-[var(--ink-2)]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {pwBars.map((filled, i) => (
                  <div key={i} className={cn('flex-1 h-1 rounded-full transition-all', filled ? pwStrengthColor : 'bg-[var(--line)]')} />
                ))}
              </div>
              <p className="text-xs text-[var(--ink-3)] mt-1 capitalize font-medium">{pwStrength} password</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--ink-2)] uppercase tracking-wider mb-1.5">
            Referral Code <span className="text-[var(--ink-3)] normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-3)]" />
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="RAHUL2026"
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
            />
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => setAgreed(!agreed)}
            className={cn(
              'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
              agreed ? 'bg-[var(--brand)] border-[var(--brand)]' : 'border-[var(--line-strong)] hover:border-[var(--brand)]'
            )}
          >
            {agreed && <Check className="w-2.5 h-2.5 text-[var(--brand-fg)]" />}
          </button>
          <span className="text-sm text-[var(--ink-2)]">
            I agree to the{' '}
            <Link href="#" className="text-[var(--brand)] hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-[var(--brand)] hover:underline">Privacy Policy</Link>
          </span>
        </label>

        <Button
          type="submit"
          className="w-full h-11 text-sm mt-1"
          disabled={!agreed || !username || !email || !password || isLoading}
        >
          {isLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
          }
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[var(--line)]" />
        <span className="text-xs text-[var(--ink-3)] font-medium">or</span>
        <div className="flex-1 h-px bg-[var(--line)]" />
      </div>

      {/* Wallet */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm font-medium text-[var(--ink-2)] hover:border-[var(--line-strong)] hover:text-[var(--ink-1)] transition-all"
      >
        <Wallet className="w-4 h-4 text-purple-400" />
        Sign Up with Wallet
        <span className="ml-auto text-xs text-[var(--ink-3)] bg-[var(--line)] px-2 py-0.5 rounded font-mono">Polygon</span>
      </button>

      <p className="text-center mt-6 text-sm text-[var(--ink-3)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--brand)] font-semibold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
