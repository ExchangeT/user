import { Match, User, Market, Prediction, Campaign, LeaderboardEntry, Achievement, Referral, Transaction, Team, Tournament, AppNotification, FAQItem, Chain, DepositAsset, WithdrawalFeeConfig, ReferralReward } from '@/types';

// Teams
export const teams: Team[] = [
  { id: '1', name: 'Mumbai Indians', shortName: 'MI', logo: '💙', color: '#004BA0' },
  { id: '2', name: 'Chennai Super Kings', shortName: 'CSK', logo: '💛', color: '#FFFF00' },
  { id: '3', name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: '❤️', color: '#EC1C24' },
  { id: '4', name: 'Kolkata Knight Riders', shortName: 'KKR', logo: '💜', color: '#3A225D' },
  { id: '5', name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: '🧡', color: '#FF822A' },
  { id: '6', name: 'Rajasthan Royals', shortName: 'RR', logo: '💗', color: '#E73895' },
  { id: '7', name: 'Delhi Capitals', shortName: 'DC', logo: '💙', color: '#0078BC' },
  { id: '8', name: 'Punjab Kings', shortName: 'PBKS', logo: '❤️', color: '#ED1B24' },
];

// Tournament
export const ipl2026: Tournament = {
  id: 'ipl-2026',
  name: 'Indian Premier League',
  shortName: 'IPL',
  season: '2026',
  logo: '🏏',
};

// Current User
export const currentUser: User = {
  id: 'user-1',
  privyId: 'privy-123',
  email: 'rahul@example.com',
  username: 'rahul_predictor',
  walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
  avatar: 'R',
  referralCode: 'RAHUL2026',
  tier: 'gold',
  createdAt: new Date('2026-02-01'),
  stats: {
    totalPredictions: 156,
    wins: 106,
    losses: 50,
    winRate: 68,
    totalWinnings: 24850,
    netProfit: 8450,
    currentStreak: 7,
    bestStreak: 12,
    globalRank: 247,
  },
};

// Matches
export const matches: Match[] = [
  {
    id: 'match-1',
    tournament: ipl2026,
    team1: teams[0], // MI
    team2: teams[1], // CSK
    venue: 'Wankhede Stadium, Mumbai',
    startTime: new Date(Date.now() + 3600000), // 1 hour from now
    status: 'live',
    score: {
      team1Score: '156/4',
      team2Score: '187/6',
      team1Overs: '16.2',
      team2Overs: '20.0',
      currentInnings: 2,
      battingTeam: 'MI',
      currentRR: 9.52,
      requiredRR: 8.73,
      target: 188,
    },
    markets: [],
    poolSize: 1850000,
    totalPredictions: 2847,
  },
  {
    id: 'match-2',
    tournament: ipl2026,
    team1: teams[2], // RCB
    team2: teams[3], // KKR
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    startTime: new Date(Date.now() + 7200000), // 2 hours from now
    status: 'upcoming',
    markets: [],
    poolSize: 1250000,
    totalPredictions: 1523,
  },
  {
    id: 'match-3',
    tournament: ipl2026,
    team1: teams[4], // SRH
    team2: teams[5], // RR
    venue: 'Rajiv Gandhi Stadium, Hyderabad',
    startTime: new Date(Date.now() + 86400000), // Tomorrow
    status: 'upcoming',
    markets: [],
    poolSize: 980000,
    totalPredictions: 856,
  },
  {
    id: 'match-4',
    tournament: ipl2026,
    team1: teams[6], // DC
    team2: teams[7], // PBKS
    venue: 'Arun Jaitley Stadium, Delhi',
    startTime: new Date(Date.now() + 172800000), // 2 days
    status: 'upcoming',
    markets: [],
    poolSize: 750000,
    totalPredictions: 421,
  },
];

