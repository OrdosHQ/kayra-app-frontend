'use client';
import { FC, useCallback } from 'react';
import { useModalStore } from '@/entities/modal';
import { Icons } from '@/assets';

import styles from './transaction-loader.module.scss';
import Image from 'next/image';
import { Button, TokenLogo } from '@/shared/ui';

export const TransactionLoader: FC = () => {
    const { state } = useModalStore();
    console.log(state);

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
                    src={`/assets/icons/${
                        state.status === 'loading' ? 'loader' : 'success'
                    }.svg`}
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
            {state.link && (
                <div className={styles.footer}>
                    <Button fill size="s" onClick={openLinkHandler(state.link)}>
                        Open in Explorer
                    </Button>
                </div>
            )}
        </div>
    );
};
