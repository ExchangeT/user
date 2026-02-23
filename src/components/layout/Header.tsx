'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWalletStore, useUIStore } from '@/stores';
import { formatCurrency, truncateAddress } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCurrentUser } from '@/lib/hooks';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Bell,
  Search,
  Wallet,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  TrendingUp,
} from 'lucide-react';

export function Header() {
  const { data: session } = useSession();
  const { data: dbUser } = useCurrentUser();
  const user = dbUser || session?.user;

  const { availableBalance } = useWalletStore();
  const { toggleMobileSidebar } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-[var(--panel)] border-b border-[var(--line)] sticky top-0 z-40">
      <div className="h-full px-4 lg:px-6 flex items-center gap-3">

        {/* Hamburger — Mobile only */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--panel-raised)] flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink-1)] hover:border-[var(--line-strong)] transition-all flex-shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Mobile Logo */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-[var(--brand)] rounded-md flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--brand-fg)]" />
          </div>
          <span className="text-base font-extrabold text-[var(--ink-1)]">
            Cric<span className="text-[var(--brand)]">Chain</span>
          </span>
        </Link>

        {/* Search — Desktop */}
        <div className="relative hidden md:flex flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-3)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search markets, matches, teams..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--panel-raised)] flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink-1)] transition-all"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--panel-raised)] flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink-1)] hover:border-[var(--line-strong)] transition-all"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--negative)] rounded-full border border-[var(--panel)]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[var(--panel-overlay)] border border-[var(--line)] rounded-xl shadow-dropdown z-50 animate-scale-in overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--line)] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--ink-1)]">Notifications</h3>
                  <button className="text-xs text-[var(--brand)] hover:underline font-medium">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[var(--line)]">
                  <NotifItem icon="🎉" title="You won ₹2,450!" desc="RCB vs MI prediction settled" time="2h ago" />
                  <NotifItem icon="⚡" title="MI vs CSK is LIVE" desc="Your prediction is active" time="1h ago" />
                  <NotifItem icon="🎫" title="IPL Ticket Campaign" desc="Only 3 referrals left!" time="5h ago" />
                </div>
                <div className="p-3 border-t border-[var(--line)]">
                  <Link
                    href="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="block text-center text-xs text-[var(--brand)] hover:underline font-medium py-1"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Wallet balance */}
          <Link
            href="/wallet"
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg hover:border-[var(--line-strong)] transition-all group"
          >
            <Wallet className="w-3.5 h-3.5 text-[var(--brand)]" />
            <div>
              <p className="text-[10px] text-[var(--ink-3)] uppercase font-bold tracking-wider leading-none">Balance</p>
              <p className="font-mono font-bold text-[var(--ink-1)] text-xs leading-tight tabular">
                {formatCurrency(availableBalance)}
              </p>
            </div>
          </Link>

          {/* Web3 Connect — Desktop only */}
          <div className="hidden xl:block">
            <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} />
          </div>

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 ml-1 border-l border-[var(--line)] hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-[var(--brand-subtle)] border border-[var(--brand)]/20 rounded-lg flex items-center justify-center font-bold text-sm text-[var(--brand)]">
                  {/* @ts-ignore */}
                  {user?.avatar || user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden xl:block text-left">
                  {/* @ts-ignore */}
                  <p className="text-sm font-semibold text-[var(--ink-1)] leading-tight">{user?.username || user?.name || 'User'}</p>
                  <p className="text-[10px] text-[var(--ink-3)] leading-tight font-medium">
                    {/* @ts-ignore */}
                    {user?.walletAddress ? truncateAddress(user.walletAddress) : 'No wallet'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--ink-3)] hidden xl:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[var(--panel-overlay)] border border-[var(--line)] rounded-xl shadow-dropdown z-50 animate-scale-in overflow-hidden">
                  {/* Mobile: show user info */}
                  <div className="px-4 py-3 border-b border-[var(--line)] xl:hidden">
                    {/* @ts-ignore */}
                    <p className="text-sm font-semibold text-[var(--ink-1)]">{user?.username || user?.name || 'User'}</p>
                    <p className="text-xs text-[var(--ink-3)] truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[var(--ink-2)] hover:bg-[var(--panel-raised)] hover:text-[var(--ink-1)] rounded-lg transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[var(--ink-2)] hover:bg-[var(--panel-raised)] hover:text-[var(--ink-1)] rounded-lg transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="h-px bg-[var(--line)] my-1" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[var(--negative)] hover:bg-[var(--negative-subtle)] rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 ml-1 border-l border-[var(--line)]">
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink-1)] hidden sm:block transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 bg-[var(--brand)] text-[var(--brand-fg)] text-sm font-semibold rounded-lg hover:bg-[var(--brand-hover)] transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search expandable */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 bg-[var(--panel)] border-b border-[var(--line)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ink-3)]" />
            <input
              type="text"
              placeholder="Search matches, teams..."
              autoFocus
              className="w-full pl-9 pr-10 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none focus:border-[var(--brand)] transition-all"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)] hover:text-[var(--ink-1)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function NotifItem({
  icon, title, desc, time,
}: { icon: string; title: string; desc: string; time: string }) {
  return (
    <div className="px-4 py-3 hover:bg-[var(--panel-raised)] transition-colors cursor-pointer">
      <div className="flex gap-3">
        <span className="text-lg leading-none mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--ink-1)] truncate">{title}</p>
          <p className="text-xs text-[var(--ink-3)] mt-0.5 truncate">{desc}</p>
          <p className="text-[10px] text-[var(--ink-3)] mt-1 font-medium">{time}</p>
        </div>
      </div>
    </div>
  );
}