// Markets for match-1
export const marketsForMatch1: Market[] = [
  {
    id: 'market-1',
    matchId: 'match-1',
    type: 'match_winner',
    question: 'Who will win the match?',
    outcomes: [
      { id: 'o1', name: 'MI to Win', odds: 2.15, probability: 46.5, trend: 'up', volume: 750000 },
      { id: 'o2', name: 'CSK to Win', odds: 1.75, probability: 57.1, trend: 'down', volume: 920000 },
      { id: 'o3', name: 'Draw/Tie', odds: 15.0, probability: 6.7, trend: 'stable', volume: 45000 },
    ],
    status: 'live',
    totalVolume: 1230000,
    liquidity: 500000,
    openTime: new Date(Date.now() - 3600000),
    closeTime: new Date(Date.now() + 1800000),
  },
  {
    id: 'market-2',
    matchId: 'match-1',
    type: 'total_runs',
    question: 'Total runs in the match?',
    outcomes: [
      { id: 'o4', name: 'Over 350.5', odds: 1.90, probability: 52.6, trend: 'up', volume: 280000 },
      { id: 'o5', name: 'Under 350.5', odds: 1.95, probability: 51.3, trend: 'down', volume: 265000 },
    ],
    status: 'live',
    totalVolume: 420000,
    liquidity: 200000,
    openTime: new Date(Date.now() - 3600000),
    closeTime: new Date(Date.now() + 1800000),
  },
  {
    id: 'market-3',
    matchId: 'match-1',
    type: 'player_runs',
    question: 'Rohit Sharma total runs?',
    outcomes: [
      { id: 'o6', name: 'Over 32.5', odds: 1.85, probability: 54.1, trend: 'stable', volume: 180000 },
      { id: 'o7', name: 'Under 32.5', odds: 2.00, probability: 50.0, trend: 'stable', volume: 175000 },
    ],
    status: 'live',
    totalVolume: 355000,
    liquidity: 150000,
    openTime: new Date(Date.now() - 3600000),
    closeTime: new Date(Date.now() + 1800000),
  },
];

// User Predictions
export const userPredictions: Prediction[] = [
  {
    id: 'pred-1',
    oderId: 'order-1',
    userId: 'user-1',
    matchId: 'match-1',
    marketId: 'market-1',
    outcomeId: 'o2',
    amount: 1000,
    shares: 0.45,
    oddsAtBet: 1.75,
    status: 'active',
    potentialPayout: 1750,
    fee: 20,
    feeDiscount: 16,
    placedAt: new Date(Date.now() - 1800000),
  },
  {
    id: 'pred-2',
    oderId: 'order-2',
    userId: 'user-1',
    matchId: 'match-1',
    marketId: 'market-3',
    outcomeId: 'o7',
    amount: 500,
    shares: 0.25,
    oddsAtBet: 2.00,
    status: 'active',
    potentialPayout: 1000,
    fee: 10,
    feeDiscount: 8,
    placedAt: new Date(Date.now() - 1200000),
  },
];

// Transactions
export const transactions: Transaction[] = [
  { id: 'tx-1', userId: 'user-1', type: 'BET_WON', currency: 'INR', amount: 2450, status: 'completed', description: 'Won: RCB vs MI', createdAt: new Date(Date.now() - 7200000) },
  { id: 'tx-2', userId: 'user-1', type: 'BET_PLACED', currency: 'INR', amount: -1000, status: 'pending', description: 'Bet: CSK to Win', createdAt: new Date(Date.now() - 10800000) },
  { id: 'tx-3', userId: 'user-1', type: 'DEPOSIT', currency: 'INR', amount: 5000, status: 'completed', description: 'Deposit via UPI', createdAt: new Date(Date.now() - 86400000) },
  { id: 'tx-4', userId: 'user-1', type: 'BET_WON', currency: 'INR', amount: 3200, status: 'completed', description: 'Won: KKR vs DC', createdAt: new Date(Date.now() - 90000000) },
  { id: 'tx-5', userId: 'user-1', type: 'BET_LOST', currency: 'INR', amount: -800, status: 'completed', description: 'Lost: SRH vs RR', createdAt: new Date(Date.now() - 172800000) },
  { id: 'tx-6', userId: 'user-1', type: 'STAKE', currency: 'CRIC', amount: -5420, status: 'completed', description: 'Staked $CRIC', createdAt: new Date(Date.now() - 259200000) },
  { id: 'tx-7', userId: 'user-1', type: 'WITHDRAWAL', currency: 'INR', amount: -10000, status: 'completed', description: 'Withdraw to Bank', createdAt: new Date(Date.now() - 432000000) },
];

