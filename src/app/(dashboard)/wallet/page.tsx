'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useWallet, useTransactions } from '@/lib/hooks';
import { chains, depositAssets, withdrawalFees, fiatWithdrawalConfig } from '@/lib/mock-data';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, History, Copy, QrCode,
  CreditCard, CheckCircle, AlertTriangle, X, Shield, Loader2,
  Link2, RefreshCw,
} from 'lucide-react';
import BridgeWidget from '@/components/wallet/BridgeWidget';

// ─── Card-number input formatter ─────────────────────────────────────────────
function formatCardNum(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

// ─── Step types for the pay-with-card flow ────────────────────────────────────
type Step = 'method' | 'card-form' | 'confirm' | 'success';

// ─── Small step-header ────────────────────────────────────────────────────────
function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
      <h3 className="text-base font-bold text-[var(--ink-1)]">{title}</h3>
      <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink-1)] hover:bg-[var(--panel-raised)] transition-all">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Add-funds modal ──────────────────────────────────────────────────────────
function AddFundsModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'card' | 'crypto'>('card');
  const [step, setStep] = useState<Step>('method');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [amount] = useState('100.00');

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[var(--panel)] rounded-2xl shadow-card-lg border border-[var(--line)] overflow-hidden">

        <ModalHeader title="Add funds to your wallet" onClose={onClose} />

        <div className="p-5">
          {/* Mode switcher (only on method/card-form step) */}
          {(step === 'method' || step === 'card-form') && (
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => { setMode('card'); setStep('method'); }}
                className={cn(
                  'flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all',
                  mode === 'card'
                    ? 'bg-[var(--ink-1)] text-white border-[var(--ink-1)]'
                    : 'bg-[var(--panel)] text-[var(--ink-2)] border-[var(--line)] hover:bg-[var(--panel-raised)]'
                )}
              >
                Pay with card
              </button>
              <button
                onClick={() => { setMode('crypto'); setStep('method'); }}
                className={cn(
                  'flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all',
                  mode === 'crypto'
                    ? 'bg-[var(--ink-1)] text-white border-[var(--ink-1)]'
                    : 'bg-[var(--panel)] text-[var(--ink-2)] border-[var(--line)] hover:bg-[var(--panel-raised)]'
                )}
              >
                Receive funds
              </button>
            </div>
          )}

          {/* ── Card flow ── */}
          {mode === 'card' && step === 'method' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-3)] mb-1.5 uppercase tracking-wider">Card Number</label>
                <input
                  value={cardNum}
                  onChange={(e) => setCardNum(formatCardNum(e.target.value))}
                  placeholder="1234 5678 1234 5678"
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-3)] mb-1.5 uppercase tracking-wider">Expiry Date</label>
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                    maxLength={7}
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-3)] mb-1.5 uppercase tracking-wider">CVV</label>
                  <input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="•••"
                    type="password"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-3)] mb-1.5 uppercase tracking-wider">Name on Card</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2.5 text-sm bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20"
                />
              </div>
              <button
                onClick={() => setStep('confirm')}
                disabled={cardNum.length < 19}
                className="w-full py-3 bg-[var(--ink-1)] text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all"
              >
                Add Card
              </button>
            </div>
          )}

          {/* ── Confirm step ── */}
          {mode === 'card' && step === 'confirm' && (
            <div className="space-y-5">
              <div className="bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--ink-3)]">Amount</span>
                  <span className="font-bold text-[var(--ink-1)]">${amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--ink-3)]">Card</span>
                  <span className="font-mono font-bold text-[var(--ink-1)]">
                    •••• {cardNum.replace(/\s/g, '').slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--ink-3)]">Fee</span>
                  <span className="font-bold text-[var(--positive)]">Free</span>
                </div>
                <div className="pt-2 border-t border-[var(--line)] flex justify-between font-bold">
                  <span className="text-[var(--ink-1)]">Total</span>
                  <span className="text-[var(--ink-1)]">${amount}</span>
                </div>
              </div>
              <button
                onClick={() => setStep('success')}
                className="w-full py-3 bg-[var(--ink-1)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Pay ${amount}
              </button>
              <button onClick={() => setStep('method')} className="w-full text-center text-xs text-[var(--ink-3)] hover:text-[var(--ink-2)] transition-colors">
                ← Back
              </button>
            </div>
          )}

          {/* ── Success step ── */}
          {mode === 'card' && step === 'success' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--positive-subtle)] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-[var(--positive)]" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--ink-1)]">Deposit Successful</h4>
                <p className="text-sm text-[var(--ink-3)] mt-1">${amount} has been added to your wallet</p>
              </div>
              <div className="text-3xl font-black text-[var(--positive)]">+${amount}</div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-[var(--ink-1)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Crypto receive ── */}
          {mode === 'crypto' && (
            <div className="space-y-4">
              <div className="bg-[var(--panel-raised)] rounded-xl border border-[var(--line)] p-4 text-center">
                <QrCode className="w-24 h-24 text-[var(--ink-1)] mx-auto mb-3" />
                <p className="text-xs font-mono text-[var(--ink-2)] break-all">0x1a2b3c4d5e6f...ef12</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl">
                <code className="text-xs font-mono text-[var(--ink-2)] flex-1 truncate">0x1a2b3c4d5e6f7890abcdef12</code>
                <button className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--brand)] transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[var(--positive-subtle)] border border-[var(--positive)]/20 rounded-xl">
                <CheckCircle className="w-4 h-4 text-[var(--positive)] flex-shrink-0" />
                <p className="text-xs font-medium text-[var(--positive)]">Zero deposit fees — receive 100%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Withdraw modal ───────────────────────────────────────────────────────────
