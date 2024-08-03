'use client';
import { FC, PropsWithChildren } from 'react';
import { WagmiProvider } from './wagmi-provider';
import { QueryClientProvider } from './query-client';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
    return (
        <WagmiProvider>
            <QueryClientProvider>{children}</QueryClientProvider>
        </WagmiProvider>
    );
};