// Leaderboard
const defaultStats = { totalPredictions: 0, wins: 0, losses: 0, winRate: 0, totalWinnings: 0, netProfit: 0, currentStreak: 0, bestStreak: 0, globalRank: 0, ...currentUser.stats };
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, previousRank: 1, user: { ...currentUser, id: 'u1', username: 'CricketKing', avatar: '🦁', stats: { ...defaultStats, netProfit: 124500, winRate: 74 } }, profit: 124500, winRate: 74, totalBets: 523, rankChange: 0 },
  { rank: 2, previousRank: 3, user: { ...currentUser, id: 'u2', username: 'ProPredictor', avatar: '🎯', stats: { ...defaultStats, netProfit: 98200, winRate: 71 } }, profit: 98200, winRate: 71, totalBets: 467, rankChange: 1 },
  { rank: 3, previousRank: 2, user: { ...currentUser, id: 'u3', username: 'IPLMaster', avatar: '⚡', stats: { ...defaultStats, netProfit: 76800, winRate: 69 } }, profit: 76800, winRate: 69, totalBets: 412, rankChange: -1 },
  { rank: 4, previousRank: 6, user: { ...currentUser, id: 'u4', username: 'BetWise', avatar: '🏏', tier: 'gold', stats: { ...defaultStats, netProfit: 54300, winRate: 67 } }, profit: 54300, winRate: 67, totalBets: 412, rankChange: 2 },
  { rank: 5, previousRank: 4, user: { ...currentUser, id: 'u5', username: 'SixerKing', avatar: '🔥', tier: 'gold', stats: { ...defaultStats, netProfit: 48900, winRate: 65 } }, profit: 48900, winRate: 65, totalBets: 389, rankChange: -1 },
];

// Campaigns
export const campaigns: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Daily Top Bettor',
    description: 'Place the highest volume of bets each day and win IPL tickets. Top 3 predictors win daily!',
    type: 'daily',
    status: 'live',
    startDate: new Date(),
    endDate: new Date(Date.now() + 28800000),
    rewards: [
      { type: 'ticket', value: 1, description: 'IPL Ticket' },
      { type: 'cash', value: 5000, description: '₹5,000 Bonus' },
    ],
    requirements: [{ type: 'volume', target: 50000, description: 'Place ₹50,000+ in bets' }],
    progress: { currentValue: 32500, targetValue: 50000, percentage: 65, rank: 12, isCompleted: false },
    totalParticipants: 1247,
    prizePool: 75000,
  },
  {
    id: 'camp-2',
    title: 'Referral Champions',
    description: 'Refer 50+ friends and win a FREE IPL ticket! Plus earn 30% commission on all their bets.',
    type: 'seasonal',
    status: 'live',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-04-30'),
    rewards: [
      { type: 'ticket', value: 1, description: 'IPL Ticket' },
      { type: 'token', value: 5000, description: '5,000 $CRIC' },
    ],
    requirements: [{ type: 'referrals', target: 50, description: 'Refer 50 friends' }],
    progress: { currentValue: 47, targetValue: 50, percentage: 94, isCompleted: false },
    totalParticipants: 856,
    prizePool: 500000,
  },
];

