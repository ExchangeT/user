'use client';

import { useState } from 'react';
import { Card, Badge, Button, Tabs, SectionHeader } from '@/components/ui';
import { leaderboard as mockLeaderboard, currentUser } from '@/lib/mock-data';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Trophy, TrendingUp, TrendingDown, Minus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const TIER_COLORS: Record<string, string> = {
  platinum: 'text-[var(--info)]',
  gold:     'text-[var(--brand)]',
  silver:   'text-[var(--ink-2)]',
  bronze:   'text-orange-500',
};

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const top3 = mockLeaderboard.slice(0, 3);
  const others = mockLeaderboard.slice(3).filter(e =>
    !search || e.user.username.toLowerCase().includes(search.toLowerCase())
  );

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = ['h-20', 'h-28', 'h-16'];
  const podiumRanks = [2, 1, 3];
  const podiumBorderColors = ['border-[var(--ink-3)]', 'border-[var(--brand)]', 'border-orange-500/60'];

  return (
    <div className="space-y-8 pb-24">
      <SectionHeader
        title="Leaderboard"
        description="Compete with the best predictors and earn $CRIC rewards"
      />

      {/* Time filter */}
      <div className="flex items-center justify-between gap-4">
        <Tabs
          tabs={[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'Weekly' },
            { id: 'month', label: 'Monthly' },
            { id: 'all', label: 'All Time' },
          ]}
          activeTab={timeFilter}
          onChange={setTimeFilter}
          size="sm"
        />
        <Button variant="secondary" size="sm">
          <Filter className="w-3.5 h-3.5" /> Filters
        </Button>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto items-end pt-6">
        {podiumOrder.map((entry, i) => {
          if (!entry) return null;
          const rank = podiumRanks[i];
          const tierColor = TIER_COLORS[(entry.user.tier || '').toLowerCase()] || 'text-[var(--ink-3)]';
          return (
            <motion.div
              key={entry.user.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn(
                'relative text-center overflow-hidden border',
                podiumBorderColors[i]
              )}>
                {rank === 1 && (
                  <div className="text-2xl absolute top-2 left-1/2 -translate-x-1/2">👑</div>
                )}
                <div className={cn('w-full bg-[var(--panel-raised)]', podiumHeights[i])} />
                <div className="px-3 pb-4 pt-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--panel-raised)] border-2 flex items-center justify-center text-xl font-bold mx-auto -mt-6 mb-2" style={{ borderColor: 'inherit' }}>
                    {entry.user.avatar || entry.user.username[0]}
                  </div>
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--brand)] flex items-center justify-center text-[var(--brand-fg)] text-xs font-bold">
                    {rank}
                  </div>
                  <p className="font-bold text-sm text-[var(--ink-1)] truncate">{entry.user.username}</p>
                  <p className={cn('text-[10px] font-bold uppercase tracking-widest mb-2', tierColor)}>
                    {entry.user.tier || 'Bronze'}
                  </p>
                  <p className="font-mono font-bold text-sm text-[var(--positive)] tabular">{formatCurrency(entry.profit)}</p>
                  <p className="text-xs text-[var(--ink-3)]">{entry.winRate}% win rate</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Rankings table */}
      <Card>
        <div className="px-4 py-3 border-b border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[var(--ink-1)]">Full Rankings</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-3)]" />
            <input
              type="text"
              placeholder="Find user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] w-48 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--panel-raised)]">
                {['Rank', 'Predictor', 'Profit', 'Win Rate', 'Total Bets', 'Status'].map(col => (
                  <th key={col} className={cn(
                    'px-4 py-3 text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-widest whitespace-nowrap',
                    ['Profit', 'Win Rate', 'Total Bets'].includes(col) && 'text-right'
                  )}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {others.map((entry) => {
                const tierColor = TIER_COLORS[(entry.user.tier || '').toLowerCase()] || 'text-[var(--ink-3)]';
                return (
                  <tr key={entry.user.id} className="hover:bg-[var(--panel-raised)] transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-[var(--ink-2)] tabular w-5 text-center">{entry.rank}</span>
                        {entry.rankChange > 0
                          ? <TrendingUp className="w-3 h-3 text-[var(--positive)]" />
                          : entry.rankChange < 0
                          ? <TrendingDown className="w-3 h-3 text-[var(--negative)]" />
                          : <Minus className="w-3 h-3 text-[var(--ink-3)]" />
                        }
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[var(--panel-raised)] border border-[var(--line)] flex items-center justify-center text-xs font-bold text-[var(--ink-2)]">
                          {entry.user.avatar || entry.user.username[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--ink-1)] group-hover:text-[var(--brand)] transition-colors">{entry.user.username}</p>
                          <p className={cn('text-[10px] font-bold uppercase tracking-widest', tierColor)}>
                            {entry.user.tier || 'Bronze'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-mono font-bold text-sm text-[var(--positive)] tabular">{formatCurrency(entry.profit)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-mono text-sm text-[var(--ink-1)] tabular">{entry.winRate}%</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-mono text-sm text-[var(--ink-2)] tabular">{formatNumber(entry.totalBets)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="green" className="text-[10px]">Active</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Floating own rank */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20 pointer-events-none">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pointer-events-auto bg-[var(--panel-overlay)] border border-[var(--line)] rounded-xl shadow-dropdown p-3.5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-[var(--brand)] text-[var(--brand-fg)] font-bold rounded-lg text-sm">
              #{currentUser?.stats?.globalRank || '---'}
            </div>
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-subtle)] border border-[var(--brand)]/20 flex items-center justify-center font-bold text-sm text-[var(--brand)]">
              {currentUser.avatar || currentUser.username[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--ink-1)]">You ({currentUser.username})</p>
              <p className="text-[10px] text-[var(--brand)] font-bold uppercase tracking-widest">{currentUser.tier}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-[10px] text-[var(--ink-3)] uppercase font-semibold tracking-wider">Profit</p>
              <p className="font-mono font-bold text-sm text-[var(--positive)] tabular">{formatCurrency(currentUser?.stats?.netProfit || 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[var(--ink-3)] uppercase font-semibold tracking-wider">Win Rate</p>
              <p className="font-mono font-bold text-sm text-[var(--ink-1)] tabular">{currentUser?.stats?.winRate || 0}%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
