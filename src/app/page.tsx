'use client';
import { Chart } from '@/entities/chart';
import { Switch } from '@/shared/ui';
import { Swap } from '@/features/swap';

import styles from './page.module.css';

export default function Home() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.chart}>
                    <Chart />
                </div>
                <div className={styles.form}>
                    <div className={styles.switch}>
                        <Switch
                            value={'swap'}
                            items={[
                                {
                                    value: 'swap',
                                    label: 'Swap',
                                },
                                {
                                    value: 'limit',
                                    label: 'Limit',
                                    disabled: true,
                                },
                            ]}
                        />
                    </div>

                    <Swap />
                </div>
            </div>
        </>
    );
}