// Achievements
export const achievements: Achievement[] = [
  { id: 'ach-1', name: 'First Blood', description: 'Won your first prediction', icon: '🎯', category: 'predictions', isUnlocked: true, unlockedAt: new Date('2026-02-02') },
  { id: 'ach-2', name: 'Hot Streak', description: 'Won 5 predictions in a row', icon: '🔥', category: 'predictions', isUnlocked: true, unlockedAt: new Date('2026-02-10') },
  { id: 'ach-3', name: 'High Roller', description: 'Bet over ₹10,000 in a single prediction', icon: '💰', category: 'predictions', isUnlocked: true },
  { id: 'ach-4', name: 'Influencer', description: 'Referred 10+ friends', icon: '👥', category: 'referrals', isUnlocked: true },
  { id: 'ach-5', name: 'IPL Expert', description: 'Won 25 IPL predictions', icon: '🏏', category: 'predictions', isUnlocked: true },
  { id: 'ach-6', name: 'Gold Member', description: 'Reached Gold tier', icon: '⭐', category: 'special', isUnlocked: true },
  { id: 'ach-7', name: 'Token Holder', description: 'Staked 1,000+ $CRIC', icon: '🪙', category: 'staking', isUnlocked: true },
  { id: 'ach-8', name: 'Analyst', description: '65%+ win rate over 50 bets', icon: '📊', category: 'predictions', isUnlocked: true },
  { id: 'ach-9', name: 'Diamond Hands', description: 'Stake 10,000+ $CRIC for 30 days', icon: '💎', category: 'staking', isUnlocked: false, progress: 5420, target: 10000 },
  { id: 'ach-10', name: 'Champion', description: 'Reach Top 100 on leaderboard', icon: '🏆', category: 'special', isUnlocked: false, progress: 247, target: 100 },
];

// Referrals
export const referralStats = {
  totalReferrals: 47,
  level1Count: 23,
  level2Count: 18,
  level3Count: 6,
  totalEarnings: 12450,
  level1Earnings: 8540,
  level2Earnings: 2890,
  level3Earnings: 1020,
  pendingEarnings: 3700,
  withdrawableEarnings: 8750,
};

export const referrals: Referral[] = [
  { id: 'ref-1', referrerId: 'user-1', refereeId: 'ref-u1', referee: { ...currentUser, id: 'ref-u1', username: 'AmitKumar', avatar: 'A' }, level: 1, totalEarned: 1260, isQualifying: true, createdAt: new Date(Date.now() - 259200000) },
  { id: 'ref-2', referrerId: 'user-1', refereeId: 'ref-u2', referee: { ...currentUser, id: 'ref-u2', username: 'PriyaSharma', avatar: 'P' }, level: 1, totalEarned: 840, isQualifying: true, createdAt: new Date(Date.now() - 604800000) },
  { id: 'ref-3', referrerId: 'ref-u1', refereeId: 'ref-u3', referee: { ...currentUser, id: 'ref-u3', username: 'RajPatel', avatar: 'R' }, level: 2, totalEarned: 560, isQualifying: true, createdAt: new Date(Date.now() - 432000000) },
];

// Wallet data
export const walletData = {
  totalBalance: 12450,
  availableBalance: 10200,
  lockedBalance: 2250,
  balances: [
    { currency: 'USDT' as const, balance: 89.50, lockedBalance: 0, usdValue: 89.50 },
    { currency: 'CRIC' as const, balance: 7520, lockedBalance: 5420, usdValue: 60.16 },
    { currency: 'MATIC' as const, balance: 12.35, lockedBalance: 0, usdValue: 9.88 },
  ],
};

