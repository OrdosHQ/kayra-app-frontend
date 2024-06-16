'use client';
import dynamic from 'next/dynamic';

const Faucet = dynamic(async () => (await import('@/features/faucet')).Faucet, {
    ssr: false,
});

import styles from './page.module.scss';

export default function Page() {
    return (
        <>
            <div className={styles.container}>
                <Faucet />
            </div>
        </>
    );
}
