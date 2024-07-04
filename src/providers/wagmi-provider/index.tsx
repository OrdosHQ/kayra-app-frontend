'use client';
import { injected } from '@wagmi/core';
import { FC, PropsWithChildren } from 'react';
import { WagmiProvider as LWagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    },
    // connectors: [
    //     injected({
    //         shimDisconnect: false,
    //         target: {
    //             id: 'Keplr',
    //             name: 'Keplr Wallet',
    //             provider: window?.keplr.ethereum,
    //         },
    //     }),
    // ],
});

export const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
    return <LWagmiProvider config={config}>{children}</LWagmiProvider>;
};
