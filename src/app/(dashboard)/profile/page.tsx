'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Card, Badge, StatCard } from '@/components/ui';
import { ShieldCheck, Mail, Wallet, User as UserIcon, ShieldAlert, ArrowUpRight, ArrowDownLeft, Activity, Search, RefreshCw, X, Loader2, Coins } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import Image from 'next/image';
import { format } from 'date-fns';
import { useCricMarket } from '@/hooks/useCricMarket';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const { address, isConnected } = useAccount();

  // Web3 State for Demo Market
  const { marketInfo, userPrediction, claimWinnings, isWriting, refetchAll } = useCricMarket('market-test-1');

  // Wallet States
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(true);

  // Modal States
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form States
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  const fetchData = useCallback(async () => {
    setLoadingWallet(true);
    try {
      const [wRes, tRes] = await Promise.all([
        fetch('/api/wallet'),
        fetch('/api/wallet/transactions')
      ]);

      const wData = await wRes.json();
      const tData = await tRes.json();

      if (wData.success) setWallet(wData.data);
      if (tData.success) setTransactions(tData.data);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoadingWallet(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, fetchData]);

  // Auto-Link Web3 Wallet Logic
  useEffect(() => {
    const linkWallet = async () => {
      // If we're authenticated, have a connected Wagmi address, and it doesn't match our DB record
      if (status === 'authenticated' && isConnected && address && (session?.user as any)?.walletAddress !== address) {
        try {
          const res = await fetch('/api/user/wallet/link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: address }),
          });
          const data = await res.json();
          if (data.success) {
            // Force a NextAuth session update so the UI reflects the new address immediately
            await update({ walletAddress: address });
          }
        } catch (error) {
          console.error("Failed to link wallet:", error);
        }
      }
    };

    linkWallet();
  }, [isConnected, address, status, session, update]);

  if (status === 'loading') {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-slate-500 mb-6">Please sign in to view your profile and manage your account settings.</p>
        <div className="bg-[#1a2235] text-white px-6 py-3 rounded-xl inline-block cursor-pointer hover:bg-[#252f46] transition-colors font-bold shadow-lg" onClick={() => window.location.href = '/login'}>
          Go to Login
        </div>
      </div>
    );
  }

  const user = session.user as any;

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depositAmount, currency: 'USDT' })
      });
      const data = await res.json();
      if (data.success) {
        setShowDeposit(false);
        setDepositAmount('');
        await fetchData();
      } else {
        alert(data.error || 'Deposit failed');
      }
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Failed to process transaction");
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0 || !withdrawAddress) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: withdrawAmount, currency: 'USDT', destinationAddress: withdrawAddress })
      });
      const data = await res.json();
      if (data.success) {
        setShowWithdraw(false);
        setWithdrawAmount('');
        setWithdrawAddress('');
        await fetchData();
      } else {
        alert(data.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert("Failed to process transaction");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">👤 Profile Settings & Wallet</h1>
        <p className="text-slate-500 font-medium">Manage your personal information, wallet balances, and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="col-span-1 border-slate-200 overflow-hidden shadow-sm">
          <div className="h-24 bg-gradient-to-r from-amber-400 to-orange-500 w-full relative" />
          <div className="px-5 pb-5 relative">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-slate-100 shadow-md absolute -top-10 flex items-center justify-center overflow-hidden">
              {user.image ? (
                <Image src={user.image} alt="Profile" fill className="object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div className="mt-12">
              <h2 className="text-lg font-bold text-slate-900">{user.name || user.username || 'Anonymous User'}</h2>
              <p className="text-slate-500 font-medium text-sm flex items-center gap-2"><Mail className="w-3 h-3" />{user.email}</p>

              <div className="flex gap-2 mt-4 flex-wrap">
                <Badge variant={user.tier === 'GOLD' ? 'gold' : user.tier === 'PLATINUM' ? 'purple' : 'blue'}>
                  {user.tier || 'SILVER'} TIER
                </Badge>
                {user.walletAddress && (
                  <Badge variant="green" className="flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> {truncateAddress(user.walletAddress)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Web3 Claim Winnings Banner (Active when Web3 State shows unclaimed winnings) */}
        {isConnected && (marketInfo as any)?.status === 3 /* RESOLVED */ && (userPrediction as any)?.[0] /* amount */ > 0 && !(userPrediction as any)?.[2] /* claimed */ && (
          <Card className="col-span-1 md:col-span-3 shadow-lg border-emerald-500/30 bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 p-6 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
            <div className="absolute -right-10 -top-10 text-emerald-500/10">
              <Coins className="w-48 h-48" />
            </div>
            <div className="relative z-10 mb-4 md:mb-0">
              <h3 className="font-bold text-emerald-400 text-xl flex items-center gap-2">
                <Coins className="w-6 h-6" /> Unclaimed Web3 Winnings!
              </h3>
              <p className="text-emerald-100/70 text-sm mt-1">You have unresolved parimutuel payouts securely locked in the CricMarket escrow.</p>
            </div>
            <button
              onClick={async () => {
                try {
                  await claimWinnings();
                  alert('Winnings Claimed Successfully on-chain!');
                  refetchAll();
                } catch (e: any) {
                  alert('Claim Failed: ' + (e.shortMessage || e.message));
                }
              }}
              disabled={isWriting}
              className="relative z-10 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {isWriting ? <><Loader2 className="w-5 h-5 animate-spin" /> Claiming...</> : 'Claim to Wallet'}
            </button>
          </Card>
        )}

        {/* Wallet Overview */}
        <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" /> Web3 Wallet Balance
              </h3>
              <button onClick={fetchData} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-500 transition-colors">
                <RefreshCw className={`w-4 h-4 ${loadingWallet ? 'animate-spin text-amber-500' : ''}`} />
              </button>
            </div>

            {loadingWallet && !wallet ? (
              <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1">Available Funds</p>
                  <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1">
                    {wallet?.availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    <span className="text-lg text-slate-500 font-bold">USDT</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 opacity-80">
                  <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 flex items-center gap-1">
                    Locked <span className="text-[10px] text-slate-400 normal-case font-medium">(In-play/Withdrawals)</span>
                  </p>
                  <div className="text-xl font-bold text-slate-700 flex items-baseline gap-1">
                    {wallet?.lockedBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    <span className="text-sm text-slate-500">USDT</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button onClick={() => setShowDeposit(true)} className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> Deposit
            </button>
            <button onClick={() => setShowWithdraw(true)} className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 rounded-xl flex items-center justify-center gap-2 transition-all">
              <ArrowUpRight className="w-4 h-4 text-slate-500" /> Withdraw
            </button>
            <div className="ml-auto mt-4 sm:mt-0">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction Ledger */}
      <Card className="shadow-sm border-slate-200">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Transaction Ledger
            </h2>
            <p className="text-sm text-slate-500 font-medium">A complete history of your bets, deposits, and cashouts.</p>
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          {loadingWallet && transactions.length === 0 ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No transactions found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Type</th>
                  <th className="py-3 px-5">Amount (USDT)</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <Badge variant={
                        tx.type === 'DEPOSIT' ? 'green' :
                          tx.type === 'WITHDRAWAL' ? 'blue' :
                            tx.type === 'BET_PLACED' ? 'gold' :
                              tx.type === 'BET_WON' ? 'green' : 'blue'
                      }>
                        {tx.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 font-bold">
                      <span className={tx.amount > 0 ? "text-emerald-600" : tx.amount < 0 ? "text-red-600" : "text-slate-600"}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <Badge variant={tx.status === 'COMPLETED' ? 'green' : tx.status === 'PENDING' ? 'gold' : 'red'} className="text-[10px] px-2 py-0.5">
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 text-slate-500 font-mono text-xs">
                      {format(new Date(tx.createdAt), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="py-4 px-5 text-slate-600 truncate max-w-[250px]" title={tx.description}>
                      {tx.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
                Deposit Funds
              </h3>
              <button onClick={() => setShowDeposit(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-6">
                <p className="text-sm text-emerald-800 font-medium">
                  Simulate adding USDT to your account. Your available balance will be credited instantly.
                </p>
              </div>

              <label className="block text-sm font-bold text-slate-700 mb-2">Amount (USDT)</label>
              <div className="relative mb-6">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full text-xl font-bold bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">USDT</span>
              </div>

              <button
                onClick={handleDeposit}
                disabled={processing || !depositAmount}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : 'Confirm Deposit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-slate-500" />
                Request Withdrawal
              </h3>
              <button onClick={() => setShowWithdraw(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-6">
                <p className="text-sm text-amber-800 font-medium">
                  Withdrawals require Admin approval and will be locked from your available balance until processed.
                </p>
              </div>

              <label className="block text-sm font-bold text-slate-700 mb-2">Destination Address (Polygon/ERC20)</label>
              <input
                type="text"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder="0x..."
                className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />

              <label className="block text-sm font-bold text-slate-700 mb-2">Amount (USDT)</label>
              <div className="relative mb-2">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="e.g. 100"
                  max={wallet?.availableBalance || 0}
                  className="w-full text-xl font-bold bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">USDT</span>
              </div>

              <div className="flex justify-between items-center mb-6 px-2">
                <span className="text-xs font-bold text-slate-500">Available: {wallet?.availableBalance || '0'} USDT</span>
                <button onClick={() => setWithdrawAmount(wallet?.availableBalance?.toString() || '0')} className="text-xs font-bold text-amber-600 hover:text-amber-700">Max</button>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={processing || !withdrawAmount || !withdrawAddress || Number(withdrawAmount) > (wallet?.availableBalance || 0)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : 'Submit Withdrawal Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
