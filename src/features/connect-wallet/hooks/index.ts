import { useCallback, useMemo } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

export const useConnectWallet = () => {
    const { connectAsync } = useConnect();
    const { isConnected: connected } = useAccount();

    const connectClickHandler = useCallback(async () => {
        try {
            await connectAsync({ connector: metaMask() });
        } finally {
        }
    }, [connectAsync]);

    return useMemo(
        () => ({
            connected,
            connectClickHandler,
        }),
        [connected, connectClickHandler],
    );
};
