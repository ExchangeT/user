'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, Badge, Button, Tabs } from '@/components/ui';
import { useCampaignDetail, useJoinCampaign } from '@/lib/hooks';
import { Calendar, Users, Trophy, ChevronLeft, ArrowRight, CheckCircle2, Loader2, Share2, Info } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function CampaignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();
    const id = params.id as string;

    const [activeTab, setActiveTab] = useState('details');

    const { data: campaign, isLoading } = useCampaignDetail(id);
    const joinMutation = useJoinCampaign();

    const isJoined = campaign?.isJoined;

    const handleJoin = async () => {
        if (sessionStatus === 'unauthenticated') {
            // Redirect to login with callback URL
            router.push(`/login?callbackUrl=/campaigns/${id}`);
            return;
        }

        if (!isJoined && !joinMutation.isPending) {
            joinMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="w-8 h-8 animate-spin text-[#f4c430]" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
                <Link href="/campaigns" className="text-[#f4c430] hover:underline">← Back to Campaigns</Link>
            </div>
        );
    }

    const { title, description, type, status, startDate, endDate, prizePool, totalParticipants, rules } = campaign;

    return (
        <div className="space-y-6">
            <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#f4c430] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Campaigns
            </Link>

            {/* Header Banner */}
            <div className="bg-[#1a2235] rounded-3xl overflow-hidden border border-white/5 relative">
                {/* Visual Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2235] via-[#243049] to-[#f4c430]/10" />

                <div className="relative p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {status === 'LIVE' ? (
                                <Badge variant="live">LIVE</Badge>
                            ) : status === 'UPCOMING' ? (
                                <Badge variant="blue">UPCOMING</Badge>
                            ) : (
                                <Badge variant="gold">ENDED</Badge>
                            )}
                            <Badge variant="purple">{type}</Badge>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-white">{title}</h1>
                        <p className="text-[#94a3b8] max-w-2xl text-lg">{description || 'Join this event to climb the leaderboard and win your share of the massive prize pool!'}</p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
                            <div className="flex items-center gap-2 text-[#94a3b8]">
                                <Calendar className="w-5 h-5 text-[#f4c430]" />
                                <span>{new Date(startDate).toLocaleDateString()} — {new Date(endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#94a3b8]">
                                <Users className="w-5 h-5 text-[#3b82f6]" />
                                <span>{totalParticipants} Joined</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Action Card */}
                    <div className="w-full md:w-80 shrink-0">
                        <Card className="bg-[#111827]/80 backdrop-blur-md border-[#f4c430]/30 shadow-2xl p-6 text-center">
                            <Trophy className="w-12 h-12 text-[#f4c430] mx-auto mb-4" />
                            <p className="text-sm text-[#94a3b8] mb-1">Total Prize Pool</p>
                            <p className="text-3xl font-mono font-bold text-[#10b981] mb-6">{formatCurrency(prizePool)}</p>

                            {status === 'ENDED' ? (
                                <Button className="w-full opacity-50 cursor-not-allowed" disabled>Campaign Ended</Button>
                            ) : isJoined ? (
                                <Button className="w-full bg-[#10b981] text-white hover:bg-[#059669] flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" /> Joined Successfully
                                </Button>
                            ) : (
                                <Button
                                    className="w-full bg-gradient-to-r from-[#f4c430] to-[#ff6b35] text-black hover:-translate-y-1 shadow-lg shadow-[#f4c430]/20"
                                    onClick={handleJoin}
                                    disabled={joinMutation.isPending}
                                >
                                    {joinMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Join Campaign <ArrowRight className="w-4 h-4" /></>}
                                </Button>
                            )}

                            <p className="text-xs text-[#64748b] mt-4">By joining, you agree to the campaign rules and terms of service.</p>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Campaign Details Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="border-b border-white/5 p-2">
                            <Tabs
                                tabs={[
                                    { id: 'details', label: 'Details' },
                                    { id: 'rules', label: 'Rules' },
                                    { id: 'rewards', label: 'Rewards Structure' }
                                ]}
                                activeTab={activeTab}
                                onChange={setActiveTab}
                            />
                        </div>

                        <div className="p-6">
                            {activeTab === 'details' && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold mb-4">About this Campaign</h3>
                                    <p className="text-[#94a3b8] leading-relaxed">
                                        {description || 'This is a special event created for CricChain users. Compete against others by placing winning predictions during the campaign period. The users with the highest net profit at the end of the campaign will share the massive prize pool.'}
                                    </p>
                                    <h4 className="font-semibold mt-6 mb-2">How it works:</h4>
                                    <ul className="list-disc list-inside space-y-2 text-[#94a3b8]">
                                        <li>Click the "Join Campaign" button to register your participation.</li>
                                        <li>Place predictions on any eligible matches during the active period.</li>
                                        <li>Only resolved predictions within the timeframe will count towards your score.</li>
                                        <li>Track your progress on the leaderboard.</li>
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'rules' && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                                        <Info className="w-5 h-5 text-[#f4c430]" /> Rules & Conditions
                                    </h3>
                                    <div className="bg-[#111827] rounded-xl p-4 text-sm text-[#94a3b8] space-y-3">
                                        {rules ? (
                                            <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(rules, null, 2)}</pre>
                                        ) : (
                                            <ul className="list-disc list-inside space-y-2">
                                                <li>Participants must hold a verified account (KYC).</li>
                                                <li>Minimum 5 predictions required to qualify for the prize pool.</li>
                                                <li>Cancelled or refunded predictions do not count towards the total volume.</li>
                                                <li>CricChain reserves the right to disqualify accounts suspected of wash trading or manipulation.</li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'rewards' && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold mb-4">Prize Pool Distribution</h3>
                                    <div className="space-y-3">
                                        {[
                                            { rank: '1st Place', prize: prizePool * 0.5 },
                                            { rank: '2nd Place', prize: prizePool * 0.25 },
                                            { rank: '3rd Place', prize: prizePool * 0.10 },
                                            { rank: '4th - 10th Place', prize: `${formatCurrency(prizePool * 0.15)} shared` },
                                        ].map((tier, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-[#111827] border border-white/5 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : idx === 1 ? 'bg-gray-300/20 text-gray-300' : idx === 2 ? 'bg-orange-500/20 text-orange-500' : 'bg-[#243049] text-[#64748b]'}`}>{idx + 1}</span>
                                                    <span className="font-semibold">{tier.rank}</span>
                                                </div>
                                                <span className="font-mono font-bold text-[#10b981]">
                                                    {typeof tier.prize === 'number' ? formatCurrency(tier.prize) : tier.prize}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <div className="p-6">
                            <h3 className="font-bold mb-4">Share Campaign</h3>
                            <p className="text-sm text-[#94a3b8] mb-4">Invite your friends to compete with you in this campaign.</p>
                            <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                                <Share2 className="w-4 h-4" /> Copy Link
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
