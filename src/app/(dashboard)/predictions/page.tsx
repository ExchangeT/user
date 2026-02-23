'use client';
import { useState } from 'react';
import { Card, Badge, Button, Tabs, StatCard, SectionHeader } from '@/components/ui';
import { currentUser } from '@/lib/mock-data';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Search, Download, Target, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const PREDICTIONS = [
  { id: '1', match: 'MI vs CSK', selection: 'CSK to Win', odds: 1.75, stake: 1000, returns: 1750, status: 'pending', date: new Date() },
  { id: '2', match: 'RCB vs MI', selection: 'RCB to Win', odds: 2.10, stake: 1500, returns: 3150, status: 'won', date: new Date(Date.now() - 86400000) },
  { id: '3', match: 'KKR vs DC', selection: 'Over 180.5', odds: 1.90, stake: 2000, returns: 3800, status: 'won', date: new Date(Date.now() - 172800000) },
  { id: '4', match: 'SRH vs RR', selection: 'SRH to Win', odds: 1.85, stake: 800, returns: -800, status: 'lost', date: new Date(Date.now() - 259200000) },
  { id: '5', match: 'CSK vs KKR', selection: 'Dhoni 30+ runs', odds: 2.50, stake: 500, returns: 1250, status: 'won', date: new Date(Date.now() - 345600000) },
];

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const stats = currentUser.stats || {
    totalPredictions: 0, wins: 0, losses: 0, winRate: 0,
    totalWinnings: 0, netProfit: 0,
  };

  const filtered = PREDICTIONS.filter(p => {
    if (activeTab !== 'all' && p.status !== activeTab) return false;
    if (search && !p.match.toLowerCase().includes(search.toLowerCase()) && !p.selection.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCfg: Record<string, { label: string; variant: any }> = {
    won:     { label: 'Won',     variant: 'green' },
    lost:    { label: 'Lost',    variant: 'red' },
    pending: { label: 'Pending', variant: 'gold' },
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Predictions"
        description="Track your prediction history and performance"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard icon={<Target className="w-4 h-4 text-[var(--info)]" />} label="Total" value={stats.totalPredictions} iconBg="bg-[var(--info-subtle)]" />
        <StatCard icon={<span className="text-sm font-bold text-[var(--positive)]">W</span>} label="Won" value={stats.wins} iconBg="bg-[var(--positive-subtle)]" valueColor="text-[var(--positive)]" />
        <StatCard icon={<span className="text-sm font-bold text-[var(--negative)]">L</span>} label="Lost" value={stats.losses} iconBg="bg-[var(--negative-subtle)]" valueColor="text-[var(--negative)]" />
        <StatCard icon={<TrendingUp className="w-4 h-4 text-[var(--brand)]" />} label="Win Rate" value={`${stats.winRate}%`} iconBg="bg-[var(--brand-subtle)]" />
        <StatCard icon={<Wallet className="w-4 h-4 text-[var(--positive)]" />} label="Net Profit" value={formatCurrency(stats.netProfit)} iconBg="bg-[var(--positive-subtle)]" valueColor="text-[var(--positive)]" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: PREDICTIONS.length },
            { id: 'won', label: 'Won' },
            { id: 'lost', label: 'Lost' },
            { id: 'pending', label: 'Pending' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          size="sm"
        />
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-3)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search predictions..."
              className="pl-9 pr-4 py-2 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 w-52 transition-all"
            />
          </div>
          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--panel-raised)]">
                {['Match', 'Selection', 'Odds', 'Stake', 'Returns', 'Status', 'Date'].map(col => (
                  <th key={col} className="px-4 py-3 text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-widest whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filtered.map((pred) => {
                const cfg = statusCfg[pred.status];
                return (
                  <tr key={pred.id} className="hover:bg-[var(--panel-raised)] transition-colors group">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-[var(--ink-1)]">{pred.match}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-[var(--ink-2)]">{pred.selection}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-sm text-[var(--brand)] tabular">{pred.odds.toFixed(2)}x</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-sm text-[var(--ink-1)] tabular">{formatCurrency(pred.stake)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {pred.status === 'won'
                          ? <TrendingUp className="w-3.5 h-3.5 text-[var(--positive)]" />
                          : pred.status === 'lost'
                          ? <TrendingDown className="w-3.5 h-3.5 text-[var(--negative)]" />
                          : null
                        }
                        <span className={cn(
                          'font-mono font-bold text-sm tabular',
                          pred.status === 'won' ? 'text-[var(--positive)]'
                          : pred.status === 'lost' ? 'text-[var(--negative)]'
                          : 'text-[var(--brand)]'
                        )}>
                          {pred.status === 'won' ? '+' : ''}{formatCurrency(pred.returns)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-[var(--ink-3)]">{formatRelativeTime(pred.date)}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--ink-3)]">
                    No predictions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
