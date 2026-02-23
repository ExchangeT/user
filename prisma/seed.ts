import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ==================== CHAINS ====================
    const chains = await Promise.all([
        prisma.chain.upsert({ where: { shortName: 'BTC' }, update: {}, create: { name: 'Bitcoin', shortName: 'BTC', icon: '₿', color: '#F7931A', explorerUrl: 'https://blockstream.info' } }),
        prisma.chain.upsert({ where: { shortName: 'ETH' }, update: {}, create: { name: 'Ethereum', shortName: 'ETH', icon: 'Ξ', color: '#627EEA', explorerUrl: 'https://etherscan.io' } }),
        prisma.chain.upsert({ where: { shortName: 'MATIC' }, update: {}, create: { name: 'Polygon', shortName: 'MATIC', icon: '⬡', color: '#8247E5', explorerUrl: 'https://polygonscan.com' } }),
        prisma.chain.upsert({ where: { shortName: 'SOL' }, update: {}, create: { name: 'Solana', shortName: 'SOL', icon: '◎', color: '#9945FF', explorerUrl: 'https://solscan.io' } }),
        prisma.chain.upsert({ where: { shortName: 'TRX' }, update: {}, create: { name: 'Tron', shortName: 'TRX', icon: '⟐', color: '#FF0013', explorerUrl: 'https://tronscan.org' } }),
        prisma.chain.upsert({ where: { shortName: 'BASE' }, update: {}, create: { name: 'Base', shortName: 'BASE', icon: '🔵', color: '#0052FF', explorerUrl: 'https://basescan.org' } }),
        prisma.chain.upsert({ where: { shortName: 'ARB' }, update: {}, create: { name: 'Arbitrum', shortName: 'ARB', icon: '🔷', color: '#28A0F0', explorerUrl: 'https://arbiscan.io' } }),
        prisma.chain.upsert({ where: { shortName: 'TON' }, update: {}, create: { name: 'TON', shortName: 'TON', icon: '💎', color: '#0098EA', explorerUrl: 'https://tonscan.org' } }),
        prisma.chain.upsert({ where: { shortName: 'BNB' }, update: {}, create: { name: 'BNB Chain', shortName: 'BNB', icon: '🔸', color: '#F3BA2F', explorerUrl: 'https://bscscan.com' } }),
    ]);
    console.log(`✅ ${chains.length} chains seeded`);

    // ==================== DEPOSIT ASSETS ====================
    const ethChain = chains.find(c => c.shortName === 'ETH')!;
    const polyChain = chains.find(c => c.shortName === 'MATIC')!;
    const tronChain = chains.find(c => c.shortName === 'TRX')!;
    const solChain = chains.find(c => c.shortName === 'SOL')!;
    const bnbChain = chains.find(c => c.shortName === 'BNB')!;

    const assets = [
        { symbol: 'BTC', name: 'Bitcoin', chainId: chains[0].id, decimals: 8, minDeposit: 0.0001 },
        { symbol: 'ETH', name: 'Ethereum', chainId: ethChain.id, decimals: 18, minDeposit: 0.001 },
        { symbol: 'USDT', name: 'Tether (ERC-20)', chainId: ethChain.id, decimals: 6, minDeposit: 10 },
        { symbol: 'USDC', name: 'USD Coin (ERC-20)', chainId: ethChain.id, decimals: 6, minDeposit: 10 },
        { symbol: 'USDT', name: 'Tether (Polygon)', chainId: polyChain.id, decimals: 6, minDeposit: 5 },
        { symbol: 'USDT', name: 'Tether (TRC-20)', chainId: tronChain.id, decimals: 6, minDeposit: 5 },
        { symbol: 'SOL', name: 'Solana', chainId: solChain.id, decimals: 9, minDeposit: 0.01 },
        { symbol: 'USDT', name: 'Tether (BEP-20)', chainId: bnbChain.id, decimals: 18, minDeposit: 5 },
        { symbol: 'BNB', name: 'BNB', chainId: bnbChain.id, decimals: 18, minDeposit: 0.01 },
    ];
    for (const a of assets) {
        await prisma.depositAsset.upsert({
            where: { symbol_chainId: { symbol: a.symbol, chainId: a.chainId } },
            update: {},
            create: a,
        });
    }
    console.log(`✅ ${assets.length} deposit assets seeded`);

    // ==================== WITHDRAWAL FEE CONFIGS ====================
    const fees = [
        { chainId: chains[0].id, assetSymbol: 'BTC', processingFeePercent: 1, networkFee: 0.0003, minWithdrawal: 0.001 },
        { chainId: ethChain.id, assetSymbol: 'ETH', processingFeePercent: 1, networkFee: 0.005, minWithdrawal: 0.01 },
        { chainId: ethChain.id, assetSymbol: 'USDT', processingFeePercent: 1, networkFee: 5.0, minWithdrawal: 20 },
        { chainId: polyChain.id, assetSymbol: 'USDT', processingFeePercent: 1, networkFee: 0.5, minWithdrawal: 10 },
        { chainId: tronChain.id, assetSymbol: 'USDT', processingFeePercent: 1, networkFee: 1.0, minWithdrawal: 10 },
        { chainId: solChain.id, assetSymbol: 'SOL', processingFeePercent: 1, networkFee: 0.005, minWithdrawal: 0.1 },
        { chainId: bnbChain.id, assetSymbol: 'BNB', processingFeePercent: 1, networkFee: 0.002, minWithdrawal: 0.05 },
    ];
    for (const f of fees) {
        await prisma.withdrawalFeeConfig.upsert({
            where: { chainId_assetSymbol: { chainId: f.chainId, assetSymbol: f.assetSymbol } },
            update: {},
            create: f,
        });
    }
    console.log(`✅ ${fees.length} withdrawal fee configs seeded`);

    // ==================== PLATFORM SETTINGS ====================
    const settings = [
        { key: 'platform_fee_percent', value: '2', type: 'number' },
        { key: 'crypto_processing_fee_percent', value: '1', type: 'number' },
        { key: 'fiat_processing_fee_percent', value: '4.5', type: 'number' },
        { key: 'tds_percent', value: '30', type: 'number' },
        { key: 'tds_threshold', value: '10000', type: 'number' },
        { key: 'referral_l1_percent', value: '30', type: 'number' },
        { key: 'referral_l2_percent', value: '10', type: 'number' },
        { key: 'referral_l3_percent', value: '5', type: 'number' },
        { key: 'instant_reward_percent', value: '2', type: 'number' },
        { key: 'min_prediction_amount', value: '100', type: 'number' },
        { key: 'max_prediction_amount', value: '500000', type: 'number' },
        { key: 'staking_apy_30', value: '8', type: 'number' },
        { key: 'staking_apy_365', value: '18', type: 'number' },
        { key: 'feature_live_predictions', value: 'true', type: 'boolean' },
        { key: 'feature_referral_program', value: 'true', type: 'boolean' },
        { key: 'feature_staking', value: 'true', type: 'boolean' },
        { key: 'feature_fiat_deposits', value: 'true', type: 'boolean' },
        { key: 'maintenance_mode', value: 'false', type: 'boolean' },
    ];
    for (const s of settings) {
        await prisma.platformSetting.upsert({
            where: { key: s.key },
            update: {},
            create: s,
        });
    }
    console.log(`✅ ${settings.length} platform settings seeded`);

    // ==================== ADMIN USER ====================
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@cricchain.io' },
        update: {},
        create: {
            email: 'admin@cricchain.io',
            username: 'admin',
            name: 'CricChain Admin',
            passwordHash: adminPassword,
            role: 'SUPER_ADMIN',
            tier: 'PLATINUM',
            wallet: {
                create: {
                    totalBalance: 0,
                    balances: { create: [{ currency: 'USDT', balance: 0 }, { currency: 'CRIC', balance: 0 }] },
                },
            },
        },
    });
    console.log(`✅ Admin user seeded: admin@cricchain.io`);

    // ==================== DEMO USER ====================
    const demoPassword = await bcrypt.hash('demo1234', 12);
    const demo = await prisma.user.upsert({
        where: { email: 'demo@cricchain.io' },
        update: {},
        create: {
            email: 'demo@cricchain.io',
            username: 'demo_user',
            name: 'Demo User',
            passwordHash: demoPassword,
            role: 'USER',
            tier: 'GOLD',
            totalPredictions: 47,
            wins: 28,
            losses: 19,
            totalWinnings: 234000,
            netProfit: 89000,
            currentStreak: 3,
            bestStreak: 7,
            wallet: {
                create: {
                    totalBalance: 15000,
                    availableBalance: 15000,
                    balances: {
                        create: [
                            { currency: 'USDT', balance: 12000 },
                            { currency: 'CRIC', balance: 3000 },
                        ],
                    },
                },
            },
        },
    });
    console.log(`✅ Demo user seeded: demo@cricchain.io`);

    // ==================== TEAMS ====================
    const teams = await Promise.all([
        prisma.team.upsert({ where: { shortName: 'MI' }, update: {}, create: { name: 'Mumbai Indians', shortName: 'MI', logo: '🔵', color: '#004BA0' } }),
        prisma.team.upsert({ where: { shortName: 'CSK' }, update: {}, create: { name: 'Chennai Super Kings', shortName: 'CSK', logo: '🦁', color: '#FFCE00' } }),
        prisma.team.upsert({ where: { shortName: 'RCB' }, update: {}, create: { name: 'Royal Challengers Bengaluru', shortName: 'RCB', logo: '🔴', color: '#EC1C24' } }),
        prisma.team.upsert({ where: { shortName: 'KKR' }, update: {}, create: { name: 'Kolkata Knight Riders', shortName: 'KKR', logo: '💜', color: '#3A225D' } }),
        prisma.team.upsert({ where: { shortName: 'DC' }, update: {}, create: { name: 'Delhi Capitals', shortName: 'DC', logo: '🏛️', color: '#0078BC' } }),
        prisma.team.upsert({ where: { shortName: 'GT' }, update: {}, create: { name: 'Gujarat Titans', shortName: 'GT', logo: '🛡️', color: '#1B2133' } }),
        prisma.team.upsert({ where: { shortName: 'SRH' }, update: {}, create: { name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: '🌅', color: '#FF822A' } }),
        prisma.team.upsert({ where: { shortName: 'RR' }, update: {}, create: { name: 'Rajasthan Royals', shortName: 'RR', logo: '👑', color: '#EA1A85' } }),
        prisma.team.upsert({ where: { shortName: 'PBKS' }, update: {}, create: { name: 'Punjab Kings', shortName: 'PBKS', logo: '🦁', color: '#ED1B24' } }),
        prisma.team.upsert({ where: { shortName: 'LSG' }, update: {}, create: { name: 'Lucknow Super Giants', shortName: 'LSG', logo: '🦁', color: '#A72056' } }),
    ]);
    console.log(`✅ ${teams.length} teams seeded`);

    // ==================== TOURNAMENT ====================
    const ipl = await prisma.tournament.upsert({
        where: { shortName_season: { shortName: 'IPL', season: '2026' } },
        update: {},
        create: { name: 'Indian Premier League', shortName: 'IPL', season: '2026', logo: '🏆' },
    });
    console.log(`✅ Tournament seeded: IPL 2026`);

    // ==================== MATCHES ====================
    const mi = teams.find(t => t.shortName === 'MI')!;
    const csk = teams.find(t => t.shortName === 'CSK')!;
    const rcb = teams.find(t => t.shortName === 'RCB')!;
    const kkr = teams.find(t => t.shortName === 'KKR')!;
    const dc = teams.find(t => t.shortName === 'DC')!;

    const match1 = await prisma.match.create({
        data: {
            tournamentId: ipl.id,
            team1Id: mi.id,
            team2Id: csk.id,
            venue: 'Wankhede Stadium, Mumbai',
            startTime: new Date(Date.now() - 3600000), // Started 1h ago
            status: 'LIVE',
            poolSize: 450000,
            totalPredictions: 1247,
            score: { team1Score: '186/4', team2Score: '120/3', team1Overs: '20.0', team2Overs: '14.2', currentInnings: 2, battingTeam: 'CSK' },
            markets: {
                create: [
                    {
                        type: 'MATCH_WINNER',
                        question: 'Who will win?',
                        status: 'LIVE',
                        totalVolume: 320000,
                        openTime: new Date(Date.now() - 7200000),
                        closeTime: new Date(Date.now() + 3600000),
                        outcomes: {
                            create: [
                                { name: 'Mumbai Indians', odds: 1.45, probability: 65, trend: 'UP', volume: 208000 },
                                { name: 'Chennai Super Kings', odds: 2.75, probability: 35, trend: 'DOWN', volume: 112000 },
                            ],
                        },
                    },
                    {
                        type: 'HIGHEST_SCORER',
                        question: 'Who will be the highest scorer?',
                        status: 'LIVE',
                        totalVolume: 89000,
                        openTime: new Date(Date.now() - 7200000),
                        closeTime: new Date(Date.now() + 3600000),
                        outcomes: {
                            create: [
                                { name: 'Rohit Sharma', odds: 3.50, probability: 28, trend: 'UP', volume: 25000 },
                                { name: 'MS Dhoni', odds: 4.00, probability: 22, trend: 'STABLE', volume: 20000 },
                                { name: 'Suryakumar Yadav', odds: 3.80, probability: 25, trend: 'DOWN', volume: 22000 },
                                { name: 'Ruturaj Gaikwad', odds: 5.00, probability: 18, trend: 'UP', volume: 15000 },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const match2 = await prisma.match.create({
        data: {
            tournamentId: ipl.id,
            team1Id: rcb.id,
            team2Id: kkr.id,
            venue: 'M. Chinnaswamy Stadium, Bengaluru',
            startTime: new Date(Date.now() + 86400000), // Tomorrow
            status: 'UPCOMING',
            markets: {
                create: [
                    {
                        type: 'MATCH_WINNER',
                        question: 'Who will win?',
                        status: 'OPEN',
                        totalVolume: 0,
                        openTime: new Date(),
                        closeTime: new Date(Date.now() + 86400000),
                        outcomes: {
                            create: [
                                { name: 'Royal Challengers Bengaluru', odds: 1.80, probability: 52 },
                                { name: 'Kolkata Knight Riders', odds: 2.10, probability: 48 },
                            ],
                        },
                    },
                    {
                        type: 'TOSS_WINNER',
                        question: 'Who will win the toss?',
                        status: 'OPEN',
                        totalVolume: 0,
                        openTime: new Date(),
                        closeTime: new Date(Date.now() + 86400000),
                        outcomes: {
                            create: [
                                { name: 'RCB', odds: 2.00, probability: 50 },
                                { name: 'KKR', odds: 2.00, probability: 50 },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const match3 = await prisma.match.create({
        data: {
            tournamentId: ipl.id,
            team1Id: dc.id,
            team2Id: mi.id,
            venue: 'Arun Jaitley Stadium, Delhi',
            startTime: new Date(Date.now() + 172800000), // Day after tomorrow
            status: 'UPCOMING',
            markets: {
                create: [{
                    type: 'MATCH_WINNER',
                    question: 'Who will win?',
                    status: 'OPEN',
                    totalVolume: 0,
                    openTime: new Date(),
                    closeTime: new Date(Date.now() + 172800000),
                    outcomes: {
                        create: [
                            { name: 'Delhi Capitals', odds: 2.20, probability: 45 },
                            { name: 'Mumbai Indians', odds: 1.70, probability: 55 },
                        ],
                    },
                }],
            },
        },
    });

    console.log(`✅ 3 matches seeded with markets and outcomes`);

    // ==================== CAMPAIGNS ====================
    await prisma.campaign.createMany({
        data: [
            {
                title: 'IPL Opening Week Bonus',
                description: 'Place 5 predictions in the first week and get ₹500 bonus!',
                type: 'WEEKLY',
                status: 'LIVE',
                startDate: new Date(),
                endDate: new Date(Date.now() + 604800000),
                prizePool: 50000,
            },
            {
                title: 'Refer & Earn 2x',
                description: 'Double referral rewards for the first 100 referrals this season.',
                type: 'SEASONAL',
                status: 'LIVE',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7776000000),
                prizePool: 200000,
            },
        ],
        skipDuplicates: true,
    });
    console.log(`✅ 2 campaigns seeded`);

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📧 Admin: admin@cricchain.io / admin123');
    console.log('📧 Demo:  demo@cricchain.io / demo1234');
}

main()
    .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
