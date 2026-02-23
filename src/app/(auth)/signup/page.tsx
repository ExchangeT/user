'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui';
import { Mail, User, Eye, EyeOff, ArrowRight, Gift, Wallet, Check, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function SignupPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreed) return toast('Please agree to the Terms of Service', 'error');
        if (password.length < 8) return toast('Password must be at least 8 characters', 'error');

        setIsLoading(true);

        try {
            // 1. Call custom register API
            const registerRes = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                    referralCode: referralCode || undefined,
                })
            });

            const data = await registerRes.json();

            if (!registerRes.ok || !data.success) {
                toast(data.error || 'Failed to register', 'error');
                setIsLoading(false);
                return;
            }

            // 2. Sign in immediately
            const signInRes = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (signInRes?.error) {
                toast('Account created but auto-login failed. Please sign in.', 'info');
                router.push('/login');
            } else {
                toast('Account created successfully! Welcome to CricChain 🎉', 'success');
                router.push('/dashboard');
                router.refresh();
            }

        } catch (error: any) {
            toast(error.message || 'An unexpected error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Logo */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-[#f4c430] to-[#ff6b35] rounded-2xl flex items-center justify-center text-2xl shadow-gold">
                        🏏
                    </div>
                </Link>
                <h1 className="text-3xl font-extrabold mb-2">
                    Join <span className="gradient-text">CricChain</span>
                </h1>
                <p className="text-[#94a3b8]">Start predicting and earning today</p>
            </div>

            {/* Signup Card */}
            <div className="bg-[#1a2235] border border-white/[0.06] rounded-2xl p-6 shadow-2xl">
                {/* Bonus Banner */}
                <div className="flex items-center gap-3 p-3 bg-[#f4c430]/5 border border-[#f4c430]/20 rounded-xl mb-6">
                    <span className="text-xl">🎁</span>
                    <p className="text-sm text-[#f4c430]">Get <strong>100% deposit match</strong> + 500 $CRIC on signup!</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="cricket_predictor"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 8 characters"
                                required
                                minLength={8}
                                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {/* Password Strength */}
                        {password && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full ${password.length >= i * 3
                                                ? password.length >= 12
                                                    ? 'bg-[#10b981]'
                                                    : password.length >= 8
                                                        ? 'bg-[#f4c430]'
                                                        : 'bg-[#ef4444]'
                                                : 'bg-[#243049]'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-[#64748b]">
                                    {password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Medium' : 'Weak'} password
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                            Referral Code <span className="text-[#64748b]">(optional)</span>
                        </label>
                        <div className="relative">
                            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                            <input
                                type="text"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                                placeholder="RAHUL2026"
                                className="w-full pl-11 pr-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] transition-all"
                            />
                        </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 cursor-pointer">
                        <button
                            type="button"
                            onClick={() => setAgreed(!agreed)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreed
                                ? 'bg-[#f4c430] border-[#f4c430]'
                                : 'border-white/20 hover:border-[#f4c430]'
                                }`}
                        >
                            {agreed && <Check className="w-3.5 h-3.5 text-[#0f172a]" />}
                        </button>
                        <span className="text-sm text-[#94a3b8]">
                            I agree to the{' '}
                            <Link href="#" className="text-[#f4c430] hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="#" className="text-[#f4c430] hover:underline">Privacy Policy</Link>
                        </span>
                    </label>

                    <Button type="submit" className="w-full h-12 text-base" disabled={!agreed || !username || !email || !password || isLoading}>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
                    </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-sm text-[#64748b]">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Connect Wallet */}
                <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#8b5cf6]/30 rounded-xl text-sm font-medium hover:border-[#8b5cf6] transition-all">
                    <Wallet className="w-5 h-5 text-[#8b5cf6]" />
                    <span>Sign Up with Wallet</span>
                    <span className="text-[#64748b] text-xs">Polygon</span>
                </button>
            </div>

            {/* Login Link */}
            <p className="text-center mt-6 text-[#94a3b8]">
                Already have an account?{' '}
                <Link href="/login" className="text-[#f4c430] font-semibold hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    );
}
