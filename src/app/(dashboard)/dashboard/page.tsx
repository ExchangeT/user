'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Badge, Button, StatCard, Tabs, SectionHeader } from '@/components/ui';
import { currentUser, leaderboard } from '@/lib/mock-data';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useMatches } from '@/lib/hooks';
import { Zap, Trophy, ChevronRight, ArrowRight, TrendingUp, Target, Wallet, Users } from 'lucide-react';
import { PromotionModal } from '@/components/ui/PromotionModal';
import { LiveBetFeed } from '@/components/dashboard/LiveBetFeed';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('live');
  const stats = currentUser.stats || {
    totalPredictions: 0, wins: 0, losses: 0, winRate: 0,
    totalWinnings: 0, netProfit: 0, currentStreak: 0, bestStreak: 0, globalRank: 0,
  };

  const statusParam = activeTab === 'all' ? undefined : activeTab;
  const { data: matchesResponse, isLoading: matchesLoading } = useMatches({ status: statusParam });
  const matches = matchesResponse?.items || [];

  return (
    <div className="space-y-6">
      <PromotionModal />

      {/* Welcome banner */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="gold">Gold Member</Badge>
            <Badge variant="green">IPL 2026</Badge>
          </div>
          <h1 className="text-xl font-bold text-[var(--ink-1)]">
            Welcome back, {currentUser.username}
          </h1>
          <p className="text-sm text-[var(--ink-3)] mt-0.5">
            You&apos;re on a <span className="text-[var(--positive)] font-semibold">{stats.currentStreak}-win streak</span>
          </p>
        </div>
        <div className="flex gap-2.5 flex-shrink-0">
          <Button size="sm"><Zap className="w-3.5 h-3.5" />Place Prediction</Button>
          <Button variant="secondary" size="sm">IPL Schedule</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard icon={<Target className="w-4 h-4 text-[var(--info)]" />} label="Total Predictions" value={stats.totalPredictions} iconBg="bg-[var(--info-subtle)]" />
        <StatCard icon={<span className="text-sm">✓</span>} label="Wins" value={stats.wins} iconBg="bg-[var(--positive-subtle)]" valueColor="text-[var(--positive)]" />
        <StatCard icon={<TrendingUp className="w-4 h-4 text-[var(--brand)]" />} label="Win Rate" value={`${stats.winRate}%`} iconBg="bg-[var(--brand-subtle)]" />
        <StatCard icon={<Wallet className="w-4 h-4 text-[var(--positive)]" />} label="Net Profit" value={formatCurrency(stats.netProfit)} iconBg="bg-[var(--positive-subtle)]" valueColor="text-[var(--positive)]" />
        <StatCard icon={<Trophy className="w-4 h-4 text-purple-400" />} label="Global Rank" value={`#${stats.globalRank}`} iconBg="bg-purple-500/10" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Matches panel */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink-1)]">
                <Zap className="w-4 h-4 text-[var(--brand)]" />
                Matches
              </div>
              <Tabs
                tabs={[
                  { id: 'live', label: 'Live', count: 1 },
                  { id: 'upcoming', label: 'Upcoming', count: 3 },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
                size="sm"
              />
            </CardHeader>
            <CardContent className="space-y-2.5">
              {matchesLoading ? (
                <div className="py-10 text-center text-[var(--ink-3)] text-sm">Loading matches...</div>
              ) : matches.length === 0 ? (
                <div className="py-10 text-center text-[var(--ink-3)] text-sm">No matches found</div>
              ) : matches.slice(0, 3).map((match: any) => (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <div className="p-4 rounded-lg bg-[var(--panel-raised)] border border-[var(--line)] hover:border-[var(--brand)]/30 hover:bg-[var(--panel)] transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        {match.status === 'live' && (
                          <Badge variant="live" className="text-[10px]">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            LIVE
                          </Badge>
                        )}
                        <span className="text-xs text-[var(--ink-3)] font-medium">{match.tournament?.shortName}</span>
                      </div>
                      <span className="text-xs text-[var(--ink-3)]">{match.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{match.team1?.logo}</span>
                          <div>
                            <p className="font-semibold text-sm text-[var(--ink-1)]">{match.team1?.shortName}</p>
                            {match.score && <p className="font-mono text-xs text-[var(--brand)]">{match.score.team1Score}</p>}
                          </div>
                        </div>
                        <span className="text-xs text-[var(--ink-3)] font-medium">vs</span>
                        <div className="flex items-center gap-2.5">
                          <div className="text-right">
                            <p className="font-semibold text-sm text-[var(--ink-1)]">{match.team2?.shortName}</p>
                            {match.score && <p className="font-mono text-xs text-[var(--brand)]">{match.score.team2Score}</p>}
                          </div>
                          <span className="text-xl">{match.team2?.logo}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[var(--ink-3)] uppercase font-semibold tracking-wide">Pool</p>
                        <p className="font-mono font-bold text-sm text-[var(--ink-1)]">{formatNumber(match.poolSize)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href="/matches"
                className="flex items-center justify-center gap-1.5 text-sm text-[var(--brand)] hover:underline py-2 font-medium"
              >
                View all matches <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <span className="text-sm font-semibold text-[var(--ink-1)]">Quick Actions</span>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {[
                { href: '/wallet', icon: <Wallet className="w-4 h-4" />, label: 'Deposit Funds' },
                { href: '/referrals', icon: <Users className="w-4 h-4" />, label: 'Invite Friends' },
                { href: '/staking', icon: <TrendingUp className="w-4 h-4" />, label: 'Stake $CRIC' },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--panel-raised)] hover:bg-[var(--panel)] border border-transparent hover:border-[var(--line)] transition-all group"
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-[var(--ink-2)] group-hover:text-[var(--ink-1)]">
                    <span className="w-7 h-7 rounded-lg bg-[var(--brand-subtle)] flex items-center justify-center text-[var(--brand)]">
                      {a.icon}
                    </span>
                    {a.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <span className="text-sm font-semibold text-[var(--ink-1)] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[var(--brand)]" />
                Top Predictors
              </span>
              <Link href="/leaderboard" className="text-xs text-[var(--brand)] hover:underline font-medium">
                Full Rankings
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={entry.user.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-yellow-400/20 text-yellow-500'
                    : i === 1 ? 'bg-slate-400/20 text-slate-400'
                    : i === 2 ? 'bg-orange-500/20 text-orange-500'
                    : 'bg-[var(--panel-raised)] text-[var(--ink-3)]'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--ink-1)] truncate">{entry.user.username}</p>
                    <p className="text-xs text-[var(--ink-3)]">{entry.winRate}% win rate</p>
                  </div>
                  <span className="text-sm font-mono font-semibold text-[var(--positive)] tabular flex-shrink-0">
                    +{formatCurrency(entry.profit)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Live feed */}
          <div className="h-[400px]">
            <LiveBetFeed />
          </div>

          {/* Campaign CTA */}
          <Card className="bg-[var(--brand-subtle)] border-[var(--brand)]/20">
            <CardContent className="text-center py-4">
              <p className="text-2xl mb-2">🎫</p>
              <h3 className="font-bold text-sm text-[var(--ink-1)] mb-0.5">Win IPL Tickets!</h3>
              <p className="text-xs text-[var(--ink-3)] mb-3">Only 3 more referrals needed</p>
              <Button size="sm" className="w-full">Invite Friends</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
