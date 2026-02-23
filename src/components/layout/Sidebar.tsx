'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores';
import {
  LayoutDashboard,
  Zap,
  Calendar,
  Target,
  Trophy,
  Wallet,
  Coins,
  Users,
  Gift,
  Crown,
  Settings,
  HelpCircle,
  X,
  TrendingUp,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard',     href: '/dashboard',            icon: LayoutDashboard },
  { name: 'Live Matches',  href: '/matches?status=live',  icon: Zap,    live: true },
  { name: 'Upcoming',      href: '/matches?status=upcoming', icon: Calendar },
  { name: 'My Predictions', href: '/predictions',         icon: Target },
  { name: 'Leaderboard',   href: '/leaderboard',          icon: Trophy },
];

const finance = [
  { name: 'Wallet',     href: '/wallet',  icon: Wallet },
  { name: '$CRIC Token', href: '/staking', icon: Coins },
];

const social = [
  { name: 'Referrals', href: '/referrals', icon: Users },
  { name: 'Campaigns', href: '/campaigns', icon: Gift },
  { name: 'Profile',   href: '/profile',   icon: Crown },
];

function NavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: { name: string; href: string; icon: any; live?: boolean };
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = item.href.includes('?')
    ? pathname === item.href.split('?')[0]
    : pathname === item.href || pathname.startsWith(item.href + '/');

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative',
        isActive
          ? 'bg-[var(--brand-subtle)] text-[var(--brand)]'
          : 'text-[var(--ink-3)] hover:text-[var(--ink-1)] hover:bg-[var(--panel-raised)]'
      )}
    >
      {isActive && (
        <div className="absolute left-0 inset-y-1.5 w-0.5 bg-[var(--brand)] rounded-r-full" />
      )}
      <Icon className={cn(
        'w-4 h-4 flex-shrink-0',
        isActive ? 'text-[var(--brand)]' : 'text-[var(--ink-3)] group-hover:text-[var(--ink-2)]'
      )} />
      <span className="flex-1 truncate">{item.name}</span>
      {item.live && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--negative)] flex-shrink-0" />
      )}
    </Link>
  );
}

function NavGroup({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: typeof navigation;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="mb-5">
      <p className="px-3 mb-1.5 text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-widest">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavItem key={item.name} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full bg-[var(--panel)] border-r border-[var(--line)]">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center border-b border-[var(--line)] flex-shrink-0">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[var(--brand)] rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <TrendingUp className="w-4 h-4 text-[var(--brand-fg)]" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-[var(--ink-1)]">
              Cric<span className="text-[var(--brand)]">Chain</span>
            </span>
            <p className="text-[9px] text-[var(--ink-3)] font-medium uppercase tracking-widest leading-none mt-0.5">
              Prediction Markets
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <NavGroup title="Markets" items={navigation} pathname={pathname} onNavigate={onNavigate} />

        {session?.user && (
          <>
            <NavGroup title="Finance" items={finance} pathname={pathname} onNavigate={onNavigate} />
            <NavGroup title="Account" items={social} pathname={pathname} onNavigate={onNavigate} />
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[var(--line)] space-y-0.5 flex-shrink-0">
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--ink-3)] hover:text-[var(--ink-1)] hover:bg-[var(--panel-raised)] transition-all group"
        >
          <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
          Settings
        </Link>
        <Link
          href="/help"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--ink-3)] hover:text-[var(--ink-1)] hover:bg-[var(--panel-raised)] transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          Help & Support
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-sidebar fixed top-0 left-0 h-screen z-50 flex-col">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const { mobileSidebarOpen, closeMobileSidebar } = useUIStore();

  if (!mobileSidebarOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeMobileSidebar}
      />
      <aside className="absolute top-0 left-0 w-[280px] h-full shadow-dropdown z-10 animate-slide-up">
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={closeMobileSidebar}
            className="w-8 h-8 rounded-lg bg-[var(--panel-raised)] border border-[var(--line)] flex items-center justify-center text-[var(--ink-3)] hover:text-[var(--ink-1)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContent onNavigate={closeMobileSidebar} />
      </aside>
    </div>
  );
}
