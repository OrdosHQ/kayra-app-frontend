'use client';
import { FC, useCallback } from 'react';
import { useModalStore } from '@/entities/modal';
import { Button, TokenLogo } from '@/shared/ui';
import Image from 'next/image';

import styles from './transaction-loader.module.scss';

export const TransactionLoader: FC = () => {
    const { state, closeModal } = useModalStore();

    const openLinkHandler = useCallback((link: string) => {
        return () => {
            window.open(link, '_blank');
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.loader}>
                <Image
                    width={200}
                    height={200}
                    alt="loader"
                    src={`/assets/icons/${state.status}.svg`}
                />
            </div>
            <div className={styles.title}>{state?.title}</div>
            <div className={styles.info}>
                <TokenLogo
                    size="s"
                    src={state?.token1?.logoURI}
                    alt={state?.token1?.name}
                />
                {`${state?.amount1} ${state?.token1?.symbol}`}{' '}
                {state.token2 && (
                    <>
                        <Image
                            width={20}
                            height={20}
                            src="/assets/icons/arrow-right.svg"
                            alt="arrowRight"
                        />{' '}
                        <TokenLogo
                            size="s"
                            src={state?.token2?.logoURI}
                            alt={state?.token2?.name}
                        />
                        {`${state?.amount2} ${state?.token2?.symbol}`}
                    </>
                )}
            </div>
            {state.link ? (
                <div className={styles.link}>
                    <a href={state.link} target="_blank">
                        Open in explorer
                    </a>
                </div>
            ) : null}

            {state.message && (
                <div className={styles.error}>{state.message}</div>
            )}

            {state.status === 'success' ? (
                <div className={styles.footer}>
                    <Button fill size="s" onClick={closeModal}>
                        OK
                    </Button>
                </div>
            ) : null}
        </div>
    );
};
