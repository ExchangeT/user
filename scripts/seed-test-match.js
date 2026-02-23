const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Create Teams
    const mi = await prisma.team.upsert({
        where: { shortName: 'MI' },
        update: {},
        create: { name: 'Mumbai Indians', shortName: 'MI', logo: '/teams/mi.png', color: '#004BA0' }
    });

    const csk = await prisma.team.upsert({
        where: { shortName: 'CSK' },
        update: {},
        create: { name: 'Chennai Super Kings', shortName: 'CSK', logo: '/teams/csk.png', color: '#FFFF00' }
    });

    // 2. Create Tournament
    const ipl = await prisma.tournament.upsert({
        where: { shortName_season: { shortName: 'IPL', season: '2026' } },
        update: {},
        create: { name: 'Indian Premier League', shortName: 'IPL', season: '2026', logo: '/tournaments/ipl.png' }
    });

    // 3. Create Match
    const match = await prisma.match.create({
        data: {
            id: 'test-match-1',
            externalId: 'mock-1', // Matches the mock data in cricket-api.ts
            tournamentId: ipl.id,
            team1Id: mi.id,
            team2Id: csk.id,
            venue: 'Wankhede Stadium, Mumbai',
            startTime: new Date('2026-03-20T14:30:00Z'),
            status: 'UPCOMING',
            score: {}
        }
    });

    // 4. Create a Market
    const market = await prisma.market.create({
        data: {
            matchId: match.id,
            type: 'MATCH_WINNER',
            question: 'Who will win the match?',
            status: 'OPEN',
            openTime: new Date(),
            closeTime: new Date('2026-03-20T14:30:00Z'),
            outcomes: {
                create: [
                    { name: 'Mumbai Indians', odds: 1.95, probability: 51 },
                    { name: 'Chennai Super Kings', odds: 1.95, probability: 49 }
                ]
            }
        }
    });

    console.log('Seed completed!', { matchId: match.id, marketId: market.id });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
