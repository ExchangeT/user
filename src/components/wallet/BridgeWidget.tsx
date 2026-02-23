'use client';

import { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { Loader2, ExternalLink } from 'lucide-react';

export default function BridgeWidget() {
    const [isLoading, setIsLoading] = useState(true);

    // Li.Fi widget URL - can be customized with integrator name and swap destination
    const widgetUrl = "https://li.fi/widget/?fromChain=1&toChain=137&toToken=0xc2132d05d31c914a87c6611c10748aeb04b58e8f";

    return (
        <Card className="border-[#f4c430]/20 bg-gradient-to-br from-[#1a2235] to-[#f4c430]/5 overflow-hidden">
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg">Cross-Chain Bridge</h3>
                    <p className="text-xs text-[#94a3b8]">Deposit from any chain (ETH, SOL, Base) to Polygon USDT</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => window.open(widgetUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-1" /> Open Full
                </Button>
            </div>
            <CardContent className="p-0 relative min-h-[500px]">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0e17]/80 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-[#f4c430] mb-2" />
                        <p className="text-sm text-[#94a3b8]">Loading Bridge Interface...</p>
                    </div>
                )}
                <iframe
                    src={widgetUrl}
                    className="w-full h-[600px] border-none"
                    onLoad={() => setIsLoading(false)}
                    title="LI.FI Widget"
                    allow="clipboard-read; clipboard-write; trust-token; payment"
                />
            </CardContent>
            <div className="p-4 bg-[#0a0e17]/50 text-[10px] text-[#64748b] text-center border-t border-white/[0.06]">
                Security powered by Li.Fi • Quotes are sourced from 20+ Bridges & 30+ DEXs
            </div>
        </Card>
    );
}
