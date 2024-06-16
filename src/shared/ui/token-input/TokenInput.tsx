import { FC, useCallback } from 'react';
import { Token } from '@/shared/types';
import { TokenSelect } from '@/shared/ui';

import styles from './TokenInput.module.scss';

interface TokenInputProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    header?: string;
    token?: Token;
    balance?: string;
    onMaxClick?: (amount: string) => void;
}

export const TokenInput: FC<TokenInputProps> = ({
    header,
    balance,
    token,
    onMaxClick,
    ...inputProps
}) => {
    const maxClickCallback = useCallback(() => {
        if (balance) {
            onMaxClick?.(balance);
        }
    }, [balance, onMaxClick]);

    return (
        <div className={styles.container}>
            {header && <div className={styles.header}>{header}</div>}

            <div className={styles.content}>
                <input {...inputProps} className={styles.input} />
                <TokenSelect token={token} />
            </div>

            <div className={styles.footer}>
                <div className={styles.balance}>
                    Balance: {balance} {token?.name}{' '}
                    <span className={styles.action} onClick={maxClickCallback}>
                        MAX
                    </span>
                </div>
            </div>
        </div>
    );
};
