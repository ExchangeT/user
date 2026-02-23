# CricChain Development Context for Claude Code

## Project Overview
**CricChain** - The world's first decentralized cricket prediction platform powered by blockchain and AI.
- **Target**: Global users (not India-specific)
- **Tech**: Next.js 14, TypeScript, Tailwind CSS, Zustand, Polygon blockchain
- **Launch**: IPL 2026 (March 20, 2026)
- **Goals**: 100K users, ₹50Cr volume, 25K DAU

## IMPORTANT TERMINOLOGY
- Use "**prediction**" NOT "betting" (regulatory compliance)
- Use "**decentralized**" always when describing platform
- Global-first positioning

---

## Current Project Structure

```
/home/claude/cricchain-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 ✅ Created
│   │   ├── page.tsx                   ✅ Redirects to /dashboard
│   │   ├── globals.css                ✅ CricChain design system
│   │   └── (dashboard)/
│   │       ├── layout.tsx             ✅ Sidebar + Header layout
│   │       ├── dashboard/page.tsx     ✅ Main dashboard
│   │       ├── matches/page.tsx       ✅ Match listing (Public)
│   │       ├── matches/[id]/
│   │       │   ├── page.tsx           ✅ Server Component (SEO/OG)
│   │       │   ├── MatchDetailClient.tsx ✅ Interactivity & Chat
│   │       │   └── opengraph-image.tsx ✅ Dynamic OG Generator
│   │       ├── wallet/page.tsx        ✅ Multi-chain & Bridging (Ph-25)
│   │       ├── profile/page.tsx       ✅ User profile
│   │       ├── referrals/page.tsx     ✅ 3-tier referral system
│   │       ├── predictions/page.tsx   ✅ Bet history
│   │       ├── campaigns/page.tsx     ✅ Integrated with real-time stats
│   │       ├── leaderboard/page.tsx   ✅ Podium + Rankings (Ph-26)
│   │       └── staking/page.tsx       ✅ $CRIC Staking interface
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx            ✅ Navigation sidebar
│   │   │   ├── Header.tsx             ✅ Top header with wallet
│   │   │   └── index.ts               ✅ Exports
│   │   └── ui/
│   │       └── index.tsx              ✅ Card, Button, Badge, Tabs, etc.
│   ├── lib/
│   │   ├── utils.ts                   ✅ Formatting utilities
│   │   ├── vault.ts                   ✅ Security Vault (Simulation)
│   │   ├── tiers.ts                   ✅ Loyalty Tier Config
│   │   ├── achievements.ts            ✅ Achievement Logic
│   │   └── mock-data.ts               ✅ Sample data
│   ├── stores/
│   │   └── index.ts                   ✅ Zustand stores (user, wallet, betslip)
│   └── types/
│       └── index.ts                   ✅ TypeScript interfaces
├── scripts/
│   └── pusher-load-test.ts            ✅ Stress testing infrastructure
├── tailwind.config.ts                 ✅ CricChain theme
└── package.json                       ✅ Dependencies (Axios added)
```

---

## Design System (Tailwind)

### Colors
```
Primary BG:     #0a0e17 (dark navy)
Secondary BG:   #111827
Card BG:        #1a2235
Elevated:       #243049
Gold Accent:    #f4c430 (PRIMARY BRAND COLOR)
Orange:         #ff6b35
Green:          #10b981 (success/wins)
Red:            #ef4444 (errors/losses)
Blue:           #3b82f6
Purple:         #8b5cf6
Text Primary:   #ffffff
Text Secondary: #94a3b8
Text Muted:     #64748b
```

### Fonts
- Main: Plus Jakarta Sans
- Mono: JetBrains Mono (for numbers/odds)

### Component Classes (in globals.css)
- `.card` - Standard card styling
- `.btn` / `.btn-primary` / `.btn-secondary` - Buttons
- `.badge-gold` / `.badge-green` / `.badge-red` / `.badge-live` - Status badges
- `.gradient-text` - Gold gradient text
- `.odds-btn` / `.odds-btn-selected` - Betting odds buttons

---

## Key Features to Implement

### 1. Pages Still Needed

#### Campaigns Page (INCOMPLETE)
```tsx
// Features needed:
- Hero campaign (IPL Ticket Giveaway)
- Campaign cards grid with progress
- Filter tabs (Live, Upcoming, Ended)
- User progress tracking
```

#### Leaderboard Page ✅
- Top 3 podium display (gold/silver/bronze)
- Full rankings table with pagination
- User's current rank highlighted
- Filters: All Time, This Month, This Week, Today
- Dynamic $CRIC reward triggers

#### Staking Page ✅
- $CRIC token overview
- Staking tiers (30/90/180/365 days)
- APY calculator
- Active stakes list
- Rewards tracking
- Stake/Unstake actions
- Multiplier logic integrated with Tiers

### 2. Admin Panel (Separate Project)

