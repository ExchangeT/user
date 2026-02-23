'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { currentUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  ShieldCheck, User, Activity, Gift, Trophy, Bookmark, Settings,
  Eye, EyeOff, Upload, Smartphone, Mail, Globe, Key, Plus,
  CheckCircle, XCircle, Clock, Trash2,
} from 'lucide-react';

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV = [
  { id: 'security',    label: 'Account & Security', icon: ShieldCheck },
  { id: 'profile',     label: 'Profile',             icon: User },
  { id: 'activity',    label: 'Activity',            icon: Activity },
  { id: 'rewards',     label: 'Rewards',             icon: Gift },
  { id: 'leaderboard', label: 'Leaderboard',         icon: Trophy },
  { id: 'watchlist',   label: 'Watchlist',           icon: Bookmark },
  { id: 'settings',    label: 'Settings',            icon: Settings },
];

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors ${active ? 'bg-[var(--positive)]' : 'bg-[var(--panel-raised)]'} border border-[var(--line)]`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-[3px] transition-all ${active ? 'left-[23px]' : 'left-[3px]'}`} />
    </button>
  );
}

// ─── Input row ────────────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, readOnly = false, disabled = false }: {
  label: string; type?: string; value?: string; readOnly?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--ink-3)] mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        defaultValue={value}
        readOnly={readOnly}
        disabled={disabled}
        className={cn(
          'w-full px-3.5 py-2.5 text-sm bg-[var(--panel)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/20 transition-all',
          (readOnly || disabled) && 'bg-[var(--panel-raised)] text-[var(--ink-3)] cursor-default'
        )}
      />
    </div>
  );
}

const ACTIVITY_TABS = ['All', 'Deposit', 'Withdrawal', 'Order', 'Trade', 'Settlement', 'Reward'];
const ACTIVITY_ROWS = [
  { action: 'Deposit',    position: '—',          contract: '—',        amount: '+₹5,000',  date: '23 Feb 2026', market: '—',        status: 'completed' },
  { action: 'Buy',        position: 'CSK to Win', contract: 'MI vs CSK', amount: '₹1,000',  date: '22 Feb 2026', market: 'IPL 2026', status: 'pending' },
  { action: 'Trade Win',  position: 'RCB Win',    contract: 'RCB vs MI', amount: '+₹1,575', date: '21 Feb 2026', market: 'IPL 2026', status: 'completed' },
  { action: 'Withdrawal', position: '—',          contract: '—',        amount: '-₹2,000', date: '20 Feb 2026', market: '—',        status: 'completed' },
  { action: 'Reward',     position: 'Referral',   contract: '—',        amount: '+₹250',   date: '19 Feb 2026', market: '—',        status: 'completed' },
  { action: 'Buy',        position: 'Over 180.5', contract: 'KKR vs DC', amount: '₹2,000', date: '18 Feb 2026', market: 'IPL 2026', status: 'completed' },
];

