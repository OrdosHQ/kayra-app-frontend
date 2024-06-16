'use client';
import { FC, useCallback } from 'react';
import { tokens } from '@/shared/constants';
import { TokenLogo } from '@/shared/ui';

import styles from './select-token.module.scss';
import { useModalStore } from '@/entities/modal/model';

export const SelectToken: FC = () => {
    const state = useModalStore((store) => store.state);
    const closeModal = useModalStore((store) => store.closeModal);

    const tokenClickHandler = useCallback(
        (token: any) => {
            return () => {
                state.onSelect?.(token);

                closeModal();
            };
        },
        [state, closeModal],
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Select a token</div>
            </div>

            <div className={styles.list}>
                {tokens.map((token) => {
                    const { name, symbol, logoURI, address } = token;

                    return (
                        <div
                            onClick={tokenClickHandler(token)}
                            key={address}
                            className={styles.item}
                        >
                            <div className={styles.logo}>
                                <TokenLogo src={logoURI} alt={name} />
                            </div>

                            <div className={styles.info}>
                                <div className={styles.name}>{name}</div>
                                <div className={styles.symbol}>{symbol}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