// Notifications
export const notifications: AppNotification[] = [
  { id: 'n1', type: 'prediction', icon: '🎉', title: 'You won ₹2,450!', description: 'Your RCB vs MI prediction settled — CSK to Win was correct.', isRead: false, actionUrl: '/predictions', createdAt: new Date(Date.now() - 7200000) },
  { id: 'n2', type: 'prediction', icon: '🔥', title: 'MI vs CSK is LIVE', description: 'Your active prediction is now in play. Track it live!', isRead: false, actionUrl: '/matches/match-1', createdAt: new Date(Date.now() - 3600000) },
  { id: 'n3', type: 'campaign', icon: '🎫', title: 'IPL Ticket Campaign', description: 'Only 3 referrals left to win a FREE IPL ticket!', isRead: false, actionUrl: '/campaigns', createdAt: new Date(Date.now() - 18000000) },
  { id: 'n4', type: 'wallet', icon: '💰', title: 'Deposit Confirmed', description: '₹5,000 deposited to your wallet via UPI.', isRead: true, actionUrl: '/wallet', createdAt: new Date(Date.now() - 86400000) },
  { id: 'n5', type: 'social', icon: '👥', title: 'New Referral Joined!', description: 'AmitKumar joined CricChain using your referral link.', isRead: true, actionUrl: '/referrals', createdAt: new Date(Date.now() - 259200000) },
  { id: 'n6', type: 'prediction', icon: '❌', title: 'Prediction Lost', description: 'SRH vs RR —your SRH to Win prediction did not come through.', isRead: true, actionUrl: '/predictions', createdAt: new Date(Date.now() - 172800000) },
  { id: 'n7', type: 'system', icon: '🪙', title: 'Staking Rewards', description: 'You earned 12.5 $CRIC from your active stake.', isRead: true, actionUrl: '/staking', createdAt: new Date(Date.now() - 345600000) },
  { id: 'n8', type: 'social', icon: '🏆', title: 'Rank Up!', description: 'You climbed 12 spots on the leaderboard this week!', isRead: true, actionUrl: '/leaderboard', createdAt: new Date(Date.now() - 432000000) },
  { id: 'n9', type: 'system', icon: '🔒', title: 'Security Alert', description: 'New login detected from Chrome on macOS.', isRead: true, createdAt: new Date(Date.now() - 518400000) },
  { id: 'n10', type: 'campaign', icon: '🎁', title: 'Welcome Bonus Claimed!', description: 'You claimed your 100% first deposit match bonus.', isRead: true, actionUrl: '/campaigns', createdAt: new Date(Date.now() - 604800000) },
  { id: 'n11', type: 'prediction', icon: '🎯', title: 'Prediction Placed', description: 'You placed ₹1,000 on CSK to Win @ 1.75 odds.', isRead: true, actionUrl: '/predictions', createdAt: new Date(Date.now() - 690000000) },
  { id: 'n12', type: 'wallet', icon: '💸', title: 'Withdrawal Processed', description: '₹10,000 withdrawn to your bank account.', isRead: true, actionUrl: '/wallet', createdAt: new Date(Date.now() - 864000000) },
];

