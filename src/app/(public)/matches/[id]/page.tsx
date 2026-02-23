import { Metadata } from 'next';
import MatchDetailClient from './MatchDetailClient';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

async function getMatchData(id: string) {
    // In a real app, we might call an internal service or the database directly
    // For consistency with current patterns, we'll simulate the fetch or use the DB if available
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/matches/${id}`, {
            next: { revalidate: 60 }
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching match data for metadata:', error);
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const matchData = await getMatchData(id);

    if (!matchData?.data) {
        return {
            title: 'Match Not Found | CricChain',
        };
    }

    const match = matchData.data;
    const title = `${match.team1.name} vs ${match.team2.name} | CricChain`;
    const description = `Place your predictions on ${match.team1.name} vs ${match.team2.name} in the ${match.tournament.name}. High odds, decentralized platform.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            images: [
                {
                    url: `/api/matches/${id}/og`, // We'll point to an API or use the built-in opengraph-image.tsx
                    width: 1200,
                    height: 630,
                    alt: `${match.team1.name} vs ${match.team2.name}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const matchData = await getMatchData(id);

    if (!matchData?.data) {
        notFound();
    }

    return <MatchDetailClient initialData={matchData.data} matchId={id} />;
}