function WithdrawModal({
  onClose, availableBalance,
}: { onClose: () => void; availableBalance: number }) {
  const [mode, setMode] = useState<'crypto' | 'fiat'>('crypto');
  const [selectedChain, setSelectedChain] = useState(chains[2]);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');

  const feeConfig = withdrawalFees.find((f) => f.chainId === selectedChain.id);
  const amt = parseFloat(amount) || 0;
  const processingFee = (amt * (feeConfig?.processingFeePercent || 1)) / 100;
  const networkFee = feeConfig?.networkFee || 0;
  const receive = amt - processingFee - networkFee;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[var(--panel)] rounded-2xl shadow-card-lg border border-[var(--line)] overflow-hidden max-h-[90vh] overflow-y-auto">
        <ModalHeader title="Withdraw Funds" onClose={onClose} />
        <div className="p-5 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-2">
            {(['crypto', 'fiat'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 py-2 text-sm font-semibold rounded-xl border capitalize transition-all',
                  mode === m
                    ? 'bg-[var(--ink-1)] text-white border-[var(--ink-1)]'
                    : 'bg-[var(--panel)] text-[var(--ink-2)] border-[var(--line)] hover:bg-[var(--panel-raised)]'
                )}
              >
                {m === 'crypto' ? 'Crypto' : 'Bank (Fiat)'}
              </button>
            ))}
          </div>

          {mode === 'crypto' ? (
            <>
              {/* Network */}
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-3)] mb-2 uppercase tracking-wider">Network</label>
                <div className="grid grid-cols-3 gap-2">
                  {chains.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChain(c)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all',
                        selectedChain.id === c.id
                          ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)]'
                          : 'border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--line-strong)]'
                      )}
                    >
                      <span style={{ color: c.color }}>{c.icon}</span>
                      {c.shortName}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-3)] mb-2 uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--ink-3)]">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-16 py-2.5 text-sm font-mono bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20"
                  />
                  <button
                    onClick={() => setAmount(availableBalance.toString())}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black bg-[var(--brand-subtle)] text-[var(--brand)] px-2 py-1 rounded-md"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-3)] mb-2 uppercase tracking-wider">Destination Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20"
                />
              </div>

              {/* Fee breakdown */}
              <div className="bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--ink-3)]">Amount</span><span className="font-mono font-bold text-[var(--ink-1)]">{amount || '0'}</span></div>
                <div className="flex justify-between"><span className="text-[var(--ink-3)]">Processing fee (1%)</span><span className="font-mono text-[var(--negative)]">-{processingFee.toFixed(4)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--ink-3)]">Network fee</span><span className="font-mono text-[var(--negative)]">-{networkFee}</span></div>
                <div className="pt-2 border-t border-[var(--line)] flex justify-between font-bold">
                  <span className="text-[var(--ink-1)]">You receive</span>
                  <span className="font-mono text-[var(--positive)]">{receive > 0 ? receive.toFixed(4) : '0'} USDT</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-amber-800">
                  4.5% processing fee + TDS (30% above ₹10,000) per Indian regulations.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-3)] mb-2 uppercase tracking-wider">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--ink-3)]">₹</span>
                  <input
                    type="number"
                    value={fiatAmount}
                    onChange={(e) => setFiatAmount(e.target.value)}
                    placeholder="10,000"
                    className="w-full pl-7 pr-4 py-2.5 text-sm font-mono bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
              </div>
              <div className="bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--ink-3)]">Bank Account</span><span className="font-bold text-[var(--ink-1)]">HDFC ****4521</span></div>
                <div className="flex justify-between"><span className="text-[var(--ink-3)]">Fee (4.5%)</span><span className="font-mono text-[var(--negative)]">-₹{(parseFloat(fiatAmount || '0') * 0.045).toFixed(0)}</span></div>
                <div className="pt-2 border-t border-[var(--line)] flex justify-between font-bold">
                  <span className="text-[var(--ink-1)]">You receive</span>
                  <span className="font-mono text-[var(--positive)]">₹{(parseFloat(fiatAmount || '0') * 0.955).toFixed(0)}</span>
                </div>
              </div>
            </>
          )}

          <button className="w-full py-3 bg-[var(--ink-1)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all">
            Confirm Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TX_TABS = ['all', 'deposits', 'withdrawals', 'bets'];