// ─── Profile Tab ─────────────────────────────────────────────────────────────
function ProfileTab() {
  const user = currentUser;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[var(--ink-1)]">Profile</h2>
        <p className="text-sm text-[var(--ink-3)] mt-0.5">Edit your profile details</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-black text-white shadow-md">
            {user.avatar || user.username[0]}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[var(--ink-1)] text-white rounded-full flex items-center justify-center shadow-sm hover:opacity-80 transition-opacity">
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--ink-1)]">{user.username}</p>
          <p className="text-xs text-[var(--ink-3)]">{user.email}</p>
          <p className="text-[10px] font-bold text-[var(--brand)] mt-1 uppercase tracking-widest">Gold Tier</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email" type="email" value={user.email} disabled />
        <Field label="Username" value={user.username} />
        <Field label="Phone" value={user.phone || '+91 98765 43210'} />
        <Field label="Referral Code" value={user.referralCode} readOnly />
      </div>

      {/* Connect socials */}
      <div>
        <p className="text-xs font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-3">Connect Socials</p>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--line)] rounded-xl text-sm font-semibold text-[var(--ink-2)] hover:bg-[var(--panel-raised)] transition-colors">
            <span>📸</span> Instagram
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-[var(--line)] rounded-xl text-sm font-semibold text-[var(--ink-2)] hover:bg-[var(--panel-raised)] transition-colors">
            <span>🐦</span> Twitter
          </button>
        </div>
      </div>

      <button className="px-6 py-2.5 bg-[var(--ink-1)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
        Save Changes
      </button>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const [showPw, setShowPw] = useState(false);
  const [twoFA, setTwoFA] = useState({ app: true, email: true, sms: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[var(--ink-1)]">Account & Security</h2>
        <p className="text-sm text-[var(--ink-3)] mt-0.5">Manage your password, 2FA and API keys</p>
      </div>

      {/* Change password */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[var(--panel-raised)]">
          <h3 className="text-sm font-bold text-[var(--ink-1)]">Change Password</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-3)] mb-1.5 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--panel)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)] pr-10"
              />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)] hover:text-[var(--ink-2)]">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="New Password" type="password" value="" />
            <Field label="Confirm Password" type="password" value="" />
          </div>
          <button className="px-6 py-2.5 bg-[var(--ink-1)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
            Update Password
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[var(--panel-raised)]">
          <h3 className="text-sm font-bold text-[var(--ink-1)]">Two-Factor Authentication</h3>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {[
            { key: 'app',   Icon: Smartphone, title: 'Google Authenticator', desc: 'Use an authenticator app for 2FA codes' },
            { key: 'email', Icon: Mail,        title: 'Email OTP',            desc: 'Receive OTP codes via your email' },
            { key: 'sms',   Icon: Smartphone, title: 'SMS OTP',              desc: 'Receive OTP codes via SMS' },
          ].map(({ key, Icon, title, desc }) => (
            <div key={key} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--panel-raised)] border border-[var(--line)] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[var(--ink-2)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink-1)]">{title}</p>
                  <p className="text-xs text-[var(--ink-3)]">{desc}</p>
                </div>
              </div>
              <Toggle
                active={(twoFA as any)[key]}
                onChange={() => setTwoFA((p) => ({ ...p, [key]: !(p as any)[key] }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[var(--panel-raised)] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--ink-1)]">API Keys</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--brand)] border border-[var(--brand)]/30 rounded-lg hover:bg-[var(--brand-subtle)] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Generate New Key
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 p-3 bg-[var(--panel-raised)] rounded-xl border border-[var(--line)]">
            <Key className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
            <code className="text-xs font-mono text-[var(--ink-2)] flex-1 truncate">cc_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
            <button className="text-[var(--negative)] hover:text-red-700 transition-colors ml-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {/* API Usage table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  {['Endpoint', 'Calls', 'Last Used'].map((c) => (
                    <th key={c} className="pb-2 pr-4 font-bold text-[var(--ink-3)] uppercase tracking-wider">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {[
                  { ep: '/api/matches', calls: '1,204', last: '2m ago' },
                  { ep: '/api/predictions', calls: '873', last: '10m ago' },
                  { ep: '/api/wallet', calls: '312', last: '1h ago' },
                ].map((r) => (
                  <tr key={r.ep} className="hover:bg-[var(--panel-raised)] transition-colors">
                    <td className="py-2.5 pr-4 font-mono text-[var(--ink-1)]">{r.ep}</td>
                    <td className="py-2.5 pr-4 font-bold text-[var(--ink-2)]">{r.calls}</td>
                    <td className="py-2.5 text-[var(--ink-3)]">{r.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active sessions */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[var(--panel-raised)]">
          <h3 className="text-sm font-bold text-[var(--ink-1)]">Active Sessions</h3>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {[
            { device: 'Chrome on macOS', location: 'Mumbai, India', time: 'Active now', current: true },
            { device: 'Safari on iPhone', location: 'Mumbai, India', time: '2 hours ago', current: false },
            { device: 'Chrome on Windows', location: 'Delhi, India', time: '3 days ago', current: false },
          ].map((s, i) => (
            <div key={i} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--panel-raised)] border border-[var(--line)] flex items-center justify-center">
                  <Globe className="w-4 h-4 text-[var(--ink-2)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink-1)] flex items-center gap-2">
                    {s.device}
                    {s.current && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[var(--positive-subtle)] text-[var(--positive)] rounded-md">Current</span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--ink-3)]">{s.location} · {s.time}</p>
                </div>
              </div>
              {!s.current && (
                <button className="text-xs font-semibold text-[var(--negative)] hover:underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────
function ActivityTab() {
  const [activeTab, setActiveTab] = useState('All');

  const rows = activeTab === 'All'
    ? ACTIVITY_ROWS
    : ACTIVITY_ROWS.filter((r) => r.action.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[var(--ink-1)]">Activity</h2>
        <p className="text-sm text-[var(--ink-3)] mt-0.5">Full history of your account activity</p>
      </div>

      {/* Activity sub-tabs */}
      <div className="flex gap-1 bg-[var(--panel-raised)] p-1 rounded-xl border border-[var(--line)] flex-wrap">
        {ACTIVITY_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeTab === t
                ? 'bg-white text-[var(--ink-1)] shadow-sm border border-[var(--line)]'
                : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[var(--panel-raised)]">
                {['Action', 'Position', 'Contract', 'Amount', 'Date', 'Market'].map((col) => (
                  <th key={col} className="px-4 py-3 text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-widest whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-[var(--panel-raised)] transition-colors">
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md',
                      r.status === 'completed'
                        ? 'bg-[var(--positive-subtle)] text-[var(--positive)]'
                        : 'bg-[var(--brand-subtle)] text-[var(--brand)]'
                    )}>
                      {r.status === 'completed'
                        ? <CheckCircle className="w-3 h-3" />
                        : <Clock className="w-3 h-3" />}
                      {r.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--ink-2)]">{r.position}</td>
                  <td className="px-4 py-3.5 text-[var(--ink-2)]">{r.contract}</td>
                  <td className={cn('px-4 py-3.5 font-mono font-bold tabular',
                    r.amount.startsWith('+') ? 'text-[var(--positive)]' :
                    r.amount.startsWith('-') ? 'text-[var(--negative)]' :
                    'text-[var(--ink-1)]'
                  )}>
                    {r.amount}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[var(--ink-3)] whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-3.5 text-[var(--ink-3)] text-xs">{r.market}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[var(--ink-3)]">No activity found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Preferences Tab ─────────────────────────────────────────────────────────
function PreferencesTab() {
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[var(--ink-1)]">Settings</h2>
        <p className="text-sm text-[var(--ink-3)] mt-0.5">Platform preferences and defaults</p>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-card divide-y divide-[var(--line)]">
        {[
          { label: 'Auto-confirm predictions under ₹500', desc: 'Skip confirmation for small stakes', active: autoConfirm, set: setAutoConfirm },
          { label: 'Email notifications', desc: 'Receive updates on settled predictions', active: emailNotifs, set: setEmailNotifs },
          { label: 'Push notifications', desc: 'Browser push alerts for live matches', active: pushNotifs, set: setPushNotifs },
        ].map(({ label, desc, active, set }) => (
          <div key={label} className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--ink-1)]">{label}</p>
              <p className="text-xs text-[var(--ink-3)] mt-0.5">{desc}</p>
            </div>
            <Toggle active={active} onChange={() => set(!active)} />
          </div>
        ))}
      </div>

      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[var(--panel-raised)]">
          <h3 className="text-sm font-bold text-[var(--ink-1)]">Defaults</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-3)] mb-1.5 uppercase tracking-wider">Default Currency</label>
            <select className="w-full px-3.5 py-2.5 text-sm bg-[var(--panel)] border border-[var(--line)] rounded-xl text-[var(--ink-1)] focus:outline-none focus:border-[var(--brand)]">
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>USDT</option>
            </select>
          </div>
          <Field label="Default Stake Amount" type="number" value="1000" />
          <button className="px-6 py-2.5 bg-[var(--ink-1)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const SECTION_MAP: Record<string, React.ReactNode> = {
  security:    <SecurityTab />,
  profile:     <ProfileTab />,
  activity:    <ActivityTab />,
  settings:    <PreferencesTab />,
};

export default function SettingsPage() {
  const [active, setActive] = useState('profile');
  const { data: session } = useSession();
  const user = currentUser;

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">

      {/* ── Left sidebar ────────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 hidden md:block">
        <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card overflow-hidden sticky top-4">
          {/* User pill at top */}
          <div className="px-4 py-4 border-b border-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                {user.avatar || user.username[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--ink-1)] truncate">{user.username}</p>
                <p className="text-[10px] text-[var(--ink-3)] truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-2 space-y-0.5">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all',
                  active === id
                    ? 'bg-[var(--ink-1)] text-white'
                    : 'text-[var(--ink-2)] hover:bg-[var(--panel-raised)] hover:text-[var(--ink-1)]'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ── Mobile: horizontal tabs ─────────────────────────────────── */}
      <div className="md:hidden w-full overflow-x-auto pb-2">
        <div className="flex gap-2">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 border transition-all',
                active === id
                  ? 'bg-[var(--ink-1)] text-white border-[var(--ink-1)]'
                  : 'bg-[var(--panel)] text-[var(--ink-2)] border-[var(--line)]'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {SECTION_MAP[active] ?? (
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-card p-8 text-center text-[var(--ink-3)]">
            <p className="text-sm font-medium">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
