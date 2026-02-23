// User Types
export interface User {
  id: string;
  privyId: string;
  email: string;
  phone?: string;
  username: string;
  walletAddress: string;
  avatar?: string;
  referralCode: string;
  referredBy?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  createdAt: Date;
  stats?: UserStats; // Stats might be calculated dynamically now
  predictions?: Prediction[];
}

export interface UserStats {
  totalPredictions: number;
  wins: number;
  losses: number;
  winRate: number;
  totalWinnings: number;
  netProfit: number;
  currentStreak: number;
  bestStreak: number;
  globalRank: number;
}

// Match Types
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

export interface Match {
  id: string;
  tournament: Tournament;
  team1: Team;
  team2: Team;
  venue: string;
  startTime: Date;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  score?: MatchScore;
  markets: Market[];
  poolSize: number;
  totalPredictions: number;
}

export interface MatchScore {
  team1Score: string;
  team2Score: string;
  team1Overs: string;
  team2Overs: string;
  currentInnings: 1 | 2;
  battingTeam: string;
  currentRR?: number;
  requiredRR?: number;
  target?: number;
  result?: string;
}

export interface Tournament {
  id: string;
  name: string;
  shortName: string;
  season: string;
  logo: string;
}

// Market Types
export interface Market {
  id: string;
  matchId: string;
  type: MarketType;
  question: string;
  outcomes: Outcome[];
  status: MarketStatus;
  totalVolume: number;
  liquidity: number;
  openTime: Date;
  closeTime: Date;
  resolvedOutcome?: string;
}

export type MarketType =
  | 'match_winner'
  | 'total_runs'
  | 'player_runs'
  | 'player_wickets'
  | 'toss_winner'
  | 'first_innings_score'
  | 'highest_scorer';

export type MarketStatus =
  | 'upcoming'
  | 'open'
  | 'live'
  | 'closed'
  | 'resolving'
  | 'settled'
  | 'cancelled';

export interface Outcome {
  id: string;
  name: string;
  odds: number;
  probability: number;
  trend: 'up' | 'down' | 'stable';
  volume: number;
}

// Prediction/Bet Types
export interface Prediction {
  id: string;
  oderId: string;
  userId: string;
  matchId: string;
  marketId: string;
  outcomeId: string;
  amount: number;
  shares: number;
  oddsAtBet: number;
  status: PredictionStatus;
  potentialPayout: number;
  actualPayout?: number;
  fee: number;
  feeDiscount: number;
  placedAt: Date;
  settledAt?: Date;
}

export type PredictionStatus =
  | 'pending'
  | 'active'
  | 'won'
  | 'lost'
  | 'cashed_out'
  | 'cancelled'
  | 'refunded';

export interface BetSlipItem {
  marketId: string;
  outcomeId: string;
  outcomeName: string;
  matchName: string;
  marketType: string;
  odds: number;
  stake: number;
}

// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  balances: WalletBalance[];
  totalBalance: number;
  lockedBalance: number;
  availableBalance: number;
}

export interface WalletBalance {
  currency: 'USDT' | 'USDC' | 'CRIC' | 'MATIC';
  balance: number;
  lockedBalance: number;
  usdValue: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  currency: string;
  amount: number;
  fee?: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  description: string;
  createdAt: Date;
  completedAt?: Date;
}

export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'BET_PLACED'
  | 'BET_WON'
  | 'BET_LOST'
  | 'CASHOUT'
  | 'REFERRAL_COMMISSION'
  | 'REFERRAL_INSTANT_REWARD'
  | 'STAKE'
  | 'UNSTAKE'
  | 'REWARD'
  | 'FEE';

// Referral Types
export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  referee: User;
  level: 1 | 2 | 3;
  totalEarned: number;
  isQualifying: boolean;
  createdAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  totalEarnings: number;
  level1Earnings: number;
  level2Earnings: number;
  level3Earnings: number;
  pendingEarnings: number;
  withdrawableEarnings: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  user: User;
  profit: number;
  winRate: number;
  totalBets: number;
  rankChange: number;
}

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'special';
  status: 'upcoming' | 'live' | 'ended';
  startDate: Date;
  endDate: Date;
  rewards: CampaignReward[];
  requirements: CampaignRequirement[];
  progress?: CampaignProgress;
  totalParticipants: number;
  prizePool: number;
}

export interface CampaignReward {
  type: 'ticket' | 'cash' | 'token' | 'bonus';
  value: number;
  description: string;
}

export interface CampaignRequirement {
  type: string;
  target: number;
  description: string;
}

export interface CampaignProgress {
  currentValue: number;
  targetValue: number;
  percentage: number;
  rank?: number;
  isCompleted: boolean;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'predictions' | 'referrals' | 'staking' | 'social' | 'special';
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
}

// Staking Types
export interface StakingPosition {
  id: string;
  userId: string;
  amount: number;
  lockPeriod: 30 | 90 | 180 | 365;
  apy: number;
  startDate: Date;
  endDate: Date;
  earnedRewards: number;
  status: 'active' | 'completed' | 'withdrawn';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Notification Types
export interface AppNotification {
  id: string;
  type: 'prediction' | 'wallet' | 'social' | 'system' | 'campaign';
  icon: string;
  title: string;
  description: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// FAQ Types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'getting-started' | 'predictions' | 'wallet' | 'referrals' | 'token' | 'security';
}

// Multi-Chain Types
export interface Chain {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  explorerUrl: string;
}

export interface DepositAsset {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  chainId: string;
  contractAddress?: string;
  decimals: number;
  minDeposit: number;
  enabled: boolean;
}

export interface WithdrawalFeeConfig {
  assetId: string;
  chainId: string;
  processingFeePercent: number; // 1% for crypto, 4-5% for fiat
  networkFee: number; // fixed fee in asset units
  tdsPercent?: number; // only for fiat
  minWithdrawal: number;
}

export interface ReferralReward {
  id: string;
  refereeUsername: string;
  predictionId: string;
  matchName: string;
  stakeAmount: number;
  rewardPercent: number;
  rewardAmount: number;
  createdAt: Date;
}