// FAQ Items
export const faqItems: FAQItem[] = [
  { id: 'faq-1', question: 'What is CricChain?', answer: 'CricChain is the world\'s first decentralized cricket prediction platform powered by blockchain and AI. Users can make predictions on live cricket matches, earn rewards, stake $CRIC tokens, and participate in campaigns.', category: 'getting-started' },
  { id: 'faq-2', question: 'How do I make a prediction?', answer: 'Navigate to a match from the Matches page, select a market (e.g., Match Winner), choose your outcome, set your stake amount in the bet slip, and click "Place Prediction". Your prediction will be active once the transaction is confirmed on the Polygon blockchain.', category: 'predictions' },
  { id: 'faq-3', question: 'What currencies are supported?', answer: 'CricChain supports USDT, USDC, MATIC, and our native $CRIC token. You can deposit and withdraw using these currencies through the Polygon network.', category: 'wallet' },
  { id: 'faq-4', question: 'How does the referral program work?', answer: 'CricChain offers a 3-tier referral system: Level 1 (30% commission), Level 2 (10%), and Level 3 (5%). Share your unique referral link and earn commission on every prediction your referrals make.', category: 'referrals' },
  { id: 'faq-5', question: 'What is $CRIC token?', answer: '$CRIC is the native utility token of CricChain. Stake $CRIC to earn APY rewards (8-18%), get up to 80% fee discounts, access premium features, and participate in governance voting.', category: 'token' },
  { id: 'faq-6', question: 'How are predictions settled?', answer: 'Predictions are settled automatically using verified oracle data from official cricket scoring sources. Once a match is completed, all markets are resolved and payouts are distributed to winners within minutes.', category: 'predictions' },
  { id: 'faq-7', question: 'What fees does CricChain charge?', answer: 'CricChain charges a 2% platform fee on predictions. $CRIC stakers enjoy up to 80% discount on fees. There are no fees for deposits, and withdrawal fees are minimal gas costs on Polygon.', category: 'wallet' },
  { id: 'faq-8', question: 'Is CricChain safe and secure?', answer: 'Yes. CricChain is built on the Polygon blockchain ensuring transparency and immutability. All smart contracts are audited. We use Privy for secure authentication and never store your private keys.', category: 'security' },
  { id: 'faq-10', question: 'Can I cash out my prediction early?', answer: 'Yes! CricChain supports early cash-out on active predictions. The cash-out value is calculated based on current odds and market conditions. Navigate to My Predictions to see available cash-out options.', category: 'predictions' },
];

// Chains
export const chains: Chain[] = [
  { id: 'bitcoin', name: 'Bitcoin', shortName: 'BTC', icon: '₿', color: '#F7931A', explorerUrl: 'https://blockstream.info' },
  { id: 'ethereum', name: 'Ethereum', shortName: 'ETH', icon: 'Ξ', color: '#627EEA', explorerUrl: 'https://etherscan.io' },
  { id: 'polygon', name: 'Polygon', shortName: 'MATIC', icon: '⬡', color: '#8247E5', explorerUrl: 'https://polygonscan.com' },
  { id: 'solana', name: 'Solana', shortName: 'SOL', icon: '◎', color: '#9945FF', explorerUrl: 'https://solscan.io' },
  { id: 'tron', name: 'Tron', shortName: 'TRX', icon: '⟐', color: '#FF0013', explorerUrl: 'https://tronscan.org' },
  { id: 'base', name: 'Base', shortName: 'BASE', icon: '🔵', color: '#0052FF', explorerUrl: 'https://basescan.org' },
  { id: 'arbitrum', name: 'Arbitrum', shortName: 'ARB', icon: '🔷', color: '#28A0F0', explorerUrl: 'https://arbiscan.io' },
  { id: 'ton', name: 'TON', shortName: 'TON', icon: '💎', color: '#0098EA', explorerUrl: 'https://tonscan.org' },
  { id: 'bnb', name: 'BNB Chain', shortName: 'BNB', icon: '🔸', color: '#F3BA2F', explorerUrl: 'https://bscscan.com' },
];

