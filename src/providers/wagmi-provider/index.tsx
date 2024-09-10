'use client';
import { FC, PropsWithChildren, useEffect } from 'react';
import {
    WagmiProvider as LWagmiProvider,
    createConfig,
    http,
    useAccount,
    useSwitchChain,
} from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

const config = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    },
    connectors: [metaMask()],
});

const ConnectionHandler = () => {
    const { isConnected, chainId } = useAccount();
    const { switchChainAsync } = useSwitchChain();

    useEffect(() => {
        if (!isConnected) {
            if (chainId !== sepolia.id) {
                switchChainAsync({
                    chainId: sepolia.id,
                }).catch((err) => console.log(err));
            }
        }
    }, [isConnected, chainId]);

    return null;
};

export const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <LWagmiProvider config={config}>
            {/* <ConnectionHandler /> */}
            {children}
        </LWagmiProvider>
    );
};
