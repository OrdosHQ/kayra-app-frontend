import { FC } from 'react';

import styles from './orders.module.scss';
import { TokenLogo } from '@/shared/ui';
import { USDC, WETH } from '@/shared/constants';

export const Orders: FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Orders</div>
            </div>

            <div className={styles.content}>
                <div className={styles.orders}>
                    <div className={styles.order}>
                        <div className={styles.token}>
                            <TokenLogo src={USDC.logoURI} />

                            <div className={styles.tokenSymbol}>
                                {USDC.symbol}
                            </div>
                        </div>
                        <div className={styles.token}>
                            <TokenLogo src={WETH.logoURI} />

                            <div className={styles.tokenSymbol}>
                                {WETH.symbol}
                            </div>
                        </div>
                        <div className={styles.amount}>3000</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
