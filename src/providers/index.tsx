'use client';
import { FC, PropsWithChildren } from 'react';
import { WagmiProvider } from './wagmi-provider';
import { ConnectKitProvider } from './connect-kit';
import { QueryClientProvider } from './query-client';
import { KeplrProvider } from './keplr';

export const Providers: FC<PropsWithChildren> = ({ children }) => {
    return (
        <WagmiProvider>
            <QueryClientProvider>
                <ConnectKitProvider>
                    {children}
                    {/* <KeplrProvider>{children}</KeplrProvider> */}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
