'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button, Tabs } from '@/components/ui';
import { matches } from '@/lib/mock-data';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { Search, TrendingUp, Bookmark, Share2, Zap, Loader2 } from 'lucide-react';
import { useMatches } from '@/lib/hooks';

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const statusParam = activeTab === 'all' ? undefined : activeTab;
  const { data: matchesResponse, isLoading } = useMatches({ status: statusParam, search });
  const matches = matchesResponse?.items || [];

  const filtered = matches.filter((m: any) => {
    if (search) { const q = search.toLowerCase(); return m.team1.shortName.toLowerCase().includes(q) || m.team2.shortName.toLowerCase().includes(q); }
    return true;
  });

  // Trending tags
  const tags = ['IPL 2026', 'T20 World Cup', 'Top Batter', 'Match Winner', 'Toss'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#f4c430]" /> Prediction Markets
          </h1>
          <p className="text-[#94a3b8]">Trade on cricket outcomes with real-time odds</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input type="text" placeholder="Search markets..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-[#1a2235] border border-white/10 rounded-xl text-sm w-72 focus:outline-none focus:border-[#f4c430] placeholder:text-[#64748b]" />
        </div>
      </div>

      {/* Trending Tags */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-[#64748b] flex-shrink-0">Trending:</span>
        {tags.map((tag) => (
          <button key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a2235] border border-white/10 text-[#94a3b8] hover:border-[#f4c430] hover:text-[#f4c430] transition-all whitespace-nowrap">
            {tag}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#111827] rounded-xl p-1 w-fit">
        {[
          { id: 'all', label: 'All', count: matches.length },
          { id: 'live', label: '🔴 Live', count: matches.filter(m => m.status === 'live').length },
          { id: 'upcoming', label: 'Upcoming', count: matches.filter(m => m.status === 'upcoming').length },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-[#243049] text-white' : 'text-[#64748b] hover:text-white'}`}>
            {tab.label} <span className="text-[#64748b] text-xs ml-1">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Market Cards Grid — Polymarket style */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#f4c430]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#111827] rounded-xl border border-white/5">
          <p className="text-[#64748b]">No matches found for the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((match: any) => {
            const isLive = match.status === 'live';
            // Simulated probability for the first team (for demo)
            const prob1 = Math.floor(40 + Math.random() * 30);
            const prob2 = 100 - prob1;

            return (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <Card hover className="cursor-pointer group overflow-hidden">
                  {/* Card Header */}
                  <div className="p-4 pb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-[#243049] flex items-center justify-center text-2xl">🏏</div>
                        {isLive && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f1729] animate-pulse" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-[#f4c430] transition-colors">{match.team1.shortName} vs {match.team2.shortName}</p>
                        <p className="text-xs text-[#64748b]">{match.tournament.shortName} • {match.venue.split(',')[0]}</p>
                      </div>
                    </div>
                    <div className="relative w-12 h-12">
                      <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f4c430" strokeWidth="3" strokeDasharray={`${prob1}, 100`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{prob1}%</span>
                    </div>
                  </div>

                  {/* Outcomes with scores if live */}
                  {isLive && match.score && (
                    <div className="px-4 pb-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{match.team1.logo} {match.team1.shortName}</span>
                        <span className="font-mono text-[#f4c430]">{match.score.team1Score}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span>{match.team2.logo} {match.team2.shortName}</span>
                        <span className="font-mono text-[#f4c430]">{match.score.team2Score}</span>
                      </div>
                    </div>
                  )}

                  {/* Predict Buttons — Polymarket style */}
                  <div className="px-4 pb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button className="px-3 py-2.5 rounded-xl text-sm font-medium bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 transition-all border border-[#10b981]/20">
                        {match.team1.shortName} <span className="opacity-70">{prob1}%</span>
                      </button>
                      <button className="px-3 py-2.5 rounded-xl text-sm font-medium bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 transition-all border border-[#ef4444]/20">
                        {match.team2.shortName} <span className="opacity-70">{prob2}%</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#64748b]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono">{formatCurrency(match.poolSize)} Vol.</span>
                      <span>🎯 {formatNumber(match.totalPredictions)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLive && <Badge variant="live"><span className="w-1.5 h-1.5 bg-white rounded-full mr-1" />LIVE</Badge>}
                      <Bookmark className="w-3.5 h-3.5 hover:text-[#f4c430] cursor-pointer" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
