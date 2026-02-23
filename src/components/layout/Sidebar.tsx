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
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Matches', href: '/matches?status=live', icon: Zap },
  { name: 'Upcoming', href: '/matches?status=upcoming', icon: Calendar },
  { name: 'My Predictions', href: '/predictions', icon: Target },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
];

const finance = [
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: '$CRIC Token', href: '/staking', icon: Coins },
];

const social = [
  { name: 'Referrals', href: '/referrals', icon: Users },
  { name: 'Campaigns', href: '/campaigns', icon: Gift },
  { name: 'Profile', href: '/profile', icon: Crown },
];

function NavSection({ title, items, pathname, onNavigate }: {
  title: string;
  items: typeof navigation;
  pathname: string;
  onNavigate?: () => void;
}) {
  const isActive = (href: string) => {
    if (href.includes('?')) {
      return pathname === href.split('?')[0];
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="mb-6">
      <p className="px-4 mb-3 text-xs font-bold text-cc-text-muted uppercase tracking-[0.15em] opacity-70">
        {title}
      </p>
      <ul className="space-y-1.5 px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative group',
                  active
                    ? 'bg-cc-gold/10 text-cc-gold font-semibold shadow-[inset_0_0_20px_rgba(244,196,48,0.05)]'
                    : 'text-cc-text-secondary hover:bg-cc-bg-card-hover hover:text-white'
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-gold rounded-r-full shadow-[0_0_10px_rgba(244,196,48,0.5)]" />
                )}
                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", active ? "text-cc-gold drop-shadow-[0_0_8px_rgba(244,196,48,0.5)]" : "")} />
                <span className="tracking-wide">{item.name}</span>
                {item.name === 'Live Matches' && (
                  <span className="ml-auto w-2 h-2 bg-cc-red rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full bg-cc-bg-secondary/40 backdrop-blur-xl border-r border-cc-border-subtle relative z-20">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-cc-gold/5 blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onNavigate}>
          <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center text-xl shadow-[0_0_20px_rgba(244,196,48,0.3)] group-hover:shadow-[0_0_25px_rgba(244,196,48,0.5)] transition-shadow duration-300">
            🏏
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
            Cric<span className="gradient-text">Chain</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 scrollbar-thin scrollbar-thumb-cc-border-medium scrollbar-track-transparent">
        <NavSection title="Main" items={navigation} pathname={pathname} onNavigate={onNavigate} />
        {session?.user && (
          <>
            <NavSection title="Finance" items={finance} pathname={pathname} onNavigate={onNavigate} />
            <NavSection title="Social" items={social} pathname={pathname} onNavigate={onNavigate} />
          </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-cc-border-subtle/50 space-y-2">
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-cc-text-muted hover:text-white hover:bg-cc-bg-card-hover transition-all group"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-medium">Settings</span>
        </Link>
        <Link
          href="/help"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-cc-text-muted hover:text-white hover:bg-cc-bg-card-hover transition-all group"
        >
          <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium">Help & Support</span>
        </Link>
      </div>
    </div>
  );
}

// Desktop Sidebar
export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-sidebar fixed top-0 left-0 h-screen z-50 flex-col">
      <SidebarContent />
    </aside>
  );
}

// Mobile Sidebar Overlay
export function MobileSidebar() {
  const { mobileSidebarOpen, closeMobileSidebar } = useUIStore();

  if (!mobileSidebarOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[80]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cc-bg-primary/80 backdrop-blur-md animate-fade-in"
        onClick={closeMobileSidebar}
      />
      {/* Sidebar */}
      <aside className="absolute top-0 left-0 w-[280px] h-full shadow-[20px_0_50px_-10px_rgba(0,0,0,0.5)] animate-slide-right z-10">
        {/* Close button */}
        <button
          onClick={closeMobileSidebar}
          className="absolute top-4 right-4 p-2 rounded-xl text-cc-text-muted hover:text-white hover:bg-cc-bg-card-hover transition-all z-30"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent onNavigate={closeMobileSidebar} />
      </aside>
    </div>
  );
}
