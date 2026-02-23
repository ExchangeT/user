'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui';
import { Mail, Phone, Eye, EyeOff, ArrowRight, Wallet, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

import { Suspense } from 'react';

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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || (method === 'email' && !email) || (method === 'phone' && !phone)) {
            return toast('Please fill in all fields', 'error');
        }

        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: method === 'email' ? email : phone, // assuming backend handles both later
                password,
            });

            if (res?.error) {
                toast('Invalid email or password', 'error');
            } else {
                toast('Successfully signed in!', 'success');
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            toast('An unexpected error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl });
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
                    Welcome Back
                </h1>
                <p className="text-[#94a3b8]">Sign in to continue to CricChain</p>
            </div>

            {/* Login Card */}
            <div className="bg-[#1a2235] border border-white/[0.06] rounded-2xl p-6 shadow-2xl">
                {/* Method Toggle */}
                <div className="flex bg-[#111827] rounded-xl p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setMethod('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${method === 'email' ? 'bg-[#f4c430]/10 text-[#f4c430]' : 'text-[#64748b] hover:text-white'
                            }`}
                    >
                        <Mail className="w-4 h-4" /> Email
                    </button>
                    <button
                        type="button"
                        onClick={() => setMethod('phone')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${method === 'phone' ? 'bg-[#f4c430]/10 text-[#f4c430]' : 'text-[#64748b] hover:text-white'
                            }`}
                    >
                        <Phone className="w-4 h-4" /> Phone
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    {method === 'email' ? (
                        <div>
                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="rahul@example.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] transition-all"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] text-sm">+91</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="98765 43210"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
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
                    </div>

                    <div className="flex justify-end">
                        <Link href="#" className="text-sm text-[#f4c430] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-12 text-base">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                    </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-sm text-[#64748b]">or continue with</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button onClick={handleGoogleSignIn} type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-sm font-medium hover:border-[#f4c430]/50 transition-all">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" /><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" /><path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" /><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" /></svg>
                        Google
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-sm font-medium hover:border-[#f4c430]/50 transition-all">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        Twitter
                    </button>
                </div>

                {/* Connect Wallet */}
                <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[#8b5cf6]/10 to-[#ec4899]/10 border border-[#8b5cf6]/30 rounded-xl text-sm font-medium hover:border-[#8b5cf6] transition-all group">
                    <Wallet className="w-5 h-5 text-[#8b5cf6]" />
                    <span>Connect Wallet</span>
                    <span className="text-[#64748b] text-xs">Polygon</span>
                </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-[#94a3b8]">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[#f4c430] font-semibold hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="w-10 h-10 animate-spin text-[#f4c430]" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