// Deposit Assets (admin-controlled enabled/disabled)
export const depositAssets: DepositAsset[] = [
  { id: 'btc-bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿', chainId: 'bitcoin', decimals: 8, minDeposit: 0.0001, enabled: true },
  { id: 'eth-ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', chainId: 'ethereum', decimals: 18, minDeposit: 0.001, enabled: true },
  { id: 'usdt-ethereum', symbol: 'USDT', name: 'Tether', icon: '₮', chainId: 'ethereum', contractAddress: '0xdAC17F958...', decimals: 6, minDeposit: 10, enabled: true },
  { id: 'usdc-ethereum', symbol: 'USDC', name: 'USD Coin', icon: '$', chainId: 'ethereum', contractAddress: '0xA0b86991...', decimals: 6, minDeposit: 10, enabled: true },
  { id: 'matic-polygon', symbol: 'MATIC', name: 'Polygon', icon: '⬡', chainId: 'polygon', decimals: 18, minDeposit: 1, enabled: true },
  { id: 'usdt-polygon', symbol: 'USDT', name: 'Tether', icon: '₮', chainId: 'polygon', contractAddress: '0xc2132D05...', decimals: 6, minDeposit: 5, enabled: true },
  { id: 'usdc-polygon', symbol: 'USDC', name: 'USD Coin', icon: '$', chainId: 'polygon', contractAddress: '0x2791Bca1...', decimals: 6, minDeposit: 5, enabled: true },
  { id: 'sol-solana', symbol: 'SOL', name: 'Solana', icon: '◎', chainId: 'solana', decimals: 9, minDeposit: 0.01, enabled: true },
  { id: 'usdt-solana', symbol: 'USDT', name: 'Tether', icon: '₮', chainId: 'solana', contractAddress: 'Es9vMFrzaC...', decimals: 6, minDeposit: 5, enabled: true },
  { id: 'trx-tron', symbol: 'TRX', name: 'Tron', icon: '⟐', chainId: 'tron', decimals: 6, minDeposit: 10, enabled: true },
  { id: 'usdt-tron', symbol: 'USDT', name: 'Tether', icon: '₮', chainId: 'tron', contractAddress: 'TR7NHqjeK...', decimals: 6, minDeposit: 5, enabled: true },
  { id: 'eth-base', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', chainId: 'base', decimals: 18, minDeposit: 0.001, enabled: true },
  { id: 'usdc-base', symbol: 'USDC', name: 'USD Coin', icon: '$', chainId: 'base', contractAddress: '0x833589fCD...', decimals: 6, minDeposit: 5, enabled: true },
  { id: 'eth-arbitrum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', chainId: 'arbitrum', decimals: 18, minDeposit: 0.001, enabled: true },
  { id: 'usdt-arbitrum', symbol: 'USDT', name: 'Tether', icon: '₮', chainId: 'arbitrum', contractAddress: '0xFd086bC7C...', decimals: 6, minDeposit: 5, enabled: true },
  { id: 'ton-ton', symbol: 'TON', name: 'Toncoin', icon: '💎', chainId: 'ton', decimals: 9, minDeposit: 0.1, enabled: true },
  { id: 'usdt-ton', symbol: 'USDT', name: 'Tether', icon: '₮', chainId: 'ton', contractAddress: 'EQBynBO23...', decimals: 6, minDeposit: 5, enabled: false },
  { id: 'bnb-bnb', symbol: 'BNB', name: 'BNB', icon: '🔸', chainId: 'bnb', decimals: 18, minDeposit: 0.01, enabled: true },
  { id: 'usdt-bnb', symbol: 'USDT', name: 'Tether', icon: '₮', chainId: 'bnb', contractAddress: '0x55d398326...', decimals: 6, minDeposit: 5, enabled: true },
  { id: 'usdc-bnb', symbol: 'USDC', name: 'USD Coin', icon: '$', chainId: 'bnb', contractAddress: '0x8AC76a51...', decimals: 6, minDeposit: 5, enabled: false },
];

// Withdrawal Fees (crypto: 1% + network, fiat: 4-5% + TDS)
export const withdrawalFees: WithdrawalFeeConfig[] = [
  { assetId: 'btc-bitcoin', chainId: 'bitcoin', processingFeePercent: 1, networkFee: 0.0003, minWithdrawal: 0.001 },
  { assetId: 'eth-ethereum', chainId: 'ethereum', processingFeePercent: 1, networkFee: 0.005, minWithdrawal: 0.01 },
  { assetId: 'usdt-ethereum', chainId: 'ethereum', processingFeePercent: 1, networkFee: 5.0, minWithdrawal: 20 },
  { assetId: 'usdt-polygon', chainId: 'polygon', processingFeePercent: 1, networkFee: 0.5, minWithdrawal: 10 },
  { assetId: 'usdt-tron', chainId: 'tron', processingFeePercent: 1, networkFee: 1.0, minWithdrawal: 10 },
  { assetId: 'sol-solana', chainId: 'solana', processingFeePercent: 1, networkFee: 0.005, minWithdrawal: 0.1 },
  { assetId: 'usdt-solana', chainId: 'solana', processingFeePercent: 1, networkFee: 0.5, minWithdrawal: 10 },
  { assetId: 'eth-base', chainId: 'base', processingFeePercent: 1, networkFee: 0.001, minWithdrawal: 0.005 },
  { assetId: 'usdc-base', chainId: 'base', processingFeePercent: 1, networkFee: 0.3, minWithdrawal: 5 },
  { assetId: 'eth-arbitrum', chainId: 'arbitrum', processingFeePercent: 1, networkFee: 0.001, minWithdrawal: 0.005 },
  { assetId: 'ton-ton', chainId: 'ton', processingFeePercent: 1, networkFee: 0.01, minWithdrawal: 1 },
  { assetId: 'bnb-bnb', chainId: 'bnb', processingFeePercent: 1, networkFee: 0.002, minWithdrawal: 0.05 },
  { assetId: 'usdt-bnb', chainId: 'bnb', processingFeePercent: 1, networkFee: 0.5, minWithdrawal: 10 },
];

// Fiat withdrawal config
export const fiatWithdrawalConfig = {
  processingFeePercent: 4.5,
  tdsPercent: 30,
  tdsThreshold: 10000, // TDS applies above this amount (INR)
  minWithdrawal: 500, // INR
  maxWithdrawal: 500000, // INR
};

// Referral instant rewards
export const referralRewards: ReferralReward[] = [
  { id: 'rr1', refereeUsername: 'amit_kumar', predictionId: 'p-001', matchName: 'MI vs CSK', stakeAmount: 5000, rewardPercent: 2, rewardAmount: 100, createdAt: new Date(Date.now() - 1800000) },
  { id: 'rr2', refereeUsername: 'amit_kumar', predictionId: 'p-002', matchName: 'MI vs CSK', stakeAmount: 2000, rewardPercent: 2, rewardAmount: 40, createdAt: new Date(Date.now() - 3600000) },
  { id: 'rr3', refereeUsername: 'priya_sharma', predictionId: 'p-003', matchName: 'RCB vs KKR', stakeAmount: 3500, rewardPercent: 2, rewardAmount: 70, createdAt: new Date(Date.now() - 7200000) },
  { id: 'rr4', refereeUsername: 'raj_patel', predictionId: 'p-004', matchName: 'SRH vs RR', stakeAmount: 8000, rewardPercent: 2, rewardAmount: 160, createdAt: new Date(Date.now() - 14400000) },
  { id: 'rr5', refereeUsername: 'priya_sharma', predictionId: 'p-005', matchName: 'DC vs PBKS', stakeAmount: 1500, rewardPercent: 2, rewardAmount: 30, createdAt: new Date(Date.now() - 28800000) },
  { id: 'rr6', refereeUsername: 'neha_gupta', predictionId: 'p-006', matchName: 'MI vs RCB', stakeAmount: 10000, rewardPercent: 2, rewardAmount: 200, createdAt: new Date(Date.now() - 43200000) },
  { id: 'rr7', refereeUsername: 'deepak_r', predictionId: 'p-007', matchName: 'CSK vs RCB', stakeAmount: 4000, rewardPercent: 2, rewardAmount: 80, createdAt: new Date(Date.now() - 86400000) },
  { id: 'rr8', refereeUsername: 'amit_kumar', predictionId: 'p-008', matchName: 'GT vs LSG', stakeAmount: 6000, rewardPercent: 2, rewardAmount: 120, createdAt: new Date(Date.now() - 172800000) },
];
