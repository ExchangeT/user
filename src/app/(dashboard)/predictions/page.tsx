'use client';
import { useState } from 'react';
import { Card, Badge, Button, Tabs, StatCard } from '@/components/ui';
import { userPredictions, currentUser, matches } from '@/lib/mock-data';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { Search, Download } from 'lucide-react';

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState('all');
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
  const predictions = [
    { id: '1', match: 'MI vs CSK', selection: 'CSK to Win', odds: 1.75, stake: 1000, returns: 1750, status: 'pending', date: new Date() },
    { id: '2', match: 'RCB vs MI', selection: 'RCB to Win', odds: 2.10, stake: 1500, returns: 3150, status: 'won', date: new Date(Date.now() - 86400000) },
    { id: '3', match: 'KKR vs DC', selection: 'Over 180.5', odds: 1.90, stake: 2000, returns: 3800, status: 'won', date: new Date(Date.now() - 172800000) },
    { id: '4', match: 'SRH vs RR', selection: 'SRH to Win', odds: 1.85, stake: 800, returns: -800, status: 'lost', date: new Date(Date.now() - 259200000) },
    { id: '5', match: 'CSK vs KKR', selection: 'Dhoni 30+ runs', odds: 2.50, stake: 500, returns: 1250, status: 'won', date: new Date(Date.now() - 345600000) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold">📊 My Predictions</h1><p className="text-[#94a3b8]">Track your betting history</p></div></div>
      <div className="grid grid-cols-5 gap-4">
        <StatCard icon="🎯" label="Total" value={stats.totalPredictions} iconBg="bg-[#3b82f6]/15" />
        <StatCard icon="✅" label="Won" value={stats.wins} iconBg="bg-[#10b981]/15" />
        <StatCard icon="❌" label="Lost" value={stats.losses} iconBg="bg-[#ef4444]/15" />
        <StatCard icon="📈" label="Win Rate" value={`${stats.winRate}%`} iconBg="bg-[#f4c430]/15" />
        <StatCard icon="💰" label="Profit" value={formatCurrency(stats.netProfit)} iconBg="bg-[#10b981]/15" />
      </div>
      <div className="flex justify-between items-center">
        <Tabs tabs={[{ id: 'all', label: 'All' }, { id: 'won', label: 'Won' }, { id: 'lost', label: 'Lost' }, { id: 'pending', label: 'Pending' }]} activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" /><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-[#1a2235] border border-white/10 rounded-xl text-sm w-64" /></div><Button variant="secondary"><Download className="w-4 h-4" /> Export</Button></div>
      </div>
      <Card>
        <div className="divide-y divide-white/[0.06]">
          <div className="grid grid-cols-7 gap-4 p-4 text-xs font-semibold text-[#64748b] uppercase bg-black/20">
            <div>Match</div><div>Selection</div><div>Odds</div><div>Stake</div><div>Returns</div><div>Status</div><div>Date</div>
          </div>
          {predictions.filter(p => activeTab === 'all' || p.status === activeTab).map((pred) => (
            <div key={pred.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-white/[0.02]">
              <div className="font-medium">{pred.match}</div>
              <div>{pred.selection}</div>
              <div className="font-mono font-bold text-[#f4c430]">{pred.odds.toFixed(2)}</div>
              <div className="font-mono">{formatCurrency(pred.stake)}</div>
              <div className={`font-mono font-bold ${pred.status === 'won' ? 'text-[#10b981]' : pred.status === 'lost' ? 'text-[#ef4444]' : 'text-[#f4c430]'}`}>{pred.status === 'won' ? '+' : ''}{formatCurrency(pred.returns)}</div>
              <div><Badge variant={pred.status === 'won' ? 'green' : pred.status === 'lost' ? 'red' : 'gold'}>{pred.status === 'won' ? '✓ Won' : pred.status === 'lost' ? '✗ Lost' : '⏳ Pending'}</Badge></div>
              <div className="text-sm text-[#64748b]">{formatRelativeTime(pred.date)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
