'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWalletStore, useUIStore } from '@/stores';
import { formatCurrency, truncateAddress } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCurrentUser } from '@/lib/hooks';
import {
  Bell,
  Search,
  Wallet,
  ChevronDown,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export function Header() {
  const { data: session } = useSession();
  const { data: dbUser } = useCurrentUser();

  // Optional: Merge session user info and DB user info
  const user = dbUser || session?.user;

  const { availableBalance } = useWalletStore();
  const { toggleMobileSidebar } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-20 bg-cc-bg-primary/80 backdrop-blur-md border-b border-cc-border-subtle sticky top-0 z-40">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Left - Hamburger + Search */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Hamburger - Mobile Only */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2.5 rounded-xl bg-cc-bg-card border border-cc-border-light hover:border-cc-gold hover:text-cc-gold transition-all"
          >
            <Menu className="w-5 h-5 text-cc-text-muted transition-colors" />
          </button>

          {/* Mobile Logo */}
          <Link href="/dashboard" className="lg:hidden flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-gold rounded-xl flex items-center justify-center text-sm shadow-[0_0_15px_rgba(244,196,48,0.3)]">
              🏏
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">
              Cric<span className="gradient-text">Chain</span>
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cc-text-muted" />
            <input
              type="text"
              placeholder="Search markets, teams, events..."
              className="w-72 lg:w-96 pl-12 pr-4 py-2.5 bg-cc-bg-card/50 border border-cc-border-light rounded-2xl text-sm text-white placeholder:text-cc-text-muted focus:outline-none focus:ring-1 focus:ring-cc-gold focus:border-cc-gold focus:bg-cc-bg-card transition-all shadow-inner"
            />
          </div>

          {/* Search Icon - Mobile */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden ml-auto p-2.5 rounded-xl bg-cc-bg-card border border-cc-border-light hover:border-cc-gold hover:text-cc-gold transition-all"
          >
            <Search className="w-5 h-5 text-cc-text-muted transition-colors" />
          </button>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3 sm:gap-5 hidden md:flex">
          {/* Notifications */}
          <button
            className="relative p-2.5 rounded-xl bg-cc-bg-card border border-cc-border-light hover:border-cc-gold hover:text-cc-gold transition-all group"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="w-5 h-5 text-cc-text-muted group-hover:text-cc-gold transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cc-red rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-cc-bg-primary shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              3
            </span>
          </button>

          {/* Wallet Balance */}
          <Link
            href="/wallet"
            className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-cc-bg-card/80 border border-cc-border-light rounded-2xl hover:border-cc-gold hover:shadow-[0_0_15px_rgba(244,196,48,0.15)] transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-cc-gold/10 flex items-center justify-center group-hover:bg-cc-gold/20 transition-colors">
              <Wallet className="w-4 h-4 text-cc-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-cc-text-muted uppercase tracking-wider font-semibold">Balance</span>
              <span className="font-mono font-bold text-white text-sm leading-tight">
                {formatCurrency(availableBalance)}
              </span>
            </div>
          </Link>

          {/* Connect Web3 Wallet */}
          <div className="hidden lg:block">
            <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
          </div>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 pl-5 ml-2 border-l border-cc-border-subtle text-left hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center font-bold text-cc-bg-primary shadow-[0_0_15px_rgba(244,196,48,0.3)]">
                  {/* @ts-ignore */}
                  {user?.avatar || user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden xl:block">
                  {/* @ts-ignore */}
                  <p className="text-sm font-bold text-white">{user?.username || user?.name || 'User'}</p>
                  <p className="text-xs text-cc-text-muted font-medium">
                    {/* @ts-ignore */}
                    {user?.walletAddress ? truncateAddress(user.walletAddress) : 'Not connected'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-cc-text-muted hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-cc-bg-secondary/95 backdrop-blur-xl border border-cc-border-light rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden py-1 z-50">
                  <div className="px-4 py-3 border-b border-cc-border-subtle xl:hidden bg-cc-bg-card/50">
                    {/* @ts-ignore */}
                    <p className="text-sm font-bold text-white">{user?.username || user?.name || 'User'}</p>
                    <p className="text-xs text-cc-text-muted truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-sm font-medium text-cc-text-secondary hover:bg-cc-bg-card hover:text-white rounded-xl transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full text-left px-3 py-2 mt-1 text-sm font-medium text-cc-red hover:bg-cc-red/10 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-5 ml-2 border-l border-cc-border-subtle">
              <Link href="/login" className="text-sm font-semibold text-cc-text-secondary hover:text-white hidden sm:block transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="px-5 py-2.5 bg-cc-gold hover:bg-cc-gold-light text-cc-bg-primary text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(244,196,48,0.3)] hover:shadow-[0_0_25px_rgba(244,196,48,0.5)]">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Expandable */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 bg-[#111827] border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search matches, teams..."
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 bg-[#1a2235] border border-white/10 rounded-xl text-sm text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] transition-all"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-[#64748b]" />
            </button>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {notificationsOpen && (
        <div className="absolute right-4 lg:right-6 top-16 w-80 bg-[#1a2235] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <NotificationItem
              icon="🎉"
              title="You won ₹2,450!"
              description="RCB vs MI prediction settled"
              time="2 hours ago"
            />
            <NotificationItem
              icon="🔥"
              title="MI vs CSK is LIVE"
              description="Your prediction is active"
              time="1 hour ago"
            />
            <NotificationItem
              icon="🎫"
              title="IPL Ticket Campaign"
              description="Only 3 referrals left to win!"
              time="5 hours ago"
            />
          </div>
          <div className="p-3 border-t border-white/10">
            <Link
              href="/notifications"
              onClick={() => setNotificationsOpen(false)}
              className="block text-center text-sm text-[#f4c430] hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NotificationItem({
  icon,
  title,
  description,
  time,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer border-b border-white/[0.06] last:border-b-0">
      <div className="flex gap-3">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-[#64748b]">{description}</p>
          <p className="text-xs text-[#64748b] mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
