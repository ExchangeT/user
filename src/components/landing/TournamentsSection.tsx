'use client';

const tournaments = [
    { name: 'Indian Premier League', short: 'IPL', color: '#1E3A8A', active: true },
    { name: 'ICC T20 World Cup', short: 'T20 WC', color: '#1C6BB8', active: true },
    { name: 'Big Bash League', short: 'BBL', color: '#00A88E', active: true },
    { name: 'Pakistan Super League', short: 'PSL', color: '#00A651', active: true },
    { name: 'Caribbean Premier League', short: 'CPL', color: '#E31837', active: true },
    { name: 'SA20', short: 'SA20', color: '#008C45', active: true },
    { name: 'The Hundred', short: '100', color: '#FF6B2B', active: true },
    { name: 'Lanka Premier League', short: 'LPL', color: '#741B47', active: true },
    { name: 'ICC Champions Trophy', short: 'CT', color: '#1C6BB8', active: true },
    { name: 'County Championship', short: 'CC', color: '#1B365D', active: false },
    { name: 'Ranji Trophy', short: 'RT', color: '#003F87', active: false },
    { name: 'Bangladesh Premier League', short: 'BPL', color: '#006B3F', active: true },
];

export default function TournamentsSection() {
    return (
        <section id="tournaments" className="py-16 sm:py-24 bg-[#111827] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cc-blue/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cc-gold/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Global <span className="gradient-text">Coverage</span>
                    </h2>
                    <p className="text-cc-text-muted text-lg sm:text-xl max-w-2xl mx-auto font-medium">
                        From IPL to T20 World Cup, BBL to CPL — we cover cricket leagues and tournaments from around the world
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {tournaments.map((t, i) => (
                        <div
                            key={i}
                            className="group relative bg-cc-bg-card/40 backdrop-blur-md border border-cc-border-subtle rounded-3xl p-5 text-center hover:bg-cc-bg-card hover:border-cc-gold/30 transition-all cursor-pointer overflow-hidden hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),0_0_15px_rgba(244,196,48,0.1)] transform hover:-translate-y-1 duration-300"
                        >
                            {/* Gradient glow on hover */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                style={{ background: `radial-gradient(circle at center, ${t.color}, transparent 70%)` }}
                            />

                            <div
                                className="relative w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-extrabold text-lg shadow-lg transition-transform group-hover:scale-110 duration-500"
                                style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}BB)`, boxShadow: `0 10px 20px ${t.color}40` }}
                            >
                                {t.short}
                            </div>

                            <p className="relative text-sm font-bold text-white mb-2 leading-tight drop-shadow-md">{t.name}</p>

                            {t.active ? (
                                <span className="relative inline-flex items-center justify-center gap-1.5 text-[10px] font-black text-cc-green bg-cc-green/10 px-3 py-1 rounded-full uppercase tracking-widest border border-cc-green/20">
                                    <span className="w-1.5 h-1.5 bg-cc-green rounded-full animate-pulse shadow-[0_0_5px_#10b981]" /> Active
                                </span>
                            ) : (
                                <span className="relative inline-flex items-center justify-center text-[10px] font-black text-cc-text-subtle bg-cc-bg-primary/50 px-3 py-1 rounded-full uppercase tracking-widest border border-cc-border-subtle">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
