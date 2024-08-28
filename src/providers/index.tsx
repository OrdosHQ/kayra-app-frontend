'use client';
import { FC, PropsWithChildren } from 'react';
import { WagmiProvider } from './wagmi-provider';
import { QueryClientProvider } from './query-client';
import { SentryProvider } from './sentry';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
    return (
        <QueryClientProvider>
            <WagmiProvider>
                <SentryProvider>{children}</SentryProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
};
