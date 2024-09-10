import { useCallback, useMemo } from 'react';
import { useAccount, useConnect } from 'wagmi';

export const useConnectWallet = () => {
    const { connectAsync, connectors } = useConnect();
    const { isConnected: connected } = useAccount();

    const connectClickHandler = useCallback(async () => {
        try {
            await connectAsync({ connector: connectors[0] });
        } finally {
        }
    }, [connectAsync, connectors]);

    return useMemo(
        () => ({
            connected,
            connectClickHandler,
        }),
        [connected, connectClickHandler],
    );
};
