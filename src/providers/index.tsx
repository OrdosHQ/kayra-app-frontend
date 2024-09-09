'use client';
import { FC, PropsWithChildren } from 'react';
import { WagmiProvider } from './wagmi-provider';
import { QueryClientProvider } from './query-client';
import { SentryProvider } from './sentry';
import { NillionProvider } from './nillion';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
    return (
        <SentryProvider>
            <QueryClientProvider>
                <WagmiProvider>
                    <NillionProvider>{children}</NillionProvider>
                </WagmiProvider>
            </QueryClientProvider>
        </SentryProvider>
    );
};
