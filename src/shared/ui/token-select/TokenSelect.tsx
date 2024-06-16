import { FC, useCallback } from 'react';
import { TokenLogo } from '../token-logo';
import { Token } from '@/shared/types';

import styles from './TokenSelect.module.scss';

interface TokenSelectProps {
    token?: Token;
    onClick?: any;
}

export const TokenSelect: FC<TokenSelectProps> = ({ token, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`${styles.container} ${!token && styles.noToken}`}
        >
            {token ? (
                <>
                    <div className={styles.image}>
                        <TokenLogo
                            size="s"
                            src={token.logoURI}
                            alt={token.name}
                        />
                    </div>

                    <div className={styles.name}>{token?.symbol}</div>
                </>
            ) : (
                <div>Select token</div>
            )}

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
    );
};
