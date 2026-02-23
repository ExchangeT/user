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
