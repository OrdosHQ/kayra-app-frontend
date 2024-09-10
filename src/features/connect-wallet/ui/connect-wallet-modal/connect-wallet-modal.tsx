import { FC, useCallback } from 'react';
import { useConnect } from 'wagmi';
import { useModalStore } from '@/entities/modal';
import { getKeplr } from '@/shared/utils';
import { oldConfig } from '@/shared/constants/nillion';
import Image from 'next/image';

import styles from './connect-wallet-modal.module.scss';

export const ConnectWalletModal: FC = () => {
    const closeModal = useModalStore((store) => store.closeModal);
    const { connectAsync, connectors } = useConnect();

    const connectMetaMaskClickHandler = useCallback(async () => {
        try {
            await connectAsync({ connector: connectors[0] });
        } finally {
            closeModal();
        }
    }, [connectAsync, closeModal, connectors]);

    const connectKeplrWallet = useCallback(async () => {
        try {
            const keplr = await getKeplr();

            if (!keplr) return null;

            await keplr.enable(oldConfig.chain.chainId);
        } finally {
            closeModal();
        }
    }, [closeModal]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Connect wallet</div>
            </div>

            <div className={styles.content}>
                <div
                    onClick={connectMetaMaskClickHandler}
                    className={styles.wallet}
                >
                    <div className={styles.walletIcon}>
                        <Image
                            width={40}
                            height={40}
                            src="/assets/icons/metamask.svg"
                            alt="MetaMask"
                        />
                    </div>
                    <div className={styles.walletTitle}>MetaMask</div>
                </div>

                <div onClick={connectKeplrWallet} className={styles.wallet}>
                    <div className={styles.walletIcon}>
                        <Image
                            width={40}
                            height={40}
                            src="/assets/icons/keplr.svg"
                            alt="Keplr"
                        />
                    </div>
                    <div className={styles.walletTitle}>Keplr</div>
                </div>
            </div>
        </div>
    );
};
