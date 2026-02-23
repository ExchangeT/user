'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui';
import { Gift, Clock, CheckCircle2, Loader2, Calendar, Target } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  type: string;
  prizePool: number;
  endDate: string;
  isClaimed: boolean;
  daysLeft: number;
  _count: { participants: number };
}

export default function UserCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/campaigns');
      const result = await res.json();
      if (result.success) {
        setCampaigns(result.data.campaigns);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleClaim = async (campaignId: string) => {
    setClaimingId(campaignId);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/user/campaigns/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      });
      const result = await res.json();

      if (result.success) {
        setSuccessMsg(result.message);
        fetchCampaigns(); // Refresh list to update 'isClaimed' status
      } else {
        setError(result.error || 'Failed to claim reward.');
      }
    } catch (err) {
      setError('An unexpected error occurred while claiming.');
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Gift className="w-8 h-8 text-blue-500" />
          Rewards Hub
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-1">Discover active campaigns and claim your exclusive bonuses.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.length === 0 ? (
          <div className="col-span-1 md:col-span-2 text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <Gift className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No Active Campaigns</h3>
            <p className="text-slate-500">Check back later for new promotional offers.</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className={`overflow-hidden border-2 transition-all duration-300 ${campaign.isClaimed ? 'border-slate-200 bg-slate-50/50' : 'border-blue-100 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 bg-white'}`}>
              <div className={`h-2 w-full ${campaign.isClaimed ? 'bg-slate-300' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                    <Target className="w-3.5 h-3.5" />
                    {campaign.type}
                  </div>
                  {campaign.isClaimed && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                    </span>
                  )}
                </div>

                <h3 className={`text-xl font-bold mb-2 ${campaign.isClaimed ? 'text-slate-600' : 'text-slate-900'}`}>{campaign.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2 min-h-[40px]">{campaign.description || 'Join this exclusive campaign to earn incredible platform rewards and boost your trading volume.'}</p>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reward</p>
                    <p className="text-lg font-black text-indigo-600">{campaign.prizePool} CRIC</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 border-l pl-4 border-slate-200">Expires In</p>
                    <div className="flex items-center gap-1.5 pl-4 text-slate-700 font-bold">
                      <Clock className="w-4 h-4 text-amber-500" />
                      {campaign.daysLeft} Days
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleClaim(campaign.id)}
                  disabled={campaign.isClaimed || claimingId === campaign.id}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${campaign.isClaimed
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]'
                    }`}
                >
                  {claimingId === campaign.id ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : campaign.isClaimed ? (
                    'Reward Claimed'
                  ) : (
                    'Claim Bonus Now'
                  )}
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
