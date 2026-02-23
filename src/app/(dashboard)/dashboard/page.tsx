'use client';
import { useState } from 'react';
import Link from 'next/link';
import { currentUser, leaderboard } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { useMatches } from '@/lib/hooks';
import { useWalletStore } from '@/stores';
import {
  TrendingUp, TrendingDown, ArrowDownLeft, ArrowUpRight,
  Trophy, Zap, BarChart2, ChevronRight, Target,
} from 'lucide-react';
import { PromotionModal } from '@/components/ui/PromotionModal';

// ─── Tiny sparkline SVG ──────────────────────────────────────────────────────
function Sparkline({ positive = true }: { positive?: boolean }) {
  const points = positive
    ? '0,28 10,22 20,24 30,16 40,18 50,10 60,12 70,6 80,8 90,2 100,4'
    : '0,4 10,8 20,6 30,14 40,10 50,18 60,16 70,22 80,20 90,26 100,28';
  const color = positive ? 'var(--positive)' : 'var(--negative)';
  return (
    <svg viewBox="0 0 100 32" className="w-full h-10" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Toggle pill ─────────────────────────────────────────────────────────────
function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors ${active ? 'bg-[var(--brand)]' : 'bg-[var(--panel-raised)]'} border border-[var(--line)]`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-[3px] transition-all ${active ? 'left-[23px]' : 'left-[3px]'}`} />
    </button>
  );
}

const TABS = ['Positions', 'Open Orders', 'History'];