export default function WalletPage() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const typeParam = activeTab === 'all' ? undefined : activeTab;
  const { data: txResponse } = useTransactions({ type: typeParam });
  const filteredTx = txResponse?.items || [];

  const { data: walletResponse, isLoading: walletLoading } = useWallet();
  const walletData = walletResponse || { totalBalance: 0, availableBalance: 0, lockedBalance: 0, balances: [] };

  const getTxColor = (type: string) =>
    ['DEPOSIT', 'BET_WON'].includes(type) ? 'text-[var(--positive)]' : 'text-[var(--negative)]';

  return (
    <div className="space-y-6">
      {/* Modals */}
      {showDeposit && <AddFundsModal onClose={() => setShowDeposit(false)} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} availableBalance={walletData.availableBalance} />}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink-1)]">Wallet</h1>
          <p className="text-sm text-[var(--ink-3)] mt-0.5">Manage balances, deposits and withdrawals</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeposit(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--ink-1)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <ArrowDownLeft className="w-4 h-4" /> Deposit
          </button>
          <button
            onClick={() => setShowWithdraw(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-[var(--line)] text-sm font-bold text-[var(--ink-2)] rounded-xl hover:bg-[var(--panel-raised)] transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
        </div>
      </div>

      {/* ── Balance cards ───────────────────────────────────────────── */}
      {walletLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--ink-3)]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Balance',          value: walletData.totalBalance,     color: 'text-[var(--ink-1)]',    icon: <Wallet className="w-5 h-5 text-[var(--brand)]" />,    bg: 'bg-[var(--brand-subtle)]' },
            { label: 'Available',              value: walletData.availableBalance, color: 'text-[var(--positive)]', icon: <CheckCircle className="w-5 h-5 text-[var(--positive)]" />, bg: 'bg-[var(--positive-subtle)]' },
            { label: 'Locked in Predictions',  value: walletData.lockedBalance,    color: 'text-[var(--ink-1)]',    icon: <Shield className="w-5 h-5 text-[var(--info)]" />,      bg: 'bg-[var(--info-subtle)]' },
          ].map((c) => (
            <div key={c.label} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-[var(--ink-3)] uppercase tracking-widest">{c.label}</p>
                <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center`}>{c.icon}</div>
              </div>
              <p className={`text-3xl font-black tabular ${c.color}`}>{formatCurrency(c.value)}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Transactions */}
        <div className="lg:col-span-2 bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[var(--ink-1)] flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--brand)]" />
              Transactions
            </h2>
            <div className="flex gap-1 bg-[var(--panel-raised)] p-1 rounded-lg border border-[var(--line)]">
              {TX_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all',
                    activeTab === t
                      ? 'bg-white text-[var(--ink-1)] shadow-sm border border-[var(--line)]'
                      : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[var(--line)]">
            {filteredTx.length === 0 ? (
              <div className="py-16 text-center">
                <History className="w-8 h-8 text-[var(--ink-3)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--ink-3)]">No transactions found</p>
              </div>
            ) : filteredTx.map((tx: any) => (
              <div key={tx.id} className="px-5 py-4 flex items-center justify-between hover:bg-[var(--panel-raised)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--panel-raised)] border border-[var(--line)] flex items-center justify-center text-base">
                    {tx.type === 'DEPOSIT' ? '↓' : tx.type === 'WITHDRAWAL' ? '↑' : tx.type === 'BET_WON' ? '🎉' : '🎯'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink-1)]">{tx.description}</p>
                    <p className="text-xs text-[var(--ink-3)] mt-0.5">{formatRelativeTime(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('font-mono font-bold text-base tabular', getTxColor(tx.type))}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 inline-block',
                    tx.status === 'completed'
                      ? 'bg-[var(--positive-subtle)] text-[var(--positive)]'
                      : 'bg-[var(--brand-subtle)] text-[var(--brand)]'
                  )}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Assets */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden">
            <div className="px-4 py-3.5 border-b border-[var(--line)] flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[var(--brand)]" />
              <h3 className="text-sm font-bold text-[var(--ink-1)]">Your Assets</h3>
            </div>
            <div className="p-4 space-y-2">
              {walletData.balances?.map((a: any) => (
                <div key={a.currency} className="flex items-center justify-between p-3 bg-[var(--panel-raised)] border border-[var(--line)] rounded-xl hover:border-[var(--line-strong)] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-subtle)] border border-[var(--brand)]/20 flex items-center justify-center font-black text-sm text-[var(--brand)]">
                      {a.currency[0]}
                    </div>
                    <span className="text-sm font-semibold text-[var(--ink-1)]">{a.currency}</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-[var(--ink-1)] tabular">{Number(a.balance || 0).toFixed(2)}</span>
                </div>
              ))}
              {(!walletData.balances || walletData.balances.length === 0) && (
                <p className="text-xs text-center text-[var(--ink-3)] py-4">No assets found</p>
              )}
            </div>
          </div>

          {/* Supported networks */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden">
            <div className="px-4 py-3.5 border-b border-[var(--line)] flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[var(--brand)]" />
              <h3 className="text-sm font-bold text-[var(--ink-1)]">Supported Networks</h3>
            </div>
            <div className="p-4 space-y-2">
              {chains.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-[var(--panel-raised)] rounded-xl hover:bg-[var(--panel)] border border-transparent hover:border-[var(--line)] transition-all">
                  <span className="text-lg" style={{ color: c.color }}>{c.icon}</span>
                  <span className="text-sm font-semibold text-[var(--ink-1)] flex-1">{c.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[var(--positive-subtle)] text-[var(--positive)] rounded-md">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
