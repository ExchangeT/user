'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, Badge, Button, Tabs } from '@/components/ui';
import { chains, depositAssets, withdrawalFees, fiatWithdrawalConfig } from '@/lib/mock-data';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useWallet, useTransactions } from '@/lib/hooks';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, History, Copy, QrCode, CreditCard, ChevronDown, CheckCircle, AlertTriangle, X, Shield, Loader2, Link2 } from 'lucide-react';
import BridgeWidget from '@/components/wallet/BridgeWidget';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [copied, setCopied] = useState(false);
  const [depositMode, setDepositMode] = useState<'crypto' | 'fiat'>('crypto');
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMode, setWithdrawMode] = useState<'crypto' | 'fiat'>('crypto');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedWithdrawChain, setSelectedWithdrawChain] = useState(chains[2]); // polygon default

  const [depositAddress, setDepositAddress] = useState('Fetching...');
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  // Filter assets by selected chain (only admin-enabled ones)
  const chainAssets = useMemo(() =>
    depositAssets.filter(a => a.chainId === selectedChain.id && a.enabled),
    [selectedChain]
  );
  const [selectedAsset, setSelectedAsset] = useState(chainAssets[0]);

  const withdrawChainAssets = useMemo(() =>
    depositAssets.filter(a => a.chainId === selectedWithdrawChain.id && a.enabled),
    [selectedWithdrawChain]
  );

  const typeParam = activeTab === 'all' ? undefined : activeTab;
  const { data: txResponse } = useTransactions({ type: typeParam });
  const filteredTx = txResponse?.items || [];

  const { data: walletResponse, isLoading: walletLoading } = useWallet();
  const walletData = walletResponse || { totalBalance: 0, availableBalance: 0, lockedBalance: 0, balances: [] };

  const copyAddress = () => {
    if (depositAddress === 'Fetching...') return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useMemo(() => {
    if (!selectedChain) return;

    const fetchAddress = async () => {
      setIsFetchingAddress(true);
      try {
        const res = await fetch(`/api/wallet/address?chainId=${selectedChain.id}`);
        const data = await res.json();
        if (data.success) {
          setDepositAddress(data.address);
        } else {
          setDepositAddress('Error fetching address');
        }
      } catch (err) {
        setDepositAddress('Error fetching address');
      } finally {
        setIsFetchingAddress(false);
      }
    };

    fetchAddress();
  }, [selectedChain]);

  const getTxIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      DEPOSIT: <ArrowDownLeft className="w-4 h-4 text-[#10b981]" />,
      WITHDRAWAL: <ArrowUpRight className="w-4 h-4 text-[#ef4444]" />,
      BET_WON: '🎉', BET_LOST: '❌', BET_PLACED: '🎯', STAKE: '🔒',
    };
    return icons[type] || '💰';
  };

  // Calculate withdrawal fees
  const calcWithdrawFee = () => {
    const amt = parseFloat(withdrawAmount) || 0;
    if (withdrawMode === 'fiat') {
      const fiatAmt = parseFloat(fiatAmount) || 0;
      const processingFee = (fiatAmt * fiatWithdrawalConfig.processingFeePercent) / 100;
      const tds = fiatAmt > fiatWithdrawalConfig.tdsThreshold ? (fiatAmt * fiatWithdrawalConfig.tdsPercent) / 100 : 0;
      return { processingFee, networkFee: 0, tds, total: processingFee + tds, receive: fiatAmt - processingFee - tds };
    }
    const feeConfig = withdrawalFees.find(f => f.chainId === selectedWithdrawChain.id);
    const processingFee = (amt * (feeConfig?.processingFeePercent || 1)) / 100;
    const networkFee = feeConfig?.networkFee || 0;
    return { processingFee, networkFee, tds: 0, total: processingFee + networkFee, receive: amt - processingFee - networkFee };
  };

  const fees = calcWithdrawFee();

  const handleFiatDeposit = async () => {
    if (!fiatAmount || parseFloat(fiatAmount) < 5) {
      setCheckoutError('Minimum deposit is $5 USD equivalent.');
      return;
    }

    setIsProcessingCheckout(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/fiat/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUSD: parseFloat(fiatAmount) }) // Using INR as 1:1 USD proxy for MVP
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        setCheckoutError(data.error || 'Failed to initialize checkout');
      }
    } catch (err) {
      setCheckoutError('Network error connecting to payment gateway.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-[0_0_20px_rgba(244,196,48,0.3)]">
              <Wallet className="w-6 h-6 text-cc-bg-primary" />
            </div>
            Wallet Center
          </h1>
          <p className="text-cc-text-muted mt-2 font-medium max-w-xl">Multi-chain deposits, zero-fee withdrawals, and seamless asset management across the CricChain ecosystem.</p>
        </div>
      </div>

      {/* Balance Cards */}
      {walletLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cc-gold drop-shadow-[0_0_10px_rgba(244,196,48,0.5)]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle hover:border-cc-gold/30 hover:shadow-[0_10px_30px_rgba(244,196,48,0.1)] transition-all duration-300 rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cc-gold/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cc-bg-primary/50 border border-cc-border-subtle flex items-center justify-center shadow-inner"><Wallet className="w-6 h-6 text-cc-gold drop-shadow-sm" /></div>
              <Badge variant="gold" className="text-[10px] font-black tracking-widest uppercase shadow-sm">Multi-Chain</Badge>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-cc-text-muted uppercase tracking-widest mb-1">Total Balance</p>
              <p className="font-mono text-4xl font-black text-white drop-shadow-md">{formatCurrency(walletData.totalBalance)}</p>
            </div>
          </Card>
          <Card className="p-6 bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle hover:border-cc-green/30 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all duration-300 rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cc-green/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cc-bg-primary/50 border border-cc-green/20 flex items-center justify-center text-xl shadow-inner">✅</div>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-cc-text-muted uppercase tracking-widest mb-1">Available</p>
              <p className="font-mono text-4xl font-black text-cc-green drop-shadow-md">{formatCurrency(walletData.availableBalance)}</p>
            </div>
          </Card>
          <Card className="p-6 bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle hover:border-cc-blue/30 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] transition-all duration-300 rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cc-blue/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cc-bg-primary/50 border border-cc-blue/20 flex items-center justify-center text-xl shadow-inner">🔒</div>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-cc-text-muted uppercase tracking-widest mb-1">Locked in Predictions</p>
              <p className="font-mono text-4xl font-black text-white drop-shadow-md">{formatCurrency(walletData.lockedBalance)}</p>
            </div>
          </Card>
        </div>)
      }

      {/* Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Button className="h-16 rounded-2xl bg-gradient-gold hover:opacity-90 shadow-[0_5px_20px_rgba(244,196,48,0.2)] hover:shadow-[0_8px_25px_rgba(244,196,48,0.4)] transition-all duration-300 transform hover:-translate-y-1 font-bold text-base" onClick={() => setShowDepositModal(true)}>
          <ArrowDownLeft className="w-5 h-5 mr-2" /> Deposit
        </Button>
        <Button variant="secondary" className="h-16 rounded-2xl bg-cc-bg-elevated/80 border border-cc-border-subtle hover:border-white/20 hover:bg-cc-bg-elevated shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 font-bold text-base text-white" onClick={() => setShowWithdrawModal(true)}>
          <ArrowUpRight className="w-5 h-5 mr-2 text-cc-text-muted" /> Withdraw
        </Button>
        <Button variant="secondary" className="h-16 rounded-2xl bg-cc-bg-elevated/80 border border-cc-border-subtle hover:border-white/20 hover:bg-cc-bg-elevated shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 font-bold text-base text-white opacity-50 cursor-not-allowed hidden lg:flex">
          <RefreshCw className="w-5 h-5 mr-2 text-cc-text-muted" /> Swap <span className="text-[10px] ml-2 text-cc-gold bg-cc-gold/10 px-2 py-0.5 rounded border border-cc-gold/20">SOON</span>
        </Button>
        <Button variant="secondary" className="h-16 rounded-2xl bg-cc-bg-elevated/80 border border-cc-border-subtle hover:border-white/20 hover:bg-cc-bg-elevated shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 font-bold text-base text-white" onClick={() => setActiveTab('history')}>
          <History className="w-5 h-5 mr-2 text-cc-text-muted" /> History
        </Button>
      </div>

      {/* ====== DEPOSIT MODAL ====== */}
      {
        showDepositModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowDepositModal(false)} />
            <Card className="relative z-10 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto bg-cc-bg-card border-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl animate-scale-up">
              <div className="p-5 md:p-6 border-b border-cc-border-subtle bg-cc-bg-elevated/50 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md">
                <h2 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-3"><ArrowDownLeft className="w-5 h-5 text-cc-green" /> Deposit Funds</h2>
                <button onClick={() => setShowDepositModal(false)} className="p-2 rounded-xl bg-cc-bg-primary/50 text-cc-text-muted hover:bg-cc-bg-primary hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              <CardContent className="p-5 md:p-6 space-y-6">
                {/* Deposit Mode Toggle */}
                <div className="flex bg-cc-bg-primary/50 border border-cc-border-subtle rounded-2xl p-1.5 shadow-inner">
                  <button onClick={() => setDepositMode('crypto')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${depositMode === 'crypto' ? 'bg-cc-gold text-cc-bg-primary shadow-md' : 'text-cc-text-muted hover:text-white hover:bg-cc-bg-elevated/50'}`}>
                    <Wallet className="w-4 h-4" /> Crypto
                  </button>
                  <button onClick={() => setDepositMode('fiat')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${depositMode === 'fiat' ? 'bg-white text-cc-bg-primary shadow-md' : 'text-cc-text-muted hover:text-white hover:bg-cc-bg-elevated/50'}`}>
                    <CreditCard className="w-4 h-4" /> Card (Fiat)
                  </button>
                  <button onClick={() => setDepositMode('bridge' as any)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${depositMode === ('bridge' as any) ? 'bg-cc-blue text-white shadow-md' : 'text-cc-text-muted hover:text-white hover:bg-cc-bg-elevated/50'}`}>
                    <Link2 className="w-4 h-4" /> Bridge
                  </button>
                </div>

                {depositMode === ('bridge' as any) ? (
                  <div className="mt-4">
                    <BridgeWidget />
                  </div>
                ) : depositMode === 'crypto' ? (
                  <div className="space-y-6">
                    {/* Chain Selector */}
                    <div>
                      <label className="block text-xs font-bold text-cc-text-muted uppercase tracking-widest mb-3">Select Network</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {chains.map((chain) => (
                          <button
                            key={chain.id}
                            onClick={() => { setSelectedChain(chain); setSelectedAsset(depositAssets.filter(a => a.chainId === chain.id && a.enabled)[0]); }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${selectedChain.id === chain.id ? 'border-cc-gold bg-cc-gold/10 text-cc-gold shadow-[0_0_15px_rgba(244,196,48,0.15)]' : 'border-cc-border-subtle text-cc-text-muted hover:border-white/20 hover:text-white hover:bg-cc-bg-elevated'}`}
                          >
                            <span className="text-xl drop-shadow-sm" style={{ color: chain.color }}>{chain.icon}</span>
                            <span>{chain.shortName}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Asset Selector */}
                    <div>
                      <label className="block text-xs font-bold text-cc-text-muted uppercase tracking-widest mb-3">Select Asset</label>
                      <div className="flex gap-3 flex-wrap">
                        {chainAssets.map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${selectedAsset?.id === asset.id ? 'border-cc-gold bg-cc-gold/10 text-cc-gold shadow-[0_0_15px_rgba(244,196,48,0.15)]' : 'border-cc-border-subtle text-cc-text-muted hover:text-white hover:border-white/20 hover:bg-cc-bg-elevated'}`}
                          >
                            <span className="text-lg">{asset.icon}</span> {asset.symbol}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Deposit Address + QR */}
                    {selectedAsset && (
                      <div className="bg-cc-bg-primary/40 border border-cc-border-subtle rounded-3xl p-5 md:p-6 space-y-5 shadow-inner">
                        <div className="text-center">
                          <div className="w-40 h-40 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg p-2 relative overflow-hidden group">
                            {/* Add subtle shimmer to QR wrapper */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                            <QrCode className="w-32 h-32 text-[#0a0e17]" />
                          </div>
                          <p className="text-sm font-medium text-cc-text-subtle">Send <strong className="text-white font-black">{selectedAsset.symbol}</strong> only on <strong className="font-black drop-shadow-sm" style={{ color: selectedChain.color }}>{selectedChain.name}</strong> network</p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-cc-text-muted uppercase tracking-widest px-1">Deposit Address</label>
                          <div className="flex items-center gap-2 p-1.5 pl-4 bg-cc-bg-elevated border border-cc-border-subtle rounded-xl shadow-inner group transition-colors hover:border-cc-gold/50">
                            <code className="text-xs md:text-sm flex-1 truncate text-white font-mono tracking-wide">{depositAddress}</code>
                            <button onClick={copyAddress} className="p-3 rounded-lg bg-cc-bg-card hover:bg-cc-gold hover:text-cc-bg-primary text-cc-text-muted transition-all shadow-sm"><Copy className="w-4 h-4" /></button>
                          </div>
                          {copied && <p className="text-xs font-bold text-cc-green text-center">✓ Address copied to clipboard</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="flex items-start gap-2 p-3 bg-cc-green/10 border border-cc-green/20 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-cc-green flex-shrink-0 mt-0.5" />
                            <p className="text-xs font-medium text-cc-green leading-snug">Zero fees — receive 100% of deposit</p>
                          </div>
                          <div className="flex items-start gap-2 p-3 bg-cc-blue/10 border border-cc-blue/20 rounded-xl">
                            <Wallet className="w-4 h-4 text-cc-blue flex-shrink-0 mt-0.5" />
                            <p className="text-xs font-medium text-cc-blue leading-snug">Min: <strong className="font-bold">{selectedAsset.minDeposit} {selectedAsset.symbol}</strong></p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* FIAT DEPOSIT */
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-xl">
                      <Shield className="w-5 h-5 text-[#3b82f6] flex-shrink-0" />
                      <p className="text-sm text-[#94a3b8]">Fiat deposits are instantly converted to <strong className="text-[#f4c430]">USDT</strong> via our onramp partner</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#94a3b8] mb-2">Amount (INR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] font-mono">₹</span>
                        <input type="number" placeholder="1,000" className="w-full pl-8 pr-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#f4c430]" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        {[500, 1000, 5000, 10000, 25000].map((amt) => (
                          <button key={amt} className="px-3 py-1 rounded-lg text-xs font-mono bg-[#111827] border border-white/10 hover:border-[#f4c430] hover:text-[#f4c430] transition-all">₹{amt.toLocaleString()}</button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#111827] rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-[#94a3b8]">You pay</span><span className="font-mono">₹10,000</span></div>
                      <div className="flex justify-between text-sm"><span className="text-[#94a3b8]">Deposit fee</span><span className="font-mono text-[#10b981]">₹0 (FREE)</span></div>
                      <div className="flex justify-between text-sm"><span className="text-[#94a3b8]">Exchange rate</span><span className="font-mono">1 USDT = ₹83.50</span></div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-semibold"><span>You receive</span><span className="font-mono text-[#f4c430]">≈ 119.76 USDT</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {['Visa/Mastercard', 'UPI', 'Net Banking', 'Google Pay'].map((m) => (
                        <button key={m} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-sm hover:border-[#f4c430] transition-all">
                          <CreditCard className="w-4 h-4 text-[#64748b]" /> {m}
                        </button>
                      ))}
                    </div>

                    {checkoutError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                        {checkoutError}
                      </div>
                    )}

                    <Button
                      className="w-full h-12"
                      onClick={handleFiatDeposit}
                      disabled={isProcessingCheckout || !fiatAmount}
                    >
                      {isProcessingCheckout ? (
                        <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Securely Connecting...</span>
                      ) : (
                        'Pay & Deposit via Stripe'
                      )}
                    </Button>
                    <p className="text-center text-xs text-[#64748b]">Powered by Stripe • PCI DSS Certified</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      }

      {/* ====== WITHDRAW MODAL ====== */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowWithdrawModal(false)} />
          <Card className="relative z-10 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto bg-cc-bg-card border-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl animate-scale-up">
            <div className="p-5 md:p-6 border-b border-cc-border-subtle bg-cc-bg-elevated/50 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md">
              <h2 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-3"><ArrowUpRight className="w-5 h-5 text-cc-red" /> Withdraw Funds</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="p-2 rounded-xl bg-cc-bg-primary/50 text-cc-text-muted hover:bg-cc-bg-primary hover:text-white transition-all"><X className="w-5 h-5" /></button>
            </div>
            <CardContent className="p-5 md:p-6 space-y-6">
              {/* Withdraw Mode Toggle */}
              <div className="flex bg-cc-bg-primary/50 border border-cc-border-subtle rounded-2xl p-1.5 shadow-inner">
                <button onClick={() => setWithdrawMode('crypto')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${withdrawMode === 'crypto' ? 'bg-cc-gold text-cc-bg-primary shadow-md' : 'text-cc-text-muted hover:text-white hover:bg-cc-bg-elevated/50'}`}>
                  <Wallet className="w-4 h-4" /> Crypto
                </button>
                <button onClick={() => setWithdrawMode('fiat')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${withdrawMode === 'fiat' ? 'bg-white text-cc-bg-primary shadow-md' : 'text-cc-text-muted hover:text-white hover:bg-cc-bg-elevated/50'}`}>
                  <CreditCard className="w-4 h-4" /> Bank (Fiat)
                </button>
              </div>

              {withdrawMode === 'crypto' ? (
                <div className="space-y-6">
                  {/* Chain Selector for Withdrawal */}
                  <div>
                    <label className="block text-xs font-bold text-cc-text-muted uppercase tracking-widest mb-3">Network</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {chains.map((chain) => (
                        <button key={chain.id} onClick={() => setSelectedWithdrawChain(chain)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${selectedWithdrawChain.id === chain.id ? 'border-cc-gold bg-cc-gold/10 text-cc-gold shadow-[0_0_15px_rgba(244,196,48,0.15)]' : 'border-cc-border-subtle text-cc-text-muted hover:border-white/20 hover:text-white hover:bg-cc-bg-elevated'}`}>
                          <span className="text-xl drop-shadow-sm" style={{ color: chain.color }}>{chain.icon}</span> <span className="truncate">{chain.shortName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-cc-text-muted uppercase tracking-widest mb-3">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cc-gold font-bold">$</span>
                      <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0.00" className="w-full pl-8 pr-16 py-3.5 bg-cc-bg-primary/50 border border-cc-border-subtle rounded-2xl text-white font-mono text-lg focus:outline-none focus:border-cc-gold focus:ring-1 focus:ring-cc-gold/50 shadow-inner placeholder:text-cc-text-muted transition-all" />
                      <button onClick={() => setWithdrawAmount(walletData.availableBalance.toString())} className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-cc-bg-primary bg-cc-gold hover:bg-cc-gold-light px-2 py-1 rounded-lg shadow-sm transition-colors">Max</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cc-text-muted uppercase tracking-widest mb-3">Destination Address</label>
                    <input type="text" placeholder="0x..." className="w-full px-4 py-3.5 bg-cc-bg-primary/50 border border-cc-border-subtle rounded-2xl text-white font-mono text-sm focus:outline-none focus:border-cc-gold focus:ring-1 focus:ring-cc-gold/50 shadow-inner placeholder:text-cc-text-muted transition-all" />
                  </div>
                  {/* Fee Breakdown */}
                  <div className="bg-cc-bg-primary/40 border border-cc-border-subtle rounded-3xl p-5 space-y-3 shadow-inner">
                    <div className="flex justify-between text-sm"><span className="text-cc-text-muted font-medium">Withdraw amount</span><span className="font-mono text-white font-bold">{withdrawAmount || '0'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-cc-text-muted font-medium">Processing fee (1%)</span><span className="font-mono text-cc-red font-bold">-{fees.processingFee.toFixed(4)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-cc-text-muted font-medium">Network fee</span><span className="font-mono text-cc-red font-bold">-{fees.networkFee}</span></div>
                    <div className="border-t border-cc-border-subtle pt-3 mt-1 flex justify-between items-center">
                      <span className="font-bold text-white tracking-tight">You receive</span>
                      <span className="font-mono text-xl font-black text-cc-green drop-shadow-sm">{fees.receive > 0 ? fees.receive.toFixed(4) : '0'} USDT</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* FIAT WITHDRAWAL */
                <div className="space-y-6">
                  <div className="flex items-start gap-3 p-4 bg-cc-gold/5 border border-cc-gold/20 rounded-2xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-cc-gold/10 blur-xl rounded-full pointer-events-none" />
                    <AlertTriangle className="w-5 h-5 text-cc-gold flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-cc-text-muted leading-relaxed">Fiat withdrawals incur a <strong className="text-cc-gold font-bold">4.5% processing fee</strong> + TDS (30% above ₹10,000 net winnings) as per Indian tax regulations.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cc-text-muted uppercase tracking-widest mb-3">Amount (INR)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cc-text-subtle font-bold font-mono">₹</span>
                      <input type="number" value={fiatAmount} onChange={(e) => setFiatAmount(e.target.value)} placeholder="10,000" className="w-full pl-8 pr-4 py-3.5 bg-cc-bg-primary/50 border border-cc-border-subtle rounded-2xl text-white font-mono text-lg focus:outline-none focus:border-cc-gold focus:ring-1 focus:ring-cc-gold/50 shadow-inner placeholder:text-cc-text-muted transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cc-text-muted uppercase tracking-widest mb-3">Bank Account</label>
                    <div className="p-4 bg-cc-bg-primary/50 rounded-2xl border border-cc-border-subtle group hover:border-white/20 transition-all shadow-inner">
                      <p className="font-bold text-white mb-1">HDFC Bank ****4521</p>
                      <p className="text-sm text-cc-text-muted font-medium">Savings Account • Rahul Sharma</p>
                    </div>
                  </div>
                  {/* Fee Breakdown - Fiat */}
                  <div className="bg-cc-bg-primary/40 border border-cc-border-subtle rounded-3xl p-5 space-y-3 shadow-inner">
                    <div className="flex justify-between text-sm"><span className="text-cc-text-muted font-medium">Withdrawal amount</span><span className="font-mono text-white font-bold">₹{fiatAmount || '0'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-cc-text-muted font-medium">Processing fee (4.5%)</span><span className="font-mono text-cc-red font-bold">-₹{fees.processingFee.toFixed(0)}</span></div>
                    {fees.tds > 0 && <div className="flex justify-between text-sm"><span className="text-cc-text-muted font-medium">TDS (30%)</span><span className="font-mono text-cc-red font-bold">-₹{fees.tds.toFixed(0)}</span></div>}
                    <div className="border-t border-cc-border-subtle pt-3 mt-1 flex justify-between items-center">
                      <span className="font-bold text-white tracking-tight">You receive</span>
                      <span className="font-mono text-xl font-black text-cc-green drop-shadow-sm">₹{fees.receive > 0 ? fees.receive.toFixed(0) : '0'}</span>
                    </div>
                  </div>
                </div>
              )}
              <Button className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-gold hover:opacity-90 shadow-[0_5px_20px_rgba(244,196,48,0.2)] hover:shadow-[0_8px_25px_rgba(244,196,48,0.4)] transition-all duration-300 border-0 text-cc-bg-primary">
                Confirm Withdrawal
              </Button>
            </CardContent>
          </Card>
        </div>
      )
      }

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <Card className="bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl overflow-hidden shadow-lg h-full">
            <div className="p-5 md:p-6 border-b border-cc-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-cc-bg-elevated/30">
              <h2 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2"><History className="w-5 h-5 text-cc-gold" /> Transactions</h2>
              <div className="bg-cc-bg-primary/50 p-1 rounded-xl border border-cc-border-subtle">
                <Tabs tabs={[{ id: 'all', label: 'All' }, { id: 'deposits', label: 'Deposits' }, { id: 'withdrawals', label: 'Withdrawals' }, { id: 'bets', label: 'Bets' }]} activeTab={activeTab} onChange={setActiveTab} />
              </div>
            </div>
            <div className="divide-y divide-cc-border-subtle/50">
              {filteredTx.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-cc-bg-elevated flex items-center justify-center mb-4">
                    <History className="w-8 h-8 text-cc-text-muted" />
                  </div>
                  <p className="text-cc-text-muted font-bold">No transactions found</p>
                  <p className="text-sm text-cc-text-subtle mt-1">Your recent activity will appear here.</p>
                </div>
              ) : filteredTx.map((tx: any) => (
                <div key={tx.id} className="p-5 md:p-6 flex items-center justify-between hover:bg-cc-bg-elevated/40 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cc-bg-primary/80 border border-cc-border-subtle flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {getTxIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-bold text-white tracking-tight">{tx.description}</p>
                      <p className="text-xs text-cc-text-muted font-medium mt-0.5">{formatRelativeTime(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-black text-lg drop-shadow-sm ${tx.amount > 0 ? 'text-cc-green' : 'text-white'}`}>{tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}</p>
                    <Badge variant={tx.status === 'completed' ? 'green' : 'gold'} className="mt-1 shadow-sm text-[10px] uppercase font-black tracking-widest">{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Assets Sidebar */}
        <div className="space-y-6 md:space-y-8">
          <Card className="bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl overflow-hidden shadow-lg">
            <div className="p-5 border-b border-cc-border-subtle bg-cc-bg-elevated/30">
              <h3 className="font-extrabold text-white flex items-center gap-2"><Wallet className="w-4 h-4 text-cc-gold" /> Your Assets</h3>
            </div>
            <div className="p-5 space-y-3">
              {walletData.balances?.map((a: any) => (
                <div key={a.currency} className="flex items-center justify-between p-3 bg-cc-bg-primary/50 border border-cc-border-subtle rounded-2xl hover:border-cc-gold/30 hover:bg-cc-bg-elevated transition-all group shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cc-bg-card border border-cc-border-light flex items-center justify-center font-black text-cc-gold shadow-sm group-hover:scale-110 transition-transform">
                      {a.currency[0]}
                    </div>
                    <p className="font-bold text-white">{a.currency}</p>
                  </div>
                  <p className="font-mono font-black text-lg">{Number(a.balance || 0).toFixed(2)}</p>
                </div>
              ))}
              {(!walletData.balances || walletData.balances.length === 0) && (
                <div className="text-center py-6">
                  <p className="text-sm text-cc-text-muted font-medium">No assets found</p>
                </div>
              )}
            </div>
          </Card>

          {/* Supported Chains */}
          <Card className="bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl overflow-hidden shadow-lg">
            <div className="p-5 border-b border-cc-border-subtle bg-cc-bg-elevated/30">
              <h3 className="font-extrabold text-white flex items-center gap-2"><Link2 className="w-4 h-4 text-cc-gold" /> Supported Networks</h3>
            </div>
            <div className="p-5 space-y-2">
              {chains.map((chain) => (
                <div key={chain.id} className="flex items-center gap-3 p-3 bg-cc-bg-primary/30 border border-transparent rounded-2xl hover:bg-cc-bg-elevated hover:border-cc-border-subtle transition-all cursor-default">
                  <span className="text-xl drop-shadow-sm" style={{ color: chain.color }}>{chain.icon}</span>
                  <span className="text-sm font-bold text-white tracking-wide">{chain.name}</span>
                  <Badge variant="green" className="ml-auto text-[9px] uppercase tracking-widest shadow-sm">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
