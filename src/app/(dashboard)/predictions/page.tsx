'use client';
import { useState } from 'react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { currentUser } from '@/lib/mock-data';
import { Search, TrendingUp, TrendingDown, Target, Wallet, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';

// ─── Market prediction cards ─────────────────────────────────────────────────
const MARKETS = [
  {
    id: '1', category: 'IPL', question: 'Will CSK win the IPL 2026 title?',
    user: 'Rahul_K', yes: 64, no: 36, volume: '₹2.4L', isLive: true,
    yes_odds: 1.56, no_odds: 2.78,
  },
  {
    id: '2', category: 'IPL', question: 'Will Virat Kohli score 50+ in next match?',
    user: 'CricFan22', yes: 48, no: 52, volume: '₹1.1L', isLive: true,
    yes_odds: 2.08, no_odds: 1.92,
  },
  {
    id: '3', category: 'T20', question: 'Will India reach 180+ vs Australia?',
    user: 'Priya_B', yes: 55, no: 45, volume: '₹88K', isLive: false,
    yes_odds: 1.82, no_odds: 2.22,
  },
  {
    id: '4', category: 'IPL', question: 'Will MI make it to IPL 2026 playoffs?',
    user: 'SportsBet9', yes: 71, no: 29, volume: '₹3.2L', isLive: false,
    yes_odds: 1.41, no_odds: 3.45,
  },
  {
    id: '5', category: 'Crypto', question: 'Will $CRIC token hit ₹50 by month end?',
    user: 'Web3_Guru', yes: 38, no: 62, volume: '₹45K', isLive: false,
    yes_odds: 2.63, no_odds: 1.61,
  },
  {
    id: '6', category: 'T20', question: 'Will Rohit Sharma captain in T20 WC?',
    user: 'CaptainFan', yes: 82, no: 18, volume: '₹1.7L', isLive: false,
    yes_odds: 1.22, no_odds: 5.56,
  },
  {
    id: '7', category: 'IPL', question: 'Will KKR retain their core squad for IPL 2027?',
    user: 'KKRSupport', yes: 45, no: 55, volume: '₹92K', isLive: false,
    yes_odds: 2.22, no_odds: 1.82,
  },
  {
    id: '8', category: 'Trending', question: 'Most sixes in IPL 2026 — will RCB top the chart?',
    user: 'RCBArmy12', yes: 33, no: 67, volume: '₹2.9L', isLive: true,
    yes_odds: 3.03, no_odds: 1.49,
  },
];

const HISTORY = [
  { id: '1', match: 'MI vs CSK', selection: 'CSK to Win', odds: 1.75, stake: 1000, returns: 1750, status: 'pending', date: new Date() },
  { id: '2', match: 'RCB vs MI', selection: 'RCB to Win', odds: 2.10, stake: 1500, returns: 3150, status: 'won', date: new Date(Date.now() - 86400000) },
  { id: '3', match: 'KKR vs DC', selection: 'Over 180.5', odds: 1.90, stake: 2000, returns: 3800, status: 'won', date: new Date(Date.now() - 172800000) },
  { id: '4', match: 'SRH vs RR', selection: 'SRH to Win', odds: 1.85, stake: 800, returns: -800, status: 'lost', date: new Date(Date.now() - 259200000) },
  { id: '5', match: 'CSK vs KKR', selection: 'Dhoni 30+ runs', odds: 2.50, stake: 500, returns: 1250, status: 'won', date: new Date(Date.now() - 345600000) },
];

const FILTERS = ['Trending', 'All', 'Live', 'IPL', 'T20', 'Crypto'];

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  won: { label: 'Won', color: 'text-[var(--positive)]' },
  lost: { label: 'Lost', color: 'text-[var(--negative)]' },
  pending: { label: 'Pending', color: 'text-[var(--brand)]' },
};