Create at `/home/claude/cricchain-admin/` with:

```
cricchain-admin/
├── src/app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── dashboard/page.tsx      # KPIs, charts
│       ├── users/page.tsx          # User management
│       ├── matches/page.tsx        # Match management
│       ├── markets/page.tsx        # Market management
│       ├── predictions/page.tsx    # All predictions
│       ├── transactions/page.tsx   # Financial overview
│       ├── campaigns/page.tsx      # Campaign management
│       ├── referrals/page.tsx      # Referral analytics
│       └── settings/page.tsx       # Platform settings
```

---

## Mock Data Available (in mock-data.ts)

```typescript
// Teams
teams: Team[] // MI, CSK, RCB, KKR, SRH, RR, DC, PBKS

// Current user
currentUser: User // With full stats

// Matches
matches: Match[] // 4 sample matches (1 live, 3 upcoming)

// Markets
marketsForMatch1: Market[] // Match winner, total runs, player runs

// Predictions
userPredictions: Prediction[]

// Transactions
transactions: Transaction[]

// Leaderboard
leaderboard: LeaderboardEntry[]

// Campaigns
campaigns: Campaign[]

// Achievements
achievements: Achievement[]

// Referrals
referralStats, referrals: Referral[]

// Wallet
walletData: { totalBalance, availableBalance, lockedBalance, balances[] }
```

---

## TypeScript Types Available (in types/index.ts)

- User, UserStats
- Team, Match, MatchScore, Tournament
- Market, MarketType, MarketStatus, Outcome
- Prediction, PredictionStatus, BetSlipItem
- Wallet, WalletBalance, Transaction, TransactionType
- Referral, ReferralStats
- LeaderboardEntry
- Campaign, CampaignReward, CampaignRequirement, CampaignProgress
- Achievement
- StakingPosition
- ApiResponse, PaginatedResponse

---

## Zustand Stores Available (in stores/index.ts)

```typescript
// User store
useUserStore: { user, isAuthenticated, login, logout, updateUser }

// Bet slip store
useBetSlipStore: { items, isOpen, addBet, removeBet, updateStake, clearSlip, toggleSlip, getTotalStake, getTotalPotentialPayout }

// Wallet store
useWalletStore: { totalBalance, availableBalance, lockedBalance, balances, refreshBalance }

// UI store
useUIStore: { sidebarOpen, activeTab, modalOpen, toggleSidebar, setActiveTab, openModal, closeModal }

// Match store
useMatchStore: { selectedMatch, selectedMarket, setSelectedMatch, setSelectedMarket }
```

---

## Utility Functions Available (in lib/utils.ts)

- `cn(...classes)` - Class name merger
- `formatCurrency(amount, currency)` - Format as ₹ or $
- `formatNumber(num)` - Format as K/L/Cr
- `formatOdds(odds)` - Format to 2 decimals
- `formatPercentage(value)` - Format as %
- `formatDate/Time/DateTime(date)` - Date formatting
- `formatRelativeTime(date)` - "2h ago" style
- `getMatchStatus(startTime, status)` - Get status text/color
- `truncateAddress(address)` - Shorten wallet address
- `calculatePotentialPayout(stake, odds)`
- `calculatePlatformFee(stake, feePercent)`
- `getTeamColor/Emoji(team)` - Team branding

---

## Commands to Continue Development

```bash
# Navigate to project
cd /home/claude/cricchain-nextjs

# Install deps (if needed)
npm install

# Run dev server
npm run dev

# Create new page
mkdir -p src/app/(dashboard)/[pagename]
# Then create page.tsx in that folder
```

---

## Immediate TODOs

1. **Final Security Audit** - Partner with external auditors (Mar 01)
2. **Community Beta** - Launch on Polygon Amoy for 500+ testers
3. **Marketing Push** - Leverage the dynamic OG sharing features
4. **Mainnet Deployment** - IPL 2026 Opening Night (Mar 20)

---

## Sample Page Template

```tsx
'use client';

import { useState } from 'react';
import { Card, Badge, Button, Tabs } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
// Import from mock-data as needed

export default function PageName() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Page Title</h1>
        <p className="text-[#94a3b8]">Page description</p>
      </div>

      {/* Stats/Overview */}
      <div className="grid grid-cols-4 gap-4">
        {/* StatCards */}
      </div>

      {/* Filters */}
      <Tabs 
        tabs={[{ id: 'all', label: 'All' }]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {/* Main Content */}
      <Card>
        {/* Content here */}
      </Card>
    </div>
  );
}
```

---

## Reference: HTML Prototypes Location

Static HTML prototypes are at:
`/mnt/user-data/outputs/cricchain-platform/`
- dashboard.html
- match-details.html
- wallet.html
- profile.html
- referrals.html
- predictions.html
- campaigns.html
- leaderboard.html

These can be referenced for design/layout guidance.
