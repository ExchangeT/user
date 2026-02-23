'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Badge, Button, StatCard, Tabs } from '@/components/ui';
import { currentUser, leaderboard } from '@/lib/mock-data';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useMatches } from '@/lib/hooks';
import { Zap, Trophy, ChevronRight, ArrowRight } from 'lucide-react';
import { PromotionModal } from '@/components/ui/PromotionModal';
import { LiveBetFeed } from '@/components/dashboard/LiveBetFeed';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('live');
  const stats = currentUser.stats || {
    totalPredictions: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalWinnings: 0,
    netProfit: 0,
    currentStreak: 0,
    bestStreak: 0,
    globalRank: 0
  };

  const statusParam = activeTab === 'all' ? undefined : activeTab;
  const { data: matchesResponse, isLoading: matchesLoading } = useMatches({ status: statusParam });
  const matches = matchesResponse?.items || [];

  return (
    <div className="space-y-6">
      <PromotionModal />
      <div className="bg-gradient-to-r from-[#1a2235] to-[#243049] border border-[#f4c430]/30 rounded-3xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2"><Badge variant="gold">⭐ Gold Member</Badge><Badge variant="green">IPL 2026</Badge></div>
          <h1 className="text-2xl font-bold mb-1">Welcome back, {currentUser.username}! 👋</h1>
          <p className="text-[#94a3b8] mb-4">You&apos;re on a {stats.currentStreak} win streak!</p>
          <div className="flex gap-3"><Button><Zap className="w-4 h-4" /> Place Prediction</Button><Button variant="secondary">View IPL Schedule</Button></div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <StatCard icon="🎯" label="Total Predictions" value={stats.totalPredictions} iconBg="bg-[#3b82f6]/15" />
        <StatCard icon="✅" label="Wins" value={stats.wins} iconBg="bg-[#10b981]/15" />
        <StatCard icon="📈" label="Win Rate" value={`${stats.winRate}%`} iconBg="bg-[#f4c430]/15" />
        <StatCard icon="💰" label="Net Profit" value={formatCurrency(stats.netProfit)} iconBg="bg-[#10b981]/15" />
        <StatCard icon="🏆" label="Global Rank" value={`#${stats.globalRank}`} iconBg="bg-[#8b5cf6]/15" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-[#f4c430]" />Matches</h2>
              <Tabs tabs={[{ id: 'live', label: 'Live', count: 1 }, { id: 'upcoming', label: 'Upcoming', count: 3 }]} activeTab={activeTab} onChange={setActiveTab} />
            </CardHeader>
            <CardContent className="space-y-4">
              {matchesLoading ? (
                <div className="py-10 text-center text-[#64748b]">Loading matches...</div>
              ) : matches.slice(0, 3).map((match: any) => (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <div className="p-4 rounded-xl bg-[#111827] border border-white/[0.06] hover:border-[#f4c430]/30 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {match.status === 'live' && <Badge variant="live"><span className="w-1.5 h-1.5 bg-white rounded-full mr-1" />LIVE</Badge>}
                        <span className="text-xs text-[#64748b]">{match.tournament.shortName}</span>
                      </div>
                      <span className="text-xs text-[#64748b]">{match.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3"><span className="text-2xl">{match.team1.logo}</span><div><p className="font-semibold">{match.team1.shortName}</p>{match.score && <p className="font-mono text-[#f4c430]">{match.score.team1Score}</p>}</div></div>
                        <span className="text-[#64748b]">vs</span>
                        <div className="flex items-center gap-3"><div className="text-right"><p className="font-semibold">{match.team2.shortName}</p>{match.score && <p className="font-mono text-[#f4c430]">{match.score.team2Score}</p>}</div><span className="text-2xl">{match.team2.logo}</span></div>
                      </div>
                      <div className="text-right"><p className="text-sm text-[#64748b]">Pool</p><p className="font-mono font-bold text-[#f4c430]">{formatNumber(match.poolSize)}</p></div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/matches" className="flex items-center justify-center gap-2 text-[#f4c430] hover:underline py-2">View all <ArrowRight className="w-4 h-4" /></Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><h3 className="font-bold">Quick Actions</h3></CardHeader>
            <CardContent className="space-y-2">
              {[{ href: '/wallet', icon: '💰', label: 'Deposit Funds' }, { href: '/referrals', icon: '👥', label: 'Invite Friends' }, { href: '/staking', icon: '🪙', label: 'Stake $CRIC' }].map((a) => (
                <Link key={a.href} href={a.href} className="flex items-center justify-between p-3 rounded-xl bg-[#111827] hover:bg-[#243049] transition-all">
                  <span className="flex items-center gap-2"><span className="w-8 h-8 rounded-lg bg-[#f4c430]/15 flex items-center justify-center">{a.icon}</span>{a.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#64748b]" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between"><h3 className="font-bold flex items-center gap-2"><Trophy className="w-4 h-4 text-[#f4c430]" />Top Predictors</h3><Link href="/leaderboard" className="text-xs text-[#f4c430] hover:underline">Full Rankings</Link></CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={entry.user.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' : i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' : 'bg-[#243049] text-[#64748b]'}`}>{i + 1}</div>
                  <div className="flex-1"><p className="text-sm font-medium">{entry.user.username}</p><p className="text-xs text-[#64748b]">{entry.winRate}% win rate</p></div>
                  <span className="text-sm font-mono font-semibold text-[#10b981]">+{formatCurrency(entry.profit)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="h-[450px]">
            <LiveBetFeed />
          </div>

          <Card className="bg-gradient-to-br from-[#1a2235] to-[#f4c430]/10 border-[#f4c430]/30">
            <CardContent className="text-center py-4"><span className="text-3xl mb-2 block">🎫</span><h3 className="font-bold text-sm mb-0.5">Win IPL Tickets!</h3><p className="text-[11px] text-[#94a3b8] mb-3">Only 3 more referrals to win!</p><Button size="sm" className="w-full">Invite Friends</Button></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
