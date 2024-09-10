'use client';
import { FC, useCallback } from 'react';
import { metaMask } from 'wagmi/connectors';
import { useConnect, useAccount } from 'wagmi';
import { Button } from '@/shared/ui';
import Image from 'next/image';
import { getKeplr, shortAddress, signerViaKeplr } from '@/shared/utils';
import { useAsyncInitialize } from '@/shared/hooks';
import { oldConfig } from '@/shared/constants/nillion';
import { useModalStore } from '@/entities/modal';
import { captureException } from '@sentry/nextjs';

import styles from './connect-wallet-button.module.scss';

export const ConnectWalletButton: FC = () => {
    const { connect } = useConnect();
    const { address } = useAccount();
    const showModal = useModalStore((state) => state.showModal);
    const keplr = useAsyncInitialize(getKeplr);
    const keplrAddress = useAsyncInitialize(async () => {
        try {
            if (!keplr) return null;

            const wallet = await signerViaKeplr(oldConfig.chain.chainId, keplr);

            const account = await wallet.getAccounts();

            return account[0].address;
        } catch (err) {
            captureException(err);
            return null;
        }
    }, [keplr]);

    const connectClickHandler = useCallback(() => {
        connect({ connector: metaMask() });
    }, [connect]);

    if (!address && !keplrAddress)
        return (
            <div
                onClick={() =>
                    showModal({ modalType: 'connectWallet', modalState: {} })
                }
                className={styles.container}
            >
                <Button size="s">Connect wallet</Button>
            </div>
        );

    return (
        <div className={styles.wallets}>
            {address ? (
                <div className={styles.wallet}>
                    <Image
                        width={30}
                        height={30}
                        src="/assets/icons/metamask.svg"
                        alt="metamask"
                    />
                    <span>{shortAddress(address)}</span>
                </div>
            ) : (
                <div
                    onClick={() =>
                        showModal({
                            modalType: 'connectWallet',
                            modalState: {},
                        })
                    }
                    className={styles.wallet}
                >
                    <Image
                        width={30}
                        height={30}
                        src="/assets/icons/metamask.svg"
                        alt="metamask"
                    />
                </div>
            )}

            {keplr ? (
                <div className={styles.wallet}>
                    <Image
                        width={30}
                        height={30}
                        src="/assets/icons/keplr.svg"
                        alt="keplr"
                    />
                    <span>{shortAddress(keplrAddress)}</span>
                </div>
            ) : (
                <div
                    onClick={() =>
                        showModal({
                            modalType: 'connectWallet',
                            modalState: {},
                        })
                    }
                    className={styles.wallet}
                >
                    <Image
                        width={30}
                        height={30}
                        src="/assets/icons/keplr.svg"
                        alt="keplr"
                    />
                </div>
            )}
        </div>
    );
};
