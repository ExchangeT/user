/**
 * Cricket API Integration Service
 * 
 * Primary: CricketData.org (free tier: 100 req/day)
 * Strategy: Fetch from API → Cache in PostgreSQL → Serve from DB
 * 
 * All data is cached with configurable TTL to minimize API calls.
 */

import { db as prisma } from './db';
import { pusherServer } from './pusher';

const CRICKET_API_BASE = 'https://api.cricapi.com/v1';
const CRICKET_API_KEY = process.env.CRICKET_API_KEY || '';

// Cache TTL in minutes
const CACHE_TTL = {
  LIVE_SCORES: 1,       // 1 minute for live scores
  MATCHES: 30,          // 30 minutes for match listings
  PLAYER_PROFILE: 1440, // 24 hours for player data
  NEWS: 60,             // 1 hour for news
  SERIES: 720,          // 12 hours for series data
};

// ==================== API FETCH HELPERS ====================

async function cricketApiFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${CRICKET_API_BASE}/${endpoint}`);
  url.searchParams.set('apikey', CRICKET_API_KEY);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  try {
    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Cricket API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (data.status !== 'success') {
      console.error('Cricket API returned error:', data.info);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Cricket API fetch error:', error);
    return null;
  }
}

// ==================== LIVE SCORES ====================

export async function fetchLiveScores() {
  // Check cache first
  const cached = await prisma.liveScoreCache.findMany({
    where: {
      status: 'live',
      lastUpdated: {
        gte: new Date(Date.now() - CACHE_TTL.LIVE_SCORES * 60 * 1000),
      },
    },
  });

  if (cached.length > 0) {
    return cached.map((c) => c.matchData);
  }

  // Fetch fresh data from API
  const data = await cricketApiFetch('currentMatches', { offset: '0' });
  if (!data) return getCachedLiveScores();

  // Update cache
  for (const match of data) {
    await prisma.liveScoreCache.upsert({
      where: { matchKey: match.id },
      update: {
        matchData: match,
        status: match.matchStarted && !match.matchEnded ? 'live' :
          match.matchEnded ? 'completed' : 'upcoming',
        lastUpdated: new Date(),
      },
      create: {
        matchKey: match.id,
        matchData: match,
        status: match.matchStarted && !match.matchEnded ? 'live' :
          match.matchEnded ? 'completed' : 'upcoming',
      },
    });
  }

  return data;
}

async function getCachedLiveScores() {
  const scores = await prisma.liveScoreCache.findMany({
    where: { status: { in: ['live', 'upcoming'] } },
    orderBy: { lastUpdated: 'desc' },
    take: 20,
  });
  return scores.map((s) => s.matchData);
}

// ==================== MATCHES ====================

export async function fetchUpcomingMatches() {
  const data = await cricketApiFetch('matches', { offset: '0' });
  if (!data) {
    // Return from our DB cache
    const matches = await prisma.match.findMany({
      where: { status: 'UPCOMING' },
      include: { team1: true, team2: true, tournament: true },
      orderBy: { startTime: 'asc' },
      take: 20,
    });
    return matches;
  }

  return data;
}

// ==================== PLAYER PROFILES ====================

export async function fetchPlayerProfile(playerId: string) {
  // Check cache
  const cached = await prisma.cricketerProfile.findUnique({
    where: { externalId: playerId },
  });

  if (cached && isWithinTTL(cached.lastSyncedAt, CACHE_TTL.PLAYER_PROFILE)) {
    return cached;
  }

  // Fetch from API
  const data = await cricketApiFetch('players_info', { id: playerId });
  if (!data) return cached;

  // Upsert into cache
  const profile = await prisma.cricketerProfile.upsert({
    where: { externalId: playerId },
    update: {
      name: data.name || cached?.name || '',
      fullName: data.fullName || data.name,
      nationality: data.country,
      imageUrl: data.playerImg,
      role: data.role,
      battingStyle: data.battingStyle,
      bowlingStyle: data.bowlingStyle,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      stats: data.stats,
      bio: data.bio,
      lastSyncedAt: new Date(),
    },
    create: {
      externalId: playerId,
      name: data.name || '',
      fullName: data.fullName || data.name,
      nationality: data.country,
      imageUrl: data.playerImg,
      role: data.role,
      battingStyle: data.battingStyle,
      bowlingStyle: data.bowlingStyle,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      stats: data.stats,
      bio: data.bio,
    },
  });

  return profile;
}

// ==================== CRICKET NEWS ====================

export async function fetchCricketNews() {
  // Check if we have recent news
  const recentNews = await prisma.cricketNews.findMany({
    where: {
      isActive: true,
      createdAt: {
        gte: new Date(Date.now() - CACHE_TTL.NEWS * 60 * 1000),
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });

  if (recentNews.length > 0) return recentNews;

  // Fetch from API
  const data = await cricketApiFetch('news', { offset: '0' });
  if (!data) {
    return prisma.cricketNews.findMany({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });
  }

  // Store news
  for (const item of data) {
    await prisma.cricketNews.upsert({
      where: { externalId: item.id || `news-${Date.now()}-${Math.random()}` },
      update: {
        title: item.title,
        summary: item.description,
        imageUrl: item.image,
        sourceUrl: item.url,
        sourceName: item.source,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      },
      create: {
        externalId: item.id || `news-${Date.now()}-${Math.random()}`,
        title: item.title,
        summary: item.description,
        imageUrl: item.image,
        sourceUrl: item.url,
        sourceName: item.source,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      },
    });
  }

  return prisma.cricketNews.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });
}

// ==================== SERIES ====================

export async function fetchCricketSeries() {
  const cached = await prisma.cricketSeries.findMany({
    orderBy: { startDate: 'desc' },
    take: 30,
  });

  if (cached.length > 0 && isWithinTTL(cached[0].lastSyncedAt, CACHE_TTL.SERIES)) {
    return cached;
  }

  const data = await cricketApiFetch('series', { offset: '0' });
  if (!data) return cached;

  for (const series of data) {
    await prisma.cricketSeries.upsert({
      where: { externalId: series.id },
      update: {
        name: series.name,
        startDate: series.startDate ? new Date(series.startDate) : undefined,
        endDate: series.endDate ? new Date(series.endDate) : undefined,
        category: series.category,
        lastSyncedAt: new Date(),
      },
      create: {
        externalId: series.id,
        name: series.name,
        startDate: series.startDate ? new Date(series.startDate) : undefined,
        endDate: series.endDate ? new Date(series.endDate) : undefined,
        category: series.category,
      },
    });
  }

  return prisma.cricketSeries.findMany({
    orderBy: { startDate: 'desc' },
    take: 30,
  });
}

// ==================== MASTER SYNC ====================

export async function syncAllCricketData() {
  const results = {
    liveScores: 0,
    news: 0,
    series: 0,
    errors: [] as string[],
  };

  try {
    const scores = await fetchLiveScores();
    results.liveScores = Array.isArray(scores) ? scores.length : 0;

    // Broadcast live score updates via Pusher
    if (Array.isArray(scores)) {
      for (const score of scores) {
        if (score.matchStarted && !score.matchEnded) {
          try {
            // Find internal match by external ID
            const internalMatch = await prisma.match.findUnique({
              where: { externalId: score.id },
              select: { id: true }
            });

            if (internalMatch) {
              await pusherServer.trigger(`match-${internalMatch.id}`, 'score-update', {
                id: score.id,
                name: score.name,
                status: score.status,
                score: score.score,
                lastUpdated: new Date()
              });
            }
          } catch (pe) {
            console.error('Pusher score broadcast failed for:', score.id, pe);
          }
        }
      }
    }
  } catch (e) {
    results.errors.push(`Live scores sync failed: ${e}`);
  }

  try {
    const news = await fetchCricketNews();
    results.news = Array.isArray(news) ? news.length : 0;
  } catch (e) {
    results.errors.push(`News sync failed: ${e}`);
  }

  try {
    const series = await fetchCricketSeries();
    results.series = Array.isArray(series) ? series.length : 0;
  } catch (e) {
    results.errors.push(`Series sync failed: ${e}`);
  }

  return results;
}

// ==================== HELPERS ====================

function isWithinTTL(lastSynced: Date, ttlMinutes: number): boolean {
  return (Date.now() - lastSynced.getTime()) < ttlMinutes * 60 * 1000;
}

// ==================== MOCK DATA FOR DEVELOPMENT ====================

export function getMockLiveScores() {
  return [
    {
      id: 'mock-1',
      name: 'Mumbai Indians vs Chennai Super Kings',
      matchType: 't20',
      status: 'MI 185/4 (18.2 ov) - Live',
      venue: 'Wankhede Stadium, Mumbai',
      teams: ['Mumbai Indians', 'Chennai Super Kings'],
      teamInfo: [
        { name: 'Mumbai Indians', shortname: 'MI', img: '/teams/mi.png' },
        { name: 'Chennai Super Kings', shortname: 'CSK', img: '/teams/csk.png' },
      ],
      score: [
        { r: 185, w: 4, o: 18.2, inning: 'Mumbai Indians Inning 1' },
        { r: 172, w: 6, o: 20, inning: 'Chennai Super Kings Inning 1' },
      ],
      matchStarted: true,
      matchEnded: false,
    },
    {
      id: 'mock-2',
      name: 'Royal Challengers Bengaluru vs Kolkata Knight Riders',
      matchType: 't20',
      status: 'RCB 92/2 (10.4 ov) - Live',
      venue: 'M. Chinnaswamy Stadium, Bengaluru',
      teams: ['Royal Challengers Bengaluru', 'Kolkata Knight Riders'],
      teamInfo: [
        { name: 'Royal Challengers Bengaluru', shortname: 'RCB', img: '/teams/rcb.png' },
        { name: 'Kolkata Knight Riders', shortname: 'KKR', img: '/teams/kkr.png' },
      ],
      score: [
        { r: 92, w: 2, o: 10.4, inning: 'RCB Inning 1' },
      ],
      matchStarted: true,
      matchEnded: false,
    },
    {
      id: 'mock-3',
      name: 'India vs Australia',
      matchType: 'test',
      status: 'Day 2 - IND 312/5 (88 ov)',
      venue: 'MCG, Melbourne',
      teams: ['India', 'Australia'],
      teamInfo: [
        { name: 'India', shortname: 'IND', img: '/teams/ind.png' },
        { name: 'Australia', shortname: 'AUS', img: '/teams/aus.png' },
      ],
      score: [
        { r: 312, w: 5, o: 88, inning: 'India Inning 1' },
        { r: 267, w: 10, o: 78.3, inning: 'Australia Inning 1' },
      ],
      matchStarted: true,
      matchEnded: false,
    },
  ];
}

export function getMockNews() {
  return [
    {
      id: 'news-1',
      title: 'IPL 2026: Full Schedule Announced — Season Starts March 20',
      summary: 'The BCCI has released the complete schedule for IPL 2026 with 74 matches across 10 venues. The tournament opener features defending champions KKR taking on MI.',
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600',
      publishedAt: new Date('2026-02-20'),
      category: 'IPL',
      sourceName: 'CricChain News',
    },
    {
      id: 'news-2',
      title: 'Virat Kohli Confirms Return to T20 Format for IPL 2026',
      summary: 'In a major boost for RCB fans, Virat Kohli has confirmed his availability for the upcoming IPL season after initially keeping his participation uncertain.',
      imageUrl: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600',
      publishedAt: new Date('2026-02-19'),
      category: 'IPL',
      sourceName: 'CricChain News',
    },
    {
      id: 'news-3',
      title: 'ICC T20 World Cup 2026: India Announces 15-Member Squad',
      summary: 'The BCCI has announced India\'s squad for the ICC T20 World Cup 2026. Suryakumar Yadav will lead the side with Hardik Pandya as vice-captain.',
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600',
      publishedAt: new Date('2026-02-18'),
      category: 'International',
      sourceName: 'CricChain News',
    },
    {
      id: 'news-4',
      title: 'CricChain Launches — World\'s First Decentralized Cricket Prediction Platform',
      summary: 'CricChain goes live with IPL 2026, offering blockchain-powered cricket predictions with multi-chain support across 9 networks.',
      imageUrl: 'https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?w=600',
      publishedAt: new Date('2026-02-22'),
      category: 'Platform',
      sourceName: 'CricChain',
    },
    {
      id: 'news-5',
      title: 'Big Bash League 2026: Sydney Thunder Win the Title',
      summary: 'Sydney Thunder clinched their second BBL title after a thrilling final against Perth Scorchers at the SCG.',
      imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600',
      publishedAt: new Date('2026-02-15'),
      category: 'BBL',
      sourceName: 'CricChain News',
    },
    {
      id: 'news-6',
      title: 'Pakistan Super League 2026: Live Scores and Updates on CricChain',
      summary: 'Follow all PSL 2026 matches live on CricChain with real-time scores, ball-by-ball updates, and prediction markets.',
      imageUrl: 'https://images.unsplash.com/photo-1567689265662-fbc9e4eb9c04?w=600',
      publishedAt: new Date('2026-02-17'),
      category: 'PSL',
      sourceName: 'CricChain News',
    },
  ];
}

export function getMockBanners() {
  return [
    {
      id: 'banner-1',
      title: 'IPL 2026 Is Here!',
      subtitle: 'Make predictions on every match. Win big with blockchain-powered payouts.',
      ctaText: 'Start Predicting',
      ctaLink: '/matches',
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&h=600&fit=crop',
      eventTag: 'IPL 2026',
      isActive: true,
      order: 0,
    },
    {
      id: 'banner-2',
      title: 'Welcome Bonus — Get ₹500 Free',
      subtitle: 'Sign up today and get ₹500 in prediction credits. No deposit required.',
      ctaText: 'Claim Now',
      ctaLink: '/auth/signup',
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1400&h=600&fit=crop',
      eventTag: 'Promotion',
      isActive: true,
      order: 1,
    },
    {
      id: 'banner-3',
      title: 'T20 World Cup 2026 Predictions',
      subtitle: 'Predict the world champion. 10x payout on underdogs.',
      ctaText: 'View Markets',
      ctaLink: '/matches?tournament=t20wc',
      imageUrl: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1400&h=600&fit=crop',
      eventTag: 'T20 World Cup',
      isActive: true,
      order: 2,
    },
  ];
}
