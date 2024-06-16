'use client';
import { Faucet } from '@/features/faucet';

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
