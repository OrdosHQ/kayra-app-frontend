'use client';
import { Token } from '@/shared/types';
import { FC } from 'react';
import { Textfit } from 'react-textfit';

import styles from './amount-input.module.scss';

interface IAmountInputProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    token?: Token;
}

export const AmountInput: FC<IAmountInputProps> = ({
    token,
    className,
    ...inputProps
}) => {
    return (
        <div className={styles.container}>
            <Textfit className={styles.textfit} mode="single">
                <input
                    {...inputProps}
                    className={`${styles.input} ${className}`}
                />
                {inputProps.value || inputProps.placeholder} {token?.symbol}
            </Textfit>
        </div>
    );
};
