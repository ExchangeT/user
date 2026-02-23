'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useMatchDetail, useMarkets, usePlacePrediction } from '@/lib/hooks';
import { useBetSlipStore } from '@/stores';
import { useSession } from 'next-auth/react';
import { TrendingUp, TrendingDown, X, Share2, Bookmark, MessageCircle, Trophy, Activity, FileText, ChevronDown, Zap, Loader2 } from 'lucide-react';
import ProbabilityChart from '@/components/ui/ProbabilityChart';

// Mock activity data
const mockActivity = [
  { user: '🟢 amit_k', action: 'predicted', outcome: 'MI to Win', amount: 5000, time: new Date(Date.now() - 300000) },
  { user: '🔵 priya_s', action: 'predicted', outcome: 'CSK to Win', amount: 3200, time: new Date(Date.now() - 900000) },
  { user: '🟣 raj_p', action: 'predicted', outcome: 'MI to Win', amount: 8000, time: new Date(Date.now() - 1800000) },
  { user: '🟡 neha_g', action: 'predicted', outcome: 'Virat 50+', amount: 2000, time: new Date(Date.now() - 3600000) },
  { user: '🔴 deepak', action: 'predicted', outcome: 'CSK to Win', amount: 12000, time: new Date(Date.now() - 7200000) },
  { user: '🟢 vikram', action: 'cashed out', outcome: 'MI to Win', amount: 4500, time: new Date(Date.now() - 10800000) },
];

const mockComments = [
  { user: 'amit_k', avatar: '🟢', text: 'MI looking strong with Jasprit back in form. Going all in! 🔥', position: '₹5,000 on MI', time: '2h ago', likes: 12 },
  { user: 'priya_s', avatar: '🔵', text: 'CSK middle order is key tonight. Jadeja could be the X-factor.', position: '₹3,200 on CSK', time: '3h ago', likes: 8 },
  { user: 'raj_patel', avatar: '🟣', text: 'Wankhede pitch has been good for chasing. Toss winner will be crucial.', position: '₹8,000 on MI', time: '5h ago', likes: 23 },
  { user: 'cricket_fan99', avatar: '🟡', text: 'History says MI at Wankhede = dangerous combo. 72% win rate here.', position: null, time: '6h ago', likes: 15 },
];