const POSITIONS = [
  { action: 'Buy', position: 'CSK to Win', contract: 'MI vs CSK', amount: '₹1,000', date: 'Today, 2:30 PM', market: 'IPL 2026', status: 'live' },
  { action: 'Buy', position: 'RCB Win', contract: 'RCB vs MI', amount: '₹1,500', date: 'Yesterday', market: 'IPL 2026', status: 'won' },
  { action: 'Sell', position: 'Over 180.5', contract: 'KKR vs DC', amount: '₹2,000', date: '2 days ago', market: 'IPL 2026', status: 'won' },
  { action: 'Buy', position: 'SRH Win', contract: 'SRH vs RR', amount: '₹800', date: '3 days ago', market: 'IPL 2026', status: 'lost' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Positions');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const stats = currentUser.stats || {
    totalPredictions: 0, wins: 0, losses: 0, winRate: 0,
    totalWinnings: 0, netProfit: 0, currentStreak: 0, bestStreak: 0, globalRank: 0,
  };

  const { availableBalance } = useWalletStore();
  const { data: matchesResponse, isLoading: matchesLoading } = useMatches({ status: 'live' });
  const matches = matchesResponse?.items || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <PromotionModal />

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-[var(--ink-3)] uppercase tracking-widest mb-1">Portfolio</p>
        <h1 className="text-2xl font-bold text-[var(--ink-1)]">
          {greeting}, {currentUser.username}
        </h1>
      </div>

      {/* ── Three stat cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Available Balance */}
        <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 shadow-card">
          <p className="text-xs font-semibold text-[var(--ink-3)] uppercase tracking-widest mb-3">Available Balance</p>
          <p className="text-3xl font-black text-[var(--ink-1)] tabular mb-4">
            {formatCurrency(availableBalance || 128.07)}
          </p>
          <div className="flex gap-2">
            <Link
              href="/wallet"
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--ink-1)] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" /> Deposit
            </Link>
            <Link
              href="/wallet"
              className="flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] text-xs font-bold text-[var(--ink-2)] rounded-lg hover:bg-[var(--panel-raised)] transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
            </Link>
          </div>
        </div>

        {/* Positions */}
        <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-[var(--ink-3)] uppercase tracking-widest">Positions</p>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
              Bronze Rank
            </span>
          </div>
          <p className="text-3xl font-black text-[var(--ink-1)] tabular mb-1">₹75.00</p>
          <p className="text-xs text-[var(--ink-3)] mb-4">4 active predictions</p>
          <Link
            href="/predictions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline"
          >
            Go to Positions <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Profit / Loss */}
        <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-semibold text-[var(--ink-3)] uppercase tracking-widest">Profit / Loss</p>
            <div className="flex items-center gap-1 text-xs font-bold text-[var(--positive)]">
              <TrendingUp className="w-3.5 h-3.5" />
              +12.4%
            </div>
          </div>
          <p className="text-3xl font-black text-[var(--positive)] tabular mb-1">
            +{formatCurrency(stats.netProfit || 420)}
          </p>
          <Sparkline positive={stats.netProfit >= 0} />
          <div className="flex justify-between text-[10px] text-[var(--ink-3)] mt-1">
            <span>7d low</span><span>7d high</span>
          </div>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Positions table */}
        <div className="xl:col-span-2 bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[var(--line)]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-[var(--ink-1)] border-b-2 border-[var(--brand)] -mb-px'
                    : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[var(--panel-raised)]">
                  {['Action', 'Position', 'Contract', 'Amount', 'Date', 'Market'].map((col) => (
                    <th key={col} className="px-4 py-3 text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-widest whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {POSITIONS.map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--panel-raised)] transition-colors">
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                        row.action === 'Buy'
                          ? 'bg-[var(--positive-subtle)] text-[var(--positive)]'
                          : 'bg-[var(--negative-subtle)] text-[var(--negative)]'
                      }`}>
                        {row.action === 'Buy'
                          ? <TrendingUp className="w-3 h-3" />
                          : <TrendingDown className="w-3 h-3" />}
                        {row.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[var(--ink-1)]">{row.position}</td>
                    <td className="px-4 py-3.5 text-[var(--ink-2)]">{row.contract}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-[var(--ink-1)]">{row.amount}</td>
                    <td className="px-4 py-3.5 text-[var(--ink-3)] text-xs whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium px-2 py-1 bg-[var(--panel-raised)] border border-[var(--line)] rounded-md text-[var(--ink-2)]">
                        {row.market}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Live matches */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--line)] flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--ink-1)] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--brand)]" />
                Live Matches
              </span>
              <Link href="/matches" className="text-xs font-semibold text-[var(--brand)] hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {matchesLoading ? (
                <p className="px-4 py-8 text-center text-sm text-[var(--ink-3)]">Loading…</p>
              ) : matches.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[var(--ink-3)]">No live matches</p>
              ) : matches.slice(0, 3).map((m: any) => (
                <Link key={m.id} href={`/matches/${m.id}`} className="block px-4 py-3 hover:bg-[var(--panel-raised)] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.team1?.logo}</span>
                      <span className="text-xs font-bold text-[var(--ink-1)]">{m.team1?.shortName}</span>
                      <span className="text-[10px] text-[var(--ink-3)]">vs</span>
                      <span className="text-xs font-bold text-[var(--ink-1)]">{m.team2?.shortName}</span>
                      <span className="text-lg">{m.team2?.logo}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--negative)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--negative)] animate-pulse" />
                      LIVE
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Predictors */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--line)] flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--ink-1)] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Leaderboard
              </span>
              <Link href="/leaderboard" className="text-xs font-semibold text-[var(--brand)] hover:underline">
                Full rankings
              </Link>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={entry.user.id} className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    i === 0 ? 'bg-yellow-100 text-yellow-600'
                    : i === 1 ? 'bg-slate-100 text-slate-500'
                    : i === 2 ? 'bg-orange-100 text-orange-600'
                    : 'bg-[var(--panel-raised)] text-[var(--ink-3)]'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--ink-1)] truncate">{entry.user.username}</p>
                    <p className="text-xs text-[var(--ink-3)]">{entry.winRate}% win rate</p>
                  </div>
                  <span className="text-sm font-mono font-bold text-[var(--positive)] flex-shrink-0">
                    +{formatCurrency(entry.profit)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats mini */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card p-4">
            <p className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-widest mb-3">Your Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total', value: stats.totalPredictions, icon: <Target className="w-4 h-4" /> },
                { label: 'Wins', value: stats.wins, icon: <TrendingUp className="w-4 h-4 text-[var(--positive)]" /> },
                { label: 'Win Rate', value: `${stats.winRate}%`, icon: <BarChart2 className="w-4 h-4 text-[var(--brand)]" /> },
                { label: 'Global Rank', value: `#${stats.globalRank || 142}`, icon: <Trophy className="w-4 h-4 text-amber-500" /> },
              ].map((s) => (
                <div key={s.label} className="bg-[var(--panel-raised)] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[var(--ink-3)] mb-1">
                    {s.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
                  </div>
                  <p className="text-lg font-black text-[var(--ink-1)] tabular">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notification preference */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--ink-1)]">Match alerts</p>
              <p className="text-xs text-[var(--ink-3)]">Get notified on live changes</p>
            </div>
            <Toggle active={notificationsOn} onChange={() => setNotificationsOn(!notificationsOn)} />
          </div>

        </div>
      </div>
    </div>
  );
}
