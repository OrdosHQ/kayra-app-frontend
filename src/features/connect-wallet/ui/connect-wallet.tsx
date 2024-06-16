'use client';
import { FC, useCallback } from 'react';
import { metaMask } from 'wagmi/connectors';
import { useConnect, useAccount } from 'wagmi';

export const ConnectWallet: FC = () => {
    const { connect } = useConnect();
    const { address } = useAccount();

    const connectClickHandler = useCallback(() => {
        connect({ connector: metaMask() });
    }, [connect]);

    return (
        <div>
            {!address ? (
                <button onClick={connectClickHandler}>Connect wallet</button>
            ) : (
                <div>{address}</div>
            )}
        </div>
    );
};
