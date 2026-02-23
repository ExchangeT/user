'use client';
import { useState } from 'react';
import { Card, Badge, Button, ProgressBar, SectionHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TrendingUp, Lock, Coins, Zap, Vote, Star, Users } from 'lucide-react';

const TIERS = [
  { days: 30,  apy: 8,  bonus: '60% fee discount' },
  { days: 90,  apy: 12, bonus: '70% fee discount' },
  { days: 180, apy: 15, bonus: '80% fee discount', popular: true },
  { days: 365, apy: 18, bonus: '80% + VIP access' },
];

const STAKES = [
  { id: '1', amount: 5420, days: 180, apy: 15, start: 'Jan 15, 2026', end: 'Jul 15, 2026', earned: 245, status: 'active', progress: 45 },
];

const BENEFITS = [
  { icon: Zap,   title: 'Fee Discounts',  desc: 'Up to 80% off platform fees' },
  { icon: Vote,  title: 'Governance',     desc: 'Vote on platform decisions' },
  { icon: Star,  title: 'Premium Access', desc: 'Exclusive features & markets' },
  { icon: Users, title: 'Referral Boost', desc: '2x referral commissions' },
];

export default function StakingPage() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');

  const estReturns = selectedTier !== null && stakeAmount
    ? ((Number(stakeAmount) * TIERS[selectedTier].apy / 100) * (TIERS[selectedTier].days / 365)).toFixed(0)
    : '0';

  return (
    <div className="space-y-6">
      <SectionHeader
        title="$CRIC Staking"
        description="Lock tokens to earn rewards and reduce platform fees"
      />

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Staked', value: '5,420', unit: '$CRIC', color: 'text-[var(--brand)]' },
          { label: 'Rewards Earned', value: '245', unit: '$CRIC', color: 'text-[var(--positive)]' },
          { label: 'Current APY', value: '15%', unit: 'Annual', color: 'text-[var(--ink-1)]' },
          { label: 'Fee Discount', value: '80%', unit: 'Active', color: 'text-purple-400' },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-2">{s.label}</p>
            <p className={cn('font-mono text-2xl font-bold tabular', s.color)}>{s.value}</p>
            <p className="text-xs text-[var(--ink-3)] mt-0.5">{s.unit}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Stake form */}
          <Card>
            <div className="px-5 py-4 border-b border-[var(--line)]">
              <h2 className="text-sm font-semibold text-[var(--ink-1)]">Stake $CRIC Tokens</h2>
            </div>
            <div className="p-5 space-y-5">
              {/* Lock period selection */}
              <div>
                <p className="text-xs font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-3">Select Lock Period</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TIERS.map((tier, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedTier(i)}
                      className={cn(
                        'relative p-4 rounded-xl border text-center transition-all',
                        selectedTier === i
                          ? 'border-[var(--brand)] bg-[var(--brand-subtle)]'
                          : 'border-[var(--line)] bg-[var(--panel-raised)] hover:border-[var(--line-strong)]'
                      )}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-[var(--brand)] text-[var(--brand-fg)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          Popular
                        </span>
                      )}
                      <p className="font-mono text-xl font-bold text-[var(--ink-1)]">{tier.days}</p>
                      <p className="text-xs text-[var(--ink-3)] mb-2">Days</p>
                      <p className="font-mono text-base font-bold text-[var(--positive)]">{tier.apy}%</p>
                      <p className="text-[10px] text-[var(--ink-3)] mt-0.5">APY</p>
                      <p className="text-[10px] text-purple-400 mt-1 font-medium">{tier.bonus}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-2">
                    Amount to Stake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 pr-16 py-3 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg font-mono text-lg text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[var(--ink-3)]">$CRIC</span>
                  </div>
                  <p className="text-xs text-[var(--ink-3)] mt-1.5">Balance: <span className="font-mono font-semibold">7,520 $CRIC</span></p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-2">
                    Est. Returns ({selectedTier !== null ? TIERS[selectedTier].days : '—'} days)
                  </label>
                  <div className="px-3 py-3 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg">
                    <p className="font-mono text-lg font-bold text-[var(--positive)]">+{estReturns} $CRIC</p>
                  </div>
                  {selectedTier !== null && (
                    <p className="text-xs text-[var(--ink-3)] mt-1.5">{TIERS[selectedTier].apy}% APY · {TIERS[selectedTier].bonus}</p>
                  )}
                </div>
              </div>

              <Button className="w-full h-11" disabled={selectedTier === null || !stakeAmount}>
                <Lock className="w-4 h-4" />
                Stake $CRIC
              </Button>
            </div>
          </Card>

          {/* Active stakes */}
          <Card>
            <div className="px-5 py-4 border-b border-[var(--line)]">
              <h2 className="text-sm font-semibold text-[var(--ink-1)]">Active Stakes</h2>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {STAKES.map((stake) => (
                <div key={stake.id} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-xl font-bold text-[var(--ink-1)] tabular">
                        {stake.amount.toLocaleString()} <span className="text-sm text-[var(--ink-3)]">$CRIC</span>
                      </p>
                      <p className="text-sm text-[var(--ink-3)] mt-0.5">{stake.days} days @ {stake.apy}% APY</p>
                    </div>
                    <Badge variant="green">Active</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm mb-3">
                    <div><span className="text-[var(--ink-3)]">Started: </span><span className="font-medium text-[var(--ink-2)]">{stake.start}</span></div>
                    <div><span className="text-[var(--ink-3)]">Ends: </span><span className="font-medium text-[var(--ink-2)]">{stake.end}</span></div>
                    <div><span className="text-[var(--ink-3)]">Earned: </span><span className="font-mono font-semibold text-[var(--positive)]">+{stake.earned} $CRIC</span></div>
                  </div>
                  <ProgressBar value={stake.progress} className="mb-3" color="brand" />
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Claim Rewards</Button>
                    <Button variant="ghost" size="sm" className="text-[var(--negative)] hover:bg-[var(--negative-subtle)]">Unstake Early</Button>
                  </div>
                </div>
              ))}
              {STAKES.length === 0 && (
                <div className="p-12 text-center text-sm text-[var(--ink-3)]">No active stakes</div>
              )}
            </div>
          </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Token info */}
          <Card>
            <div className="p-5 border-b border-[var(--line)]">
              <h3 className="text-sm font-semibold text-[var(--ink-1)] flex items-center gap-2">
                <Coins className="w-4 h-4 text-[var(--brand)]" />
                $CRIC Token
              </h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Token Price', value: '$0.008' },
                { label: 'Market Cap', value: '$800K' },
                { label: 'Total Staked', value: '45M $CRIC' },
                { label: 'Staking Rate', value: '62.5%' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-[var(--line)] last:border-0">
                  <span className="text-sm text-[var(--ink-3)]">{row.label}</span>
                  <span className="font-mono font-semibold text-sm text-[var(--ink-1)]">{row.value}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                Buy $CRIC
              </Button>
            </div>
          </Card>

          {/* Benefits */}
          <Card>
            <div className="px-5 py-4 border-b border-[var(--line)]">
              <h3 className="text-sm font-semibold text-[var(--ink-1)]">Staking Benefits</h3>
            </div>
            <div className="p-4 space-y-2">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="flex items-start gap-3 p-3 bg-[var(--panel-raised)] rounded-lg">
                    <div className="w-7 h-7 rounded-lg bg-[var(--brand-subtle)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[var(--brand)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink-1)]">{b.title}</p>
                      <p className="text-xs text-[var(--ink-3)]">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
