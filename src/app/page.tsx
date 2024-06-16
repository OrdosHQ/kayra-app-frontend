import Image from 'next/image';
import styles from './page.module.css';
import { Modal } from '@/entities/modal';
import { ConnectWallet } from '@/features/connect-wallet';
import { Chart } from '@/entities/chart';
import { Switch } from '@/shared/ui';
import { Swap } from '@/features/swap';

export default function Home() {
    return (
        <>
            <Modal />
            <div>
                <ConnectWallet />
            </div>
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
