'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui';
import { Mail, Phone, Eye, EyeOff, ArrowRight, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || (method === 'email' && !email) || (method === 'phone' && !phone)) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: method === 'email' ? email : phone,
        password,
      });

      if (res?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => signIn('google', { callbackUrl });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-8 h-8 bg-[var(--brand)] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--brand-fg)] font-black text-sm">CC</span>
          </div>
          <span className="text-base font-extrabold text-[var(--ink-1)]">
            Cric<span className="text-[var(--brand)]">Chain</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-[var(--ink-1)] mb-1">Welcome back</h1>
        <p className="text-sm text-[var(--ink-3)]">Sign in to your account to continue</p>
      </div>

      {/* Method toggle */}
      <div className="flex p-1 bg-[var(--panel-raised)] rounded-lg border border-[var(--line)] mb-6">
        {(['email', 'phone'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMethod(m)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all',
              method === m
                ? 'bg-[var(--panel)] text-[var(--ink-1)] shadow-sm border border-[var(--line)]'
                : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'
            )}
          >
            {m === 'email' ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2.5 p-3 bg-[var(--negative-subtle)] border border-[var(--negative)]/20 rounded-lg mb-5 text-sm text-[var(--negative)]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {method === 'email' ? (
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-2)] uppercase tracking-wider mb-1.5">
              Email address
            </label>
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
        ) : (
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-2)] uppercase tracking-wider mb-1.5">
              Phone number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--ink-3)]">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[var(--ink-2)] uppercase tracking-wider">
              Password
            </label>
            <Link href="#" className="text-xs text-[var(--brand)] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-3 pr-10 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)] hover:text-[var(--ink-2)] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full h-11 text-sm mt-2">
          {isLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
          }
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[var(--line)]" />
        <span className="text-xs text-[var(--ink-3)] font-medium">or continue with</span>
        <div className="flex-1 h-px bg-[var(--line)]" />
      </div>

      {/* OAuth options */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm font-medium text-[var(--ink-1)] hover:border-[var(--line-strong)] hover:bg-[var(--panel-raised)] transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
            <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
          </svg>
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm font-medium text-[var(--ink-1)] hover:border-[var(--line-strong)] transition-all"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X (Twitter)
        </button>
      </div>

      {/* Wallet option */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm font-medium text-[var(--ink-2)] hover:border-[var(--line-strong)] hover:text-[var(--ink-1)] transition-all"
      >
        <Wallet className="w-4 h-4 text-purple-400" />
        Connect Wallet
        <span className="ml-auto text-[var(--ink-3)] text-xs bg-[var(--line)] px-2 py-0.5 rounded font-mono">Polygon</span>
      </button>

      {/* Sign up link */}
      <p className="text-center mt-6 text-sm text-[var(--ink-3)]">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[var(--brand)] font-semibold hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
