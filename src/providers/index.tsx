'use client';
import { FC, PropsWithChildren } from 'react';
import { WagmiProvider } from './wagmi-provider';
import { QueryClientProvider } from './query-client';
import { SentryProvider } from './sentry';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
    return (
        <WagmiProvider>
            <QueryClientProvider>
                <SentryProvider>{children}</SentryProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
