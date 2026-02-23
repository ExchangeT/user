'use client';

import { useState } from 'react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { faqItems } from '@/lib/mock-data';
import { Search, ChevronDown, ChevronUp, MessageCircle, Book, Shield, Coins, HelpCircle, ExternalLink } from 'lucide-react';

export default function HelpPage() {
    const [search, setSearch] = useState('');
    const [openFaq, setOpenFaq] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All', icon: '📋' },
        { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
        { id: 'predictions', label: 'Predictions', icon: '🎯' },
        { id: 'wallet', label: 'Wallet', icon: '💰' },
        { id: 'referrals', label: 'Referrals', icon: '👥' },
        { id: 'token', label: '$CRIC Token', icon: '🪙' },
        { id: 'security', label: 'Security', icon: '🔒' },
    ];

    const filtered = faqItems.filter((faq) => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = !search || faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const quickLinks = [
        { icon: Book, title: 'Getting Started Guide', desc: 'Learn the basics of CricChain', href: '#' },
        { icon: HelpCircle, title: 'How Predictions Work', desc: 'Understanding markets and odds', href: '#' },
        { icon: Coins, title: '$CRIC Token', desc: 'Staking, rewards, and benefits', href: '#' },
        { icon: Shield, title: 'Security Best Practices', desc: 'Keep your account safe', href: '#' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">❓ Help & Support</h1>
                <p className="text-[#94a3b8]">Find answers and get help</p>
            </div>

            {/* Search */}
            <Card className="p-8 bg-gradient-to-r from-[#1a2235] to-[#243049] border-white/10">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
                    <p className="text-[#94a3b8] mb-6">Search our knowledge base or browse FAQs below</p>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for help..."
                            className="w-full pl-12 pr-4 py-4 bg-[#111827] border border-white/10 rounded-2xl text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] text-lg"
                        />
                    </div>
                </div>
            </Card>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLinks.map((link, i) => (
                    <Card key={i} hover className="p-5 cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-[#f4c430]/15 flex items-center justify-center mb-3">
                            <link.icon className="w-5 h-5 text-[#f4c430]" />
                        </div>
                        <h3 className="font-semibold mb-1">{link.title}</h3>
                        <p className="text-sm text-[#64748b]">{link.desc}</p>
                    </Card>
                ))}
            </div>

            {/* FAQ Categories */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id
                                ? 'bg-[#f4c430]/10 text-[#f4c430] border border-[#f4c430]/30'
                                : 'text-[#64748b] bg-[#1a2235] border border-white/[0.06] hover:text-white hover:bg-[#243049]'
                            }`}
                    >
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* FAQ Accordion */}
            <Card>
                <div className="p-4 border-b border-white/[0.06]">
                    <h2 className="font-bold">Frequently Asked Questions</h2>
                    <p className="text-sm text-[#64748b]">{filtered.length} articles found</p>
                </div>
                <div className="divide-y divide-white/[0.06]">
                    {filtered.map((faq) => (
                        <div key={faq.id}>
                            <button
                                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 pr-4">
                                    <span className="text-[#f4c430]">Q</span>
                                    <span className="font-medium">{faq.question}</span>
                                </div>
                                {openFaq === faq.id ? (
                                    <ChevronUp className="w-5 h-5 text-[#64748b] flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-[#64748b] flex-shrink-0" />
                                )}
                            </button>
                            {openFaq === faq.id && (
                                <div className="px-5 pb-5 pl-12">
                                    <p className="text-[#94a3b8] leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-[#64748b]">No matching articles found. Try a different search term.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Contact Support */}
            <Card className="bg-gradient-to-r from-[#1a2235] to-[#8b5cf6]/10 border-[#8b5cf6]/30">
                <CardContent className="py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center">
                                <MessageCircle className="w-8 h-8 text-[#8b5cf6]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Still need help?</h3>
                                <p className="text-[#94a3b8]">Our support team is available 24/7 to assist you</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary">
                                <MessageCircle className="w-4 h-4" /> Live Chat
                            </Button>
                            <Button>
                                <ExternalLink className="w-4 h-4" /> Contact Support
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