const topPredictors = [
  { user: 'raj_patel', avatar: '🟣', winRate: 78, totalVolume: 234000, position: 'MI to Win' },
  { user: 'deepak_r', avatar: '🔴', winRate: 72, totalVolume: 189000, position: 'CSK to Win' },
  { user: 'amit_k', avatar: '🟢', winRate: 68, totalVolume: 156000, position: 'MI to Win' },
  { user: 'priya_s', avatar: '🔵', winRate: 65, totalVolume: 98000, position: 'CSK to Win' },
];

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const { data: match, isLoading: matchLoading } = useMatchDetail(params.id);
  const { data: marketsResponse, isLoading: marketsLoading } = useMarkets(params.id);

  const markets = marketsResponse?.items || [];

  const { addBet, items, removeBet, updateStake, clearSlip } = useBetSlipStore();
  const isLive = match?.status === 'live';
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState('discussion');

  const { data: session } = useSession();
  const placePredictionMutation = usePlacePrediction();

  const handlePlacePrediction = async () => {
    if (!session) {
      // Toast handles error, or redirect to login
      alert('Please login to place a prediction');
      return;
    }
    // Place each bet in the slip sequentially (or concurrently)
    // Since API is single bet at a time
    if (!match) return;
    const promises = items.map(item =>
      placePredictionMutation.mutateAsync({
        matchId: match.id,
        marketId: item.marketId,
        outcomeId: item.outcomeId,
        amount: item.stake
      })
    );

    try {
      await Promise.all(promises);
      clearSlip();
    } catch (e) {
      console.error("Some predictions failed to place", e);
    }
  };

  const handleSelectOutcome = (market: any, outcome: any) => {
    if (!match) return;
    setSelectedMarket(market);
    setSelectedOutcome(outcome.id);
    addBet({ marketId: market.id, outcomeId: outcome.id, outcomeName: outcome.name, matchName: `${match.team1.shortName} vs ${match.team2.shortName}`, marketType: market.type, odds: outcome.odds, stake: stakeAmount || 1000 });
  };

  const isSelected = (marketId: string, outcomeId: string) => items.some((item) => item.marketId === marketId && item.outcomeId === outcomeId);
  const totalStake = items.reduce((sum, i) => sum + i.stake, 0);
  const totalPayout = items.reduce((sum, i) => sum + i.stake * i.odds, 0);
  const platformFee = totalStake * 0.02;
  const quickAmounts = [100, 500, 1000, 5000];

  if (matchLoading || marketsLoading) {
    return <div className="py-20 text-center text-[#64748b]">Loading match details...</div>;
  }

  if (!match) {
    return <div className="py-20 text-center text-[#64748b]">Match not found</div>;
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/matches" className="text-[#64748b] hover:text-white">Markets</Link>
        <span className="text-[#64748b]">/</span>
        <span className="text-[#94a3b8]">Cricket</span>
        <span className="text-[#64748b]">/</span>
        <span className="text-[#f4c430]">{match.team1.shortName} vs {match.team2.shortName}</span>
      </div>

      {/* 2-Column Layout — Polymarket style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT COLUMN (2/3) ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* Event Header */}
          <Card className={`p-5 ${isLive ? 'border-red-500/20' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[#243049] flex items-center justify-center text-3xl">🏏</div>
                  {isLive && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0f1729] animate-pulse" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="gold">{match.tournament.shortName}</Badge>
                    {isLive && <Badge variant="live"><span className="w-1.5 h-1.5 bg-white rounded-full mr-1" />LIVE</Badge>}
                  </div>
                  <h1 className="text-xl font-bold">{match.team1.name} vs {match.team2.name}</h1>
                  <p className="text-sm text-[#64748b]">{match.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-[#243049] text-[#94a3b8] hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg hover:bg-[#243049] text-[#94a3b8] hover:text-[#f4c430] transition-all"><Bookmark className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Live Score */}
            {isLive && match.score && (
              <div className="flex items-center gap-8 p-4 bg-[#111827] rounded-xl mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl">{match.team1.logo}</span>
                  <div>
                    <p className="font-bold">{match.team1.shortName}</p>
                    <p className="font-mono text-xl font-bold text-[#f4c430]">{match.score.team1Score}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-[#64748b]">vs</span>
                <div className="flex items-center gap-3 flex-1 justify-end text-right">
                  <div>
                    <p className="font-bold">{match.team2.shortName}</p>
                    <p className="font-mono text-xl font-bold text-[#f4c430]">{match.score.team2Score}</p>
                  </div>
                  <span className="text-3xl">{match.team2.logo}</span>
                </div>
              </div>
            )}

            {/* Stats Bar */}
            <div className="flex items-center gap-6 text-sm">
              <div><span className="text-[#64748b]">Volume</span> <span className="font-mono font-bold ml-1">{formatCurrency(match.poolSize)}</span></div>
              <div><span className="text-[#64748b]">Predictions</span> <span className="font-mono font-bold ml-1">{match.totalPredictions.toLocaleString()}</span></div>
              <div><span className="text-[#64748b]">Markets</span> <span className="font-mono font-bold ml-1">{markets.length}</span></div>
            </div>
          </Card>

          {/* Probability Chart */}
          <Card className="p-5">
            <ProbabilityChart color="#f4c430" height={220} label="Win Probability" />
          </Card>

          {/* Markets — Polymarket-style outcomes */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-[#f4c430]" /> Markets</h2>
            {markets.map((market) => (
              <Card key={market.id} className="overflow-hidden">
                <div className="p-4 border-b border-white/[0.06]">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{market.question}</h3>
                      <p className="text-xs text-[#64748b]">Volume: {formatCurrency(market.totalVolume)}</p>
                    </div>
                    {market.status === 'live' && <Badge variant="live">LIVE</Badge>}
                  </div>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {market.outcomes.map((outcome: any) => {
                    const selected = isSelected(market.id, outcome.id);
                    return (
                      <div key={outcome.id} className={`px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-all ${selected ? 'bg-[#f4c430]/5' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{outcome.name}</span>
                          <span className={`flex items-center text-xs ${outcome.trend === 'up' ? 'text-[#10b981]' : outcome.trend === 'down' ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
                            {outcome.trend === 'up' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                            {outcome.trend === 'down' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                            {outcome.probability}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Probability bar */}
                          <div className="w-20 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#f4c430]" style={{ width: `${outcome.probability}%` }} />
                          </div>
                          <span className="font-mono font-bold text-[#f4c430] w-12 text-right">{outcome.odds.toFixed(2)}x</span>
                          <button
                            onClick={() => handleSelectOutcome(market, outcome)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${selected
                              ? 'bg-[#f4c430] text-black'
                              : 'bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 border border-[#10b981]/20'}`}
                          >
                            {selected ? '✓ Selected' : 'Predict'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs Section — Discussion, Top Predictors, Activity, Rules */}
          <Card>
            <div className="flex border-b border-white/[0.06]">
              {[
                { id: 'discussion', label: 'Discussion', icon: <MessageCircle className="w-4 h-4" />, count: mockComments.length },
                { id: 'top', label: 'Top Predictors', icon: <Trophy className="w-4 h-4" /> },
                { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> },
                { id: 'rules', label: 'Rules', icon: <FileText className="w-4 h-4" /> },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveInfoTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${activeInfoTab === tab.id ? 'border-[#f4c430] text-[#f4c430]' : 'border-transparent text-[#64748b] hover:text-white'}`}>
                  {tab.icon} {tab.label} {tab.count !== undefined && <span className="text-xs bg-white/[0.06] px-1.5 py-0.5 rounded-full">{tab.count}</span>}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeInfoTab === 'discussion' && (
                <div className="space-y-4">
                  {/* Comment input */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#243049] flex items-center justify-center text-sm">😎</div>
                    <input type="text" placeholder="Add your analysis..." className="flex-1 px-4 py-2 bg-[#111827] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#f4c430] placeholder:text-[#64748b]" />
                  </div>
                  {mockComments.map((c, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#243049] flex items-center justify-center text-sm flex-shrink-0">{c.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{c.user}</span>
                          {c.position && <Badge variant="gold" className="text-[10px]">{c.position}</Badge>}
                          <span className="text-xs text-[#64748b]">{c.time}</span>
                        </div>
                        <p className="text-sm text-[#94a3b8]">{c.text}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-[#64748b]">
                          <button className="hover:text-white">👍 {c.likes}</button>
                          <button className="hover:text-white">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeInfoTab === 'top' && (
                <div className="space-y-3">
                  {topPredictors.map((tp, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#111827] rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-[#64748b] w-6">#{i + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-[#243049] flex items-center justify-center">{tp.avatar}</div>
                        <div>
                          <p className="font-medium text-sm">{tp.user}</p>
                          <p className="text-xs text-[#64748b]">{tp.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-[#10b981]">{tp.winRate}%</p>
                        <p className="text-xs text-[#64748b]">{formatCurrency(tp.totalVolume)} vol</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeInfoTab === 'activity' && (
                <div className="space-y-2">
                  {mockActivity.map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{a.user}</span>
                        <span className="text-[#64748b]">{a.action}</span>
                        <Badge variant={a.outcome.includes('MI') ? 'blue' : 'purple'}>{a.outcome}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold">{formatCurrency(a.amount)}</span>
                        <span className="text-xs text-[#64748b]">{formatRelativeTime(a.time)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeInfoTab === 'rules' && (
                <div className="space-y-3 text-sm text-[#94a3b8]">
                  <h3 className="font-semibold text-white">Resolution Rules</h3>
                  <p>Markets are resolved based on the official match result as declared by the ICC / BCCI.</p>
                  <ul className="list-disc list-inside space-y-1 text-[#64748b]">
                    <li>Match Winner: Resolved upon completion of the match or when a result is declared (e.g., DLS method)</li>
                    <li>Player Performance markets resolve based on official scorecards from ESPNCricinfo</li>
                    <li>If a match is abandoned without a result, all bets are voided and stakes returned</li>
                    <li>Markets may be settled early if outcome becomes mathematically certain (auto-settlement via oracle)</li>
                  </ul>
                  <h3 className="font-semibold text-white mt-4">Fee Structure</h3>
                  <p>A 2% platform fee is applied to all predictions at placement time. No additional fees on winnings.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ===== RIGHT COLUMN — Sticky Trading Panel (1/3) ===== */}
        <div>
          <Card className="sticky top-24">
            {/* Buy tab header */}
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Predict</h3>
                {items.length > 0 && <button onClick={clearSlip} className="text-xs text-[#ef4444] hover:underline">Clear all</button>}
              </div>
            </div>

            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#111827] flex items-center justify-center mx-auto mb-3 text-3xl">🎯</div>
                  <p className="text-[#94a3b8] text-sm">Select an outcome from the markets to start predicting</p>
                </div>
              ) : (
                <>
                  {/* Selected Outcomes */}
                  {items.map((item) => (
                    <div key={item.marketId} className="p-3 bg-[#111827] rounded-xl relative">
                      <button onClick={() => removeBet(item.marketId)} className="absolute top-2 right-2 text-[#64748b] hover:text-white"><X className="w-3.5 h-3.5" /></button>
                      <p className="text-xs text-[#64748b] mb-1">{item.matchName}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{item.outcomeName}</p>
                        <span className="font-mono font-bold text-[#f4c430]">{item.odds.toFixed(2)}x</span>
                      </div>
                      {/* Stake input */}
                      <div className="mt-3">
                        <label className="text-xs text-[#64748b] mb-1 block">Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] font-mono text-sm">₹</span>
                          <input
                            type="number"
                            value={item.stake}
                            onChange={(e) => updateStake(item.marketId, Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-2.5 bg-[#0a0e17] border border-white/10 rounded-xl text-right font-mono font-bold text-lg focus:outline-none focus:border-[#f4c430]"
                          />
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {quickAmounts.map((amt) => (
                            <button key={amt} onClick={() => updateStake(item.marketId, amt)}
                              className="flex-1 px-2 py-1 rounded-lg text-xs font-mono bg-[#1a2235] border border-white/10 hover:border-[#f4c430] hover:text-[#f4c430] transition-all">
                              +₹{amt >= 1000 ? `${amt / 1000}K` : amt}
                            </button>
                          ))}
                          <button className="px-2 py-1 rounded-lg text-xs font-medium bg-[#1a2235] border border-white/10 hover:border-[#f4c430] hover:text-[#f4c430] transition-all">Max</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Fee Breakdown */}
                  <div className="bg-[#111827] rounded-xl p-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#64748b]">Total Stake</span><span className="font-mono">{formatCurrency(totalStake)}</span></div>
                    <div className="flex justify-between"><span className="text-[#64748b]">Platform Fee (2%)</span><span className="font-mono text-[#ef4444]">-{formatCurrency(platformFee)}</span></div>
                    <div className="flex justify-between"><span className="text-[#64748b]">Net Stake</span><span className="font-mono">{formatCurrency(totalStake - platformFee)}</span></div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                      <span>Potential Win</span>
                      <span className="font-mono text-[#10b981]">{formatCurrency(totalPayout * 0.98)}</span>
                    </div>
                  </div>

                  {/* Place Prediction CTA */}
                  <Button
                    className="w-full h-12 text-base font-bold"
                    onClick={handlePlacePrediction}
                    disabled={placePredictionMutation.isPending}
                  >
                    {placePredictionMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Place Prediction'}
                  </Button>
                  <p className="text-center text-xs text-[#64748b]">By predicting, you agree to the <span className="text-[#f4c430] cursor-pointer">Terms of Use</span></p>
                </>
              )}

              {/* Related Market */}
              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-xs text-[#64748b] mb-2">Related Markets</p>
                <div className="space-y-2">
                  {[
                    { q: 'Top Run Scorer in IPL 2026?', prob: '34%', vol: '₹12.4L' },
                    { q: 'Most Wickets in IPL 2026?', prob: '28%', vol: '₹8.7L' },
                  ].map((rm, i) => (
                    <div key={i} className="p-3 bg-[#111827] rounded-xl flex items-center justify-between hover:bg-[#1a2235] cursor-pointer transition-all">
                      <div>
                        <p className="text-sm font-medium">{rm.q}</p>
                        <p className="text-xs text-[#64748b]">{rm.vol} Vol.</p>
                      </div>
                      <span className="font-mono font-bold text-[#f4c430]">{rm.prob}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
