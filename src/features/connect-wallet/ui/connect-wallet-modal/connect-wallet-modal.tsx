import { FC, useCallback } from 'react';
import Image from 'next/image';
import { useConnect } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

import styles from './connect-wallet-modal.module.scss';
import { useModalStore } from '@/entities/modal';
import { getKeplr, signerViaKeplr } from '@/shared/utils';
import { config } from '@/shared/constants/nillion';

export const ConnectWalletModal: FC = () => {
    const closeModal = useModalStore((store) => store.closeModal);
    const { connectAsync } = useConnect();

    const connectMetaMaskClickHandler = useCallback(async () => {
        try {
            await connectAsync({ connector: metaMask() });
        } finally {
            closeModal();
        }
    }, [connectAsync, closeModal]);

    const connectKeplrWallet = useCallback(async () => {
        try {
            const keplr = await getKeplr();

            if (!keplr) return null;

            await keplr.enable(config.chain.chainId);
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
