import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    bsc,
    localhost,
} from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '118df262ce40fc2097e3ae3de15c43d5';

export const wagmiConfig = getDefaultConfig({
    appName: 'CricChain',
    projectId: projectId,
    chains: [localhost, polygon, bsc, mainnet, optimism, arbitrum, base],
    ssr: true, // If using Next.js 13+ App router
});
