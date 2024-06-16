'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const client = new QueryClient();

const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http('https://sepolia.drpc.org'),
    },
});

export const Providers: FC<PropsWithChildren> = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
};
