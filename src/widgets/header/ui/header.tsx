'use client';
import { FC } from 'react';
import { ConnectWallet } from '@/features/connect-wallet';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import styles from './header.module.scss';

export const Header: FC = () => {
    const path = usePathname();

    return (
        <div className={styles.container}>
            <div>
                <Image width={144} height={40} src="/logo.svg" alt="Aphotic" />
            </div>

            <div className={styles.navigation}>
                <Link className={path === '/' ? styles.selected : ''} href="/">
                    Trade
                </Link>

                <Link
                    className={path === '/faucet' ? styles.selected : ''}
                    href="/faucet"
                >
                    Faucet
                </Link>
            </div>

            <ConnectWallet />
        </div>
    );
};
