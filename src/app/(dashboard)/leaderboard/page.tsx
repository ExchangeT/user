'use client';

import { useState } from 'react';
import { Card, Badge, Button, Tabs } from '@/components/ui';
import { leaderboard as mockLeaderboard, currentUser } from '@/lib/mock-data';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Trophy, TrendingUp, TrendingDown, Minus, Medal, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all');

  const top3 = mockLeaderboard.slice(0, 3);
  const others = mockLeaderboard.slice(3);

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'text-[#3b82f6]';
      case 'gold': return 'text-[#f4c430]';
      case 'silver': return 'text-[#94a3b8]';
      default: return 'text-[#cd7f32]';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-[#94a3b8]">Compete with the best predictors and win exclusive $CRIC rewards.</p>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex justify-between items-end">
        <Tabs
          tabs={[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'Weekly' },
            { id: 'month', label: 'Monthly' },
            { id: 'all', label: 'All Time' }
          ]}
          activeTab={timeFilter}
          onChange={setTimeFilter}
        />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="bg-[#1a2235] border-white/5">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10">
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-2 md:order-1"
        >
          <Card className="relative pt-12 pb-6 text-center border-[#94a3b8]/20 bg-gradient-to-b from-[#94a3b8]/5 to-transparent">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#94a3b8] overflow-hidden bg-[#111827]">
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#94a3b8]">
                    {top3[1].user.avatar || top3[1].user.username[0]}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#94a3b8] flex items-center justify-center text-white font-bold border-2 border-[#0a0e17]">
                  2
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1">{top3[1].user.username}</h3>
            <p className={`text-xs uppercase font-bold tracking-widest mb-4 ${getTierColor(top3[1].user.tier || '')}`}>
              {top3[1].user.tier || 'BRONZE'}
            </p>
            <div className="flex justify-center gap-6">
              <div>
                <p className="text-[10px] text-[#64748b] uppercase">Profit</p>
                <p className="font-mono font-bold text-[#10b981]">{formatCurrency(top3[1].profit)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#64748b] uppercase">Win Rate</p>
                <p className="font-mono font-bold">{top3[1].winRate}%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="order-1 md:order-2"
        >
          <Card className="relative pt-16 pb-8 text-center border-[#f4c430]/40 bg-gradient-to-b from-[#f4c430]/10 to-transparent transform md:-translate-y-4">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
                <div className="w-24 h-24 rounded-full border-4 border-[#f4c430] overflow-hidden bg-[#111827] shadow-[0_0_30px_rgba(244,196,48,0.2)]">
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#f4c430]">
                    {top3[0].user.avatar || top3[0].user.username[0]}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#f4c430] flex items-center justify-center text-[#0a0e17] font-bold border-2 border-[#0a0e17]">
                  1
                </div>
              </div>
            </div>
            <h3 className="font-bold text-xl mb-1">{top3[0].user.username}</h3>
            <p className={`text-xs uppercase font-bold tracking-widest mb-6 ${getTierColor(top3[0].user.tier || '')}`}>
              {top3[0].user.tier || 'GOLD'}
            </p>
            <div className="flex justify-center gap-8">
              <div>
                <p className="text-[10px] text-[#64748b] uppercase">Total Profit</p>
                <p className="font-mono text-xl font-bold text-[#10b981]">{formatCurrency(top3[0].profit)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#64748b] uppercase">Win Rate</p>
                <p className="font-mono text-xl font-bold">{top3[0].winRate}%</p>
              </div>
            </div>
            <Button className="mt-6 w-full max-w-[160px] mx-auto bg-[#f4c430] hover:bg-[#d4a410] text-black">
              View Profile
            </Button>
          </Card>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-3"
        >
          <Card className="relative pt-12 pb-6 text-center border-[#cd7f32]/20 bg-gradient-to-b from-[#cd7f32]/5 to-transparent">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#cd7f32] overflow-hidden bg-[#111827]">
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#cd7f32]">
                    {top3[2].user.avatar || top3[2].user.username[0]}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#cd7f32] flex items-center justify-center text-white font-bold border-2 border-[#0a0e17]">
                  3
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1">{top3[2].user.username}</h3>
            <p className={`text-xs uppercase font-bold tracking-widest mb-4 ${getTierColor(top3[2].user.tier || '')}`}>
              {top3[2].user.tier || 'BRONZE'}
            </p>
            <div className="flex justify-center gap-6">
              <div>
                <p className="text-[10px] text-[#64748b] uppercase">Profit</p>
                <p className="font-mono font-bold text-[#10b981]">{formatCurrency(top3[2].profit)}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#64748b] uppercase">Win Rate</p>
                <p className="font-mono font-bold">{top3[2].winRate}%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Rankings Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="font-bold">Full Rankings</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Find user..."
              className="pl-9 pr-4 py-1.5 bg-[#111827] border border-white/5 rounded-lg text-sm focus:outline-none focus:border-[#f4c430] w-48"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[#64748b] text-[10px] uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Rank</th>
                <th className="px-6 py-4 font-semibold">Predictor</th>
                <th className="px-6 py-4 font-semibold text-right">Profit</th>
                <th className="px-6 py-4 font-semibold text-right">Win Rate</th>
                <th className="px-6 py-4 font-semibold text-right">Total Bets</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {others.map((entry) => (
                <tr key={entry.user.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#94a3b8]">{entry.rank}</span>
                      {entry.rankChange > 0 ? (
                        <TrendingUp className="w-3 h-3 text-[#10b981]" />
                      ) : entry.rankChange < 0 ? (
                        <TrendingDown className="w-3 h-3 text-[#ef4444]" />
                      ) : (
                        <Minus className="w-3 h-3 text-[#64748b]" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#243049] flex items-center justify-center font-bold text-xs ring-2 ring-white/5 group-hover:ring-[#f4c430]/30 transition-all">
                        {entry.user.avatar || entry.user.username[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm group-hover:text-[#f4c430] transition-all">{entry.user.username}</p>
                        <p className={`text-[10px] font-bold uppercase ${getTierColor(entry.user.tier || '')}`}>
                          {entry.user.tier || 'BRONZE'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-mono font-bold text-[#10b981]">{formatCurrency(entry.profit)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-mono font-bold">{entry.winRate}%</p>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-[#94a3b8]">
                    {formatNumber(entry.totalBets)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Badge variant="blue" className="bg-blue-500/10 text-blue-500 border-none px-2 py-0">Active</Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User's Own Rank (Pinned at bottom) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="bg-[#1a2235]/80 backdrop-blur-xl border border-[#f4c430]/30 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#f4c430] text-[#0a0e17] font-bold rounded-lg px-3 py-1 text-sm">
              #{currentUser?.stats?.globalRank || '---'}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f4c430]/20 flex items-center justify-center font-bold border border-[#f4c430]/20">
                {currentUser.avatar || currentUser.username[0]}
              </div>
              <div>
                <p className="font-bold text-sm">You ({currentUser.username})</p>
                <p className="text-[10px] text-[#f4c430] uppercase font-bold tracking-widest">{currentUser.tier}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-[10px] text-[#64748b] uppercase">Current Profit</p>
              <p className="font-mono font-bold text-[#10b981]">{formatCurrency(currentUser?.stats?.netProfit || 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#64748b] uppercase">Win Rate</p>
              <p className="font-mono font-bold">{currentUser?.stats?.winRate || 0}%</p>
            </div>
            <div className="flex items-center border-l border-white/10 pl-4 ml-4">
              <p className="text-[10px] text-[#94a3b8] max-w-[100px] leading-tight">
                Rank up to <strong className="text-white">#{(currentUser?.stats?.globalRank || 10) - 10}</strong> for extra rewards
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
