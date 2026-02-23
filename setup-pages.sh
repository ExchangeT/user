#!/bin/bash
# CricChain Complete Setup Script
# Run: chmod +x setup.sh && ./setup.sh

cd /home/claude/cricchain-nextjs

echo "🏏 Setting up CricChain Frontend..."

# ============================================
# CAMPAIGNS PAGE
# ============================================
cat > 'src/app/(dashboard)/campaigns/page.tsx' << 'CAMPAIGNS'
'use client';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export default function CampaignsPage() {
  const campaigns = [
    { id: '1', title: 'Daily Top Bettor', desc: 'Highest volume wins daily', icon: '🏆', status: 'live', progress: 65, rewards: ['🎫 IPL Ticket', '💰 ₹5K'], time: '8h left' },
    { id: '2', title: 'Referral Champions', desc: 'Refer 50 friends', icon: '👥', status: 'live', progress: 94, rewards: ['🎫 IPL Ticket', '🪙 5K $CRIC'], time: '32 days', current: 47, target: 50 },
    { id: '3', title: 'Private Sale', desc: 'Invest $5K+ for ticket', icon: '💎', status: 'ending', progress: 78, rewards: ['🎫 IPL Ticket', '🪙 25% Bonus'], time: '5 days' },
    { id: '4', title: 'Winning Streak', desc: 'Win 10 in a row', icon: '🔥', status: 'live', progress: 70, rewards: ['💰 ₹10K', '🪙 2.5K $CRIC'], current: 7, target: 10 },
    { id: '5', title: 'Welcome Bonus', desc: '100% first deposit match', icon: '🎉', status: 'claimed', rewards: ['💰 100% Match', '🪙 500 $CRIC'] },
    { id: '6', title: 'Weekend Warriors', desc: 'Predict all weekend matches', icon: '🗓️', status: 'upcoming', rewards: ['💰 2x Rewards', '🪙 1K $CRIC'], time: 'Starts Sat' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">🎁 Campaigns</h1><p className="text-[#94a3b8]">Win IPL tickets, bonuses & rewards</p></div>
      
      <Card className="p-8 bg-gradient-to-r from-[#1a2235] to-[#f4c430]/10 border-[#f4c430]/30">
        <div className="flex justify-between items-center">
          <div className="max-w-lg">
            <Badge variant="gold" className="mb-3">🔥 FEATURED</Badge>
            <h2 className="text-3xl font-bold mb-2">Win <span className="gradient-text">FREE IPL Tickets</span> 🎫</h2>
            <p className="text-[#94a3b8] mb-4">Top predictors win match tickets worth up to ₹25,000!</p>
            <div className="flex gap-6 mb-4">
              <div><p className="font-mono text-2xl font-bold text-[#f4c430]">120</p><p className="text-xs text-[#64748b]">Tickets</p></div>
              <div><p className="font-mono text-2xl font-bold text-[#f4c430]">₹12L+</p><p className="text-xs text-[#64748b]">Prize Pool</p></div>
              <div><p className="font-mono text-2xl font-bold text-[#f4c430]">32</p><p className="text-xs text-[#64748b]">Days Left</p></div>
            </div>
            <Button>🎯 Start Predicting</Button>
          </div>
          <div className="w-48 h-32 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-[#f4c430] rounded-2xl flex flex-col items-center justify-center animate-bounce"><span className="text-4xl">🎫</span><span className="font-bold text-[#f4c430]">IPL 2026</span></div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <Card key={c.id} hover className="overflow-hidden">
            <div className={`h-32 flex items-center justify-center text-5xl ${c.status === 'live' ? 'bg-gradient-to-br from-[#f4c430]/20 to-[#ff6b35]/20' : c.status === 'ending' ? 'bg-gradient-to-br from-[#ef4444]/20 to-[#f97316]/20' : 'bg-gradient-to-br from-[#8b5cf6]/20 to-[#ec4899]/20'}`}>
              <Badge variant={c.status === 'live' ? 'live' : c.status === 'ending' ? 'red' : c.status === 'claimed' ? 'green' : 'blue'} className="absolute top-3 left-3">{c.status === 'live' ? '● LIVE' : c.status.toUpperCase()}</Badge>
              {c.icon}
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-1">{c.title}</h3>
              <p className="text-sm text-[#64748b] mb-3">{c.desc}</p>
              <div className="flex flex-wrap gap-1 mb-3">{c.rewards.map((r, i) => (<span key={i} className="text-xs px-2 py-1 bg-[#243049] rounded">{r}</span>))}</div>
              {c.progress && c.status !== 'claimed' && <ProgressBar value={c.progress} className="mb-2" />}
              {c.current !== undefined && <p className="text-xs text-[#64748b] mb-2">{c.current}/{c.target}</p>}
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="text-sm text-[#64748b]">{c.time || ''}</span>
                <Button size="sm" variant={c.status === 'claimed' ? 'secondary' : 'primary'}>{c.status === 'claimed' ? '✓ Claimed' : c.status === 'upcoming' ? 'Remind Me' : 'View'}</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="p-4 border-b border-white/[0.06]"><h2 className="font-bold">🎯 Your IPL Ticket Progress</h2></div>
        <div className="p-4 grid grid-cols-4 gap-4">
          {[{ name: 'Sign Up', done: true },{ name: 'First Deposit', done: true },{ name: '50 Referrals', current: 47, target: 50 },{ name: 'Claim Ticket', locked: true }].map((s, i) => (
            <div key={i} className={`p-4 rounded-xl text-center border ${s.done ? 'border-[#10b981] bg-[#10b981]/5' : s.current ? 'border-[#f4c430] bg-[#f4c430]/5' : 'border-white/10 bg-[#111827]'}`}>
              <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center bg-[#243049]">{s.done ? '✓' : s.locked ? '🔒' : '🎯'}</div>
              <p className="font-semibold text-sm">{s.name}</p>
              {s.current && <p className="text-xs text-[#64748b]">{s.current}/{s.target}</p>}
              {s.done && <Badge variant="green" className="mt-2">Done</Badge>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
CAMPAIGNS
echo "✅ Campaigns page created"

# ============================================
# LEADERBOARD PAGE
# ============================================
cat > 'src/app/(dashboard)/leaderboard/page.tsx' << 'LEADERBOARD'
'use client';
import { useState } from 'react';
import { Card, Badge, Button, Tabs } from '@/components/ui';
import { leaderboard, currentUser } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('all');
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">🏆 Leaderboard</h1><p className="text-[#94a3b8]">Top predictors competing for glory</p></div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 items-end">
        {[top3[1], top3[0], top3[2]].map((entry, i) => {
          const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
          const colors = { 1: { border: '#ffd700', bg: 'from-yellow-500/15', badge: 'bg-gradient-to-br from-yellow-400 to-yellow-600' }, 2: { border: '#c0c0c0', bg: 'from-gray-400/10', badge: 'bg-gradient-to-br from-gray-300 to-gray-500' }, 3: { border: '#cd7f32', bg: 'from-orange-700/10', badge: 'bg-gradient-to-br from-orange-400 to-orange-600' }};
          const c = colors[pos as 1|2|3];
          return (
            <Card key={entry.user.id} className={`p-6 text-center relative ${pos === 1 ? 'pb-8' : ''}`} style={{ borderColor: `${c.border}50`, background: `linear-gradient(180deg, ${c.bg.replace('from-', '')} 0%, transparent 100%)` }}>
              <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${c.badge} ${pos === 1 ? 'w-14 h-14 text-xl' : ''}`} style={{ color: pos === 3 ? 'white' : 'black' }}>{pos === 1 ? '👑' : pos}</div>
              <div className={`w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl bg-[#243049] ${pos === 1 ? 'w-24 h-24 text-4xl border-2' : ''}`} style={{ borderColor: pos === 1 ? c.border : 'transparent' }}>{entry.user.avatar}</div>
              <p className={`font-bold ${pos === 1 ? 'text-xl' : ''}`}>{entry.user.username}</p>
              <p className="text-sm text-[#64748b] mb-3">@{entry.user.username.toLowerCase()}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 bg-[#111827] rounded-lg"><p className="font-mono font-bold text-[#10b981]">+{formatCurrency(entry.profit)}</p><p className="text-xs text-[#64748b]">Profit</p></div>
                <div className="p-2 bg-[#111827] rounded-lg"><p className="font-mono font-bold text-[#f4c430]">{entry.winRate}%</p><p className="text-xs text-[#64748b]">Win Rate</p></div>
              </div>
              <Badge variant="gold">🎫 IPL Ticket + {pos === 1 ? '₹25K' : pos === 2 ? '₹15K' : '₹10K'}</Badge>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <Tabs tabs={[{ id: 'all', label: 'All Time' },{ id: 'month', label: 'This Month' },{ id: 'week', label: 'This Week' },{ id: 'today', label: 'Today' }]} activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-[#1a2235] border border-white/10 rounded-lg text-sm"><option>All Tournaments</option><option>IPL 2026</option></select>
          <select className="px-3 py-2 bg-[#1a2235] border border-white/10 rounded-lg text-sm"><option>By Profit</option><option>By Win Rate</option><option>By Total Bets</option></select>
        </div>
      </div>

      {/* Your Rank */}
      <Card className="p-4 bg-gradient-to-r from-[#f4c430]/5 to-transparent border-[#f4c430]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#f4c430] to-[#ff6b35] flex items-center justify-center font-bold text-xl text-black">#{currentUser.stats.globalRank}</div>
            <div><h3 className="font-bold">Your Rank</h3><p className="text-sm text-[#94a3b8]">Keep predicting to climb! 🚀</p></div>
          </div>
          <div className="flex gap-8">
            <div className="text-center"><p className="font-mono text-xl font-bold text-[#10b981]">+{formatCurrency(currentUser.stats.netProfit)}</p><p className="text-xs text-[#64748b]">Profit</p></div>
            <div className="text-center"><p className="font-mono text-xl font-bold">{currentUser.stats.winRate}%</p><p className="text-xs text-[#64748b]">Win Rate</p></div>
            <div className="text-center"><p className="font-mono text-xl font-bold">{currentUser.stats.totalPredictions}</p><p className="text-xs text-[#64748b]">Bets</p></div>
            <div className="text-center"><p className="font-mono text-xl font-bold text-[#10b981]">↑ 12</p><p className="text-xs text-[#64748b]">This Week</p></div>
          </div>
        </div>
      </Card>

      {/* Full Rankings */}
      <Card>
        <div className="p-4 border-b border-white/[0.06] flex justify-between"><h2 className="font-bold">📊 Full Rankings</h2><span className="text-sm text-[#64748b]">🔄 Updated 5 min ago</span></div>
        <div className="divide-y divide-white/[0.06]">
          <div className="grid grid-cols-6 gap-4 p-4 text-xs font-semibold text-[#64748b] uppercase bg-black/20"><div>Rank</div><div className="col-span-2">User</div><div>Profit</div><div>Win Rate</div><div>Change</div></div>
          {[...rest, { rank: currentUser.stats.globalRank, user: currentUser, profit: currentUser.stats.netProfit, winRate: currentUser.stats.winRate, totalBets: currentUser.stats.totalPredictions, rankChange: 12, isYou: true }].map((entry: any) => (
            <div key={entry.user.id} className={`grid grid-cols-6 gap-4 p-4 items-center hover:bg-white/[0.02] ${entry.isYou ? 'bg-[#f4c430]/5 border-l-2 border-[#f4c430]' : ''}`}>
              <div><div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${entry.rank <= 10 ? 'bg-[#f4c430]/15 text-[#f4c430]' : 'bg-[#243049] text-[#64748b]'}`}>{entry.rank}</div></div>
              <div className="col-span-2 flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.isYou ? 'bg-gradient-to-r from-[#f4c430] to-[#ff6b35] text-black' : 'bg-[#243049]'}`}>{entry.user.avatar || entry.user.username[0]}</div><div><p className="font-medium">{entry.user.username} {entry.isYou && '(You)'}</p><p className="text-xs text-[#64748b]">@{entry.user.username.toLowerCase()}</p></div></div>
              <div className="font-mono font-bold text-[#10b981]">+{formatCurrency(entry.profit)}</div>
              <div className="font-mono font-bold text-[#f4c430]">{entry.winRate}%</div>
              <div className={`font-semibold ${entry.rankChange > 0 ? 'text-[#10b981]' : entry.rankChange < 0 ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>{entry.rankChange > 0 ? `↑ ${entry.rankChange}` : entry.rankChange < 0 ? `↓ ${Math.abs(entry.rankChange)}` : '—'}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/[0.06] flex justify-between items-center"><span className="text-sm text-[#64748b]">Showing 4-10 of 2,847</span><div className="flex gap-1">{[1,2,3,'...',285].map((p, i) => (<button key={i} className={`w-8 h-8 rounded-lg text-sm ${p === 2 ? 'bg-[#f4c430]/15 text-[#f4c430]' : 'bg-[#243049] text-[#64748b]'}`}>{p}</button>))}</div></div>
      </Card>
    </div>
  );
}
LEADERBOARD
echo "✅ Leaderboard page created"

# ============================================
# STAKING PAGE
# ============================================
cat > 'src/app/(dashboard)/staking/page.tsx' << 'STAKING'
'use client';
import { useState } from 'react';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export default function StakingPage() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const tiers = [
    { days: 30, apy: 8, bonus: '60% fee discount' },
    { days: 90, apy: 12, bonus: '70% fee discount' },
    { days: 180, apy: 15, bonus: '80% fee discount', popular: true },
    { days: 365, apy: 18, bonus: '80% + VIP access' },
  ];
  const stakes = [
    { id: '1', amount: 5420, days: 180, apy: 15, start: 'Jan 15, 2026', end: 'Jul 15, 2026', earned: 245, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">🪙 $CRIC Staking</h1><p className="text-[#94a3b8]">Stake tokens, earn rewards, reduce fees</p></div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-[#1a2235] to-[#f4c430]/10 border-[#f4c430]/30">
          <p className="text-sm text-[#94a3b8] mb-1">Total Staked</p>
          <p className="font-mono text-3xl font-bold text-[#f4c430]">5,420</p>
          <p className="text-sm text-[#64748b]">$CRIC</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[#94a3b8] mb-1">Rewards Earned</p>
          <p className="font-mono text-3xl font-bold text-[#10b981]">245</p>
          <p className="text-sm text-[#64748b]">$CRIC</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[#94a3b8] mb-1">Current APY</p>
          <p className="font-mono text-3xl font-bold">15%</p>
          <p className="text-sm text-[#64748b]">Annual</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[#94a3b8] mb-1">Fee Discount</p>
          <p className="font-mono text-3xl font-bold text-[#8b5cf6]">80%</p>
          <p className="text-sm text-[#64748b]">Active</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <div className="p-4 border-b border-white/[0.06]"><h2 className="font-bold">Stake $CRIC</h2></div>
            <div className="p-4">
              <p className="text-sm text-[#94a3b8] mb-3">Select Lock Period</p>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {tiers.map((tier, i) => (
                  <button key={i} onClick={() => setSelectedTier(i)} className={`p-4 rounded-xl border text-center transition-all ${selectedTier === i ? 'border-[#f4c430] bg-[#f4c430]/10' : 'border-white/10 bg-[#111827] hover:border-[#f4c430]/50'}`}>
                    {tier.popular && <Badge variant="gold" className="mb-2">POPULAR</Badge>}
                    <p className="font-mono text-2xl font-bold">{tier.days}</p>
                    <p className="text-sm text-[#64748b]">Days</p>
                    <p className="font-mono text-xl font-bold text-[#10b981] mt-2">{tier.apy}% APY</p>
                    <p className="text-xs text-[#8b5cf6] mt-1">{tier.bonus}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-sm text-[#94a3b8] block mb-2">Amount to Stake</label>
                  <div className="relative">
                    <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl font-mono text-xl focus:outline-none focus:border-[#f4c430]" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]">$CRIC</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1">Balance: 7,520 $CRIC</p>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-[#94a3b8] block mb-2">Est. Returns ({selectedTier !== null ? tiers[selectedTier].days : '-'} days)</label>
                  <div className="px-4 py-3 bg-[#111827] border border-white/10 rounded-xl">
                    <p className="font-mono text-xl text-[#10b981]">+{selectedTier !== null && stakeAmount ? ((Number(stakeAmount) * tiers[selectedTier].apy / 100) * (tiers[selectedTier].days / 365)).toFixed(0) : '0'} $CRIC</p>
                  </div>
                </div>
              </div>
              <Button className="w-full h-12" disabled={!selectedTier || !stakeAmount}>🔒 Stake $CRIC</Button>
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b border-white/[0.06]"><h2 className="font-bold">Active Stakes</h2></div>
            <div className="divide-y divide-white/[0.06]">
              {stakes.map((stake) => (
                <div key={stake.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono text-xl font-bold">{stake.amount.toLocaleString()} $CRIC</p>
                      <p className="text-sm text-[#64748b]">{stake.days} days @ {stake.apy}% APY</p>
                    </div>
                    <Badge variant="green">Active</Badge>
                  </div>
                  <div className="flex gap-6 text-sm mb-3">
                    <div><span className="text-[#64748b]">Started: </span>{stake.start}</div>
                    <div><span className="text-[#64748b]">Ends: </span>{stake.end}</div>
                    <div><span className="text-[#64748b]">Earned: </span><span className="text-[#10b981]">+{stake.earned} $CRIC</span></div>
                  </div>
                  <ProgressBar value={45} className="mb-3" />
                  <div className="flex gap-2"><Button variant="secondary" size="sm">Claim Rewards</Button><Button variant="secondary" size="sm">Unstake Early</Button></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-[#8b5cf6]/10 to-transparent border-[#8b5cf6]/30">
            <div className="p-6 text-center">
              <span className="text-4xl mb-3 block">🪙</span>
              <h3 className="font-bold mb-2">$CRIC Token</h3>
              <p className="text-sm text-[#94a3b8] mb-4">Platform utility token with real benefits</p>
              <div className="space-y-2 text-sm text-left">
                <div className="flex justify-between"><span className="text-[#64748b]">Price</span><span className="font-mono">$0.008</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Market Cap</span><span className="font-mono">$800K</span></div>
                <div className="flex justify-between"><span className="text-[#64748b]">Total Staked</span><span className="font-mono">45M</span></div>
              </div>
              <Button variant="secondary" className="w-full mt-4">Buy $CRIC</Button>
            </div>
          </Card>

          <Card>
            <div className="p-4 border-b border-white/[0.06]"><h3 className="font-bold">Benefits</h3></div>
            <div className="p-4 space-y-3">
              {[{ icon: '💸', title: 'Fee Discounts', desc: 'Up to 80% off platform fees' },{ icon: '🗳️', title: 'Governance', desc: 'Vote on platform decisions' },{ icon: '⭐', title: 'Premium Access', desc: 'Exclusive features & markets' },{ icon: '🎁', title: 'Referral Boost', desc: '2x referral commissions' }].map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#111827] rounded-xl">
                  <span className="text-xl">{b.icon}</span>
                  <div><p className="font-semibold text-sm">{b.title}</p><p className="text-xs text-[#64748b]">{b.desc}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
STAKING
echo "✅ Staking page created"

echo ""
echo "🎉 CricChain Frontend Setup Complete!"
echo ""
echo "Run: npm run dev"
echo "Open: http://localhost:3000"
