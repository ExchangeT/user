import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

interface MatchCardProps {
    match: any; // Using any for rapid prototyping, best practice is to import Prisma types
}

export function MatchCard({ match }: MatchCardProps) {
    const isLive = match.status === 'LIVE';
    const isCompleted = match.status === 'COMPLETED';

    return (
        <Link href={`/matches/${match.id}`} className="block group h-full">
            <div className="bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl p-6 hover:bg-cc-bg-card/60 hover:border-cc-gold/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(244,196,48,0.1)] transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-between group">

                {/* Background Glow when Live */}
                {isLive && (
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-cc-red/10 blur-[50px] rounded-full pointer-events-none animate-pulse" />
                )}

                <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-cc-gold uppercase tracking-widest bg-cc-gold/5 px-2 py-0.5 rounded border border-cc-gold/20 inline-block w-fit">{match.tournament.name}</span>
                            <span className="text-xs font-bold text-cc-text-muted flex items-center gap-1.5 uppercase tracking-wide">
                                📍 {match.venue || 'TBA'}
                            </span>
                        </div>
                        <Badge variant={isLive ? 'red' : isCompleted ? 'blue' : 'gold'} className={`${isLive ? 'animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'shadow-sm'} text-[10px] font-black px-2.5 py-1 tracking-widest`}>
                            {match.status}
                        </Badge>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-3 w-[30%]">
                            <div className="w-16 h-16 rounded-2xl bg-cc-bg-primary/80 border border-cc-border-subtle p-2 flex items-center justify-center relative shadow-inner overflow-hidden group-hover:border-cc-gold/30 group-hover:shadow-[0_0_15px_rgba(244,196,48,0.1)] transition-all duration-300">
                                {match.team1.logoUrl ? (
                                    <Image src={match.team1.logoUrl} alt={match.team1.code} fill className="object-contain p-2 drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <span className="font-extrabold text-cc-text-muted text-sm tracking-wider">{match.team1.code}</span>
                                )}
                            </div>
                            <span className="font-extrabold text-white text-center text-sm md:text-base leading-tight tracking-tight line-clamp-2">{match.team1.name}</span>
                        </div>

                        {/* VS */}
                        <div className="flex flex-col items-center justify-center w-[40%] px-2">
                            <span className="text-[10px] font-black text-cc-text-subtle mb-3 uppercase tracking-[0.2em] bg-cc-bg-primary/50 px-3 py-1 rounded-full border border-cc-border-subtle/50">VS</span>
                            {!isCompleted ? (
                                match.status === 'UPCOMING' ? (
                                    <div className="flex flex-col items-center">
                                        <CountdownTimer
                                            targetDate={match.startTime}
                                            className="text-xs font-mono font-bold bg-cc-bg-elevated/50 backdrop-blur-sm text-cc-text-secondary px-3 py-1.5 rounded-xl border border-cc-border-light whitespace-nowrap shadow-inner"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-xs font-mono font-bold bg-cc-bg-elevated/50 backdrop-blur-sm text-cc-text-secondary px-3 py-1.5 rounded-xl border border-cc-border-light whitespace-nowrap shadow-inner">
                                        {format(new Date(match.startTime), 'MMM d, h:mm a')}
                                    </span>
                                )
                            ) : (
                                <span className="text-sm font-black text-cc-gold uppercase tracking-widest drop-shadow-md">
                                    Finished
                                </span>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center gap-3 w-[30%]">
                            <div className="w-16 h-16 rounded-2xl bg-cc-bg-primary/80 border border-cc-border-subtle p-2 flex items-center justify-center relative shadow-inner overflow-hidden group-hover:border-cc-gold/30 group-hover:shadow-[0_0_15px_rgba(244,196,48,0.1)] transition-all duration-300">
                                {match.team2.logoUrl ? (
                                    <Image src={match.team2.logoUrl} alt={match.team2.code} fill className="object-contain p-2 drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <span className="font-extrabold text-cc-text-muted text-sm tracking-wider">{match.team2.code}</span>
                                )}
                            </div>
                            <span className="font-extrabold text-white text-center text-sm md:text-base leading-tight tracking-tight line-clamp-2">{match.team2.name}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="pt-4 border-t border-cc-border-subtle/50 flex justify-between items-center bg-black/10 -mx-6 -mb-6 px-6 py-4 mt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-cc-text-subtle font-bold uppercase tracking-widest mb-0.5">Markets</span>
                        <span className="text-sm font-bold text-white leading-none">{match._count?.markets || 0}</span>
                    </div>

                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-cc-text-subtle font-bold uppercase tracking-widest mb-0.5">Predictions</span>
                        <span className="text-sm font-bold text-cc-gold leading-none drop-shadow-[0_0_5px_rgba(244,196,48,0.5)]">{match._count?.predictions || 0}</span>
                    </div>
                </div>

            </div>
        </Link>
    );
}