// ─── Market Card ─────────────────────────────────────────────────────────────
function MarketCard({ m }: { m: typeof MARKETS[0] }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 shadow-card hover:shadow-card-hover hover:border-[var(--line-strong)] transition-all flex flex-col gap-3">
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[var(--brand-subtle)] text-[var(--brand)] rounded-md">
            {m.category}
          </span>
          {m.isLive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--negative)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--negative)] animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <span className="text-[10px] text-[var(--ink-3)] whitespace-nowrap">@{m.user}</span>
      </div>

      {/* Question */}
      <p className="text-sm font-semibold text-[var(--ink-1)] leading-snug flex-1 line-clamp-2">
        {m.question}
      </p>

      {/* Yes / No progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-[var(--positive)]">YES {m.yes}%</span>
          <span className="text-[var(--negative)]">NO {m.no}%</span>
        </div>
        <div className="h-1.5 bg-[var(--panel-raised)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--positive)] to-emerald-400 rounded-full transition-all"
            style={{ width: `${m.yes}%` }}
          />
        </div>
      </div>

      {/* Volume */}
      <p className="text-[10px] text-[var(--ink-3)]">
        Vol <span className="font-semibold text-[var(--ink-2)]">{m.volume}</span>
      </p>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button className="flex-1 py-2 text-xs font-bold bg-[var(--positive-subtle)] text-[var(--positive)] rounded-lg hover:bg-emerald-100 transition-colors">
          Yes {m.yes_odds}x
        </button>
        <button className="flex-1 py-2 text-xs font-bold bg-[var(--negative-subtle)] text-[var(--negative)] rounded-lg hover:bg-red-100 transition-colors">
          No {m.no_odds}x
        </button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function PredictionsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeHistTab, setActiveHistTab] = useState('all');
  const [search, setSearch] = useState('');

  const stats = currentUser.stats || {
    totalPredictions: 0, wins: 0, losses: 0, winRate: 0,
    totalWinnings: 0, netProfit: 0,
  };

  const visibleMarkets = MARKETS.filter((m) => {
    if (activeFilter === 'All' || activeFilter === 'Trending') return true;
    if (activeFilter === 'Live') return m.isLive;
    return m.category === activeFilter;
  });

  const filteredHistory = HISTORY.filter((p) => {
    if (activeHistTab !== 'all' && p.status !== activeHistTab) return false;
    if (search && !p.match.toLowerCase().includes(search.toLowerCase()) && !p.selection.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink-1)]">Predictions</h1>
        <p className="text-sm text-[var(--ink-3)] mt-0.5">Browse open markets and track your bets</p>
      </div>

      {/* ── Stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Target className="w-4 h-4 text-[var(--info)]" />, label: 'Total', value: stats.totalPredictions, bg: 'bg-[var(--info-subtle)]' },
          { icon: <TrendingUp className="w-4 h-4 text-[var(--positive)]" />, label: 'Won', value: stats.wins, bg: 'bg-[var(--positive-subtle)]' },
          { icon: <TrendingDown className="w-4 h-4 text-[var(--negative)]" />, label: 'Lost', value: stats.losses, bg: 'bg-[var(--negative-subtle)]' },
          { icon: <Wallet className="w-4 h-4 text-[var(--positive)]" />, label: 'Net Profit', value: formatCurrency(stats.netProfit), bg: 'bg-[var(--positive-subtle)]' },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-3 shadow-card flex items-center gap-3">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-wider">{s.label}</p>
              <p className="text-base font-black text-[var(--ink-1)] tabular">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter chips ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-semibold border transition-all',
              activeFilter === f
                ? 'bg-[var(--ink-1)] text-white border-[var(--ink-1)]'
                : 'bg-[var(--panel)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--line-strong)]'
            )}
          >
            {f}
            {f === 'Live' && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-[var(--negative)] inline-block align-middle" />
            )}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-3)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search markets..."
            className="pl-9 pr-4 py-2 text-sm bg-[var(--panel)] border border-[var(--line)] rounded-full text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 w-48 transition-all"
          />
        </div>
      </div>

      {/* ── Market cards grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleMarkets.map((m) => (
          <MarketCard key={m.id} m={m} />
        ))}
      </div>

      {/* ── My prediction history ──────────────────────────────────── */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[var(--ink-1)]">My Prediction History</h2>
          <div className="flex items-center gap-3">
            {/* Status tabs */}
            <div className="flex gap-1 bg-[var(--panel-raised)] p-1 rounded-lg">
              {['all', 'won', 'lost', 'pending'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveHistTab(t)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all',
                    activeHistTab === t
                      ? 'bg-white text-[var(--ink-1)] shadow-sm border border-[var(--line)]'
                      : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--line)] rounded-lg text-xs font-semibold text-[var(--ink-2)] hover:bg-[var(--panel-raised)] transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[var(--panel-raised)]">
                {['Match', 'Selection', 'Odds', 'Stake', 'Returns', 'Status', 'Date'].map((col) => (
                  <th key={col} className="px-4 py-3 text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-widest whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredHistory.map((pred) => {
                const cfg = STATUS_CFG[pred.status];
                return (
                  <tr key={pred.id} className="hover:bg-[var(--panel-raised)] transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-[var(--ink-1)]">{pred.match}</td>
                    <td className="px-4 py-3.5 text-[var(--ink-2)]">{pred.selection}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[var(--brand)] tabular">{pred.odds.toFixed(2)}x</td>
                    <td className="px-4 py-3.5 font-mono text-[var(--ink-1)] tabular">{formatCurrency(pred.stake)}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('font-mono font-bold tabular', cfg.color)}>
                        {pred.status === 'won' ? '+' : ''}{formatCurrency(pred.returns)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('text-xs font-bold capitalize px-2 py-1 rounded-md', {
                        'bg-[var(--positive-subtle)] text-[var(--positive)]': pred.status === 'won',
                        'bg-[var(--negative-subtle)] text-[var(--negative)]': pred.status === 'lost',
                        'bg-[var(--brand-subtle)] text-[var(--brand)]': pred.status === 'pending',
                      })}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[var(--ink-3)]">{formatRelativeTime(pred.date)}</td>
                  </tr>
                );
              })}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--ink-3)]">
                    No predictions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
