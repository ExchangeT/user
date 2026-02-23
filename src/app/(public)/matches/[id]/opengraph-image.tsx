import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Match Prediction on CricChain';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch match data for the image
    let match;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/matches/${id}`);
        const data = await res.json();
        match = data.data;
    } catch (e) {
        console.error("OG Image Fetch Error:", e);
    }

    if (!match) {
        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0e17',
                    color: 'white',
                }}>
                    <h1 style={{ fontSize: 60, fontWeight: 'bold' }}>CricChain</h1>
                    <p style={{ fontSize: 30, color: '#94a3b8' }}>Dynamic Cricket Predictions</p>
                </div>
            ),
            { ...size }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0e17',
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #1e273c 0%, #0a0e17 100%)',
                    padding: '60px',
                    position: 'relative'
                }}
            >
                {/* Brand Header */}
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '60px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#f4c430',
                        marginRight: '12px'
                    }} />
                    <span style={{ fontSize: 24, fontWeight: '900', color: 'white', letterSpacing: '1px' }}>CRICCHAIN</span>
                </div>

                {/* Match Info Badge */}
                <div style={{
                    backgroundColor: match.status === 'LIVE' ? '#ef4444' : '#f4c430',
                    padding: '8px 24px',
                    borderRadius: '50px',
                    color: match.status === 'LIVE' ? 'white' : '#0a0e17',
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: '40px',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                    {match.status} {match.status === 'LIVE' ? 'NOW' : ''}
                </div>

                {/* Teams Container */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    gap: '40px'
                }}>
                    {/* Team 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div style={{
                            width: '180px',
                            height: '180px',
                            backgroundColor: '#1a2235',
                            borderRadius: '32px',
                            border: '4px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: 60, fontWeight: '900', color: '#94a3b8' }}>{match.team1.code}</span>
                        </div>
                        <span style={{ fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>{match.team1.name}</span>
                    </div>

                    {/* VS */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 40px' }}>
                        <span style={{ fontSize: 24, fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>VS</span>
                        <div style={{ width: '60px', height: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    {/* Team 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div style={{
                            width: '180px',
                            height: '180px',
                            backgroundColor: '#1a2235',
                            borderRadius: '32px',
                            border: '4px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: 60, fontWeight: '900', color: '#94a3b8' }}>{match.team2.code}</span>
                        </div>
                        <span style={{ fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>{match.team2.name}</span>
                    </div>
                </div>

                {/* Footer Info */}
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: 20, color: '#64748b' }}>
                        {match.tournament.name} • {match.venue || 'Global Stadium'}
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
