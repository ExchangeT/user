import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + 'Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)}, ${formatTime(date)}`;
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getMatchStatus(startTime: Date, status: string): { text: string; color: string } {
  if (status === 'live') {
    return { text: 'LIVE', color: 'red' };
  }
  if (status === 'completed') {
    return { text: 'Completed', color: 'gray' };
  }
  
  const now = new Date();
  const start = new Date(startTime);
  const diffMs = start.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 0) return { text: 'Starting...', color: 'gold' };
  if (diffMins < 60) return { text: `In ${diffMins}m`, color: 'gold' };
  if (diffHours < 24) return { text: `In ${diffHours}h`, color: 'blue' };
  if (diffDays < 7) return { text: `In ${diffDays}d`, color: 'blue' };
  return { text: formatDate(startTime), color: 'gray' };
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function calculatePotentialPayout(stake: number, odds: number): number {
  return stake * odds;
}

export function calculatePlatformFee(stake: number, feePercent: number = 2): number {
  return stake * (feePercent / 100);
}

export function calculateFeeDiscount(fee: number, discountPercent: number = 80): number {
  return fee * (discountPercent / 100);
}

export function getTeamColor(teamName: string): string {
  const colors: Record<string, string> = {
    'Mumbai Indians': '#004BA0',
    'Chennai Super Kings': '#FFFF00',
    'Royal Challengers Bangalore': '#EC1C24',
    'Kolkata Knight Riders': '#3A225D',
    'Sunrisers Hyderabad': '#FF822A',
    'Rajasthan Royals': '#E73895',
    'Delhi Capitals': '#0078BC',
    'Punjab Kings': '#ED1B24',
    'Gujarat Titans': '#1C1C1C',
    'Lucknow Super Giants': '#A72056',
  };
  return colors[teamName] || '#6366f1';
}

export function getTeamEmoji(teamShortName: string): string {
  const emojis: Record<string, string> = {
    'MI': '💙',
    'CSK': '💛',
    'RCB': '❤️',
    'KKR': '💜',
    'SRH': '🧡',
    'RR': '💗',
    'DC': '💙',
    'PBKS': '❤️',
    'GT': '🖤',
    'LSG': '💖',
  };
  return emojis[teamShortName] || '🏏';
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
  };
  return colors[tier] || '#f4c430';
}

export function generateReferralCode(username: string): string {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${username.toUpperCase().slice(0, 4)}${random}`;
}
