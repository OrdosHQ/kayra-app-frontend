import { FC, useCallback } from 'react';
import { TokenLogo } from '../token-logo';
import { Token } from '@/shared/types';

import styles from './TokenSelect.module.scss';
import { shortAddress } from '@/shared/utils';
import { Address } from '../address';

interface TokenSelectProps {
    token?: Token;
    onClick?: any;
    balance?: string;
}

export const TokenSelect: FC<TokenSelectProps> = ({
    token,
    onClick,
    balance,
}) => {
    return (
        <div
            onClick={onClick}
            className={`${styles.container} ${!token && styles.noToken}`}
        >
            {token ? (
                <>
                    <div className={styles.token}>
                        <div className={styles.image}>
                            <TokenLogo
                                size="l"
                                src={token.logoURI}
                                alt={token.name}
                            />
                        </div>

                        <div className={styles.info}>
                            <div className={styles.infoSymbol}>
                                {token?.symbol}
                            </div>
                            <div className={styles.infoAddress}>
                                <Address address={token.address} />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>Select token</div>
            )}

            <div className={styles.right}>
                <div className={styles.balance}>
                    <div>Balance:</div>

                    <div>{balance || '0.0'}</div>
                </div>
                <div className={styles.angle}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    );
};
