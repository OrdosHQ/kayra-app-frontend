'use client';
import dynamic from 'next/dynamic';
import { Orders } from '@/entities/orders';

const Chart = dynamic(async () => (await import('@/entities/chart')).Chart, {
    ssr: false,
});

const Switch = dynamic(async () => (await import('@/shared/ui')).Switch, {
    ssr: false,
});

const Swap = dynamic(async () => (await import('@/features/new-swap')).Swap, {
    ssr: false,
});

import styles from './page.module.css';

export default function Home() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.chart}>
                    <div style={{ marginBottom: 10, height: '100%' }}>
                        <Chart />
                    </div>

                    <Orders />
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
                                // {
                                //     value: 'limit',
                                //     label: 'Limit',
                                //     disabled: true,
                                // },
                            ]}
                        />
                    </div>

                    <Swap />
                </div>
            </div>
        </>
    );
}
