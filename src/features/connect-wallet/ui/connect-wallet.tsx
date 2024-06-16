'use client';
import { FC, useCallback } from 'react';
import { metaMask } from 'wagmi/connectors';
import { useConnect, useAccount } from 'wagmi';
import { Button } from '@/shared/ui';

import styles from './connect-wallet.module.scss';
import { ConnectKitButton } from 'connectkit';

export const ConnectWallet: FC = () => {
    const { connect } = useConnect();
    const { address } = useAccount();

    const connectClickHandler = useCallback(() => {
        connect({ connector: metaMask() });
    }, [connect]);

    return (
        <div className={styles.container}>
            <ConnectKitButton showBalance />
        </div>
    );
};
