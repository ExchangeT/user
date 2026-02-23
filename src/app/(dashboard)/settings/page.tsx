'use client';

import { useState } from 'react';
import { Card, CardContent, Badge, Button, Input } from '@/components/ui';
import { currentUser } from '@/lib/mock-data';
import {
    User, Shield, Bell, CreditCard, Trash2, Eye, EyeOff,
    Upload, ChevronRight, Smartphone, Mail, Globe, Moon, Volume2
} from 'lucide-react';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const user = currentUser;

    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'wallet', label: 'Wallet & Payments', icon: CreditCard },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">⚙️ Settings</h1>
                <p className="text-[#94a3b8]">Manage your account preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Menu */}
                <div className="lg:col-span-1">
                    <Card>
                        <div className="p-2">
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeSection === s.id
                                            ? 'bg-[#f4c430]/10 text-[#f4c430]'
                                            : 'text-[#94a3b8] hover:bg-[#243049] hover:text-white'
                                        }`}
                                >
                                    <s.icon className="w-5 h-5" />
                                    <span className="font-medium">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Settings */}
                    {activeSection === 'profile' && (
                        <>
                            <Card>
                                <div className="p-4 border-b border-white/[0.06]">
                                    <h2 className="font-bold">Profile Information</h2>
                                </div>
                                <CardContent className="space-y-6">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#f4c430] to-[#ff6b35] flex items-center justify-center text-3xl font-bold text-[#0f172a]">
                                            {user.avatar || user.username[0]}
                                        </div>
                                        <div>
                                            <Button variant="secondary" size="sm">
                                                <Upload className="w-4 h-4" /> Change Avatar
                                            </Button>
                                            <p className="text-xs text-[#64748b] mt-2">JPG, PNG or GIF. Max 2MB.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Username</label>
                                            <input
                                                type="text"
                                                defaultValue={user.username}
                                                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#f4c430]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Email</label>
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#f4c430]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                defaultValue={user.phone || '+91 98765 43210'}
                                                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#f4c430]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Referral Code</label>
                                            <input
                                                type="text"
                                                value={user.referralCode}
                                                readOnly
                                                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-[#64748b] cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <Button>Save Changes</Button>
                                </CardContent>
                            </Card>

                            {/* KYC */}
                            <Card>
                                <div className="p-4 border-b border-white/[0.06]">
                                    <h2 className="font-bold">KYC Verification</h2>
                                </div>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 bg-[#111827] rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 flex items-center justify-center text-xl">✅</div>
                                            <div>
                                                <p className="font-semibold">Identity Verified</p>
                                                <p className="text-sm text-[#64748b]">Your KYC is approved. Full platform access enabled.</p>
                                            </div>
                                        </div>
                                        <Badge variant="green">Verified</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="border-[#ef4444]/20">
                                <div className="p-4 border-b border-[#ef4444]/10">
                                    <h2 className="font-bold text-[#ef4444]">⚠️ Danger Zone</h2>
                                </div>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">Delete Account</p>
                                            <p className="text-sm text-[#64748b]">Permanently delete your account and all data. This action cannot be undone.</p>
                                        </div>
                                        <Button variant="danger" size="sm">
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Security Settings */}
                    {activeSection === 'security' && (
                        <>
                            <Card>
                                <div className="p-4 border-b border-white/[0.06]">
                                    <h2 className="font-bold">Change Password</h2>
                                </div>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#f4c430]"
                                            />
                                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]">
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#f4c430]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Confirm Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#f4c430]" />
                                        </div>
                                    </div>
                                    <Button>Update Password</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <div className="p-4 border-b border-white/[0.06]">
                                    <h2 className="font-bold">Two-Factor Authentication</h2>
                                </div>
                                <CardContent className="space-y-4">
                                    {[
                                        { icon: Smartphone, title: 'Authenticator App', desc: 'Google Authenticator or Authy', enabled: true },
                                        { icon: Mail, title: 'Email OTP', desc: 'Receive codes via email', enabled: true },
                                        { icon: Smartphone, title: 'SMS OTP', desc: 'Receive codes via SMS', enabled: false },
                                    ].map((method, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-[#111827] rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#243049] flex items-center justify-center">
                                                    <method.icon className="w-5 h-5 text-[#94a3b8]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{method.title}</p>
                                                    <p className="text-xs text-[#64748b]">{method.desc}</p>
                                                </div>
                                            </div>
                                            <button className={`w-12 h-6 rounded-full transition-all relative ${method.enabled ? 'bg-[#f4c430]' : 'bg-[#243049]'}`}>
                                                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${method.enabled ? 'right-0.5' : 'left-0.5'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <div className="p-4 border-b border-white/[0.06]">
                                    <h2 className="font-bold">Active Sessions</h2>
                                </div>
                                <CardContent className="space-y-3">
                                    {[
                                        { device: 'Chrome on macOS', location: 'Mumbai, India', time: 'Active now', current: true },
                                        { device: 'Safari on iPhone', location: 'Mumbai, India', time: '2 hours ago', current: false },
                                        { device: 'Chrome on Windows', location: 'Delhi, India', time: '3 days ago', current: false },
                                    ].map((session, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-[#111827] rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#243049] flex items-center justify-center">
                                                    <Globe className="w-5 h-5 text-[#94a3b8]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium flex items-center gap-2">
                                                        {session.device}
                                                        {session.current && <Badge variant="green">Current</Badge>}
                                                    </p>
                                                    <p className="text-xs text-[#64748b]">{session.location} · {session.time}</p>
                                                </div>
                                            </div>
                                            {!session.current && (
                                                <Button variant="ghost" size="sm">Revoke</Button>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Notification Preferences */}
                    {activeSection === 'notifications' && (
                        <Card>
                            <div className="p-4 border-b border-white/[0.06]">
                                <h2 className="font-bold">Notification Preferences</h2>
                            </div>
                            <CardContent className="space-y-6">
                                {[
                                    {
                                        category: 'Predictions', items: [
                                            { title: 'Prediction Settled', desc: 'When your prediction result is out', email: true, push: true, inApp: true },
                                            { title: 'Match Starting', desc: 'Reminder before match starts', email: false, push: true, inApp: true },
                                            { title: 'Odds Changed', desc: 'When odds change for active predictions', email: false, push: false, inApp: true },
                                        ]
                                    },
                                    {
                                        category: 'Wallet', items: [
                                            { title: 'Deposit Confirmed', desc: 'When funds are deposited', email: true, push: true, inApp: true },
                                            { title: 'Withdrawal Processed', desc: 'When withdrawal is completed', email: true, push: true, inApp: true },
                                        ]
                                    },
                                    {
                                        category: 'Social', items: [
                                            { title: 'New Referral', desc: 'Someone joins via your link', email: true, push: true, inApp: true },
                                            { title: 'Leaderboard Update', desc: 'Rank changes on leaderboard', email: false, push: false, inApp: true },
                                        ]
                                    },
                                    {
                                        category: 'System', items: [
                                            { title: 'Security Alerts', desc: 'New logins and account changes', email: true, push: true, inApp: true },
                                            { title: 'Product Updates', desc: 'New features and improvements', email: true, push: false, inApp: false },
                                        ]
                                    },
                                ].map((group) => (
                                    <div key={group.category}>
                                        <h3 className="font-semibold text-[#94a3b8] text-sm uppercase tracking-wider mb-3">{group.category}</h3>
                                        <div className="space-y-2">
                                            {group.items.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-[#111827] rounded-xl">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{item.title}</p>
                                                        <p className="text-xs text-[#64748b]">{item.desc}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {[
                                                            { label: 'Email', enabled: item.email, icon: Mail },
                                                            { label: 'Push', enabled: item.push, icon: Smartphone },
                                                            { label: 'App', enabled: item.inApp, icon: Volume2 },
                                                        ].map((ch) => (
                                                            <button
                                                                key={ch.label}
                                                                title={ch.label}
                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${ch.enabled
                                                                        ? 'bg-[#f4c430]/15 text-[#f4c430]'
                                                                        : 'bg-[#243049] text-[#64748b] hover:text-white'
                                                                    }`}
                                                            >
                                                                <ch.icon className="w-4 h-4" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <Button>Save Preferences</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Wallet Settings */}
                    {activeSection === 'wallet' && (
                        <>
                            <Card>
                                <div className="p-4 border-b border-white/[0.06]">
                                    <h2 className="font-bold">Payment Preferences</h2>
                                </div>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Default Currency</label>
                                        <select className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#f4c430]">
                                            <option>INR (₹)</option>
                                            <option>USD ($)</option>
                                            <option>USDT</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#94a3b8] mb-2">Default Stake Amount</label>
                                        <input
                                            type="number"
                                            defaultValue={1000}
                                            className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#f4c430]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-[#111827] rounded-xl">
                                        <div>
                                            <p className="font-medium">Auto-confirm predictions under ₹500</p>
                                            <p className="text-xs text-[#64748b]">Skip confirmation dialog for small stakes</p>
                                        </div>
                                        <button className="w-12 h-6 rounded-full bg-[#f4c430] transition-all relative">
                                            <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 right-0.5" />
                                        </button>
                                    </div>
                                    <Button>Save Preferences</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <div className="p-4 border-b border-white/[0.06]">
                                    <h2 className="font-bold">Connected Wallets</h2>
                                </div>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-[#111827] rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/15 flex items-center justify-center text-lg">🦊</div>
                                            <div>
                                                <p className="font-medium">MetaMask</p>
                                                <p className="text-xs font-mono text-[#64748b]">0x1a2b...ef12</p>
                                            </div>
                                        </div>
                                        <Badge variant="green">Connected</Badge>
                                    </div>
                                    <Button variant="secondary" className="w-full">+ Connect Another Wallet</Button>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
