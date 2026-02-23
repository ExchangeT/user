import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroBanner from '@/components/landing/HeroBanner';
import LiveScoresTicker from '@/components/landing/LiveScoresTicker';
import FeaturedMatches from '@/components/landing/FeaturedMatches';
import HowItWorks from '@/components/landing/HowItWorks';
import PlatformStats from '@/components/landing/PlatformStats';
import TrendingMarkets from '@/components/landing/TrendingMarkets';
import CricketNewsSection from '@/components/landing/CricketNewsSection';
import TournamentsSection from '@/components/landing/TournamentsSection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0a0e17]">
            <LandingNavbar />
            <HeroBanner />
            <LiveScoresTicker />
            <FeaturedMatches />
            <HowItWorks />
            <PlatformStats />
            <TrendingMarkets />
            <CricketNewsSection />
            <TournamentsSection />
            <LandingFooter />
        </main>
    );
}
