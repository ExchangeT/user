'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Badge, StatCard } from '@/components/ui';
import { ShieldAlert, Users, Link as LinkIcon, Copy, Check, TrendingUp, DollarSign, Activity, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ReferralsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/referrals');
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReferrals();
    }
  }, [status, fetchReferrals]);

  const handleCopy = () => {
    if (!data?.referralCode) return;
    const link = `${window.location.origin}/signup?ref=${data.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading' || (loading && !data)) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-slate-500 mb-6">Please sign in to view your referral dashboard.</p>
        <div className="bg-[#1a2235] text-white px-6 py-3 rounded-xl inline-block cursor-pointer hover:bg-[#252f46] transition-colors font-bold shadow-lg" onClick={() => window.location.href = '/login'}>
          Go to Login
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">🤝 Referral Engine</h1>
        <p className="text-slate-500 font-medium">Invite friends to CricChain and earn up to 25% of their trading fees forever.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Invite Card */}
        <Card className="col-span-1 md:col-span-3 border-slate-200 shadow-sm p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-amber-400 mb-2 flex items-center justify-center md:justify-start gap-2">
                <Users className="w-6 h-6" /> Share Your Link
              </h2>
              <p className="text-slate-300 max-w-md text-sm">
                Your downline is hardcoded to the blockchain. Every time your referee makes a prediction, you instantly earn a percentage of the platform fee securely deposited into your wallet.
              </p>
            </div>

            <div className="w-full md:w-auto bg-slate-950/50 border border-slate-700 p-4 rounded-2xl backdrop-blur-sm">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> Your Unique Invite Link
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl font-mono text-sm w-full md:w-64 overflow-hidden text-ellipsis whitespace-nowrap">
                  https://cricchain.io/signup?ref={data?.referralCode}
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-slate-900'}`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Invites</h3>
          </div>
          <p className="text-4xl font-black text-slate-900">{data?.stats?.totalReferrals || 0}</p>
        </Card>

        <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Earned</h3>
          </div>
          <p className="text-4xl font-black text-slate-900 flex items-baseline gap-1">
            {data?.stats?.totalEarned?.toFixed(2) || '0.00'} <span className="text-lg text-slate-400 font-bold">USDT</span>
          </p>
        </Card>

        <Card className="p-6 border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Traders</h3>
          </div>
          <p className="text-4xl font-black text-slate-900">{data?.stats?.activeTraders || 0}</p>
        </Card>
      </div>

      {/* Referrals List */}
      <Card className="shadow-sm border-slate-200 mt-6">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> My Network
            </h2>
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          {!data?.history || data.history.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">You haven't referred anyone yet.</p>
              <p className="text-sm text-slate-400 mt-1">Share your link to get started!</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-5">Registration Date</th>
                  <th className="py-3 px-5">Tier</th>
                  <th className="py-3 px-5">Predictions Made</th>
                  <th className="py-3 px-5">Commissions Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.history.map((record: any) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">
                      @{record.referee.username}
                    </td>
                    <td className="py-4 px-5 text-slate-500">
                      {format(new Date(record.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="py-4 px-5">
                      <Badge variant={record.referee.tier === 'GOLD' ? 'gold' : 'blue'}>
                        {record.referee.tier}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-medium">
                      {record.referee.totalPredictions}
                    </td>
                    <td className="py-4 px-5 font-bold text-emerald-600">
                      +{record.totalEarned.toFixed(2)} USDT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
