'use client';
import { FC, PropsWithChildren } from 'react';
import { WagmiProvider as LWagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask } from '@wagmi/connectors';

const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    },
    connectors: [metaMask()],
});

export const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
    return <LWagmiProvider config={config}>{children}</LWagmiProvider>;
};
