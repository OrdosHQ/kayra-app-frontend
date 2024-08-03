import { FC, useCallback } from 'react';
import { Token } from '@/shared/types';
import { TokenSelect, AmountInput } from '@/shared/ui';

import styles from './TokenInput.module.scss';

interface TokenInputProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    header?: string;
    token?: Token;
    balance?: string;
    usd?: string;
    onMaxClick?: (amount: string) => void;
    onTokenClick?: any;
}

export const TokenInput: FC<TokenInputProps> = ({
    header,
    balance,
    token,
    usd,
    onMaxClick,
    onTokenClick,
    ...inputProps
}) => {
    const maxClickCallback = useCallback(() => {
        if (balance) {
            onMaxClick?.(balance);
        }
    }, [balance, onMaxClick]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <TokenSelect
                    balance={balance}
                    onClick={onTokenClick}
                    token={token}
                />
            </div>

            <div className={styles.content}>
                <AmountInput token={token} {...inputProps} />
            </div>

            <div className={styles.footer}>
                {/* <div className={styles.usd}>$ {usd || '0.0'}</div> */}
                <div className={styles.balance}>
                    {onMaxClick && (
                        <span
                            className={styles.action}
                            onClick={maxClickCallback}
                        >
                            MAX
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
