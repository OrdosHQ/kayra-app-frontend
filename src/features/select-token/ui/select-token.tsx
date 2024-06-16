import { FC } from 'react';
import { tokens } from '@/shared/constants';
import { TokenLogo } from '@/shared/ui';

import styles from './select-token.module.scss';

export const SelectToken: FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Select a token</div>
            </div>

            <div className={styles.list}>
                {tokens.map(({ name, symbol, logoURI, address }) => (
                    <div key={address} className={styles.item}>
                        <div className={styles.logo}>
                            <TokenLogo src={logoURI} alt={name} />
                        </div>

                        <div className={styles.info}>
                            <div className={styles.name}>{name}</div>
                            <div className={styles.symbol}>{symbol}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
